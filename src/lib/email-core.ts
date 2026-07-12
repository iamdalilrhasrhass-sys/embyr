import { createHash } from "node:crypto";

export const EMAIL_TEMPLATE_TYPES = [
  "welcome",
  "profile-reminder",
  "weekly-digest",
  "admin-aggregate",
  "admin-signup",
] as const;

export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPES)[number];
export type UserEmailTemplateType = Exclude<
  EmailTemplateType,
  "admin-aggregate" | "admin-signup"
>;
export type EmailRecipientKind = "user" | "admin_report" | "admin_signup";

export interface AggregateHealthData {
  failedJobs24h: number;
  staleJobs: number;
  stuckEmails: number;
  outboxBacklog: number;
  apiErrors24h: number;
  trackingLagMinutes: number | null;
  unaggregatedRetentionDays: number;
}

export interface AggregateReportData {
  cadence: "daily" | "weekly";
  periodStart: string;
  periodEnd: string;
  newUsers: number;
  activePresenceSignals: number;
  mutualMatches: number;
  messagesSent: number;
  reportsCreated: number;
  analyticsEvents: number;
  emailsSent: number;
  emailsPending: number;
  emailsFailed: number;
  uniqueVisitors?: number;
  sessions?: number;
  pageViews?: number;
  totalUsers?: number;
  completedProfiles?: number;
  activeUsers?: number;
  visitToSignupRate?: number;
  previousVisitors?: number;
  previousNewUsers?: number;
  sevenDayAverageVisitors?: number;
  retentionD1?: number;
  retentionD7?: number;
  retentionD30?: number;
  topSources?: Array<{ label: string; count: number }>;
  topPages?: Array<{ label: string; count: number }>;
  topCountries?: Array<{ label: string; count: number }>;
  topLanguages?: Array<{ label: string; count: number }>;
  alerts?: string[];
  recommendations?: string[];
  priorities?: string[];
  health?: AggregateHealthData;
}

export interface AdminSignupEmailData {
  occurredAt: string;
  country: string | null;
  language: string;
  source: string | null;
  campaign: string | null;
  onboardingStatus: "started" | "completed";
  totalUsers: number;
}

export interface QueuedEmailPayload {
  schemaVersion: 1;
  recipientKind: EmailRecipientKind;
  template: EmailTemplateType;
  data: Record<string, unknown> | AggregateReportData;
}

export function normalizeEmailAddress(email: string): string {
  return email.trim().toLocaleLowerCase("en-US");
}

export function hashEmailAddress(email: string): string {
  return createHash("sha256").update(normalizeEmailAddress(email)).digest("hex");
}

export function retryDelayMs(attempt: number): number {
  const normalizedAttempt = Math.max(1, Math.floor(attempt));
  const delay = 5 * 60 * 1000 * 2 ** (normalizedAttempt - 1);
  return Math.min(delay, 24 * 60 * 60 * 1000);
}

export function sanitizeOperationalError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  return raw
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/(postgres(?:ql)?:\/\/)[^\s@]+@/gi, "$1[redacted]@")
    .replace(/(Bearer\s+)[A-Za-z0-9._~+\/-]+/gi, "$1[redacted]")
    .replace(/(pass(?:word)?|token|secret)=([^&\s]+)/gi, "$1=[redacted]")
    .slice(0, 500);
}

export function isQueuedEmailPayload(value: unknown): value is QueuedEmailPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<QueuedEmailPayload>;
  const structurallyValid = (
    candidate.schemaVersion === 1 &&
    (candidate.recipientKind === "user" ||
      candidate.recipientKind === "admin_report" ||
      candidate.recipientKind === "admin_signup") &&
    typeof candidate.template === "string" &&
    EMAIL_TEMPLATE_TYPES.includes(candidate.template as EmailTemplateType) &&
    !!candidate.data &&
    typeof candidate.data === "object" &&
    !Array.isArray(candidate.data) &&
    !("email" in candidate.data) &&
    !("recipient" in candidate.data) &&
    !("to" in candidate.data)
  );
  if (!structurallyValid) return false;

  const recipientMatchesTemplate =
    (candidate.recipientKind === "admin_report" &&
      candidate.template === "admin-aggregate") ||
    (candidate.recipientKind === "admin_signup" &&
      candidate.template === "admin-signup") ||
    (candidate.recipientKind === "user" &&
      candidate.template !== "admin-aggregate" &&
      candidate.template !== "admin-signup");
  if (!recipientMatchesTemplate) return false;

  try {
    if (candidate.template === "admin-aggregate") {
      assertAggregateReportData(candidate.data);
    }
    if (candidate.template === "admin-signup") {
      assertAdminSignupEmailData(candidate.data);
    }
    return true;
  } catch {
    return false;
  }
}

function assertIsoDate(value: string, field: string): void {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== value) {
    throw new Error(`Invalid ${field}`);
  }
}

function assertShortText(
  value: unknown,
  field: string,
  maxLength: number,
  nullable = false,
): void {
  if (nullable && value === null) return;
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maxLength ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error(`Invalid ${field}`);
  }
}

