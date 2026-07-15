import { prisma } from "./prisma.ts";

type CountValue = bigint | number;

interface AdminSignupMetricsRow {
  totalUsers: CountValue;
  qualifiedMembers: CountValue;
  growth24h: CountValue;
  isRealSignup: boolean;
}

export interface AdminSignupMetrics {
  totalUsers: number;
  qualifiedMembers: number;
  growth24h: number;
  isRealSignup: boolean;
}

function toSafeCount(value: CountValue): number {
  const count = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("Admin signup metric exceeded the supported range");
  }
  return count;
}

/**
 * Computes the privacy-safe cohort displayed in operational signup emails.
 * Synthetic/internal identities and QA acquisition runs are deliberately
 * excluded so test automation cannot turn the admin inbox into a log stream.
 */
export async function collectAdminSignupMetrics(input: {
  userId: string;
  now: Date;
}): Promise<AdminSignupMetrics> {
  if (!input.userId.trim() || Number.isNaN(input.now.getTime())) {
    throw new Error("Invalid admin signup metric input");
  }
  const since = new Date(input.now.getTime() - 24 * 60 * 60 * 1000);
  const rows = await prisma.$queryRaw<AdminSignupMetricsRow[]>`
    WITH registered AS (
      SELECT
        u.id,
        u.email,
        u."emailVerified",
        u."consentSensitiveData",
        u."createdAt",
        p.city,
        p."primaryIntent",
        p."seekingGenders",
        p."seekingAgeMin",
        p."seekingAgeMax",
        p."moderationState"
      FROM "User" u
      JOIN "Profile" p ON p."userId" = u.id
      WHERE u."deletedAt" IS NULL
        AND u."bannedAt" IS NULL
        AND u.role IN ('USER', 'AMBASSADOR')
        AND u."isAdultConfirmed" = TRUE
        AND p."profileSource" = 'user_registration'
        AND LOWER(TRIM(u.email)) NOT LIKE '%@embir.xyz'
        AND LOWER(TRIM(u.email)) NOT LIKE '%embir-qa%'
        AND LOWER(TRIM(u.email)) NOT LIKE '%@test.%'
        AND LOWER(TRIM(u.email)) NOT LIKE '%.test'
        AND LOWER(TRIM(u.email)) NOT LIKE '%.local'
        AND LOWER(TRIM(u.email)) !~ '@example\.(com|org|net|invalid)$'
        AND NOT EXISTS (
          SELECT 1
          FROM "AcquisitionEvent" synthetic_acquisition
          WHERE synthetic_acquisition."userId" = u.id
            AND synthetic_acquisition."eventType" = 'register'
            AND LOWER(TRIM(synthetic_acquisition.source)) ~ '^(qa|test|internal)([_-]|$)'
        )
    ), qualified AS (
      SELECT account.id
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
    )
    SELECT
      (SELECT COUNT(*) FROM registered) AS "totalUsers",
      (SELECT COUNT(*) FROM qualified) AS "qualifiedMembers",
      (SELECT COUNT(*) FROM registered WHERE "createdAt" >= ${since}) AS "growth24h",
      EXISTS(SELECT 1 FROM registered WHERE id = ${input.userId}) AS "isRealSignup"
  `;
  const row = rows[0];
  if (!row) throw new Error("Admin signup metrics query returned no result");
  return {
    totalUsers: toSafeCount(row.totalUsers),
    qualifiedMembers: toSafeCount(row.qualifiedMembers),
    growth24h: toSafeCount(row.growth24h),
    isRealSignup: row.isRealSignup === true,
  };
}
