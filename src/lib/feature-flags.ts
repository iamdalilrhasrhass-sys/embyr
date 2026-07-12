import { prisma } from "./prisma.ts";
import {
  evaluateFeatureFlag,
  unavailableFeatureFlagEvaluation,
  type FeatureFlagConfig,
  type FeatureFlagDefinition,
  type FeatureFlagEvaluation,
  type FeatureFlagTarget,
} from "./feature-flags-core.ts";
import { resolveRuntimeEnvironment } from "./runtime-environment.ts";

interface FeatureFlagRow {
  key: string;
  enabled: boolean;
  rolloutPercent: number;
  environments: string[];
  cities: string[];
  cohorts: string[];
  testUserIds: string[];
  config: unknown;
  version: number;
}

const FLAG_KEY_PATTERN = /^[a-z][a-z0-9._-]{1,99}$/;

function normalizeFlag<TConfig extends FeatureFlagConfig>(
  row: FeatureFlagRow,
): FeatureFlagDefinition<TConfig> {
  const environments = row.environments.filter(
    (value): value is FeatureFlagTarget["environment"] =>
      value === "development" ||
      value === "test" ||
      value === "staging" ||
      value === "production",
  );
  const hasInvalidEnvironment = environments.length !== row.environments.length;
  return {
    key: row.key,
    enabled: row.enabled && !hasInvalidEnvironment,
    rolloutPercent: row.rolloutPercent,
    environments,
    cities: row.cities,
    cohorts: row.cohorts,
    testUserIds: row.testUserIds,
    config:
      row.config && typeof row.config === "object" && !Array.isArray(row.config)
        ? (row.config as TConfig)
        : ({} as TConfig),
    version: row.version,
  };
}

export async function getServerFeatureFlag<
  TConfig extends FeatureFlagConfig = FeatureFlagConfig,
>(
  key: string,
  target: Omit<FeatureFlagTarget, "environment"> & {
    environment?: FeatureFlagTarget["environment"];
  } = {},
): Promise<FeatureFlagEvaluation<TConfig>> {
  if (!FLAG_KEY_PATTERN.test(key)) return unavailableFeatureFlagEvaluation<TConfig>();

  try {
    const rows = await prisma.$queryRaw<FeatureFlagRow[]>`
      SELECT
        "key",
        "enabled",
        "rolloutPercent",
        "environments",
        "cities",
        "cohorts",
        "testUserIds",
        "config",
        "version"
      FROM "FeatureFlag"
      WHERE "key" = ${key}
      LIMIT 1
    `;
    if (!rows[0]) return unavailableFeatureFlagEvaluation<TConfig>();
    return evaluateFeatureFlag(normalizeFlag<TConfig>(rows[0]), {
      ...target,
      environment: target.environment ?? resolveRuntimeEnvironment(),
    });
  } catch {
    // Feature infrastructure always fails closed. Callers must never silently
    // expose an unfinished experience because the database is unavailable.
    return unavailableFeatureFlagEvaluation<TConfig>();
  }
}

export async function listServerFeatureFlags(): Promise<FeatureFlagRow[]> {
  return prisma.$queryRaw<FeatureFlagRow[]>`
    SELECT
      "key",
      "enabled",
      "rolloutPercent",
      "environments",
      "cities",
      "cohorts",
      "testUserIds",
      "config",
      "version"
    FROM "FeatureFlag"
    ORDER BY "key" ASC
  `;
}
