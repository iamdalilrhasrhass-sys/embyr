import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("public profiles never fall back to fabricated members", async () => {
  const source = await readFile("src/app/api/profiles/route.ts", "utf8");

  assert.doesNotMatch(source, /MOCK_PROFILES/);
  assert.match(source, /status:\s*503/);
});

test("mutual matching records who initiated the pending decision", async () => {
  const route = await readFile("src/app/api/match/action/route.ts", "utf8");
  const schema = await readFile("prisma/schema.prisma", "utf8");

  assert.match(route, /decideMatchTransition/);
  assert.match(route, /initiatorId/);
  assert.match(schema, /initiatorId\s+String\?/);
});

test("production build regenerates Prisma Client before type checking", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const buildScript = packageJson.scripts.build;

  assert.match(buildScript, /\bprisma generate\b/);
  assert.ok(buildScript.indexOf("prisma generate") < buildScript.indexOf("next build"));
});

test("legacy email rows are backfilled before the new NOT NULL constraint", async () => {
  const migration = await readFile(
    "prisma/migrations/20260712000000_connection_os/migration.sql",
    "utf8",
  );
  const addNullable = migration.indexOf('ADD COLUMN     "updatedAt" TIMESTAMP(3),');
  const backfill = migration.indexOf('UPDATE "EmailLog" SET "updatedAt" = "createdAt"');
  const enforce = migration.indexOf('ALTER TABLE "EmailLog" ALTER COLUMN "updatedAt" SET NOT NULL');

  assert.ok(addNullable >= 0);
  assert.ok(backfill > addNullable);
  assert.ok(enforce > backfill);
});

test("uploads use a shared closed allow-list policy", async () => {
  const audio = await readFile("src/app/api/messages/audio/route.ts", "utf8");
  const verification = await readFile(
    "src/app/api/verification/upload/route.ts",
    "utf8",
  );

  assert.match(audio, /upload-policy/);
  assert.doesNotMatch(audio, /startsWith\("audio\/"\)/);
  assert.match(verification, /upload-policy/);
  assert.match(verification, /validateImageSignature/);
  assert.match(verification, /privateVerificationDirectory/);
  assert.doesNotMatch(verification, /file\.name\.split/);
  assert.doesNotMatch(verification, /\/uploads\/verifications/);
});

test("AI credentials never fall back to source code and experimental routes fail closed", async () => {
  const client = await readFile("src/lib/ai-client.ts", "utf8");
  const routes = [
    "aura",
    "bouncer",
    "compatibility",
    "ghost-buster",
    "icebreaker",
    "shadow-date",
    "wingman",
  ];

  assert.match(client, /process\.env\.DEEPSEEK_API_KEY/);
  assert.doesNotMatch(client, /sk-[A-Za-z0-9_-]{16,}/);

  for (const route of routes) {
    const source = await readFile(`src/app/api/ai/${route}/route.ts`, "utf8");
    assert.match(source, /experimentalAiUnavailable/);
    assert.doesNotMatch(source, /hermesAI/);
  }

  const disabled = await readFile("src/lib/disabled-ai-route.ts", "utf8");
  assert.match(disabled, /status:\s*410/);
  assert.match(disabled, /Cache-Control[^\n]+no-store/);
});

test("legacy social-proof surfaces contain no synthetic activity", async () => {
  const sources = await Promise.all([
    readFile("src/components/FomoCounter.tsx", "utf8"),
    readFile("src/components/embir/SocialProof.tsx", "utf8"),
    readFile("src/components/landing/SocialProof.tsx", "utf8"),
    readFile("src/app/api/founder-count/route.ts", "utf8"),
  ]);
  const combined = sources.join("\n");

  assert.doesNotMatch(combined, /Math\.random/);
  assert.doesNotMatch(sources[3], /totalUsers\s*\+/);
  assert.doesNotMatch(sources[3], /count:\s*\d{3,}/);
  assert.match(sources[1], /return null/);
  assert.match(sources[2], /return null/);
  assert.match(sources[3], /prisma\.user\.count/);
});

test("public profile surfaces exclude moderated accounts and internal scores", async () => {
  const surfaces = await Promise.all([
    readFile("src/app/u/[username]/page.tsx", "utf8"),
    readFile("src/app/[locale]/u/[username]/page.tsx", "utf8"),
    readFile("src/app/[locale]/universe-of-the-day/page.tsx", "utf8"),
  ]);

  for (const source of surfaces) {
    assert.match(source, /visibilityStatus:\s*"PUBLIC"/);
    assert.match(source, /moderationState:\s*"ACTIVE"/);
    assert.match(source, /bannedAt:\s*null/);
    assert.match(source, /deletedAt:\s*null/);
    assert.doesNotMatch(source, /trustScore|popularityScore/);
  }

  const route = await readFile("src/app/api/public-profile/route.ts", "utf8");
  assert.match(route, /visibilityStatus:\s*"PUBLIC"/);
  assert.match(route, /userId:\s*_userId/);
  assert.match(route, /id:\s*_profileId/);
  assert.match(route, /NextResponse\.json\(publicProfile/);
});

test("client-awarded achievements fail closed", async () => {
  const source = await readFile("src/app/api/achievements/unlock/route.ts", "utf8");
  assert.match(source, /ACHIEVEMENTS_DISABLED/);
  assert.match(source, /status:\s*410/);
  assert.doesNotMatch(source, /userId|prisma\.achievement\.create/);
});
