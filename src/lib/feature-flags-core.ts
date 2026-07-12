import { createHash } from "node:crypto";
import type { RuntimeEnvironment } from "./runtime-environment.ts";

export type FeatureFlagConfig = Readonly<Record<string, unknown>>;

export interface FeatureFlagDefinition<
  TConfig extends FeatureFlagConfig = FeatureFlagConfig,
> {
  key: string;
  enabled: boolean;
  rolloutPercent: number;
  environments: readonly RuntimeEnvironment[];
  cities: readonly string[];
  cohorts: readonly string[];
  testUserIds: readonly string[];
  config: TConfig;
  version: number;
}

export interface FeatureFlagTarget {
  environment: RuntimeEnvironment;
  userId?: string | null;
  anonymousId?: string | null;
  city?: string | null;
  cohorts?: readonly string[] | null;
}

export type FeatureFlagReason =
  | "enabled"
  | "global_disabled"
  | "environment_mismatch"
  | "test_user"
  | "city_mismatch"
  | "cohort_mismatch"
  | "rollout_disabled"
  | "missing_stable_subject"
  | "rollout_excluded"
  | "flag_unavailable";

export interface FeatureFlagEvaluation<
  TConfig extends FeatureFlagConfig = FeatureFlagConfig,
> {
  enabled: boolean;
  reason: FeatureFlagReason;
  bucket: number | null;
  version: number;
  config: TConfig;
}

function normalizeTargetingValue(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function includesNormalized(values: readonly string[], candidate: string): boolean {
  const normalizedCandidate = normalizeTargetingValue(candidate);
  return values.some(
    (value) => normalizeTargetingValue(value) === normalizedCandidate,
  );
}

export function stableRolloutBucket(
  flagKey: string,
  version: number,
  stableSubject: string,
): number {
  const digest = createHash("sha256")
    .update(`${flagKey}:${version}:${stableSubject}`)
    .digest();
  return digest.readUInt32BE(0) % 10_000;
}

export function evaluateFeatureFlag<
  TConfig extends FeatureFlagConfig = FeatureFlagConfig,
>(
  flag: FeatureFlagDefinition<TConfig>,
  target: FeatureFlagTarget,
): FeatureFlagEvaluation<TConfig> {
  const base = {
    bucket: null,
    version: flag.version,
    config: flag.config,
  } as const;

  if (!flag.enabled) {
    return { ...base, enabled: false, reason: "global_disabled" };
  }

  if (
    flag.environments.length > 0 &&
    !flag.environments.includes(target.environment)
  ) {
    return { ...base, enabled: false, reason: "environment_mismatch" };
  }

  if (target.userId && flag.testUserIds.includes(target.userId)) {
    return { ...base, enabled: true, reason: "test_user" };
  }

  if (
    flag.cities.length > 0 &&
    (!target.city || !includesNormalized(flag.cities, target.city))
  ) {
    return { ...base, enabled: false, reason: "city_mismatch" };
  }

  const targetCohorts = target.cohorts ?? [];
  if (
    flag.cohorts.length > 0 &&
    !targetCohorts.some((cohort) => includesNormalized(flag.cohorts, cohort))
  ) {
    return { ...base, enabled: false, reason: "cohort_mismatch" };
  }

  const rolloutPercent = Math.max(0, Math.min(100, flag.rolloutPercent));
  if (rolloutPercent <= 0) {
    return { ...base, enabled: false, reason: "rollout_disabled" };
  }
  if (rolloutPercent >= 100) {
    return { ...base, enabled: true, reason: "enabled" };
  }

  const stableSubject = target.userId?.trim() || target.anonymousId?.trim();
  if (!stableSubject) {
    return { ...base, enabled: false, reason: "missing_stable_subject" };
  }

  const bucket = stableRolloutBucket(flag.key, flag.version, stableSubject);
  const enabled = bucket < Math.round(rolloutPercent * 100);
  return {
    enabled,
    reason: enabled ? "enabled" : "rollout_excluded",
    bucket,
    version: flag.version,
    config: flag.config,
  };
}

export function unavailableFeatureFlagEvaluation<
  TConfig extends FeatureFlagConfig = FeatureFlagConfig,
>(config: TConfig = {} as TConfig): FeatureFlagEvaluation<TConfig> {
  return {
    enabled: false,
    reason: "flag_unavailable",
    bucket: null,
    version: 0,
    config,
  };
}
