import { prisma } from "@/lib/prisma";
import {
  GROWTH_CAMPAIGN_LINKS,
  GROWTH_PACING_WINDOWS,
  GROWTH_STAGE_TARGETS,
  GROWTH_TARGET_TOTAL,
  GROWTH_ZONE_TARGETS,
  buildGrowthCampaignUrl,
  dailyPaceNeeded,
  growthProgress,
  type GrowthStageKey,
  type GrowthZoneKey,
} from "@/lib/growth-targets";

type CountValue = bigint | number;

type GrowthTotalsRow = Record<GrowthStageKey, CountValue> & {
  realRegistrationsGlobal: CountValue;
  emailVerifiedGlobal: CountValue;
  qualifiedGlobal: CountValue;
  activationQualified: CountValue;
  excludedDemoProfiles: CountValue;
  allNonDeletedUsers: CountValue;
};

type DensityRow = {
  zone: GrowthZoneKey | "outside";
  registered: CountValue;
  onboarded: CountValue;
  signaled: CountValue;
  recommended: CountValue;
};

type MeasurementRow = {
  postBaselineEvents: CountValue;
  identifiablePostBaselineEvents: CountValue;
  idempotentPostBaselineEvents: CountValue;
  orphanPostBaselineEvents: CountValue;
  legacyUnidentifiableEvents: CountValue;
  duplicateEmailGroups: CountValue;
  signups30d: CountValue;
  attributedSignups30d: CountValue;
  latestEventAt: Date | null;
};

const count = (value: CountValue | null | undefined) => Number(value ?? 0);

export interface GrowthMetrics {
  objective: {
    target: number;
    realRegistrationsGlobal: number;
    emailVerifiedGlobal: number;
    qualifiedGlobal: number;
    qualifiedInTargetZones: number;
    remaining: number;
    progress: number;
    activationQualified: number;
    excludedDemoProfiles: number;
    allNonDeletedUsers: number;
  };
  stages: Array<{
    key: GrowthStageKey;
    label: string;
    current: number;
    target: number;
    progress: number;
    unit: string;
  }>;
  density: Array<{
    key: GrowthZoneKey;
    label: string;
    current: number;
    target: number;
    progress: number;
    onboarded: number;
    signaled: number;
    recommended: number;
  }>;
  pacing: Array<{ days: number; dailyQualifiedUsersNeeded: number }>;
  measurement: {
    state: "ready" | "calibrating" | "blocked";
    baselineAt: string;
    postBaselineEvents: number;
    actorCoverage: number;
    idempotencyCoverage: number;
    orphanPostBaselineEvents: number;
    legacyUnidentifiableEvents: number;
    duplicateEmailGroups: number;
    signupAttributionCoverage: number | null;
    latestEventAt: string | null;
  };
  campaignLinks: Array<{ label: string; url: string }>;
  definitions: string[];
}

export const GROWTH_MEASUREMENT_BASELINE_AT = "2026-07-14T16:26:48.472Z";

function percentage(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 1_000) / 10;
}

