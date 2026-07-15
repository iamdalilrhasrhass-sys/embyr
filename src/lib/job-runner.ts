import { randomUUID } from "node:crypto";
import { Pool, type PoolClient } from "pg";
import {
  collectAggregateReport,
  persistDailyAggregate,
} from "./aggregate-reports.ts";
import {
  enqueueAdminAggregateReport,
  processEmailOutbox,
  type ProcessOutboxResult,
} from "./email-outbox.ts";
import { enqueueDueEmailVerificationReminders } from "./email-verification-delivery.ts";
import { closeSmtpTransport } from "./email-local.ts";
import { sanitizeOperationalError } from "./email-core.ts";
import {
  buildJobWindow,
  type JobCadence,
  type JobWindow,
} from "./job-schedule.ts";
import {
  cleanupOperationalData,
  collectOperationalHealth,
  detectAggregateAnomalies,
  expirePresenceSignalsWithEvents,
  retainRawAnalytics,
  transitionElapsedConfirmedPlans,
} from "./job-maintenance.ts";
import { prisma } from "./prisma.ts";
import { resolveRuntimeEnvironment } from "./runtime-environment.ts";

const MAX_JOB_ATTEMPTS = 3;
const STALE_JOB_AFTER_MS = 2 * 60 * 60 * 1000;

interface JobRunRow {
  id: string;
  status: "RUNNING" | "SUCCEEDED" | "FAILED" | "SKIPPED";
  startedAt: Date;
  attempt: number;
}

interface ClaimedJob {
  id: string;
  attempt: number;
}

class JobWorkError extends Error {
  readonly processedCount: number;
  readonly metadata: Record<string, unknown>;

  constructor(
    message: string,
    processedCount: number,
    metadata: Record<string, unknown>,
  ) {
    super(message);
    this.name = "JobWorkError";
    this.processedCount = processedCount;
    this.metadata = metadata;
  }
}

export interface ScheduledJobResult {
  cadence: JobCadence;
  idempotencyKey: string;
  status: "succeeded" | "failed" | "skipped";
  reason?: "lock_unavailable" | "already_succeeded" | "already_running" | "attempts_exhausted";
  processedCount: number;
  attempt: number;
  metadata: Record<string, unknown>;
  error?: string;
}

let jobLockPool: Pool | null = null;

function getJobLockPool(): Pool {
  if (jobLockPool) return jobLockPool;
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL must be configured");
  jobLockPool = new Pool({
    connectionString,
    max: 2,
    application_name: "embir-scheduled-jobs",
  });
  return jobLockPool;
}

async function acquireAdvisoryLock(
  cadence: JobCadence,
): Promise<{ client: PoolClient; locked: boolean }> {
  const client = await getJobLockPool().connect();
  try {
    const result = await client.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock(hashtext($1), hashtext($2)) AS locked",
      ["embir-scheduled-job", cadence],
    );
    return { client, locked: result.rows[0]?.locked === true };
  } catch (error) {
    client.release();
    throw error;
  }
}

async function releaseAdvisoryLock(
  client: PoolClient,
  cadence: JobCadence,
): Promise<void> {
  try {
    await client.query(
      "SELECT pg_advisory_unlock(hashtext($1), hashtext($2))",
      ["embir-scheduled-job", cadence],
    );
  } finally {
    client.release();
  }
}

