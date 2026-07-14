import { enqueueUserEmail, type EnqueueEmailResult } from "@/lib/email-outbox";
import {
  buildEmailVerificationUrl,
  createEmailVerificationToken,
} from "@/lib/email-verification";

const subjects = {
  fr: "Confirme ton adresse email Embir",
  en: "Confirm your Embir email address",
  es: "Confirma tu dirección de email de Embir",
} as const;

export async function enqueueEmailVerification(input: {
  userId: string;
  email: string;
  locale?: string;
  now?: Date;
}): Promise<EnqueueEmailResult> {
  const locale = input.locale === "fr" || input.locale === "es" ? input.locale : "en";
  const now = input.now ?? new Date();
  const { token, expiresAt } = createEmailVerificationToken({
    userId: input.userId,
    email: input.email,
    now,
  });
  const hourBucket = now.toISOString().slice(0, 13).replaceAll(/[^0-9a-z]/gi, "");
  return enqueueUserEmail({
    userId: input.userId,
    type: "email-verification",
    subject: subjects[locale],
    data: {
      verificationUrl: buildEmailVerificationUrl(token, locale),
      expiresAt: expiresAt.toISOString(),
      locale,
    },
    dedupeKey: `email-verification:${input.userId}:${hourBucket}`,
    maxAttempts: 5,
  });
}
