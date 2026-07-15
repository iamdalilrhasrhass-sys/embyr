import { prisma } from "./prisma.ts";
import {
  resolveRuntimeEnvironment,
  type RuntimeEnvironment,
} from "./runtime-environment.ts";

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const RECENT_EMAIL_WINDOW_MS = 30 * 24 * 60 * 60 * 1_000;
const FETCH_CONCURRENCY = 8;

const PROVIDER_EMAIL_EVENTS = new Set([
  "queued",
  "scheduled",
  "sent",
  "delivered",
  "delivery_delayed",
  "opened",
  "clicked",
  "bounced",
  "complained",
  "failed",
] as const);

export type ProviderEmailEvent =
  | "queued"
  | "scheduled"
  | "sent"
  | "delivered"
  | "delivery_delayed"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained"
  | "failed";

interface EmailDeliveryRow {
  id: string;
  providerMessageId: string;
}

export interface EmailDeliveryReconciliationResult {
  enabled: boolean;
  configurationError: boolean;
  candidates: number;
  checked: number;
  updated: number;
  delivered: number;
  delayed: number;
  bounced: number;
  complained: number;
  failed: number;
  other: number;
  apiErrors: number;
}

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export function normalizeProviderEmailEvent(value: unknown): ProviderEmailEvent | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return PROVIDER_EMAIL_EVENTS.has(normalized as ProviderEmailEvent)
    ? normalized as ProviderEmailEvent
    : null;
}

export function providerEventBlocksFutureDelivery(event: ProviderEmailEvent): boolean {
  return event === "bounced" || event === "complained" || event === "failed";
}

export function providerEventConfirmsDelivery(event: ProviderEmailEvent): boolean {
  return event === "delivered" || event === "opened" || event === "clicked";
}

function isResendMessageId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function initialResult(enabled: boolean): EmailDeliveryReconciliationResult {
  return {
    enabled,
    configurationError: false,
    candidates: 0,
    checked: 0,
    updated: 0,
    delivered: 0,
    delayed: 0,
    bounced: 0,
    complained: 0,
    failed: 0,
    other: 0,
    apiErrors: 0,
  };
}

function recordEvent(
  result: EmailDeliveryReconciliationResult,
  event: ProviderEmailEvent,
): void {
  if (providerEventConfirmsDelivery(event)) result.delivered++;
  else if (event === "delivery_delayed") result.delayed++;
  else if (event === "bounced") result.bounced++;
  else if (event === "complained") result.complained++;
  else if (event === "failed") result.failed++;
  else result.other++;
}

async function persistProviderEvent(
  rowId: string,
  event: ProviderEmailEvent,
  checkedAt: Date,
): Promise<number> {
  const blocksDelivery = providerEventBlocksFutureDelivery(event);
  const auditPayload = JSON.stringify({
    providerLastEvent: event,
    providerCheckedAt: checkedAt.toISOString(),
  });
  const safeError = blocksDelivery ? "Provider delivery event: " + event : null;
  return prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "payload" = COALESCE("payload", CAST('{}' AS jsonb)) || CAST(${auditPayload} AS jsonb),
      "status" = CASE WHEN ${blocksDelivery} THEN ${event} ELSE "status" END,
      "error" = CASE WHEN ${blocksDelivery} THEN ${safeError} ELSE "error" END,
      "nextAttemptAt" = CASE WHEN ${blocksDelivery} THEN NULL ELSE "nextAttemptAt" END,
      "updatedAt" = NOW()
    WHERE "id" = ${rowId}
      AND "status" = 'sent'
  `;
}

export async function reconcileRecentEmailDeliveryEvents(options: {
  now?: Date;
  limit?: number;
  environment?: RuntimeEnvironment;
  env?: NodeJS.ProcessEnv;
  fetcher?: Fetcher;
} = {}): Promise<EmailDeliveryReconciliationResult> {
  const env = options.env ?? process.env;
  const provider = env.EMAIL_PROVIDER?.trim().toLowerCase() || "smtp";
  const result = initialResult(provider === "resend");
  if (!result.enabled) return result;

  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    result.configurationError = true;
    return result;
  }

  const now = options.now ?? new Date();
  const limit = Math.max(1, Math.min(250, Math.floor(options.limit ?? 100)));
  const environment = options.environment ?? resolveRuntimeEnvironment(env);
  const cutoff = new Date(now.getTime() - RECENT_EMAIL_WINDOW_MS);
  const rows = await prisma.$queryRaw<EmailDeliveryRow[]>`
    SELECT "id", "providerMessageId"
    FROM "EmailLog"
    WHERE "status" = 'sent'
      AND "sentAt" IS NOT NULL
      AND "providerMessageId" IS NOT NULL
      AND "providerMessageId" <> ''
      AND "environment" = ${environment}
      AND "createdAt" >= ${cutoff}
    ORDER BY "sentAt" DESC
    LIMIT ${limit}
  `;
  result.candidates = rows.length;
  const fetcher = options.fetcher ?? fetch;

  for (let index = 0; index < rows.length; index += FETCH_CONCURRENCY) {
    const batch = rows.slice(index, index + FETCH_CONCURRENCY);
    await Promise.all(batch.map(async (row) => {
      if (!isResendMessageId(row.providerMessageId)) {
        result.other++;
        return;
      }
      try {
        const response = await fetcher(
          RESEND_EMAIL_ENDPOINT + "/" + encodeURIComponent(row.providerMessageId),
          {
            headers: { Authorization: "Bearer " + apiKey },
            signal: AbortSignal.timeout(10_000),
          },
        );
        if (!response.ok) {
          result.apiErrors++;
          return;
        }
        const body = await response.json() as { last_event?: unknown };
        const event = normalizeProviderEmailEvent(body.last_event);
        if (!event) {
          result.other++;
          return;
        }
        result.checked++;
        recordEvent(result, event);
        result.updated += await persistProviderEvent(row.id, event, now);
      } catch {
        result.apiErrors++;
      }
    }));
  }

  return result;
}
