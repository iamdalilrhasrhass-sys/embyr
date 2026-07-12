import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  digestPhoneVerificationCode,
  normalizePhoneNumber,
  verifyPhoneVerificationCode,
} from "../../src/lib/phone-verification.ts";
import { isTrustedApiMutation } from "../../src/lib/request-security.ts";
import { validateImageSignature } from "../../src/lib/upload-policy.ts";

function mutationRequest(input: {
  origin?: string;
  authorization?: string;
  authCookie?: boolean;
  host?: string;
}) {
  const host = input.host ?? "embir.xyz";
  const headers = new Headers({ host });
  if (input.origin) headers.set("origin", input.origin);
  if (input.authorization) headers.set("authorization", input.authorization);
  return {
    method: "POST",
    headers,
    cookies: { has: (name: string) => Boolean(input.authCookie && name === "token") },
    nextUrl: { pathname: "/api/profile/me", host },
  } as Parameters<typeof isTrustedApiMutation>[0];
}

test("cookie-authenticated API mutations require a same-host HTTP origin", () => {
  assert.equal(isTrustedApiMutation(mutationRequest({ authCookie: true, origin: "https://embir.xyz" })), true);
  assert.equal(isTrustedApiMutation(mutationRequest({ authCookie: true, origin: "https://attacker.invalid" })), false);
  assert.equal(isTrustedApiMutation(mutationRequest({ authCookie: true })), false);
  assert.equal(isTrustedApiMutation(mutationRequest({ authCookie: false })), true);
  assert.equal(
    isTrustedApiMutation(mutationRequest({ authCookie: true, authorization: "Bearer internal-token" })),
    true,
  );
});

test("phone verification normalizes E.164 values and stores only a keyed digest", () => {
  const previous = process.env.SMS_VERIFICATION_SECRET;
  process.env.SMS_VERIFICATION_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
  try {
    assert.equal(normalizePhoneNumber("06 12 34 56 78"), "+33612345678");
    assert.equal(normalizePhoneNumber("0041 79 123 45 67"), "+41791234567");
    assert.equal(normalizePhoneNumber("123"), null);
    const storedDigest = digestPhoneVerificationCode({ userId: "user-1", phone: "+33612345678", code: "012345" });
    assert.doesNotMatch(storedDigest, /012345/);
    assert.equal(verifyPhoneVerificationCode({ userId: "user-1", phone: "+33612345678", code: "012345", storedDigest }), true);
    assert.equal(verifyPhoneVerificationCode({ userId: "user-1", phone: "+33612345678", code: "999999", storedDigest }), false);
  } finally {
    if (previous === undefined) delete process.env.SMS_VERIFICATION_SECRET;
    else process.env.SMS_VERIFICATION_SECRET = previous;
  }
});

test("verification uploads validate file signatures, not only declared MIME types", () => {
  assert.equal(validateImageSignature(Uint8Array.from([0xff, 0xd8, 0xff]), "image/jpeg"), true);
  assert.equal(validateImageSignature(Uint8Array.from([0x00, 0x00, 0x00]), "image/jpeg"), false);
  assert.equal(
    validateImageSignature(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png"),
    true,
  );
});

test("legacy authenticated routes revalidate account state through getCurrentUser", async () => {
  const routes = [
    "src/app/api/auth/me/route.ts",
    "src/app/api/favorites/route.ts",
    "src/app/api/favorites/[userId]/route.ts",
    "src/app/api/views/route.ts",
    "src/app/api/profile/me/language/route.ts",
    "src/app/api/sms/send-code/route.ts",
    "src/app/api/sms/verify-code/route.ts",
    "src/app/api/verification/request/route.ts",
    "src/app/api/verification/upload/route.ts",
    "src/app/api/stripe/checkout/route.ts",
    "src/app/api/payments/allopass/route.ts",
    "src/app/api/sms-payment/start/route.ts",
    "src/app/api/sms-payment/verify/route.ts",
  ];
  for (const route of routes) {
    const source = await readFile(route, "utf8");
    assert.match(source, /getCurrentUser/, `${route} must revalidate the database account`);
    assert.doesNotMatch(source, /verifyToken/, `${route} must not trust a JWT payload directly`);
  }
});

test("mock and ambassador flows cannot fabricate consent, verification or premium", async () => {
  const smsPayment = await readFile("src/app/api/sms-payment/verify/route.ts", "utf8");
  const ambassador = await readFile("src/app/api/admin/ambassadors/action/route.ts", "utf8");
  assert.doesNotMatch(smsPayment, /isPremium\s*:\s*true|verifyPaymentCode/);
  assert.doesNotMatch(ambassador, /isPremium\s*:\s*true|isVerified\s*:\s*true|consentSensitiveData\s*:\s*true/);
  assert.doesNotMatch(ambassador, /tempPassword|lifetimePremium\s*:\s*true/);
});

test("Stripe fulfillment is signed, allow-listed, idempotent and fails closed", async () => {
  const checkout = await readFile("src/app/api/stripe/checkout/route.ts", "utf8");
  const webhook = await readFile("src/app/api/stripe/webhook/route.ts", "utf8");
  assert.match(checkout, /PAYMENTS_ENABLED/);
  assert.match(webhook, /PAYMENTS_ENABLED/);
  assert.ok(webhook.indexOf("PAYMENTS_ENABLED") < webhook.indexOf("await getStripe"));
  assert.match(checkout, /getCurrentUser/);
  assert.match(webhook, /constructEvent/);
  assert.match(webhook, /planSlug/);
  assert.match(webhook, /prisma\.stripeEvent\.create/);
  assert.match(webhook, /status:\s*500/);
  assert.doesNotMatch(webhook, /new Pool|proceeding|PLAN_DURATIONS\[[^\]]+\]\s*\|\|/);
});

test("the proxy includes API mutations in its matcher and applies the shared CSRF gate", async () => {
  const source = await readFile("src/proxy.ts", "utf8");
  assert.match(source, /isTrustedApiMutation/);
  assert.match(source, /'\/api\/:path\*'/);
  assert.match(source, /status:\s*403/);
});
