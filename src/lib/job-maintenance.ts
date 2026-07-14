import type { AggregateHealthData, AggregateReportData } from "./email-core.ts";
import {
  collectAggregateReport,
  persistDailyAggregate,
} from "./aggregate-reports.ts";
import { prisma } from "./prisma.ts";
import { getBackupHealth, getMigrationHealth } from "./deployment-health.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const ANALYTICS_RETENTION_DAYS = 90;
const MAX_RETENTION_BACKFILL_DAYS = 31;
const MAX_RETENTION_DELETE_ROWS = 50_000;
const MAX_CLEANUP_ROWS = 10_000;

interface ExpiredSignalRow {
  id: string;
  userId: string;
  intent: string;
  socialEnergy: string;
}

interface DuePlanRow {
  matchId: string;
  planId: string;
}

interface CountRow {
  count: bigint | number;
}

interface DayRow {
  day: Date;
}

interface HealthRow {
  failedJobs24h: bigint | number;
  staleJobs: bigint | number;
  stuckEmails: bigint | number;
  outboxBacklog: bigint | number;
  apiErrors24h: bigint | number;
  activeUsers: bigint | number;
  latestAnalyticsAt: Date | null;
  unaggregatedRetentionDays: bigint | number;
}

export interface SignalExpirationResult {
  expired: number;
  eventsCreated: number;
}

export interface RetentionResult {
  cutoff: string;
  aggregatesBackfilled: number;
  unaggregatedDaysRemaining: number;
  analyticsEventsPurged: number;
  deleteBatchLimitReached: boolean;
}

export interface CleanupResult {
  exhaustedLeasesFailed: number;
  emailLogsRedacted: number;
  emailLogsDeleted: number;
  notificationsDeleted: number;
  orphanAnalyticsAnonymized: number;
}

export interface OperationalHealthResult {
  metrics: AggregateHealthData;
  alerts: string[];
}

function safeCount(value: bigint | number): number {
  const count = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("Operational count exceeded the supported range");
  }
  return count;
}

function startOfUtcDay(value: Date): Date {
  const day = new Date(value);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}

function retentionCutoff(now: Date): Date {
  return new Date(startOfUtcDay(now).getTime() - ANALYTICS_RETENTION_DAYS * DAY_MS);
}

export async function expirePresenceSignalsWithEvents(
  now: Date,
): Promise<SignalExpirationResult> {
  return prisma.$transaction(async (tx) => {
    const expired = await tx.$queryRaw<ExpiredSignalRow[]>`
      UPDATE "PresenceSignal"
      SET
        "active" = FALSE,
        "expiredAt" = COALESCE("expiredAt", ${now}),
        "updatedAt" = ${now}
      WHERE "active" = TRUE AND "expiresAt" <= ${now}
      RETURNING "id", "userId", "intent"::text, "socialEnergy"::text
    `;
    if (expired.length === 0) return { expired: 0, eventsCreated: 0 };

    const created = await tx.analyticsEvent.createMany({
      data: expired.map((signal) => ({
        eventId: `signal-expired:${signal.id}`,
        eventName: "signal_expired",
        eventVersion: 1,
        userId: signal.userId,
        occurredAt: now,
        properties: {
          intent: signal.intent,
          socialEnergy: signal.socialEnergy,
          expiration: "scheduled",
        },
      })),
      skipDuplicates: true,
    });
    return { expired: expired.length, eventsCreated: created.count };
  });
}

export async function transitionElapsedConfirmedPlans(
  now: Date,
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    const transitions = await tx.$queryRaw<DuePlanRow[]>`
      WITH due AS (
        SELECT DISTINCT ON (plan."matchId")
          plan."id" AS "planId",
          plan."matchId"
        FROM "DatePlan" plan
        JOIN "Match" connection ON connection."id" = plan."matchId"
        WHERE plan."status" = 'CONFIRMED'
          AND plan."proposedAt" <= ${now}
          AND connection."state" = 'PLAN_CONFIRMED'
        ORDER BY plan."matchId", plan."proposedAt" DESC, plan."id" DESC
      )
      UPDATE "Match" connection
      SET
        "state" = 'MET',
        "lastTransitionAt" = ${now},
        "updatedAt" = ${now}
      FROM due
      WHERE connection."id" = due."matchId"
        AND connection."state" = 'PLAN_CONFIRMED'
      RETURNING connection."id" AS "matchId", due."planId"
    `;
    if (transitions.length === 0) return 0;

    const planIds = transitions.map((transition) => transition.planId);
    await tx.datePlan.updateMany({
      where: { id: { in: planIds }, status: "CONFIRMED" },
      data: { status: "COMPLETED" },
    });
    await tx.connectionEvent.createMany({
      data: transitions.map((transition) => ({
        matchId: transition.matchId,
        actorId: null,
        fromState: "PLAN_CONFIRMED",
        toState: "MET",
        metadata: { reason: "confirmed_plan_time_elapsed" },
      })),
    });
    return transitions.length;
  });
}

