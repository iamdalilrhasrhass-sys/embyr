import { randomUUID } from "node:crypto";
import { renderQueuedEmail } from "../emails/templates.ts";
import {
  hashEmailAddress,
  isQueuedEmailPayload,
  retryDelayMs,
  sanitizeOperationalError,
  type AggregateReportData,
  type EmailTemplateType,
  type QueuedEmailPayload,
  type UserEmailTemplateType,
} from "./email-core.ts";
import {
  getRequiredAdminReportEmail,
  sendEmail,
} from "./email-local.ts";
import { prisma } from "./prisma.ts";
import {
  resolveRuntimeEnvironment,
  type RuntimeEnvironment,
} from "./runtime-environment.ts";

interface EmailLogRow {
  id: string;
  userId: string | null;
  type: string;
  subject: string;
  status: string;
  recipientHash: string | null;
  payload: unknown;
  attempts: number;
  maxAttempts: number;
  dedupeKey: string | null;
}

interface UserEmailRow {
  email: string;
  displayName: string | null;
  username: string | null;
  emailEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  timezone: string;
}

export interface EnqueueEmailResult {
  id: string;
  queued: boolean;
  deduplicated: boolean;
}

export interface ProcessOutboxResult {
  claimed: number;
  sent: number;
  retried: number;
  failed: number;
  skipped: number;
  deferred: number;
  issues: Record<string, number>;
}

interface EnqueueRecordInput {
  userId: string | null;
  recipientEmail: string;
  type: EmailTemplateType;
  subject: string;
  payload: QueuedEmailPayload;
  dedupeKey: string;
  maxAttempts?: number;
  environment?: RuntimeEnvironment;
}

function assertDedupeKey(value: string): void {
  if (!/^[a-z0-9][a-z0-9:._-]{7,199}$/i.test(value)) {
    throw new Error("Invalid email dedupe key");
  }
}

function assertSubject(value: string): void {
  if (!value.trim() || value.length > 160 || /[\r\n]/.test(value)) {
    throw new Error("Invalid email subject");
  }
}