export async function getGrowthMetrics(): Promise<GrowthMetrics> {
  const [totalsRows, densityRows, measurementRows] = await Promise.all([
    prisma.$queryRaw<GrowthTotalsRow[]>`
      WITH registered AS (
        SELECT
          u.id,
          u.email,
          u."emailVerified",
          u."consentSensitiveData",
          p.city,
          p."profileCompletionScore",
          p.description,
          p."onboardingCompletedAt",
          p."primaryIntent",
          p."seekingGenders",
          p."seekingAgeMin",
          p."seekingAgeMax",
          p."publicVisibility",
          p."visibilityStatus",
          p."moderationState",
          CASE
            WHEN LOWER(COALESCE(p.city, '')) ~ '(lausanne|renens|pully|prilly|ecublens|morges|lutry|crissier|bussigny|epalinges)' THEN 'lausanne'
            WHEN LOWER(COALESCE(p.city, '')) ~ '(vevey|montreux|la tour-de-peilz|blonay|saint-legier|villeneuve|aigle)' THEN 'riviera'
            WHEN LOWER(COALESCE(p.city, '')) ~ '(geneve|genève|geneva|carouge|meyrin|vernier|lancy|thonex|onex)' THEN 'geneva'
            WHEN LOWER(COALESCE(p.city, '')) ~ '(fribourg|neuchatel|neuchâtel|yverdon|sion|delemont|delémont|bulle|nyon|martigny|monthey)' THEN 'other_romandie'
            ELSE 'outside'
          END AS zone
        FROM "User" u
        JOIN "Profile" p ON p."userId" = u.id
        WHERE u."deletedAt" IS NULL
          AND u."bannedAt" IS NULL
          AND u.role IN ('USER', 'AMBASSADOR')
          AND u."isAdultConfirmed" = TRUE
          AND p."profileSource" = 'user_registration'
          AND LOWER(TRIM(u.email)) NOT LIKE '%embir-qa%'
          AND LOWER(TRIM(u.email)) NOT LIKE '%@test.%'
          AND LOWER(TRIM(u.email)) NOT LIKE '%.test'
          AND LOWER(TRIM(u.email)) NOT LIKE '%.local'
          AND LOWER(TRIM(u.email)) !~ '@example\.(com|org|net|invalid)$'
      ), qualified AS (
        SELECT *
        FROM registered account
        WHERE account."emailVerified" = TRUE
          AND account."consentSensitiveData" = TRUE
          AND NULLIF(TRIM(COALESCE(account.city, '')), '') IS NOT NULL
          AND account."primaryIntent" IS NOT NULL
          AND CARDINALITY(account."seekingGenders") > 0
          AND account."seekingAgeMin" IS NOT NULL
          AND account."seekingAgeMax" IS NOT NULL
          AND account."moderationState" = 'ACTIVE'
          AND EXISTS (
            SELECT 1 FROM "Consent" consent
            WHERE consent."userId" = account.id AND consent.type = 'cgu'
          )
          AND EXISTS (
            SELECT 1 FROM "Consent" consent
            WHERE consent."userId" = account.id AND consent.type = 'privacy'
          )
          AND EXISTS (
            SELECT 1 FROM "AcquisitionEvent" acquisition
            WHERE acquisition."userId" = account.id
              AND acquisition."eventType" = 'register'
              AND NULLIF(TRIM(COALESCE(acquisition.source, '')), '') IS NOT NULL
          )
          AND NOT EXISTS (
            SELECT 1 FROM "User" duplicate
            WHERE duplicate.id <> account.id
              AND duplicate."deletedAt" IS NULL
              AND LOWER(TRIM(duplicate.email)) = LOWER(TRIM(account.email))
          )
      ), target_eligible AS (
        SELECT * FROM qualified WHERE zone <> 'outside'
      ), qualified_matches AS (
        SELECT m.*
        FROM "Match" m
        JOIN target_eligible e1 ON e1.id = m."user1Id"
        JOIN target_eligible e2 ON e2.id = m."user2Id"
      )
      SELECT
        (SELECT COUNT(*) FROM registered) AS "realRegistrationsGlobal",
        (SELECT COUNT(*) FROM registered WHERE "emailVerified" = TRUE) AS "emailVerifiedGlobal",
        (SELECT COUNT(*) FROM qualified) AS "qualifiedGlobal",
        (SELECT COUNT(*) FROM target_eligible) AS "qualifiedInTargetZones",
        (SELECT COUNT(*) FROM target_eligible
          WHERE "profileCompletionScore" >= 70
            AND NULLIF(TRIM(COALESCE(description, '')), '') IS NOT NULL
            AND NULLIF(TRIM(COALESCE(city, '')), '') IS NOT NULL
        ) AS "usableProfiles",
        (SELECT COUNT(*) FROM target_eligible WHERE "onboardingCompletedAt" IS NOT NULL) AS "onboardedUsers",
        (SELECT COUNT(DISTINCT s."userId") FROM "PresenceSignal" s JOIN target_eligible e ON e.id = s."userId") AS "signalUsers",
        (SELECT COUNT(DISTINCT x."viewerId") FROM "ProfileExposure" x JOIN target_eligible e ON e.id = x."viewerId") AS "recommendationViewers",
        (SELECT COUNT(DISTINCT s."senderId") FROM "ContextualSignal" s JOIN target_eligible e ON e.id = s."senderId") AS "sparkSenders",
        (SELECT COUNT(*) FROM "ContextualSignal" s JOIN target_eligible e ON e.id = s."senderId") AS sparks,
        (SELECT COUNT(*) FROM qualified_matches WHERE status = 'mutual') AS "reciprocalConnections",
        (SELECT COUNT(*) FROM "ConnectionReveal" r JOIN qualified_matches m ON m.id = r."matchId") AS "revealsStarted",
        (SELECT COUNT(*) FROM "ConnectionReveal" r JOIN qualified_matches m ON m.id = r."matchId" WHERE r."completedAt" IS NOT NULL) AS "revealsCompleted",
        (SELECT COUNT(*) FROM "Conversation" c JOIN qualified_matches m ON m.id = c."matchId"
          WHERE EXISTS (
            SELECT 1 FROM "Message" message
            WHERE message."conversationId" = c.id AND message."createdAt" >= NOW() - INTERVAL '30 days'
          )
        ) AS "activeConversations",
        (SELECT COUNT(*) FROM "DatePlan" d JOIN qualified_matches m ON m.id = d."matchId") AS "plansProposed",
        (SELECT COUNT(*) FROM "DatePlan" d JOIN qualified_matches m ON m.id = d."matchId" WHERE d.status = 'CONFIRMED') AS "plansAccepted",
        (SELECT COUNT(*) FROM "Ambassador" a JOIN target_eligible e ON e.id = a."userId" WHERE LOWER(a.status) = 'active') AS "activeAmbassadors",
        (SELECT COUNT(*) FROM "Prospect" p WHERE LOWER(p."sourcePlatform") IN ('partner', 'partenaire') AND LOWER(p.status) IN ('active', 'partenaire_actif')) AS "activePartners",
        (SELECT COUNT(*) FROM target_eligible e
          WHERE e."onboardingCompletedAt" IS NOT NULL
            AND e."primaryIntent" IS NOT NULL
            AND CARDINALITY(e."seekingGenders") > 0
            AND e."seekingAgeMin" IS NOT NULL
            AND e."seekingAgeMax" IS NOT NULL
            AND e."publicVisibility" = TRUE
            AND e."visibilityStatus" = 'PUBLIC'
            AND e."moderationState" = 'ACTIVE'
            AND EXISTS (SELECT 1 FROM "PresenceSignal" s WHERE s."userId" = e.id)
            AND EXISTS (SELECT 1 FROM "ProfileExposure" x WHERE x."viewerId" = e.id)
        ) AS "activationQualified",
        (SELECT COUNT(*) FROM "Profile" p JOIN "User" u ON u.id = p."userId" WHERE u."deletedAt" IS NULL AND p."profileSource" = 'demo_vitrine') AS "excludedDemoProfiles",
        (SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL) AS "allNonDeletedUsers"
    `,
    prisma.$queryRaw<DensityRow[]>`
      WITH registered AS (
        SELECT
          u.id,
          u.email,
          u."emailVerified",
          u."consentSensitiveData",
          p."onboardingCompletedAt",
          p."primaryIntent",
          p."seekingGenders",
          p."seekingAgeMin",
          p."seekingAgeMax",
          p."moderationState",
          CASE
            WHEN LOWER(COALESCE(p.city, '')) ~ '(lausanne|renens|pully|prilly|ecublens|morges|lutry|crissier|bussigny|epalinges)' THEN 'lausanne'
            WHEN LOWER(COALESCE(p.city, '')) ~ '(vevey|montreux|la tour-de-peilz|blonay|saint-legier|villeneuve|aigle)' THEN 'riviera'
            WHEN LOWER(COALESCE(p.city, '')) ~ '(geneve|genève|geneva|carouge|meyrin|vernier|lancy|thonex|onex)' THEN 'geneva'
            WHEN LOWER(COALESCE(p.city, '')) ~ '(fribourg|neuchatel|neuchâtel|yverdon|sion|delemont|delémont|bulle|nyon|martigny|monthey)' THEN 'other_romandie'
            ELSE 'outside'
          END AS zone
        FROM "User" u
        JOIN "Profile" p ON p."userId" = u.id
        WHERE u."deletedAt" IS NULL
          AND u."bannedAt" IS NULL
          AND u.role IN ('USER', 'AMBASSADOR')
          AND u."isAdultConfirmed" = TRUE
          AND p."profileSource" = 'user_registration'
          AND LOWER(TRIM(u.email)) NOT LIKE '%embir-qa%'
          AND LOWER(TRIM(u.email)) NOT LIKE '%@test.%'
          AND LOWER(TRIM(u.email)) NOT LIKE '%.test'
          AND LOWER(TRIM(u.email)) NOT LIKE '%.local'
          AND LOWER(TRIM(u.email)) !~ '@example\.(com|org|net|invalid)$'
      ), eligible AS (
        SELECT *
        FROM registered account
        WHERE account."emailVerified" = TRUE
          AND account."consentSensitiveData" = TRUE
          AND account.zone <> 'outside'
          AND account."primaryIntent" IS NOT NULL
          AND CARDINALITY(account."seekingGenders") > 0
          AND account."seekingAgeMin" IS NOT NULL
          AND account."seekingAgeMax" IS NOT NULL
          AND account."moderationState" = 'ACTIVE'
          AND EXISTS (
            SELECT 1 FROM "Consent" consent
            WHERE consent."userId" = account.id AND consent.type = 'cgu'
          )
          AND EXISTS (
            SELECT 1 FROM "Consent" consent
            WHERE consent."userId" = account.id AND consent.type = 'privacy'
          )
          AND EXISTS (
            SELECT 1 FROM "AcquisitionEvent" acquisition
            WHERE acquisition."userId" = account.id
              AND acquisition."eventType" = 'register'
              AND NULLIF(TRIM(COALESCE(acquisition.source, '')), '') IS NOT NULL
          )
          AND NOT EXISTS (
            SELECT 1 FROM "User" duplicate
            WHERE duplicate.id <> account.id
              AND duplicate."deletedAt" IS NULL
              AND LOWER(TRIM(duplicate.email)) = LOWER(TRIM(account.email))
          )
      )
      SELECT
        zone,
        COUNT(*) AS registered,
        COUNT(*) FILTER (WHERE "onboardingCompletedAt" IS NOT NULL) AS onboarded,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "PresenceSignal" s WHERE s."userId" = eligible.id)) AS signaled,
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "ProfileExposure" x WHERE x."viewerId" = eligible.id)) AS recommended
      FROM eligible
      GROUP BY zone
    `,
    prisma.$queryRaw<MeasurementRow[]>`
      WITH post_baseline AS (
        SELECT * FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${new Date(GROWTH_MEASUREMENT_BASELINE_AT)}
      ), eligible_signups AS (
        SELECT u.id
        FROM "User" u
        JOIN "Profile" p ON p."userId" = u.id
        WHERE u."deletedAt" IS NULL
          AND u."bannedAt" IS NULL
          AND u.role IN ('USER', 'AMBASSADOR')
          AND u."isAdultConfirmed" = TRUE
          AND p."profileSource" = 'user_registration'
          AND LOWER(TRIM(u.email)) NOT LIKE '%embir-qa%'
          AND LOWER(TRIM(u.email)) NOT LIKE '%@test.%'
          AND LOWER(TRIM(u.email)) NOT LIKE '%.test'
          AND LOWER(TRIM(u.email)) NOT LIKE '%.local'
          AND LOWER(TRIM(u.email)) !~ '@example\.(com|org|net|invalid)$'
          AND u."createdAt" >= NOW() - INTERVAL '30 days'
      )
      SELECT
        (SELECT COUNT(*) FROM post_baseline) AS "postBaselineEvents",
        (SELECT COUNT(*) FROM post_baseline WHERE COALESCE("userId", "anonymousId", "sessionId") IS NOT NULL) AS "identifiablePostBaselineEvents",
        (SELECT COUNT(*) FROM post_baseline WHERE "eventId" IS NOT NULL) AS "idempotentPostBaselineEvents",
        (SELECT COUNT(*) FROM post_baseline e LEFT JOIN "User" u ON u.id = e."userId" WHERE e."userId" IS NOT NULL AND u.id IS NULL) AS "orphanPostBaselineEvents",
        (SELECT COUNT(*) FROM "AnalyticsEvent" WHERE COALESCE("userId", "anonymousId", "sessionId") IS NULL) AS "legacyUnidentifiableEvents",
        (SELECT COUNT(*) FROM (
          SELECT LOWER(TRIM(email))
          FROM "User"
          WHERE "deletedAt" IS NULL
          GROUP BY 1 HAVING COUNT(*) > 1
        ) duplicates) AS "duplicateEmailGroups",
        (SELECT COUNT(*) FROM eligible_signups) AS "signups30d",
        (SELECT COUNT(DISTINCT e.id)
          FROM eligible_signups e
          JOIN "AnalyticsEvent" a ON a."userId" = e.id AND a."eventName" = 'signup_completed'
          WHERE COALESCE(a.source, a.medium, a.campaign) IS NOT NULL
        ) AS "attributedSignups30d",
        (SELECT MAX("occurredAt") FROM "AnalyticsEvent") AS "latestEventAt"
    `,
  ]);

  const totals = totalsRows[0];
  const stageValues = Object.fromEntries(
    GROWTH_STAGE_TARGETS.map((stage) => [stage.key, count(totals?.[stage.key])]),
  ) as Record<GrowthStageKey, number>;
  const qualifiedInTargetZones = stageValues.qualifiedInTargetZones;
  const densityByZone = new Map(densityRows.map((row) => [row.zone, row]));
  const measurement = measurementRows[0];
  const postBaselineEvents = count(measurement?.postBaselineEvents);
  const actorCoverage = percentage(count(measurement?.identifiablePostBaselineEvents), postBaselineEvents) ?? 0;
  const idempotencyCoverage = percentage(count(measurement?.idempotentPostBaselineEvents), postBaselineEvents) ?? 0;
  const orphanPostBaselineEvents = count(measurement?.orphanPostBaselineEvents);
  const latestEventAt = measurement?.latestEventAt ?? null;
  const latestEventIsFresh = Boolean(latestEventAt && Date.now() - latestEventAt.getTime() <= 48 * 60 * 60 * 1_000);
  const measurementState = orphanPostBaselineEvents > 0
    ? "blocked"
    : postBaselineEvents >= 50 && actorCoverage >= 90 && idempotencyCoverage >= 90 && latestEventIsFresh
      ? "ready"
      : "calibrating";

  return {
    objective: {
      target: GROWTH_TARGET_TOTAL,
      realRegistrationsGlobal: count(totals?.realRegistrationsGlobal),
      emailVerifiedGlobal: count(totals?.emailVerifiedGlobal),
      qualifiedGlobal: count(totals?.qualifiedGlobal),
      qualifiedInTargetZones,
      remaining: Math.max(0, GROWTH_TARGET_TOTAL - qualifiedInTargetZones),
      progress: growthProgress(qualifiedInTargetZones, GROWTH_TARGET_TOTAL),
      activationQualified: count(totals?.activationQualified),
      excludedDemoProfiles: count(totals?.excludedDemoProfiles),
      allNonDeletedUsers: count(totals?.allNonDeletedUsers),
    },
    stages: GROWTH_STAGE_TARGETS.map((stage) => ({
      ...stage,
      current: stageValues[stage.key],
      progress: growthProgress(stageValues[stage.key], stage.target),
    })),
    density: GROWTH_ZONE_TARGETS.map((zone) => {
      const row = densityByZone.get(zone.key);
      const current = count(row?.registered);
      return {
        ...zone,
        current,
        progress: growthProgress(current, zone.target),
        onboarded: count(row?.onboarded),
        signaled: count(row?.signaled),
        recommended: count(row?.recommended),
      };
    }),
    pacing: GROWTH_PACING_WINDOWS.map((days) => ({
      days,
      dailyQualifiedUsersNeeded: dailyPaceNeeded(qualifiedInTargetZones, GROWTH_TARGET_TOTAL, days),
    })),
    measurement: {
      state: measurementState,
      baselineAt: GROWTH_MEASUREMENT_BASELINE_AT,
      postBaselineEvents,
      actorCoverage,
      idempotencyCoverage,
      orphanPostBaselineEvents,
      legacyUnidentifiableEvents: count(measurement?.legacyUnidentifiableEvents),
      duplicateEmailGroups: count(measurement?.duplicateEmailGroups),
      signupAttributionCoverage: percentage(
        count(measurement?.attributedSignups30d),
        count(measurement?.signups30d),
      ),
      latestEventAt: latestEventAt?.toISOString() ?? null,
    },
    campaignLinks: GROWTH_CAMPAIGN_LINKS.map((link) => ({
      label: link.label,
      url: buildGrowthCampaignUrl(link),
    })),
    definitions: [
      "Inscription humaine : compte adulte, non supprimé, non banni, rôle membre, profil issu d’une inscription réelle — jamais une démo.",
      "Membre qualifié : inscription humaine, email vérifié, consentements CGU/confidentialité/données sensibles, ville, intention, préférences essentielles, source d’acquisition connue et aucun doublon évident.",
      "Zone cible : Lausanne, Riviera, Genève ou autre pôle romand défini dans le plan de densité.",
      "Activation qualifiée : onboarding et préférences utilisables, signal créé et premières recommandations réellement servies.",
      "Conversation active : connexion qualifiée avec au moins un message pendant les 30 derniers jours.",
      "Les comptes QA, démo, staff, supprimés ou bannis sont exclus de tous les objectifs.",
    ],
  };
}