async function missingAggregateDays(cutoff: Date, limit: number): Promise<Date[]> {
  const rows = await prisma.$queryRaw<DayRow[]>`
    SELECT date_trunc('day', event."occurredAt") AS "day"
    FROM "AnalyticsEvent" event
    LEFT JOIN "DailyAggregate" aggregate
      ON aggregate."day" = date_trunc('day', event."occurredAt")
    WHERE event."occurredAt" < ${cutoff}
      AND aggregate."id" IS NULL
    GROUP BY date_trunc('day', event."occurredAt")
    ORDER BY "day" ASC
    LIMIT ${limit}
  `;
  return rows.map((row) => row.day);
}

async function countMissingAggregateDays(cutoff: Date): Promise<number> {
  const rows = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*) AS "count"
    FROM (
      SELECT date_trunc('day', event."occurredAt")
      FROM "AnalyticsEvent" event
      LEFT JOIN "DailyAggregate" aggregate
        ON aggregate."day" = date_trunc('day', event."occurredAt")
      WHERE event."occurredAt" < ${cutoff}
        AND aggregate."id" IS NULL
      GROUP BY date_trunc('day', event."occurredAt")
    ) missing
  `;
  return safeCount(rows[0]?.count ?? 0);
}

async function backfillAggregatesBeforeRetention(cutoff: Date): Promise<number> {
  const days = await missingAggregateDays(cutoff, MAX_RETENTION_BACKFILL_DAYS);
  for (const day of days) {
    const report = await collectAggregateReport({
      cadence: "daily",
      periodStart: day,
      periodEnd: new Date(day.getTime() + DAY_MS),
    });
    await persistDailyAggregate(day, report);
  }
  return days.length;
}

async function purgeAggregatedAnalytics(cutoff: Date): Promise<number> {
  const rows = await prisma.$queryRaw<CountRow[]>`
    WITH candidates AS (
      SELECT event.ctid
      FROM "AnalyticsEvent" event
      JOIN "DailyAggregate" aggregate
        ON aggregate."day" = date_trunc('day', event."occurredAt")
      WHERE event."occurredAt" < ${cutoff}
      ORDER BY event."occurredAt" ASC
      LIMIT ${MAX_RETENTION_DELETE_ROWS}
    ), deleted AS (
      DELETE FROM "AnalyticsEvent" event
      USING candidates
      WHERE event.ctid = candidates.ctid
      RETURNING 1
    )
    SELECT COUNT(*) AS "count" FROM deleted
  `;
  return safeCount(rows[0]?.count ?? 0);
}

export async function retainRawAnalytics(now: Date): Promise<RetentionResult> {
  const cutoff = retentionCutoff(now);
  const aggregatesBackfilled = await backfillAggregatesBeforeRetention(cutoff);
  const unaggregatedDaysRemaining = await countMissingAggregateDays(cutoff);
  const analyticsEventsPurged = await purgeAggregatedAnalytics(cutoff);
  return {
    cutoff: cutoff.toISOString(),
    aggregatesBackfilled,
    unaggregatedDaysRemaining,
    analyticsEventsPurged,
    deleteBatchLimitReached:
      analyticsEventsPurged === MAX_RETENTION_DELETE_ROWS,
  };
}

async function cleanupEmailOutbox(now: Date): Promise<Omit<CleanupResult, "notificationsDeleted" | "orphanAnalyticsAnonymized">> {
  const exhaustedLeasesFailed = await prisma.$executeRaw`
    UPDATE "EmailLog"
    SET
      "status" = 'failed',
      "nextAttemptAt" = NULL,
      "error" = 'Processing lease expired after final attempt',
      "updatedAt" = ${now}
    WHERE "sentAt" IS NULL
      AND "status" = 'processing'
      AND "attempts" >= "maxAttempts"
      AND "nextAttemptAt" <= ${now}
  `;

  const redactedRows = await prisma.$queryRaw<CountRow[]>`
    WITH candidates AS (
      SELECT ctid
      FROM "EmailLog"
      WHERE "updatedAt" < ${new Date(now.getTime() - 30 * DAY_MS)}
        AND "status" IN ('sent', 'failed', 'skipped')
        AND ("recipientHash" IS NOT NULL OR "payload" <> CAST('{"redacted":true}' AS jsonb))
      ORDER BY "updatedAt" ASC
      LIMIT ${MAX_CLEANUP_ROWS}
    ), redacted AS (
      UPDATE "EmailLog" email
      SET
        "recipientHash" = NULL,
        "payload" = CAST('{"redacted":true}' AS jsonb),
        "providerMessageId" = NULL,
        "error" = CASE WHEN email."status" = 'failed' THEN email."error" ELSE NULL END,
        "updatedAt" = ${now}
      FROM candidates
      WHERE email.ctid = candidates.ctid
      RETURNING 1
    )
    SELECT COUNT(*) AS "count" FROM redacted
  `;

  const deletedRows = await prisma.$queryRaw<CountRow[]>`
    WITH candidates AS (
      SELECT ctid
      FROM "EmailLog"
      WHERE
        ("status" IN ('sent', 'skipped') AND "createdAt" < ${new Date(now.getTime() - 180 * DAY_MS)})
        OR ("status" = 'failed' AND "createdAt" < ${new Date(now.getTime() - 365 * DAY_MS)})
      ORDER BY "createdAt" ASC
      LIMIT ${MAX_CLEANUP_ROWS}
    ), deleted AS (
      DELETE FROM "EmailLog" email
      USING candidates
      WHERE email.ctid = candidates.ctid
      RETURNING 1
    )
    SELECT COUNT(*) AS "count" FROM deleted
  `;

  return {
    exhaustedLeasesFailed,
    emailLogsRedacted: safeCount(redactedRows[0]?.count ?? 0),
    emailLogsDeleted: safeCount(deletedRows[0]?.count ?? 0),
  };
}

async function cleanupNotifications(now: Date): Promise<number> {
  const rows = await prisma.$queryRaw<CountRow[]>`
    WITH candidates AS (
      SELECT ctid
      FROM "Notification"
      WHERE
        ("read" = TRUE AND "createdAt" < ${new Date(now.getTime() - 180 * DAY_MS)})
        OR ("deliveryStatus" = 'SKIPPED' AND "createdAt" < ${new Date(now.getTime() - 30 * DAY_MS)})
      ORDER BY "createdAt" ASC
      LIMIT ${MAX_CLEANUP_ROWS}
    ), deleted AS (
      DELETE FROM "Notification" notification
      USING candidates
      WHERE notification.ctid = candidates.ctid
      RETURNING 1
    )
    SELECT COUNT(*) AS "count" FROM deleted
  `;
  return safeCount(rows[0]?.count ?? 0);
}

async function anonymizeOrphanAnalytics(): Promise<number> {
  return prisma.$executeRaw`
    UPDATE "AnalyticsEvent" event
    SET "userId" = NULL
    WHERE event."userId" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM "User" account WHERE account.id = event."userId"
      )
  `;
}

export async function cleanupOperationalData(now: Date): Promise<CleanupResult> {
  const [email, notificationsDeleted, orphanAnalyticsAnonymized] = await Promise.all([
    cleanupEmailOutbox(now),
    cleanupNotifications(now),
    anonymizeOrphanAnalytics(),
  ]);
  return { ...email, notificationsDeleted, orphanAnalyticsAnonymized };
}

export function detectAggregateAnomalies(report: AggregateReportData): string[] {
  const alerts: string[] = [];
  const uniqueVisitors = report.uniqueVisitors;
  const previousVisitors = report.previousVisitors;
  if (
    previousVisitors !== undefined &&
    uniqueVisitors !== undefined &&
    previousVisitors >= 20 &&
    uniqueVisitors <= previousVisitors * 0.5
  ) {
    alerts.push("Baisse anormale des visiteurs d’au moins 50 % par rapport à la période précédente.");
  }
  if (
    report.previousNewUsers !== undefined &&
    report.previousNewUsers >= 5 &&
    report.newUsers <= report.previousNewUsers * 0.5
  ) {
    alerts.push("Baisse anormale des inscriptions d’au moins 50 % par rapport à la période précédente.");
  }
  if (
    report.sevenDayAverageVisitors !== undefined &&
    uniqueVisitors !== undefined &&
    uniqueVisitors >= 20 &&
    uniqueVisitors >= report.sevenDayAverageVisitors * 3
  ) {
    alerts.push("Pic de trafic supérieur à trois fois la moyenne quotidienne sur sept jours.");
  }
  return alerts;
}

export async function collectOperationalHealth(
  now: Date,
): Promise<OperationalHealthResult> {
  const [backup, migration] = await Promise.all([
    getBackupHealth(now),
    getMigrationHealth(),
  ]);
  const cutoff = retentionCutoff(now);
  const rows = await prisma.$queryRaw<HealthRow[]>`
    SELECT
      (SELECT COUNT(*) FROM "JobRun"
        WHERE "status" = 'FAILED' AND "startedAt" >= ${new Date(now.getTime() - DAY_MS)}
      ) AS "failedJobs24h",
      (SELECT COUNT(*) FROM "JobRun"
        WHERE "status" = 'RUNNING' AND "startedAt" < ${new Date(now.getTime() - 2 * 60 * 60 * 1000)}
      ) AS "staleJobs",
      (SELECT COUNT(*) FROM "EmailLog"
        WHERE "sentAt" IS NULL AND "attempts" >= "maxAttempts"
          AND "status" IN ('pending', 'retry', 'processing')
      ) AS "stuckEmails",
      (SELECT COUNT(*) FROM "EmailLog"
        WHERE "sentAt" IS NULL AND "status" IN ('pending', 'retry', 'processing')
      ) AS "outboxBacklog",
      (SELECT COUNT(*) FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${new Date(now.getTime() - DAY_MS)}
          AND (
            "eventName" IN (
              'api_error',
              'dashboard_load_error',
              'admin_signup_email_queue_failed'
            )
            OR CASE
              WHEN "properties"->>'statusCode' ~ '^[0-9]{3}$'
              THEN ("properties"->>'statusCode')::int
              ELSE 0
            END >= 500
          )
      ) AS "apiErrors24h",
      (SELECT COUNT(*)
        FROM "User" u JOIN "Profile" p ON p."userId" = u.id
        WHERE u."deletedAt" IS NULL AND u."bannedAt" IS NULL
          AND u.role IN ('USER', 'AMBASSADOR')
          AND u."isAdultConfirmed" = TRUE
          AND p."profileSource" = 'user_registration'
      ) AS "activeUsers",
      (SELECT MAX("occurredAt") FROM "AnalyticsEvent") AS "latestAnalyticsAt",
      (SELECT COUNT(*) FROM (
        SELECT date_trunc('day', event."occurredAt")
        FROM "AnalyticsEvent" event
        LEFT JOIN "DailyAggregate" aggregate
          ON aggregate."day" = date_trunc('day', event."occurredAt")
        WHERE event."occurredAt" < ${cutoff} AND aggregate."id" IS NULL
        GROUP BY date_trunc('day', event."occurredAt")
      ) missing) AS "unaggregatedRetentionDays"
  `;
  const row = rows[0];
  if (!row) throw new Error("Operational health query returned no result");
  const trackingLagMinutes = row.latestAnalyticsAt
    ? Math.max(0, Math.floor((now.getTime() - row.latestAnalyticsAt.getTime()) / 60_000))
    : null;
  const metrics: AggregateHealthData = {
    failedJobs24h: safeCount(row.failedJobs24h),
    staleJobs: safeCount(row.staleJobs),
    stuckEmails: safeCount(row.stuckEmails),
    outboxBacklog: safeCount(row.outboxBacklog),
    apiErrors24h: safeCount(row.apiErrors24h),
    trackingLagMinutes,
    unaggregatedRetentionDays: safeCount(row.unaggregatedRetentionDays),
  };
  const alerts: string[] = [];
  if (metrics.failedJobs24h > 0) alerts.push(`${metrics.failedJobs24h} job(s) ont échoué sur les dernières 24 h.`);
  if (metrics.staleJobs > 0) alerts.push(`${metrics.staleJobs} job(s) sont restés en cours plus de deux heures.`);
  if (metrics.stuckEmails > 0) alerts.push(`${metrics.stuckEmails} email(s) sont bloqués après épuisement des tentatives.`);
  if (metrics.outboxBacklog >= 500) alerts.push(`La file email contient ${metrics.outboxBacklog} éléments en attente.`);
  if (metrics.apiErrors24h > 0) alerts.push(`${metrics.apiErrors24h} erreur(s) API ont été mesurées sur les dernières 24 h.`);
  if (safeCount(row.activeUsers) > 0 && (trackingLagMinutes === null || trackingLagMinutes > 24 * 60)) {
    alerts.push("Aucun événement analytics récent depuis plus de 24 heures : vérifier le tracking.");
  }
  if (metrics.unaggregatedRetentionDays > 0) {
    alerts.push(`${metrics.unaggregatedRetentionDays} jour(s) doivent encore être agrégés avant purge analytics.`);
  }
  if (backup.status === "missing") alerts.push("Aucune sauvegarde PostgreSQL vérifiée n’est disponible.");
  if (backup.status === "stale") alerts.push("La dernière sauvegarde PostgreSQL vérifiée date de plus de 36 heures.");
  if (migration.status === "missing") alerts.push("Aucune migration Prisma appliquée n’est enregistrée.");
  return { metrics, alerts };
}
