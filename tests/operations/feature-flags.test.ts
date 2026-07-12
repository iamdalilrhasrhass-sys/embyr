import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateFeatureFlag,
  stableRolloutBucket,
  type FeatureFlagDefinition,
} from "../../src/lib/feature-flags-core.ts";

function flag(
  overrides: Partial<FeatureFlagDefinition> = {},
): FeatureFlagDefinition {
  return {
    key: "connection.reveal",
    enabled: true,
    rolloutPercent: 50,
    environments: ["production"],
    cities: [],
    cohorts: [],
    testUserIds: [],
    config: { steps: 3 },
    version: 1,
    ...overrides,
  };
}

test("feature rollout is deterministic for the same stable subject", () => {
  const first = evaluateFeatureFlag(flag(), {
    environment: "production",
    userId: "user-123",
  });
  const second = evaluateFeatureFlag(flag(), {
    environment: "production",
    userId: "user-123",
  });
  assert.deepEqual(first, second);
  assert.equal(first.bucket, stableRolloutBucket("connection.reveal", 1, "user-123"));
});

test("global and environment switches fail closed", () => {
  assert.equal(
    evaluateFeatureFlag(flag({ enabled: false }), {
      environment: "production",
      userId: "tester",
    }).reason,
    "global_disabled",
  );
  assert.equal(
    evaluateFeatureFlag(flag(), {
      environment: "staging",
      userId: "tester",
    }).reason,
    "environment_mismatch",
  );
});

test("test users bypass rollout and audience targeting but not global switches", () => {
  const definition = flag({
    rolloutPercent: 0,
    cities: ["Paris"],
    cohorts: ["pilot"],
    testUserIds: ["qa-user"],
  });
  const result = evaluateFeatureFlag(definition, {
    environment: "production",
    userId: "qa-user",
    city: "Zurich",
    cohorts: [],
  });
  assert.equal(result.enabled, true);
  assert.equal(result.reason, "test_user");
});

test("city and cohort targeting are normalized", () => {
  const definition = flag({
    rolloutPercent: 100,
    cities: [" Zürich "],
    cohorts: ["FOUNDERS"],
  });
  const result = evaluateFeatureFlag(definition, {
    environment: "production",
    userId: "user-456",
    city: "zürich",
    cohorts: ["founders"],
  });
  assert.equal(result.enabled, true);
});

test("partial rollout requires a stable subject", () => {
  const result = evaluateFeatureFlag(flag(), { environment: "production" });
  assert.equal(result.enabled, false);
  assert.equal(result.reason, "missing_stable_subject");
});

test("version participates in deterministic assignment", () => {
  const v1 = stableRolloutBucket("connection.reveal", 1, "fixed-user");
  const v2 = stableRolloutBucket("connection.reveal", 2, "fixed-user");
  assert.notEqual(v1, v2);
  assert.ok(v1 >= 0 && v1 < 10_000);
  assert.ok(v2 >= 0 && v2 < 10_000);
});
