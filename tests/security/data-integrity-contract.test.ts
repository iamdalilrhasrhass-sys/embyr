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

test("uploads use a shared closed allow-list policy", async () => {
  const audio = await readFile("src/app/api/messages/audio/route.ts", "utf8");
  const verification = await readFile(
    "src/app/api/verification/upload/route.ts",
    "utf8",
  );

  assert.match(audio, /upload-policy/);
  assert.doesNotMatch(audio, /startsWith\("audio\/"\)/);
  assert.match(verification, /upload-policy/);
  assert.doesNotMatch(verification, /file\.name\.split/);
});