export function assertAdminSignupEmailData(
  value: unknown,
): asserts value is AdminSignupEmailData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid admin signup payload");
  }
  const data = value as Partial<AdminSignupEmailData>;
  if (typeof data.occurredAt !== "string") {
    throw new Error("Invalid admin signup timestamp");
  }
  assertIsoDate(data.occurredAt, "admin signup timestamp");
  assertShortText(data.country, "admin signup country", 80, true);
  assertShortText(data.language, "admin signup language", 16);
  assertShortText(data.source, "admin signup source", 80, true);
  assertShortText(data.campaign, "admin signup campaign", 120, true);
  if (
    data.onboardingStatus !== "started" &&
    data.onboardingStatus !== "completed"
  ) {
    throw new Error("Invalid admin signup onboarding status");
  }
  if (
    typeof data.totalUsers !== "number" ||
    !Number.isSafeInteger(data.totalUsers) ||
    data.totalUsers < 0
  ) {
    throw new Error("Invalid admin signup total");
  }
}

export function assertAggregateReportData(
  value: unknown,
): asserts value is AggregateReportData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid aggregate report payload");
  }
  const report = value as Partial<AggregateReportData>;
  if (report.cadence !== "daily" && report.cadence !== "weekly") {
    throw new Error("Invalid aggregate report cadence");
  }
  if (
    typeof report.periodStart !== "string" ||
    typeof report.periodEnd !== "string"
  ) {
    throw new Error("Invalid aggregate report period");
  }
  assertIsoDate(report.periodStart, "aggregate report start");
  assertIsoDate(report.periodEnd, "aggregate report end");
  if (new Date(report.periodEnd) <= new Date(report.periodStart)) {
    throw new Error("Invalid aggregate report range");
  }
  const numericKeys: Array<keyof AggregateReportData> = [
    "newUsers",
    "activePresenceSignals",
    "mutualMatches",
    "messagesSent",
    "reportsCreated",
    "analyticsEvents",
    "emailsSent",
    "emailsPending",
    "emailsFailed",
  ];
  for (const key of numericKeys) {
    const numberValue = report[key];
    if (
      typeof numberValue !== "number" ||
      !Number.isSafeInteger(numberValue) ||
      numberValue < 0
    ) {
      throw new Error(`Invalid aggregate report metric: ${key}`);
    }
  }
  for (const key of [
    "uniqueVisitors",
    "sessions",
    "pageViews",
    "totalUsers",
    "completedProfiles",
    "activeUsers",
    "previousVisitors",
    "previousNewUsers",
    "sevenDayAverageVisitors",
  ] as const) {
    const numberValue = report[key];
    if (numberValue !== undefined && (!Number.isFinite(numberValue) || numberValue < 0)) {
      throw new Error(`Invalid optional aggregate metric: ${key}`);
    }
  }

  for (const key of ["visitToSignupRate", "retentionD1", "retentionD7", "retentionD30"] as const) {
    const numberValue = report[key];
    if (
      numberValue !== undefined &&
      (!Number.isFinite(numberValue) || numberValue < 0 || numberValue > 100)
    ) {
      throw new Error(`Invalid aggregate rate: ${key}`);
    }
  }

  for (const key of ["topSources", "topPages", "topCountries", "topLanguages"] as const) {
    const rows = report[key];
    if (rows === undefined) continue;
    if (
      !Array.isArray(rows) ||
      rows.length > 10 ||
      rows.some(
        (row) =>
          !row ||
          typeof row !== "object" ||
          typeof row.label !== "string" ||
          !row.label.trim() ||
          row.label.length > 200 ||
          !Number.isSafeInteger(row.count) ||
          row.count < 0,
      )
    ) {
      throw new Error(`Invalid aggregate ranking: ${key}`);
    }
  }

  for (const key of ["alerts", "recommendations", "priorities"] as const) {
    const messages = report[key];
    if (messages === undefined) continue;
    if (
      !Array.isArray(messages) ||
      messages.length > 20 ||
      messages.some(
        (message) =>
          typeof message !== "string" ||
          !message.trim() ||
          message.length > 500,
      )
    ) {
      throw new Error(`Invalid aggregate messages: ${key}`);
    }
  }

  if (report.health !== undefined) {
    const health = report.health;
    if (!health || typeof health !== "object" || Array.isArray(health)) {
      throw new Error("Invalid aggregate health metrics");
    }
    for (const key of [
      "failedJobs24h",
      "staleJobs",
      "stuckEmails",
      "outboxBacklog",
      "apiErrors24h",
      "unaggregatedRetentionDays",
    ] as const) {
      const metric = health[key];
      if (!Number.isSafeInteger(metric) || metric < 0) {
        throw new Error(`Invalid aggregate health metric: ${key}`);
      }
    }
    if (
      health.trackingLagMinutes !== null &&
      (!Number.isFinite(health.trackingLagMinutes) ||
        health.trackingLagMinutes < 0)
    ) {
      throw new Error("Invalid aggregate tracking lag");
    }
  }
}
