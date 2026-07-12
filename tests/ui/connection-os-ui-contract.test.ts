import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const onboardingPath = "src/app/[locale]/onboarding/page.tsx";
const dashboardPath = "src/app/[locale]/dashboard/page.tsx";
const messagesPath = "src/app/[locale]/messages/page.tsx";
const connectionJourneyPath =
  "src/components/connection-os/ConnectionJourney.tsx";
const activeConnectionsPath =
  "src/components/connection-os/ActiveConnections.tsx";
const connectionPagePath = "src/app/[locale]/connections/[id]/page.tsx";

test("onboarding persists reciprocal preferences, consent and progress", async () => {
  const source = await readFile(onboardingPath, "utf8");
  for (const field of [
    "orientation",
    "seekingGenders",
    "acceptedIntents",
    "primaryIntent",
    "activities",
    "seekingAgeMin",
    "seekingAgeMax",
    "seekingRadiusKm",
    "consentSensitiveData",
    "onboardingStep",
    "onboardingComplete",
  ]) {
    assert.match(
      source,
      new RegExp(`\\b${field}\\b`),
      `${field} must be part of onboarding`,
    );
  }
  assert.match(source, /role="progressbar"/);
});

test("dashboard requires a signal and uses a bounded five-profile selection", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.match(source, /fetch\("\/api\/signals"/);
  assert.match(source, /limit: "5"/);
  assert.doesNotMatch(source, /limit: "20"/);
  assert.doesNotMatch(source, /swipe infini/i);
});

test("dashboard sends a contextual reaction and exact free copy", async () => {
  const [dashboard, spark, localizedCopy] = await Promise.all([
    readFile(dashboardPath, "utf8"),
    readFile("src/components/connection-os/SparkCard.tsx", "utf8"),
    readFile("src/components/connection-os/copy.ts", "utf8"),
  ]);
  assert.match(dashboard, /targetUserId, \.\.\.action/);
  assert.match(spark, /targetType: selectedTarget\.type/);
  assert.match(spark, /targetId: selectedTarget\.id/);
  assert.match(spark, /cleanNote\.length < 12/);
  assert.match(
    localizedCopy,
    /Tout ce qu’il faut pour rencontrer quelqu’un est gratuit\. Sans carte bancaire\./,
  );
  assert.doesNotMatch(
    dashboard + localizedCopy,
    /gratuit[^\n]{0,20}lancement|lancement[^\n]{0,20}gratuit/i,
  );
});

test("messages use the authenticated user id and visibility-aware polling", async () => {
  const source = await readFile(messagesPath, "utf8");
  assert.match(source, /data\.user\?\.id/);
  assert.match(source, /document\.visibilityState === "hidden"/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /activeConversationId \? 5_000 : 15_000/);
});

test("messages send conversation id and translate by message id only", async () => {
  const source = await readFile(messagesPath, "utf8");
  assert.match(source, /conversationId: activeConversation\.id/);
  assert.match(
    source,
    /JSON\.stringify\(\{ messageId, targetLang: myLanguage \}\)/,
  );
  assert.doesNotMatch(source, /JSON\.stringify\(\{ text: content, targetLang/);
});

test("connection journey opens the selected conversation and supports rescheduling", async () => {
  const [journey, messages] = await Promise.all([
    readFile(connectionJourneyPath, "utf8"),
    readFile(messagesPath, "utf8"),
  ]);

  assert.match(
    journey,
    /\?conversation=\$\{encodeURIComponent\(conversationId\)\}/,
  );
  assert.match(messages, /new URLSearchParams\([\s\S]*window\.location\.search/);
  assert.match(messages, /get\("conversation"\)/);
  assert.match(journey, /action: PlanAction/);
  assert.match(journey, /updatePlan\(planId, "reschedule"/);
  assert.match(journey, /plan\.canReschedule/);
});

test("connection journey exposes accessible controls and localized product states", async () => {
  const [journey, activeConnections, connectionPage] = await Promise.all([
    readFile(connectionJourneyPath, "utf8"),
    readFile(activeConnectionsPath, "utf8"),
    readFile(connectionPagePath, "utf8"),
  ]);

  assert.match(journey, /htmlFor="reveal-answer"/);
  assert.match(journey, /htmlFor="outcome-note"/);
  assert.match(journey, /aria-pressed=\{outcome === item\}/);
  assert.match(journey, /<legend className="sr-only">/);
  assert.match(journey, /role="status"/);
  assert.match(journey, /What activity would you like to share soon\?/);
  assert.match(journey, /¿Qué actividad te gustaría compartir pronto\?/);
  assert.match(activeConnections, /connection\.nextAction === "review_plan"/);
  assert.match(activeConnections, /connection\.nextAction === "prepare_meeting"/);
  assert.match(connectionPage, /generateMetadata/);
  assert.match(connectionPage, /Connection — Embir/);
  assert.match(connectionPage, /Conexión — Embir/);
});

test("closed connections leave the active journey and past plans cannot be accepted", async () => {
  const [detailRoute, mutualRoute, revealRoute, plansRoute, outcomeRoute] =
    await Promise.all([
      readFile("src/app/api/connections/[id]/route.ts", "utf8"),
      readFile("src/app/api/match/mutual/route.ts", "utf8"),
      readFile("src/app/api/connections/[id]/reveal/route.ts", "utf8"),
      readFile("src/app/api/connections/[id]/plans/route.ts", "utf8"),
      readFile("src/app/api/connections/[id]/outcome/route.ts", "utf8"),
    ]);

  assert.match(detailRoute, /status: "mutual"/);
  assert.match(detailRoute, /state: \{ in: VISIBLE_STATES \}/);
  assert.doesNotMatch(
    detailRoute,
    /OR: \[\{ state: \{ in: VISIBLE_STATES \} \}, \{ status: "mutual" \}]/,
  );
  assert.match(mutualRoute, /state: \{ in: ACTIVE_STATES \}/);
  assert.doesNotMatch(
    mutualRoute,
    /OR: \[\{ state: \{ in: ACTIVE_STATES \} \}, \{ status: "mutual" \}]/,
  );
  assert.match(revealRoute, /REVEAL_RESPONDABLE_STATES/);
  assert.match(plansRoute, /plan\.proposedAt > now/);
  assert.match(plansRoute, /canCancel:/);
  assert.match(plansRoute, /if \(plan\.proposedAt <= now\)/);
  assert.match(outcomeRoute, /OUTCOME_STATES\.includes\(match\.state\)/);
});
