import { enqueueUserEmail, type EnqueueEmailResult } from "@/lib/email-outbox";
import {
  buildEmailVerificationUrl,
  createEmailVerificationToken,
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

const subjects = {
  fr: "Confirme ton adresse email Embir",
  en: "Confirm your Embir email address",
  es: "Confirma tu dirección de email de Embir",
} as const;

const reminderSubjects = {
  1: {
    fr: "Ton lien Embir a expiré — en voici un nouveau",
    en: "Your Embir link expired — here is a new one",
    es: "Tu enlace de Embir caducó — aquí tienes uno nuevo",
  },
  2: {
    fr: "Dernier rappel pour confirmer ton email Embir",
    en: "Final reminder to confirm your Embir email",
    es: "Último recordatorio para confirmar tu email de Embir",
  },
} as const;

export const EMAIL_VERIFICATION_REMINDER_DELAYS_MS = {
  1: 48 * 60 * 60 * 1_000,
  2: 7 * 24 * 60 * 60 * 1_000,
} as const;

interface VerificationReminderCandidate {
  id: string;
  email: string;
  locale: string | null;
  firstSentAt: Date;
  reminder1SentAt: Date | null;
  reminder1Exists: boolean;
  reminder2Exists: boolean;
}

export interface VerificationReminderResult {
  eligible: number;
  queued: number;
  deduplicated: number;
  stage1: number;
  stage2: number;
}

export function nextEmailVerificationReminderStage(input: {
  now: Date;
  firstSentAt: Date;
  reminder1SentAt: Date | null;
  reminder1Exists: boolean;
  reminder2Exists: boolean;
}): 1 | 2 | null {
  if (input.reminder2Exists) return null;
  const elapsed = input.now.getTime() - input.firstSentAt.getTime();
  if (
    input.reminder1SentAt &&
    elapsed >= EMAIL_VERIFICATION_REMINDER_DELAYS_MS[2]
  ) {
    return 2;
  }
  if (
    !input.reminder1Exists &&
    elapsed >= EMAIL_VERIFICATION_REMINDER_DELAYS_MS[1]
  ) {
    return 1;
  }
  return null;
}

export async function enqueueEmailVerification(input: {
  userId: string;
  email: string;
  locale?: string;
  now?: Date;
  reminderStage?: 1 | 2;
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
    subject: input.reminderStage
      ? reminderSubjects[input.reminderStage][locale]
      : subjects[locale],
    data: {
      verificationUrl: buildEmailVerificationUrl(token, locale),
      expiresAt: expiresAt.toISOString(),
      locale,
    },
    dedupeKey: input.reminderStage
      ? `email-verification-reminder:${input.userId}:stage${input.reminderStage}`
      : `email-verification:${input.userId}:${hourBucket}`,
    maxAttempts: 5,
  });
}

export async function enqueueDueEmailVerificationReminders(
  now = new Date(),
  limit = 200,
): Promise<VerificationReminderResult> {
  const safeLimit = Math.max(1, Math.min(500, Math.floor(limit)));
  const candidates = await prisma.$queryRaw<VerificationReminderCandidate[]>`
    WITH eligible AS (
      SELECT
        u.id,
        u.email,
        p.language AS locale,
        MIN(initial."sentAt") AS "firstSentAt"
      FROM "User" u
      JOIN "Profile" p ON p."userId" = u.id
      JOIN "EmailLog" initial
        ON initial."userId" = u.id
       AND initial.type = 'email-verification'
       AND initial.status = 'sent'
       AND initial."sentAt" IS NOT NULL
       AND initial."dedupeKey" LIKE 'email-verification:%'
       AND initial.payload->>'providerLastEvent' IN ('delivered', 'opened', 'clicked')
      WHERE u."emailVerified" = FALSE
        AND u."deletedAt" IS NULL
        AND u."bannedAt" IS NULL
        AND u.role IN ('USER', 'AMBASSADOR')
        AND u."isAdultConfirmed" = TRUE
        AND p."profileSource" = 'user_registration'
        AND LOWER(TRIM(u.email)) NOT LIKE '%@embir.xyz'
        AND LOWER(TRIM(u.email)) NOT LIKE '%embir-qa%'
        AND LOWER(TRIM(u.email)) NOT LIKE '%@test.%'
        AND LOWER(TRIM(u.email)) NOT LIKE '%.test'
        AND LOWER(TRIM(u.email)) NOT LIKE '%.local'
        AND LOWER(TRIM(u.email)) !~ '@example\\.(com|org|net|invalid)$'
        AND EXISTS (
          SELECT 1 FROM "Consent" consent
          WHERE consent."userId" = u.id AND consent.type = 'cgu'
        )
        AND EXISTS (
          SELECT 1 FROM "Consent" consent
          WHERE consent."userId" = u.id AND consent.type = 'privacy'
        )
      GROUP BY u.id, u.email, p.language
    )
    SELECT
      eligible.id,
      eligible.email,
      eligible.locale,
      eligible."firstSentAt",
      reminder1."sentAt" AS "reminder1SentAt",
      (reminder1.id IS NOT NULL) AS "reminder1Exists",
      (reminder2.id IS NOT NULL) AS "reminder2Exists"
    FROM eligible
    LEFT JOIN "EmailLog" reminder1
      ON reminder1."dedupeKey" = ('email-verification-reminder:' || eligible.id || ':stage1')
    LEFT JOIN "EmailLog" reminder2
      ON reminder2."dedupeKey" = ('email-verification-reminder:' || eligible.id || ':stage2')
    WHERE eligible."firstSentAt" <= ${new Date(now.getTime() - EMAIL_VERIFICATION_REMINDER_DELAYS_MS[1])}
      AND reminder2.id IS NULL
    ORDER BY eligible."firstSentAt" ASC
    LIMIT ${safeLimit}
  `;

  const result: VerificationReminderResult = {
    eligible: candidates.length,
    queued: 0,
    deduplicated: 0,
    stage1: 0,
    stage2: 0,
  };
  for (const candidate of candidates) {
    const stage = nextEmailVerificationReminderStage({ now, ...candidate });
    if (!stage) continue;
    const queued = await enqueueEmailVerification({
      userId: candidate.id,
      email: candidate.email,
      locale: candidate.locale ?? undefined,
      now,
      reminderStage: stage,
    });
    if (queued.queued) {
      result.queued++;
      result[`stage${stage}`]++;
    }
    if (queued.deduplicated) result.deduplicated++;
  }
  return result;
}
