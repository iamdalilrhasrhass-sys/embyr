import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  EMAIL_VERIFICATION_TTL_SECONDS,
  buildEmailVerificationUrl,
  createEmailVerificationToken,
  emailMatchesVerificationPayload,
  verifyEmailVerificationToken,
} from "../../src/lib/email-verification.ts";

const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = "email-verification-test-secret-32-characters-minimum";
test.after(() => {
  if (previousSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previousSecret;
});

test("email verification tokens are signed, email-bound and short-lived", () => {
  const now = new Date("2026-07-15T00:00:00.000Z");
  const created = createEmailVerificationToken({
    userId: "cm1234567890verification",
    email: "Person@Example.com",
    now,
  });
  const payload = verifyEmailVerificationToken(created.token, now);
  assert.ok(payload);
  assert.equal(payload.userId, "cm1234567890verification");
  assert.equal(emailMatchesVerificationPayload("person@example.com", payload), true);
  assert.equal(emailMatchesVerificationPayload("other@example.com", payload), false);
  assert.equal(
    verifyEmailVerificationToken(`${created.token.slice(0, -1)}x`, now),
    null,
  );
  assert.equal(
    verifyEmailVerificationToken(
      created.token,
      new Date(now.getTime() + (EMAIL_VERIFICATION_TTL_SECONDS + 1) * 1_000),
    ),
    null,
  );

  const url = new URL(buildEmailVerificationUrl(created.token, "fr"));
  assert.equal(url.pathname, "/fr/auth/verify-email");
  assert.equal(url.search, "");
  assert.equal(url.hash.startsWith("#token="), true);
});

test("verification never places a token in an HTTP URL and only verifies once", async () => {
  const [client, verifyRoute, resendRoute, registerRoute] = await Promise.all([
    readFile("src/components/auth/EmailVerificationClient.tsx", "utf8"),
    readFile("src/app/api/auth/email/verify/route.ts", "utf8"),
    readFile("src/app/api/auth/email/resend/route.ts", "utf8"),
    readFile("src/app/api/auth/register/route.ts", "utf8"),
  ]);
  assert.match(client, /window\.location\.hash/);
  assert.match(client, /window\.history\.replaceState/);
  assert.match(client, /method: "POST"/);
  assert.doesNotMatch(client, /searchParams\.get\("token"\)/);
  assert.match(verifyRoute, /emailVerified: false/);
  assert.match(verifyRoute, /email_verified/);
  assert.match(verifyRoute, /updateMany/);
  assert.match(resendRoute, /consumePublicForm/);
  assert.match(resendRoute, /getCurrentUser/);
  assert.match(registerRoute, /enqueueEmailVerification/);
  assert.match(registerRoute, /processEmailOutbox/);
});