async function loadActiveUserEmail(userId: string): Promise<UserEmailRow | null> {
  const rows = await prisma.$queryRaw<UserEmailRow[]>`
    SELECT
      u."email",
      p."displayName",
      p."username",
      COALESCE(np."emailEnabled", TRUE) AS "emailEnabled",
      COALESCE(np."quietHoursEnabled", FALSE) AS "quietHoursEnabled",
      COALESCE(np."quietHoursStart", '22:00') AS "quietHoursStart",
      COALESCE(np."quietHoursEnd", '08:00') AS "quietHoursEnd",
      COALESCE(np."timezone", 'Europe/Zurich') AS "timezone"
    FROM "User" u
    LEFT JOIN "Profile" p ON p."userId" = u."id"
    LEFT JOIN "NotificationPreference" np ON np."userId" = u."id"
    WHERE u."id" = ${userId}
      AND u."deletedAt" IS NULL
      AND u."bannedAt" IS NULL
      AND u."email" <> ''
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function enqueueRecord(
  input: EnqueueRecordInput,
): Promise<EnqueueEmailResult> {
  assertDedupeKey(input.dedupeKey);
  assertSubject(input.subject);
  if (!isQueuedEmailPayload(input.payload)) {
    throw new Error("Invalid email payload");
  }

  const id = randomUUID();
  const maxAttempts = Math.max(1, Math.min(10, input.maxAttempts ?? 5));
  const environment = input.environment ?? resolveRuntimeEnvironment();
  const serializedPayload = JSON.stringify(input.payload);
  if (Buffer.byteLength(serializedPayload, "utf8") > 65_536) {
    throw new Error("Email payload is too large");
  }
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    INSERT INTO "EmailLog" (
      "id",
      "userId",
      "type",
      "subject",
      "status",
      "recipientHash",
      "payload",
      "attempts",
      "maxAttempts",
      "nextAttemptAt",
      "dedupeKey",
      "environment",
      "createdAt",
      "updatedAt"
    ) VALUES (
      ${id},
      ${input.userId},
      ${input.type},
      ${input.subject.trim()},
      'pending',
      ${hashEmailAddress(input.recipientEmail)},
      CAST(${serializedPayload} AS jsonb),
      0,
      ${maxAttempts},
      NOW(),
      ${input.dedupeKey},
      ${environment},
      NOW(),
      NOW()
    )
    ON CONFLICT ("dedupeKey") DO NOTHING
    RETURNING "id"
  `;

  if (rows[0]) return { id: rows[0].id, queued: true, deduplicated: false };

  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "EmailLog" WHERE "dedupeKey" = ${input.dedupeKey} LIMIT 1
  `;
  if (!existing[0]) throw new Error("Email enqueue conflict could not be resolved");
  return { id: existing[0].id, queued: false, deduplicated: true };
}

export async function enqueueUserEmail(input: {
  userId: string;
  type: UserEmailTemplateType;
  subject: string;
  data?: Record<string, unknown>;
  dedupeKey: string;
  maxAttempts?: number;
}): Promise<EnqueueEmailResult> {
  const user = await loadActiveUserEmail(input.userId);
  if (!user) throw new Error("Active email recipient not found");
  return enqueueRecord({
    userId: input.userId,
    recipientEmail: user.email,
    type: input.type,
    subject: input.subject,
    payload: {
      schemaVersion: 1,
      recipientKind: "user",
      template: input.type,
      data: input.data ?? {},
    },
    dedupeKey: input.dedupeKey,
    maxAttempts: input.maxAttempts,
  });
}

export async function enqueueAdminAggregateReport(
  report: AggregateReportData,
  dedupeKey: string,
): Promise<EnqueueEmailResult> {
  const recipient = getRequiredAdminReportEmail();
  return enqueueRecord({
    userId: null,
    recipientEmail: recipient,
    type: "admin-aggregate",
    subject: `Rapport Embir ${report.cadence} — ${report.periodStart.slice(0, 10)}`,
    payload: {
      schemaVersion: 1,
      recipientKind: "admin_report",
      template: "admin-aggregate",
      data: report,
    },
    dedupeKey,
  });
}

export async function enqueueAdminSignupNotification(input: {
  occurredAt: string;
  country: string | null;
  language: string;
  source: string | null;
  campaign: string | null;
  onboardingStatus: "started" | "completed";
  totalUsers: number;
  dedupeKey: string;
}): Promise<EnqueueEmailResult> {
  const recipient = getRequiredAdminReportEmail();
  return enqueueRecord({
    userId: null,
    recipientEmail: recipient,
    type: "admin-signup",
    subject: `[Embir] Nouvelle inscription — Total : ${Math.max(0, Math.floor(input.totalUsers))}`,
    payload: {
      schemaVersion: 1,
      recipientKind: "admin_signup",
      template: "admin-signup",
      data: {
        occurredAt: input.occurredAt,
        country: input.country,
        language: input.language,
        source: input.source,
        campaign: input.campaign,
        onboardingStatus: input.onboardingStatus,
        totalUsers: Math.max(0, Math.floor(input.totalUsers)),
      },
    },
    dedupeKey: input.dedupeKey,
  });
}

async function claimDueEmails(
  limit: number,
  environment: RuntimeEnvironment,
): Promise<EmailLogRow[]> {
  const leaseMinutes = 15;
  return prisma.$queryRaw<EmailLogRow[]>`
    WITH due AS (
      SELECT "id"
      FROM "EmailLog"
      WHERE "sentAt" IS NULL
        AND "attempts" < "maxAttempts"
        AND COALESCE("nextAttemptAt", "createdAt") <= NOW()
        AND "environment" = ${environment}
        AND "status" IN ('pending', 'retry', 'processing')
      ORDER BY COALESCE("nextAttemptAt", "createdAt") ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    UPDATE "EmailLog" AS email
    SET
      "attempts" = email."attempts" + 1,
      "lastAttemptAt" = NOW(),
      "nextAttemptAt" = NOW() + (${leaseMinutes} * INTERVAL '1 minute'),
      "status" = 'processing',
      "updatedAt" = NOW()
    FROM due
    WHERE email."id" = due."id"
    RETURNING
      email."id",
      email."userId",
      email."type",
      email."subject",
      email."status",
      email."recipientHash",
      email."payload",
      email."attempts",
      email."maxAttempts",
      email."dedupeKey"
  `;
}

async function markSent(
  id: string,
  providerMessageId: string | null,
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "status" = 'sent',
      "sentAt" = NOW(),
      "nextAttemptAt" = NULL,
      "providerMessageId" = ${providerMessageId},
      "error" = NULL,
      "updatedAt" = NOW()
    WHERE "id" = ${id} AND "sentAt" IS NULL
  `;
}

async function markFailure(row: EmailLogRow, error: unknown): Promise<boolean> {
  const exhausted = row.attempts >= row.maxAttempts;
  const nextAttemptAt = new Date(Date.now() + retryDelayMs(row.attempts));
  await prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "status" = ${exhausted ? "failed" : "retry"},
      "error" = ${sanitizeOperationalError(error)},
      "nextAttemptAt" = ${exhausted ? null : nextAttemptAt},
      "updatedAt" = NOW()
    WHERE "id" = ${row.id} AND "sentAt" IS NULL
  `;
  return exhausted;
}

type RecipientResolution =
  | { kind: "ready"; email: string; displayName: string }
  | { kind: "unavailable" }
  | { kind: "disabled" }
  | { kind: "quiet"; retryAt: Date };

function localMinuteOfDay(now: Date, timezone: string): number {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error("Invalid notification timezone");
  }
  return hour * 60 + minute;
}

function timeToMinute(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Invalid quiet-hours configuration");
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isWithinQuietHours(input: {
  now: Date;
  timezone: string;
  start: string;
  end: string;
}): boolean {
  const current = localMinuteOfDay(input.now, input.timezone);
  const start = timeToMinute(input.start);
  const end = timeToMinute(input.end);
  if (start === end) return true;
  return start < end
    ? current >= start && current < end
    : current >= start || current < end;
}

function nextQuietHoursExit(
  now: Date,
  timezone: string,
  start: string,
  end: string,
): Date {
  for (let step = 1; step <= 100; step++) {
    const candidate = new Date(now.getTime() + step * 15 * 60 * 1000);
    if (!isWithinQuietHours({ now: candidate, timezone, start, end })) {
      return candidate;
    }
  }
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
}

async function resolveRecipient(
  row: EmailLogRow,
  payload: QueuedEmailPayload,
  now: Date,
): Promise<RecipientResolution> {
  if (payload.recipientKind === "admin_report" || payload.recipientKind === "admin_signup") {
    return {
      kind: "ready",
      email: getRequiredAdminReportEmail(),
      displayName: "équipe Embir",
    };
  }
  if (!row.userId) return { kind: "unavailable" };
  const user = await loadActiveUserEmail(row.userId);
  if (!user) return { kind: "unavailable" };
  const isTransactionalVerification = payload.template === "email-verification";
  if (!isTransactionalVerification && !user.emailEnabled) return { kind: "disabled" };
  if (
    !isTransactionalVerification &&
    user.quietHoursEnabled &&
    isWithinQuietHours({
      now,
      timezone: user.timezone,
      start: user.quietHoursStart,
      end: user.quietHoursEnd,
    })
  ) {
    return {
      kind: "quiet",
      retryAt: nextQuietHoursExit(
        now,
        user.timezone,
        user.quietHoursStart,
        user.quietHoursEnd,
      ),
    };
  }
  return {
    kind: "ready",
    email: user.email,
    displayName: user.displayName || user.username || "toi",
  };
}

async function markSkippedByPreference(id: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "status" = 'skipped',
      "nextAttemptAt" = NULL,
      "error" = NULL,
      "updatedAt" = NOW()
    WHERE "id" = ${id} AND "sentAt" IS NULL
  `;
}

async function deferForQuietHours(id: string, retryAt: Date): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "status" = 'pending',
      "attempts" = GREATEST("attempts" - 1, 0),
      "nextAttemptAt" = ${retryAt},
      "error" = NULL,
      "updatedAt" = NOW()
    WHERE "id" = ${id} AND "sentAt" IS NULL
  `;
}

async function markRecipientUnavailable(id: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "status" = 'failed',
      "attempts" = "maxAttempts",
      "nextAttemptAt" = NULL,
      "error" = 'Recipient unavailable or changed',
      "updatedAt" = NOW()
    WHERE "id" = ${id} AND "sentAt" IS NULL
  `;
}