async function claimJobRun(
  cadence: JobCadence,
  window: JobWindow,
  now: Date,
): Promise<ClaimedJob | ScheduledJobResult> {
  const id = randomUUID();
  const inserted = await prisma.$queryRaw<JobRunRow[]>`
    INSERT INTO "JobRun" (
      "id", "jobName", "idempotencyKey", "status", "startedAt",
      "processedCount", "attempt", "metadata"
    ) VALUES (
      ${id}, ${cadence}, ${window.idempotencyKey}, 'RUNNING', ${now},
      0, 1, CAST('{}' AS jsonb)
    )
    ON CONFLICT ("idempotencyKey") DO NOTHING
    RETURNING "id", "status", "startedAt", "attempt"
  `;
  if (inserted[0]) return { id: inserted[0].id, attempt: 1 };

  const existingRows = await prisma.$queryRaw<JobRunRow[]>`
    SELECT "id", "status", "startedAt", "attempt"
    FROM "JobRun"
    WHERE "idempotencyKey" = ${window.idempotencyKey}
    LIMIT 1
  `;
  const existing = existingRows[0];
  if (!existing) throw new Error("Job idempotency conflict could not be resolved");

  const baseResult = {
    cadence,
    idempotencyKey: window.idempotencyKey,
    status: "skipped" as const,
    processedCount: 0,
    attempt: existing.attempt,
    metadata: {},
  };
  if (existing.status === "SUCCEEDED") {
    return { ...baseResult, reason: "already_succeeded" };
  }
  if (existing.attempt >= MAX_JOB_ATTEMPTS) {
    return { ...baseResult, reason: "attempts_exhausted" };
  }
  const staleBefore = new Date(now.getTime() - STALE_JOB_AFTER_MS);
  if (existing.status === "RUNNING" && existing.startedAt >= staleBefore) {
    return { ...baseResult, reason: "already_running" };
  }

  const retried = await prisma.$queryRaw<JobRunRow[]>`
    UPDATE "JobRun"
    SET
      "status" = 'RUNNING',
      "startedAt" = ${now},
      "finishedAt" = NULL,
      "processedCount" = 0,
      "attempt" = "attempt" + 1,
      "error" = NULL,
      "metadata" = CAST('{}' AS jsonb)
    WHERE "id" = ${existing.id}
      AND "attempt" < ${MAX_JOB_ATTEMPTS}
      AND (
        "status" = 'FAILED'
        OR ("status" = 'RUNNING' AND "startedAt" < ${staleBefore})
      )
    RETURNING "id", "status", "startedAt", "attempt"
  `;
  if (!retried[0]) return { ...baseResult, reason: "already_running" };
  return { id: retried[0].id, attempt: retried[0].attempt };
}

function outboxMetadata(
  result: ProcessOutboxResult,
): Record<string, number | Record<string, number>> {
  return {
    claimed: result.claimed,
    sent: result.sent,
    retried: result.retried,
    failed: result.failed,
    skipped: result.skipped,
    deferred: result.deferred,
    issues: result.issues,
  };
}

async function performJobWork(
  cadence: JobCadence,
  window: JobWindow,
  now: Date,
): Promise<{ processedCount: number; metadata: Record<string, unknown> }> {
  const signalExpiration = await expirePresenceSignalsWithEvents(now);
  const elapsedConfirmedPlans = await transitionElapsedConfirmedPlans(now);
  let processedCount = signalExpiration.expired + elapsedConfirmedPlans;
  const metadata: Record<string, unknown> = {
    expiredPresenceSignals: signalExpiration.expired,
    signalExpirationEvents: signalExpiration.eventsCreated,
    elapsedConfirmedPlans,
    periodStart: window.reportStart.toISOString(),
    periodEnd: window.reportEnd.toISOString(),
  };
  const partialFailures: string[] = [];

  if (cadence === "daily" || cadence === "weekly") {
    if (cadence === "daily") {
      const verificationReminders = await enqueueDueEmailVerificationReminders(now);
      metadata.emailVerificationReminders = verificationReminders;
      processedCount += verificationReminders.queued;
    }
    const aggregate = await collectAggregateReport({
      cadence,
      periodStart: window.reportStart,
      periodEnd: window.reportEnd,
    });
    if (cadence === "daily") {
      // This write deliberately precedes every raw-event deletion. Retention
      // may only remove UTC days that have a durable DailyAggregate row.
      await persistDailyAggregate(window.reportStart, aggregate);
      metadata.dailyAggregateStored = true;
      processedCount++;

      const retention = await retainRawAnalytics(now);
      metadata.analyticsRetention = retention;
      processedCount +=
        retention.aggregatesBackfilled + retention.analyticsEventsPurged;
      if (retention.unaggregatedDaysRemaining > 0) {
        partialFailures.push(
          `${retention.unaggregatedDaysRemaining} analytics day(s) await aggregation`,
        );
      }
      if (retention.deleteBatchLimitReached) {
        metadata.analyticsRetentionDeleteContinuesNextRun = true;
      }

      const cleanup = await cleanupOperationalData(now);
      metadata.cleanup = cleanup;
      processedCount +=
        cleanup.exhaustedLeasesFailed +
        cleanup.emailLogsRedacted +
        cleanup.emailLogsDeleted +
        cleanup.notificationsDeleted +
        cleanup.orphanAnalyticsAnonymized;
    }

    const health = await collectOperationalHealth(now);
    aggregate.health = health.metrics;
    aggregate.alerts = Array.from(
      new Set([
        ...(aggregate.alerts ?? []),
        ...detectAggregateAnomalies(aggregate),
        ...health.alerts,
      ]),
    ).slice(0, 20);
    metadata.health = health.metrics;
    metadata.operationalAlerts = aggregate.alerts;

    if (cadence === "daily") {
      // Store the final health-enriched version too; the first write above is
      // the safety barrier and this idempotent update is the reporting copy.
      await persistDailyAggregate(window.reportStart, aggregate);
    }

    try {
      const queued = await enqueueAdminAggregateReport(
        aggregate,
        `admin-report:${window.idempotencyKey}`,
      );
      metadata.reportQueued = queued.queued;
      metadata.reportDeduplicated = queued.deduplicated;
      if (queued.queued) processedCount++;
    } catch (error) {
      const safeError = sanitizeOperationalError(error);
      metadata.reportQueueError = safeError;
      partialFailures.push(`admin report queue failed: ${safeError}`);
    }
    metadata.aggregate = aggregate;
  }

  const outbox = await processEmailOutbox({
    limit: cadence === "hourly" ? 200 : 100,
    environment: resolveRuntimeEnvironment(),
  });
  metadata.outbox = outboxMetadata(outbox);
  processedCount += outbox.claimed;
  if (outbox.retried > 0 || outbox.failed > 0) {
    partialFailures.push(
      `email outbox delivery incomplete: ${outbox.retried} retry, ${outbox.failed} failed`,
    );
  }

  if (cadence === "hourly") {
    const health = await collectOperationalHealth(now);
    metadata.health = health.metrics;
    metadata.operationalAlerts = health.alerts;
  }

  if (partialFailures.length > 0) {
    metadata.partialFailures = partialFailures;
    throw new JobWorkError(
      partialFailures.join("; "),
      processedCount,
      metadata,
    );
  }
  return { processedCount, metadata };
}

