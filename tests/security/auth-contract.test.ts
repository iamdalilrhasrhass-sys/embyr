import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("JWT configuration fails closed without a hard-coded fallback", async () => {
  const source = await readFile("src/lib/auth.ts", "utf8");

  assert.doesNotMatch(source, /process\.env\.JWT_SECRET\s*\|\|/);
  assert.match(source, /getJwtSecret/);
});

test("registration delegates to validated explicit consent input", async () => {
  const source = await readFile("src/app/api/auth/register/route.ts", "utf8");

  assert.match(source, /validateRegistrationInput/);
  assert.doesNotMatch(source, /role:\s*"AMBASSADOR"/);
  assert.doesNotMatch(source, /isPremium:\s*true/);
  assert.doesNotMatch(source, /prisma\.ambassador\.create/);
  assert.match(source, /acceptTerms/);
  assert.match(source, /acceptPrivacy/);
});

test("both registration interfaces submit server-verifiable consent flags", async () => {
  const page = await readFile("src/app/[locale]/auth/register/page.tsx", "utf8");
  const modal = await readFile("src/components/auth/AuthModal.tsx", "utf8");

  for (const source of [page, modal]) {
    assert.match(source, /isAdult/);
    assert.match(source, /acceptTerms/);
    assert.match(source, /acceptPrivacy/);
  }
});
