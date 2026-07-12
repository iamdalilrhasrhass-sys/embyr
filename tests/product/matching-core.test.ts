import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateCompatibility,
  haversineKm,
  isAgeCompatible,
  isOrientationCompatible,
  type CompatibilityProfile,
} from "../../src/lib/matching.ts";

const completed = new Date("2026-01-01T00:00:00.000Z");
const now = new Date("2026-07-12T12:00:00.000Z");

function profile(overrides: Partial<CompatibilityProfile> = {}): CompatibilityProfile {
  return {
    userId: "user-a",
    age: 31,
    city: "Zurich",
    country: "CH",
    latitude: 47.3769,
    longitude: 8.5417,
    genderIdentity: "HOMME",
    orientation: "HETERO",
    seekingGenders: ["FEMME"],
    primaryIntent: "AMOUR",
    acceptedIntents: ["AMOUR", "DISCUSSION"],
    activities: ["randonnée", "cinéma"],
    seekingAgeMin: 25,
    seekingAgeMax: 40,
    seekingRadiusKm: 80,
    visibilityStatus: "PUBLIC",
    moderationState: "ACTIVE",
    publicVisibility: true,
    onboardingCompletedAt: completed,
    isVerified: false,
    lastActiveAt: now,
    profileCompletionScore: 80,
    ...overrides,
  };
}

function compatibleCandidate(overrides: Partial<CompatibilityProfile> = {}): CompatibilityProfile {
  return profile({
    userId: "user-b",
    age: 30,
    genderIdentity: "FEMME",
    seekingGenders: ["HOMME"],
    latitude: 47.3667,
    longitude: 8.55,
    ...overrides,
  });
}

test("requires reciprocal gender preferences, never a one-way preference", () => {
  const user = profile();
  const candidate = compatibleCandidate();
  assert.equal(isOrientationCompatible(user, candidate), true);
  assert.equal(isOrientationCompatible(user, { ...candidate, seekingGenders: ["FEMME"] }), false);
  assert.deepEqual(evaluateCompatibility(user, { ...candidate, seekingGenders: ["FEMME"] }, { now }), {
    eligible: false,
    reasonCode: "GENDER_PREFERENCES",
  });
});

test("requires both age ranges and treats exact boundaries as eligible", () => {
  const user = profile({ age: 31, seekingAgeMin: 30, seekingAgeMax: 35 });
  assert.equal(isAgeCompatible(user, compatibleCandidate({ age: 30, seekingAgeMin: 31, seekingAgeMax: 31 })), true);
  assert.equal(isAgeCompatible(user, compatibleCandidate({ age: 29 })), false);
  assert.equal(isAgeCompatible(user, compatibleCandidate({ seekingAgeMax: 30 })), false);
});

test("enforces each participant's distance radius", () => {
  const user = profile({ seekingRadiusKm: 10 });
  const near = compatibleCandidate({ seekingRadiusKm: 10 });
  const far = compatibleCandidate({ latitude: 46.2044, longitude: 6.1432, city: "Geneva" });
  assert.ok(haversineKm(47.3769, 8.5417, 47.3667, 8.55) < 10);
  assert.equal(evaluateCompatibility(user, near, { now }).eligible, true);
  assert.deepEqual(evaluateCompatibility(user, far, { now }), { eligible: false, reasonCode: "DISTANCE" });
});

test("fails closed when distance is unknown and the approximate cities differ", () => {
  const user = profile({ latitude: null, longitude: null, seekingRadiusKm: 30 });
  const candidate = compatibleCandidate({ latitude: null, longitude: null, city: "Lausanne" });
  assert.deepEqual(evaluateCompatibility(user, candidate, { now }), {
    eligible: false,
    reasonCode: "DISTANCE_UNKNOWN",
  });
});

test("requires a shared intent and applies the explicit interface filter", () => {
  const user = profile({ primaryIntent: "AMOUR", acceptedIntents: ["AMOUR"] });
  const candidate = compatibleCandidate({ primaryIntent: "AMIS", acceptedIntents: ["AMIS"] });
  assert.deepEqual(evaluateCompatibility(user, candidate, { now }), { eligible: false, reasonCode: "INTENT" });
  assert.deepEqual(evaluateCompatibility(user, compatibleCandidate(), { now, intentFilter: "SPORT" }), {
    eligible: false,
    reasonCode: "INTENT_FILTER",
  });
});

test("only active, visible, unexpired signals create synchronized availability", () => {
  const activeSignal = { intent: "AMOUR" as const, active: true, visible: true, expiresAt: new Date(now.getTime() + 60_000) };
  const expiredSignal = { ...activeSignal, expiresAt: new Date(now.getTime() - 1) };
  const active = evaluateCompatibility(profile(), compatibleCandidate(), {
    now,
    userSignal: activeSignal,
    candidateSignal: activeSignal,
  });
  const expired = evaluateCompatibility(profile(), compatibleCandidate(), {
    now,
    userSignal: expiredSignal,
    candidateSignal: activeSignal,
  });
  assert.equal(active.eligible, true);
  assert.equal(expired.eligible, true);
  if (active.eligible && expired.eligible) {
    assert.ok(active.reasonCodes.includes("SYNCHRONIZED_AVAILABILITY"));
    assert.ok(!expired.reasonCodes.includes("SYNCHRONIZED_AVAILABILITY"));
    assert.ok(active.score > expired.score);
  }
});

test("excludes self, incomplete, hidden and moderated profiles", () => {
  const user = profile();
  assert.deepEqual(evaluateCompatibility(user, compatibleCandidate({ userId: user.userId }), { now }), { eligible: false, reasonCode: "SELF" });
  assert.deepEqual(evaluateCompatibility(user, compatibleCandidate({ onboardingCompletedAt: null }), { now }), { eligible: false, reasonCode: "ONBOARDING_INCOMPLETE" });
  assert.deepEqual(evaluateCompatibility(user, compatibleCandidate({ visibilityStatus: "HIDDEN" }), { now }), { eligible: false, reasonCode: "INVISIBLE" });
  assert.deepEqual(evaluateCompatibility(user, compatibleCandidate({ moderationState: "SUSPENDED" }), { now }), { eligible: false, reasonCode: "MODERATION" });
});

test("fails closed for missing essential preference data", () => {
  assert.deepEqual(evaluateCompatibility(profile({ seekingGenders: [] }), compatibleCandidate(), { now }), {
    eligible: false,
    reasonCode: "GENDER_PREFERENCES",
  });
  assert.deepEqual(evaluateCompatibility(profile({ primaryIntent: null, acceptedIntents: [] }), compatibleCandidate(), { now }), {
    eligible: false,
    reasonCode: "INTENT",
  });
});

test("returns human reasons without exposing an internal percentage", () => {
  const result = evaluateCompatibility(profile(), compatibleCandidate({ activities: ["cinéma", "lecture"] }), { now });
  assert.equal(result.eligible, true);
  if (result.eligible) {
    assert.ok(result.reasons.some((reason) => reason.includes("réciproquement")));
    assert.ok(result.reasons.some((reason) => reason.includes("activité")));
    assert.ok(result.reasons.every((reason) => !reason.includes("%")));
  }
});
