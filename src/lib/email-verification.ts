import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const EMAIL_VERIFICATION_TTL_SECONDS = 24 * 60 * 60;

type SupportedVerificationLocale = "fr" | "en" | "es";

interface EmailVerificationPayload {
  v: 1;
  userId: string;
  emailHash: string;
  expiresAt: number;
}

function verificationSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

function signature(encodedPayload: string): string {
  return createHmac("sha256", verificationSecret())
    .update(`embir:email-verification:v1:${encodedPayload}`)
    .digest("base64url");
}

export function emailVerificationHash(email: string): string {
  return createHash("sha256")
    .update(email.trim().toLocaleLowerCase("en-US"))
    .digest("hex");
}

export function createEmailVerificationToken(input: {
  userId: string;
  email: string;
  now?: Date;
}): { token: string; expiresAt: Date } {
  if (!/^[a-z0-9_-]{8,80}$/i.test(input.userId)) {
    throw new Error("Invalid email verification subject");
  }
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_TTL_SECONDS * 1_000);
  const payload: EmailVerificationPayload = {
    v: 1,
    userId: input.userId,
    emailHash: emailVerificationHash(input.email),
    expiresAt: Math.floor(expiresAt.getTime() / 1_000),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return {
    token: `${encodedPayload}.${signature(encodedPayload)}`,
    expiresAt,
  };
}

export function verifyEmailVerificationToken(
  token: string,
  now = new Date(),
): EmailVerificationPayload | null {
  if (!token || token.length > 1_024) return null;
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;
  const encodedPayload = token.slice(0, separator);
  const providedSignature = token.slice(separator + 1);
  const expectedSignature = signature(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<EmailVerificationPayload>;
    const nowSeconds = Math.floor(now.getTime() / 1_000);
    if (
      payload.v !== 1 ||
      typeof payload.userId !== "string" ||
      !/^[a-z0-9_-]{8,80}$/i.test(payload.userId) ||
      typeof payload.emailHash !== "string" ||
      !/^[a-f0-9]{64}$/.test(payload.emailHash) ||
      !Number.isSafeInteger(payload.expiresAt) ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt < nowSeconds ||
      payload.expiresAt > nowSeconds + EMAIL_VERIFICATION_TTL_SECONDS + 60
    ) {
      return null;
    }
    return payload as EmailVerificationPayload;
  } catch {
    return null;
  }
}

export function emailMatchesVerificationPayload(
  email: string,
  payload: Pick<EmailVerificationPayload, "emailHash">,
): boolean {
  const actual = Buffer.from(emailVerificationHash(email));
  const expected = Buffer.from(payload.emailHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function buildEmailVerificationUrl(
  token: string,
  locale: string,
): string {
  const safeLocale: SupportedVerificationLocale = locale === "fr" || locale === "es" ? locale : "en";
  const url = new URL(`/${safeLocale}/auth/verify-email`, "https://embir.xyz");
  url.hash = new URLSearchParams({ token }).toString();
  return url.toString();
}
