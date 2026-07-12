import { prisma } from "@/lib/prisma";
import { getBackupHealth, getMigrationHealth } from "@/lib/deployment-health";
import type { BackupHealth, MigrationHealth } from "@/lib/deployment-health";
import { comparablePercentage } from "@/lib/metrics";

type CountValue = bigint | number;
const count = (value: CountValue | null | undefined) => Number(value ?? 0);

type OverviewRow = {
  visitorsToday: CountValue;
  visitors7d: CountValue;
  visitors30d: CountValue;
  sessions30d: CountValue;
  pageViews30d: CountValue;
  pageViewsPrevious30d: CountValue;
  signupsToday: CountValue;
  signups7d: CountValue;
  signups30d: CountValue;
  signupsPrevious30d: CountValue;
  totalUsers: CountValue;
  completedProfiles: CountValue;
  dau: CountValue;
  wau: CountValue;
  mau: CountValue;
  reciprocalConnections: CountValue;
  conversationsStarted: CountValue;
  plansProposed: CountValue;
};

type BreakdownRow = { label: string | null; total: CountValue };
type CohortRow = {
  cohort: Date;
  users: CountValue;
  d1: CountValue;
  d7: CountValue;
  d30: CountValue;
};
type JobRow = {
  jobName: string;
  status: string;
  startedAt: Date;
  finishedAt: Date | null;
  processedCount: number;
  error: string | null;
};

