import { randomUUID } from "node:crypto";
import type { AggregateReportData } from "./email-core.ts";
import { prisma } from "./prisma.ts";

interface AggregateCountRow {
  newUsers: bigint | number;
  activePresenceSignals: bigint | number;
  mutualMatches: bigint | number;
  messagesSent: bigint | number;
  reportsCreated: bigint | number;
  analyticsEvents: bigint | number;
  emailsSent: bigint | number;
  emailsPending: bigint | number;
  emailsFailed: bigint | number;
  uniqueVisitors: bigint | number;
  sessions: bigint | number;
  pageViews: bigint | number;
  totalUsers: bigint | number;
  completedProfiles: bigint | number;
  activeUsers: bigint | number;
  previousVisitors: bigint | number;
  previousNewUsers: bigint | number;
  sevenDayVisitors: bigint | number;
  retentionEligibleD1: bigint | number;
  retainedD1: bigint | number;
  retentionEligibleD7: bigint | number;
  retainedD7: bigint | number;
  retentionEligibleD30: bigint | number;
  retainedD30: bigint | number;
}

interface TopRow { label: string | null; total: bigint | number }

function toSafeCount(value: bigint | number): number {
  const count = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("Aggregate count exceeded the supported range");
  }
  return count;
}

export async function collectAggregateReport(input: {
  cadence: "daily" | "weekly";
  periodStart: Date;
  periodEnd: Date;
}): Promise<AggregateReportData> {
  const durationMs = input.periodEnd.getTime() - input.periodStart.getTime();
  const previousStart = new Date(input.periodStart.getTime() - durationMs);
  const rows = await prisma.$queryRaw<AggregateCountRow[]>`
    SELECT
      (SELECT COUNT(*) FROM "User"
        WHERE "createdAt" >= ${input.periodStart} AND "createdAt" < ${input.periodEnd}
      ) AS "newUsers",
      (SELECT COUNT(*) FROM "PresenceSignal"
        WHERE "activatedAt" < ${input.periodEnd} AND "expiresAt" >= ${input.periodStart}
      ) AS "activePresenceSignals",
      (SELECT COUNT(*) FROM "Match"
        WHERE "status" = 'mutual'
          AND COALESCE("matchedAt", "createdAt") >= ${input.periodStart}
          AND COALESCE("matchedAt", "createdAt") < ${input.periodEnd}
      ) AS "mutualMatches",
      (SELECT COUNT(*) FROM "Message"
        WHERE "createdAt" >= ${input.periodStart} AND "createdAt" < ${input.periodEnd}
      ) AS "messagesSent",
      (SELECT COUNT(*) FROM "UserReport"
        WHERE "createdAt" >= ${input.periodStart} AND "createdAt" < ${input.periodEnd}
      ) AS "reportsCreated",
      (SELECT COUNT(*) FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      ) AS "analyticsEvents",
      (SELECT COUNT(*) FROM "EmailLog"
        WHERE "sentAt" >= ${input.periodStart} AND "sentAt" < ${input.periodEnd}
      ) AS "emailsSent",
      (SELECT COUNT(*) FROM "EmailLog"
        WHERE "status" IN ('pending', 'retry', 'processing')
          AND "createdAt" < ${input.periodEnd}
      ) AS "emailsPending",
      (SELECT COUNT(*) FROM "EmailLog"
        WHERE "status" = 'failed'
          AND "updatedAt" >= ${input.periodStart} AND "updatedAt" < ${input.periodEnd}
      ) AS "emailsFailed",
      (SELECT COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      ) AS "uniqueVisitors",
      (SELECT COUNT(DISTINCT "sessionId") FROM "AnalyticsEvent"
        WHERE "sessionId" IS NOT NULL AND "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      ) AS sessions,
      (SELECT COUNT(*) FROM "AnalyticsEvent"
        WHERE "eventName" IN ('page_view','landing_viewed')
          AND "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      ) AS "pageViews",
      (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL) AS "totalUsers",
      (SELECT COUNT(*) FROM "Profile" p JOIN "User" u ON u.id = p."userId"
        WHERE p."onboardingCompletedAt" IS NOT NULL AND u."deletedAt" IS NULL
      ) AS "completedProfiles",
      (SELECT COUNT(DISTINCT "userId") FROM "AnalyticsEvent"
        WHERE "userId" IS NOT NULL AND "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      ) AS "activeUsers",
      (SELECT COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${previousStart} AND "occurredAt" < ${input.periodStart}
      ) AS "previousVisitors",
      (SELECT COUNT(*) FROM "User"
        WHERE "createdAt" >= ${previousStart} AND "createdAt" < ${input.periodStart}
      ) AS "previousNewUsers",
      (SELECT COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${new Date(input.periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)} AND "occurredAt" < ${input.periodEnd}
      ) AS "sevenDayVisitors",
      (SELECT COUNT(*) FROM "User" WHERE "createdAt" < ${new Date(input.periodEnd.getTime() - 24 * 60 * 60 * 1000)}) AS "retentionEligibleD1",
      (SELECT COUNT(*) FROM "User" u WHERE u."createdAt" < ${new Date(input.periodEnd.getTime() - 24 * 60 * 60 * 1000)} AND EXISTS (
        SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id AND e."occurredAt" >= u."createdAt" + INTERVAL '1 day' AND e."occurredAt" < u."createdAt" + INTERVAL '2 days'
      )) AS "retainedD1",
      (SELECT COUNT(*) FROM "User" WHERE "createdAt" < ${new Date(input.periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)}) AS "retentionEligibleD7",
      (SELECT COUNT(*) FROM "User" u WHERE u."createdAt" < ${new Date(input.periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)} AND EXISTS (
        SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id AND e."occurredAt" >= u."createdAt" + INTERVAL '7 days' AND e."occurredAt" < u."createdAt" + INTERVAL '8 days'
      )) AS "retainedD7",
      (SELECT COUNT(*) FROM "User" WHERE "createdAt" < ${new Date(input.periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000)}) AS "retentionEligibleD30",
      (SELECT COUNT(*) FROM "User" u WHERE u."createdAt" < ${new Date(input.periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000)} AND EXISTS (
        SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id AND e."occurredAt" >= u."createdAt" + INTERVAL '30 days' AND e."occurredAt" < u."createdAt" + INTERVAL '31 days'
      )) AS "retainedD30"
  `;
  const row = rows[0];
  if (!row) throw new Error("Aggregate query returned no result");

  const [sourceRows, pageRows, countryRows, languageRows] = await Promise.all([
    prisma.$queryRaw<TopRow[]>`
      SELECT COALESCE("source", 'direct') AS label, COUNT(*) AS total FROM "AnalyticsEvent"
      WHERE "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      GROUP BY 1 ORDER BY 2 DESC LIMIT 5
    `,
    prisma.$queryRaw<TopRow[]>`
      SELECT COALESCE("page", '/') AS label, COUNT(*) AS total FROM "AnalyticsEvent"
      WHERE "eventName" IN ('page_view','landing_viewed')
        AND "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      GROUP BY 1 ORDER BY 2 DESC LIMIT 5
    `,
    prisma.$queryRaw<TopRow[]>`
      SELECT "country" AS label, COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) AS total
      FROM "AnalyticsEvent" WHERE "country" IS NOT NULL
        AND "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      GROUP BY 1 HAVING COUNT(DISTINCT COALESCE("anonymousId", "sessionId", "userId")) >= 10
      ORDER BY 2 DESC LIMIT 5
    `,
    prisma.$queryRaw<TopRow[]>`
      SELECT COALESCE("language", 'unknown') AS label, COUNT(*) AS total FROM "AnalyticsEvent"
      WHERE "occurredAt" >= ${input.periodStart} AND "occurredAt" < ${input.periodEnd}
      GROUP BY 1 ORDER BY 2 DESC LIMIT 5
    `,
  ]);
  const uniqueVisitors = toSafeCount(row.uniqueVisitors);
  const visitToSignupRate = uniqueVisitors ? Math.round((toSafeCount(row.newUsers) / uniqueVisitors) * 10_000) / 100 : 0;
  const rate = (retained: bigint | number, eligible: bigint | number) => {
    const denominator = toSafeCount(eligible);
    return denominator ? Math.round((toSafeCount(retained) / denominator) * 10_000) / 100 : 0;
  };
  const alerts: string[] = [];
  if (toSafeCount(row.emailsFailed) > 0) alerts.push("Des emails ont échoué et nécessitent une vérification.");
  if (uniqueVisitors === 0) alerts.push("Aucun visiteur mesuré sur la période : vérifier le tracking et la disponibilité.");
  if (visitToSignupRate < 2 && uniqueVisitors >= 20) alerts.push("La conversion visite → inscription est inférieure à 2 %.");
  const recommendations = [
    uniqueVisitors < 10 ? "Renforcer une seule source d’acquisition mesurable." : "Concentrer l’acquisition sur les deux sources qui convertissent le mieux.",
    toSafeCount(row.mutualMatches) === 0 ? "Améliorer la densité compatible et l’activation des signaux." : "Mesurer le passage connexion réciproque → conversation.",
    toSafeCount(row.completedProfiles) < toSafeCount(row.totalUsers) ? "Réduire l’abandon d’onboarding avec les étapes les plus faibles." : "Maintenir la qualité des profils complétés.",
  ];
  const top = (items: TopRow[]) => items.map((item) => ({ label: item.label ?? "unknown", count: toSafeCount(item.total) }));
  return {
    cadence: input.cadence,
    periodStart: input.periodStart.toISOString(),
    periodEnd: input.periodEnd.toISOString(),
    newUsers: toSafeCount(row.newUsers),
    activePresenceSignals: toSafeCount(row.activePresenceSignals),
    mutualMatches: toSafeCount(row.mutualMatches),
    messagesSent: toSafeCount(row.messagesSent),
    reportsCreated: toSafeCount(row.reportsCreated),
    analyticsEvents: toSafeCount(row.analyticsEvents),
    emailsSent: toSafeCount(row.emailsSent),
    emailsPending: toSafeCount(row.emailsPending),
    emailsFailed: toSafeCount(row.emailsFailed),
    uniqueVisitors,
    sessions: toSafeCount(row.sessions),
    pageViews: toSafeCount(row.pageViews),
    totalUsers: toSafeCount(row.totalUsers),
    completedProfiles: toSafeCount(row.completedProfiles),
    activeUsers: toSafeCount(row.activeUsers),
    visitToSignupRate,
    previousVisitors: toSafeCount(row.previousVisitors),
    previousNewUsers: toSafeCount(row.previousNewUsers),
    sevenDayAverageVisitors: Math.round((toSafeCount(row.sevenDayVisitors) / 7) * 10) / 10,
    retentionD1: rate(row.retainedD1, row.retentionEligibleD1),
    retentionD7: rate(row.retainedD7, row.retentionEligibleD7),
    retentionD30: rate(row.retainedD30, row.retentionEligibleD30),
    topSources: top(sourceRows),
    topPages: top(pageRows),
    topCountries: top(countryRows),
    topLanguages: top(languageRows),
    alerts,
    recommendations,
    priorities: recommendations.slice(0, 3),
  };
}

export async function persistDailyAggregate(
  day: Date,
  report: AggregateReportData,
): Promise<void> {
  if (report.cadence !== "daily") {
    throw new Error("Only daily reports can be stored as DailyAggregate");
  }
  await prisma.$executeRaw`
    INSERT INTO "DailyAggregate" (
      "id", "day", "metrics", "createdAt", "updatedAt"
    ) VALUES (
      ${randomUUID()}, ${day}, CAST(${JSON.stringify(report)} AS jsonb), NOW(), NOW()
    )
    ON CONFLICT ("day") DO UPDATE SET
      "metrics" = EXCLUDED."metrics",
      "updatedAt" = NOW()
  `;
}