function incrementIssue(result: ProcessOutboxResult, issue: string): void {
  result.issues[issue] = (result.issues[issue] ?? 0) + 1;
}

export async function processEmailOutbox(options: {
  limit?: number;
  environment?: RuntimeEnvironment;
} = {}): Promise<ProcessOutboxResult> {
  const limit = Math.max(1, Math.min(250, options.limit ?? 100));
  const environment = options.environment ?? resolveRuntimeEnvironment();
  const rows = await claimDueEmails(limit, environment);
  const result: ProcessOutboxResult = {
    claimed: rows.length,
    sent: 0,
    retried: 0,
    failed: 0,
    skipped: 0,
    deferred: 0,
    issues: {},
  };

  for (const row of rows) {
    try {
      if (!isQueuedEmailPayload(row.payload) || !row.dedupeKey) {
        const exhausted = await markFailure(row, "Invalid stored email payload");
        incrementIssue(result, exhausted ? "invalid_payload_failed" : "invalid_payload_retry");
        if (exhausted) result.failed++;
        else result.retried++;
        continue;
      }
      const recipient = await resolveRecipient(row, row.payload, new Date());
      if (recipient.kind === "disabled") {
        await markSkippedByPreference(row.id);
        result.skipped++;
        incrementIssue(result, "user_email_preference_disabled");
        continue;
      }
      if (recipient.kind === "quiet") {
        await deferForQuietHours(row.id, recipient.retryAt);
        result.deferred++;
        continue;
      }
      if (
        recipient.kind === "unavailable" ||
        !row.recipientHash ||
        hashEmailAddress(recipient.email) !== row.recipientHash
      ) {
        await markRecipientUnavailable(row.id);
        result.failed++;
        incrementIssue(result, "recipient_unavailable_or_changed");
        continue;
      }

      assertSubject(row.subject);
      const html = renderQueuedEmail(row.payload, recipient.displayName);
      const sendResult = await sendEmail({
        to: recipient.email,
        subject: row.subject,
        html,
        dedupeKey: row.dedupeKey,
      });
      await markSent(row.id, sendResult.providerMessageId);
      result.sent++;
    } catch (error) {
      const exhausted = await markFailure(row, error);
      incrementIssue(result, exhausted ? "delivery_failed" : "delivery_retry");
      if (exhausted) result.failed++;
      else result.retried++;
    }
  }

  return result;
}