export interface AdminMetrics {
  overview: {
    visitorsToday: number;
    visitors7d: number;
    visitors30d: number;
    sessions30d: number;
    pageViews30d: number;
    pageViewsChange: number | null;
    signupsToday: number;
    signups7d: number;
    signups30d: number;
    signupsChange: number | null;
    totalUsers: number;
    completedProfiles: number;
    dau: number;
    wau: number;
    mau: number;
    reciprocalConnections: number;
    conversationsStarted: number;
    plansProposed: number;
    visitToSignup: number | null;
  };
  funnel: Array<{ label: string; total: number; conversionFromPrevious: number | null }>;
  acquisition: Array<{ label: string; total: number }>;
  campaigns: Array<{ label: string; total: number }>;
  topPages: Array<{ label: string; total: number }>;
  countries: Array<{ label: string; total: number }>;
  cities: Array<{ label: string; total: number }>;
  intentions: Array<{ label: string; total: number }>;
  languages: Array<{ label: string; total: number }>;
  devices: Array<{ label: string; total: number }>;
  product: Array<{ label: string; total: number }>;
  cohorts: Array<{ cohort: string; users: number; d1: number; d7: number; d30: number }>;
  health: {
    apiErrors24h: number;
    emailFailed: number;
    emailPending: number;
    notificationFailed: number;
    jobs: JobRow[];
    uptimeSeconds: number;
    deployedCommit: string;
    backup: BackupHealth;
    migration: MigrationHealth;
  };
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function conversion(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round((current / previous) * 10_000) / 100;
}

function breakdown(rows: BreakdownRow[]) {
  return rows.map((row) => ({ label: row.label || "unknown", total: count(row.total) }));
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const [overviewRows, funnelRows, acquisitionRows, campaignRows, pageRows, countryRows, cityRows, intentionRows, languageRows, deviceRows, productRows, cohortRows, healthRows, emailRows, notificationRows, jobs, backup, migration] = await Promise.all([
    prisma.$queryRaw<OverviewRow[]>`
      WITH events AS (
        SELECT *, COALESCE("anonymousId", "sessionId", "userId") AS visitor
        FROM "AnalyticsEvent"
      ), traffic AS (
        SELECT * FROM events WHERE "eventName" IN ('page_view','landing_viewed')
      )
      SELECT
        (SELECT COUNT(DISTINCT visitor) FROM traffic WHERE visitor IS NOT NULL AND "occurredAt" >= CURRENT_DATE) AS "visitorsToday",
        (SELECT COUNT(DISTINCT visitor) FROM traffic WHERE visitor IS NOT NULL AND "occurredAt" >= NOW() - INTERVAL '7 days') AS "visitors7d",
        (SELECT COUNT(DISTINCT visitor) FROM traffic WHERE visitor IS NOT NULL AND "occurredAt" >= NOW() - INTERVAL '30 days') AS "visitors30d",
        (SELECT COUNT(DISTINCT "sessionId") FROM traffic WHERE "sessionId" IS NOT NULL AND "occurredAt" >= NOW() - INTERVAL '30 days') AS "sessions30d",
        (SELECT COUNT(*) FROM traffic WHERE "eventName" IN ('page_view','landing_viewed') AND "occurredAt" >= NOW() - INTERVAL '30 days') AS "pageViews30d",
        (SELECT COUNT(*) FROM traffic WHERE "eventName" IN ('page_view','landing_viewed') AND "occurredAt" >= NOW() - INTERVAL '60 days' AND "occurredAt" < NOW() - INTERVAL '30 days') AS "pageViewsPrevious30d",
        (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL AND "createdAt" >= CURRENT_DATE) AS "signupsToday",
        (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '7 days') AS "signups7d",
        (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days') AS "signups30d",
        (SELECT COUNT(*) FROM "User" WHERE "createdAt" >= NOW() - INTERVAL '60 days' AND "createdAt" < NOW() - INTERVAL '30 days') AS "signupsPrevious30d",
        (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL) AS "totalUsers",
        (SELECT COUNT(*) FROM "Profile" p JOIN "User" u ON u.id = p."userId" WHERE u."deletedAt" IS NULL AND p."onboardingCompletedAt" IS NOT NULL) AS "completedProfiles",
        (SELECT COUNT(DISTINCT "userId") FROM events WHERE "userId" IS NOT NULL AND "occurredAt" >= NOW() - INTERVAL '1 day') AS dau,
        (SELECT COUNT(DISTINCT "userId") FROM events WHERE "userId" IS NOT NULL AND "occurredAt" >= NOW() - INTERVAL '7 days') AS wau,
        (SELECT COUNT(DISTINCT "userId") FROM events WHERE "userId" IS NOT NULL AND "occurredAt" >= NOW() - INTERVAL '30 days') AS mau,
        (SELECT COUNT(*) FROM "Match" m
          JOIN "User" mu1 ON mu1.id = m."user1Id"
          JOIN "User" mu2 ON mu2.id = m."user2Id"
          WHERE m."status" = 'mutual' AND mu1."deletedAt" IS NULL AND mu2."deletedAt" IS NULL
        ) AS "reciprocalConnections",
        (SELECT COUNT(*) FROM "Conversation" c
          JOIN "User" cu1 ON cu1.id = c."user1Id"
          JOIN "User" cu2 ON cu2.id = c."user2Id"
          WHERE cu1."deletedAt" IS NULL AND cu2."deletedAt" IS NULL
        ) AS "conversationsStarted",
        (SELECT COUNT(*) FROM "DatePlan" dp
          JOIN "Match" dpm ON dpm.id = dp."matchId"
          JOIN "User" dpu1 ON dpu1.id = dpm."user1Id"
          JOIN "User" dpu2 ON dpu2.id = dpm."user2Id"
          WHERE dpu1."deletedAt" IS NULL AND dpu2."deletedAt" IS NULL
        ) AS "plansProposed"
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT stage AS label, total FROM (
        VALUES
          ('landing_viewed', (SELECT COUNT(*) FROM "AnalyticsEvent" WHERE "eventName" IN ('page_view','landing_viewed') AND "occurredAt" >= NOW() - INTERVAL '30 days')),
          ('signup_completed', (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL AND "createdAt" >= NOW() - INTERVAL '30 days')),
          ('profile_completed', (SELECT COUNT(*) FROM "Profile" WHERE "onboardingCompletedAt" >= NOW() - INTERVAL '30 days')),
          ('signal_activated', (SELECT COUNT(*) FROM "AnalyticsEvent" WHERE "eventName" = 'signal_activated' AND "occurredAt" >= NOW() - INTERVAL '30 days')),
          ('reciprocal_connection_created', (SELECT COUNT(*) FROM "Match" m
            JOIN "User" u1 ON u1.id = m."user1Id" JOIN "User" u2 ON u2.id = m."user2Id"
            WHERE m."matchedAt" >= NOW() - INTERVAL '30 days' AND u1."deletedAt" IS NULL AND u2."deletedAt" IS NULL)),
          ('conversation_started', (SELECT COUNT(*) FROM "Conversation" c
            JOIN "User" u1 ON u1.id = c."user1Id" JOIN "User" u2 ON u2.id = c."user2Id"
            WHERE c."createdAt" >= NOW() - INTERVAL '30 days' AND u1."deletedAt" IS NULL AND u2."deletedAt" IS NULL)),
          ('plan_proposed', (SELECT COUNT(*) FROM "DatePlan" dp
            JOIN "Match" m ON m.id = dp."matchId"
            JOIN "User" u1 ON u1.id = m."user1Id" JOIN "User" u2 ON u2.id = m."user2Id"
            WHERE dp."createdAt" >= NOW() - INTERVAL '30 days' AND u1."deletedAt" IS NULL AND u2."deletedAt" IS NULL))
      ) AS funnel(stage, total)
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT COALESCE("source", 'direct') AS label, COUNT(*) AS total
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= NOW() - INTERVAL '30 days'
        AND "eventName" IN ('page_view','landing_viewed','signup_completed')
      GROUP BY 1 ORDER BY 2 DESC LIMIT 12
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT "campaign" AS label, COUNT(*) AS total
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= NOW() - INTERVAL '30 days' AND "campaign" IS NOT NULL
      GROUP BY 1 ORDER BY 2 DESC LIMIT 12
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT COALESCE("page", '/') AS label, COUNT(*) AS total
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= NOW() - INTERVAL '30 days'
        AND "eventName" IN ('page_view','landing_viewed')
      GROUP BY 1 ORDER BY 2 DESC LIMIT 12
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT "country" AS label, COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) AS total
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= NOW() - INTERVAL '30 days' AND "country" IS NOT NULL
      GROUP BY 1 HAVING COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) >= 10
      ORDER BY 2 DESC LIMIT 12
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT "city" AS label, COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) AS total
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= NOW() - INTERVAL '30 days' AND "city" IS NOT NULL
      GROUP BY 1 HAVING COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) >= 10
      ORDER BY 2 DESC LIMIT 12
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT p."primaryIntent"::text AS label, COUNT(*) AS total
      FROM "Profile" p JOIN "User" u ON u.id = p."userId"
      WHERE p."primaryIntent" IS NOT NULL AND u."deletedAt" IS NULL
      GROUP BY 1 HAVING COUNT(*) >= 10 ORDER BY 2 DESC
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT COALESCE("language", 'unknown') AS label, COUNT(*) AS total
      FROM "AnalyticsEvent" WHERE "occurredAt" >= NOW() - INTERVAL '30 days'
      GROUP BY 1 ORDER BY 2 DESC LIMIT 12
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT COALESCE("deviceCategory", 'unknown') AS label, COUNT(*) AS total
      FROM "AnalyticsEvent" WHERE "occurredAt" >= NOW() - INTERVAL '30 days'
      GROUP BY 1 ORDER BY 2 DESC LIMIT 8
    `,
    prisma.$queryRaw<BreakdownRow[]>`
      SELECT "eventName" AS label, COUNT(*) AS total
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= NOW() - INTERVAL '30 days'
        AND "eventName" IN (
          'onboarding_started','onboarding_step_completed','profile_completed','signal_activated',
          'feed_viewed','profile_exposed','contextual_signal_sent','reciprocal_connection_created',
          'reveal_started','reveal_completed','conversation_started','message_sent','plan_proposed',
          'plan_accepted','connection_closed','user_blocked','report_submitted'
        )
      GROUP BY 1 ORDER BY 2 DESC
    `,
    prisma.$queryRaw<CohortRow[]>`
      SELECT
        date_trunc('week', u."createdAt") AS cohort,
        COUNT(*) AS users,
        COUNT(*) FILTER (WHERE EXISTS (
          SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id
          AND e."occurredAt" >= u."createdAt" + INTERVAL '1 day'
          AND e."occurredAt" < u."createdAt" + INTERVAL '2 days'
        )) AS d1,
        COUNT(*) FILTER (WHERE EXISTS (
          SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id
          AND e."occurredAt" >= u."createdAt" + INTERVAL '7 days'
          AND e."occurredAt" < u."createdAt" + INTERVAL '8 days'
        )) AS d7,
        COUNT(*) FILTER (WHERE EXISTS (
          SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id
          AND e."occurredAt" >= u."createdAt" + INTERVAL '30 days'
          AND e."occurredAt" < u."createdAt" + INTERVAL '31 days'
        )) AS d30
      FROM "User" u
      WHERE u."createdAt" >= NOW() - INTERVAL '90 days' AND u."deletedAt" IS NULL
      GROUP BY 1 ORDER BY 1 DESC LIMIT 13
    `,
    prisma.$queryRaw<Array<{ apiErrors24h: CountValue }>>`
      SELECT COUNT(*) AS "apiErrors24h" FROM "AnalyticsEvent"
      WHERE "eventName" = 'api_request' AND "occurredAt" >= NOW() - INTERVAL '1 day'
        AND properties->>'outcome' = 'error'
    `,
    prisma.$queryRaw<Array<{ failed: CountValue; pending: CountValue }>>`
      SELECT
        COUNT(*) FILTER (WHERE status = 'failed') AS failed,
        COUNT(*) FILTER (WHERE status IN ('pending','retry','processing')) AS pending
      FROM "EmailLog"
    `,
    prisma.$queryRaw<Array<{ failed: CountValue }>>`
      SELECT COUNT(*) FILTER (WHERE "deliveryStatus" = 'FAILED') AS failed FROM "Notification"
    `,
    prisma.$queryRaw<JobRow[]>`
      SELECT DISTINCT ON ("jobName") "jobName", status, "startedAt", "finishedAt", "processedCount", error
      FROM "JobRun" ORDER BY "jobName", "startedAt" DESC
    `,
    getBackupHealth(),
    getMigrationHealth(),
  ]);

  const overview = overviewRows[0];
  const pageViews30d = count(overview?.pageViews30d);
  const signups30d = count(overview?.signups30d);
  const funnelBase = breakdown(funnelRows);
  const funnel = funnelBase.map((item, index) => ({
    ...item,
    conversionFromPrevious: index === 0 ? null : conversion(item.total, funnelBase[index - 1]?.total ?? 0),
  }));

  return {
    overview: {
      visitorsToday: count(overview?.visitorsToday),
      visitors7d: count(overview?.visitors7d),
      visitors30d: count(overview?.visitors30d),
      sessions30d: count(overview?.sessions30d),
      pageViews30d,
      pageViewsChange: percentChange(pageViews30d, count(overview?.pageViewsPrevious30d)),
      signupsToday: count(overview?.signupsToday),
      signups7d: count(overview?.signups7d),
      signups30d,
      signupsChange: percentChange(signups30d, count(overview?.signupsPrevious30d)),
      totalUsers: count(overview?.totalUsers),
      completedProfiles: count(overview?.completedProfiles),
      dau: count(overview?.dau),
      wau: count(overview?.wau),
      mau: count(overview?.mau),
      reciprocalConnections: count(overview?.reciprocalConnections),
      conversationsStarted: count(overview?.conversationsStarted),
      plansProposed: count(overview?.plansProposed),
      visitToSignup: comparablePercentage(
        signups30d,
        count(overview?.visitors30d),
      ),
    },
    funnel,
    acquisition: breakdown(acquisitionRows),
    campaigns: breakdown(campaignRows),
    topPages: breakdown(pageRows),
    countries: breakdown(countryRows),
    cities: breakdown(cityRows),
    intentions: breakdown(intentionRows),
    languages: breakdown(languageRows),
    devices: breakdown(deviceRows),
    product: breakdown(productRows),
    cohorts: cohortRows.map((row) => {
      const users = count(row.users);
      return {
        cohort: row.cohort.toISOString().slice(0, 10),
        users,
        d1: conversion(count(row.d1), users) ?? 0,
        d7: conversion(count(row.d7), users) ?? 0,
        d30: conversion(count(row.d30), users) ?? 0,
      };
    }),
    health: {
      apiErrors24h: count(healthRows[0]?.apiErrors24h),
      emailFailed: count(emailRows[0]?.failed),
      emailPending: count(emailRows[0]?.pending),
      notificationFailed: count(notificationRows[0]?.failed),
      jobs,
      uptimeSeconds: Math.floor(process.uptime()),
      deployedCommit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "unknown",
      backup,
      migration,
    },
  };
}
