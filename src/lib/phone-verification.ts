import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

function verificationSecret(): string {
  const secret = process.env.SMS_VERIFICATION_SECRET || process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SMS_VERIFICATION_SECRET or JWT_SECRET must contain at least 32 characters");
  }
  return secret;
}
export function normalizePhoneNumber(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let candidate = input.trim().replace(/[\s().-]/g, "");
  if (candidate.startsWith("00")) candidate = `+${candidate.slice(2)}`;
  if (/^0\d{9}$/.test(candidate)) candidate = `+33${candidate.slice(1)}`;
  return /^\+[1-9]\d{7,14}$/.test(candidate) ? candidate : null;
}

export function generatePhoneVerificationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function digestPhoneVerificationCode(input: {
  userId: string;
  phone: string;
  code: string;
}): string {
  const digest = createHmac("sha256", verificationSecret())
    .update(`embir-phone-v1\0${input.userId}\0${input.phone}\0${input.code}`)
    .digest("hex");
  return `v1:${digest}`;
}

export function verifyPhoneVerificationCode(input: {
  userId: string;
  phone: string;
  code: string;
  storedDigest: string;
}): boolean {
  if (!/^\d{6}$/.test(input.code) || !input.storedDigest.startsWith("v1:")) return false;
  const expected = Buffer.from(
    digestPhoneVerificationCode({ userId: input.userId, phone: input.phone, code: input.code }),
    "utf8",
  );
  const actual = Buffer.from(input.storedDigest, "utf8");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