async function markJobSucceeded(
  id: string,
  processedCount: number,
  metadata: Record<string, unknown>,
  finishedAt: Date,
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "JobRun"
    SET
      "status" = 'SUCCEEDED',
      "finishedAt" = ${finishedAt},
      "processedCount" = ${processedCount},
      "metadata" = CAST(${JSON.stringify(metadata)} AS jsonb),
      "error" = NULL
    WHERE "id" = ${id} AND "status" = 'RUNNING'
  `;
}

async function markJobFailed(
  id: string,
  error: string,
  processedCount: number,
  metadata: Record<string, unknown>,
  finishedAt: Date,
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "JobRun"
    SET
      "status" = 'FAILED',
      "finishedAt" = ${finishedAt},
      "processedCount" = ${processedCount},
      "metadata" = CAST(${JSON.stringify(metadata)} AS jsonb),
      "error" = ${error}
    WHERE "id" = ${id} AND "status" = 'RUNNING'
  `;
}

export async function runScheduledJob(
  cadence: JobCadence,
  now = new Date(),
): Promise<ScheduledJobResult> {
  const window = buildJobWindow(cadence, now);
  const lock = await acquireAdvisoryLock(cadence);
  if (!lock.locked) {
    lock.client.release();
    return {
      cadence,
      idempotencyKey: window.idempotencyKey,
      status: "skipped",
      reason: "lock_unavailable",
      processedCount: 0,
      attempt: 0,
      metadata: {},
    };
  }

  try {
    const claim = await claimJobRun(cadence, window, now);
    if ("status" in claim) return claim;

    try {
      const work = await performJobWork(cadence, window, now);
      await markJobSucceeded(
        claim.id,
        work.processedCount,
        work.metadata,
        new Date(),
      );
      return {
        cadence,
        idempotencyKey: window.idempotencyKey,
        status: "succeeded",
        processedCount: work.processedCount,
        attempt: claim.attempt,
        metadata: work.metadata,
      };
    } catch (error) {
      const safeError = sanitizeOperationalError(error);
      const processedCount =
        error instanceof JobWorkError ? error.processedCount : 0;
      const metadata = error instanceof JobWorkError ? error.metadata : {};
      await markJobFailed(
        claim.id,
        safeError,
        processedCount,
        metadata,
        new Date(),
      );
      return {
        cadence,
        idempotencyKey: window.idempotencyKey,
        status: "failed",
        processedCount,
        attempt: claim.attempt,
        metadata,
        error: safeError,
      };
    }
  } finally {
    await releaseAdvisoryLock(lock.client, cadence);
  }
}

export async function closeJobResources(): Promise<void> {
  closeSmtpTransport();
  if (jobLockPool) {
    await jobLockPool.end();
    jobLockPool = null;
  }
}
