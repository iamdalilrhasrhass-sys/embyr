import type { GenderIdentity } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { validateRegistrationInput } from "@/lib/registration";
import { enqueueAdminSignupNotification } from "@/lib/email-outbox";
import { sanitizeOperationalError } from "@/lib/email-core";
import { withApiLogging } from "@/lib/api-logger";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EMB-${code}`;
}

function shortText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/\s+/g, " ").slice(0, max);
  return clean || null;
}

function acquisitionValue(value: unknown, fallback: string | null = null): string | null {
  const clean = shortText(value, 80)?.toLocaleLowerCase();
  return clean && /^[a-z0-9._-]+$/.test(clean) ? clean : fallback;
}

async function handlePost(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const validation = validateRegistrationInput({
      email: body.email,
      password: body.password,
      isAdult: body.isAdult,
      acceptTerms: body.acceptTerms,
      acceptPrivacy: body.acceptPrivacy,
      consentSensitiveData: body.consentSensitiveData,
      birthDate: body.birthDate,
    });
    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }
    const validated = validation.value;

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
      select: { id: true },
    });
    if (existingUser) return Response.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });

    const genderMap: Record<string, GenderIdentity> = {
      female: "FEMME",
      femme: "FEMME",
      male: "HOMME",
      homme: "HOMME",
      trans_woman: "FEMME_TRANS",
      femme_trans: "FEMME_TRANS",
      travesti: "TRAVESTI",
      personne_feminine: "PERSONNE_FEMININE",
      couple: "COUPLE",
      autre: "AUTRE",
      non_binaire: "AUTRE",
    };
    const rawGender = shortText(body.gender, 40)?.toLocaleLowerCase();
    const genderIdentity = rawGender ? genderMap[rawGender] ?? "AUTRE" : undefined;

    let calculatedAge = 18;
    if (validated.birthDate) {
      const birth = new Date(validated.birthDate);
      const today = new Date();
      calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDifference = today.getMonth() - birth.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) calculatedAge--;
    }

    let userReferralCode = generateReferralCode();
    for (let attempt = 0; attempt < 10; attempt++) {
      const collision = await prisma.user.findUnique({ where: { referralCode: userReferralCode }, select: { id: true } });
      if (!collision) break;
      userReferralCode = generateReferralCode();
    }
    const submittedReferral = shortText(body.referralCode, 40);
    const sponsor = submittedReferral
      ? await prisma.user.findFirst({ where: { referralCode: submittedReferral }, select: { id: true } })
      : null;

    const locale = (["fr", "en", "es"] as const).includes(body.locale as "fr" | "en" | "es")
      ? body.locale as "fr" | "en" | "es"
      : "fr";
    const headerCountry = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
    const country = /^[A-Z]{2}$/.test(headerCountry ?? "") ? headerCountry : shortText(body.country, 80);
    const source = acquisitionValue(body.source, "direct") ?? "direct";
    const medium = acquisitionValue(body.medium);
    const campaign = acquisitionValue(body.campaign);
    const now = new Date();
    const passwordHash = await hashPassword(validated.password);
    const consentsToCreate = [
      ...(validated.acceptTerms ? [{ type: "cgu", version: "1.0" }] : []),
      ...(validated.acceptPrivacy ? [{ type: "privacy", version: "1.0" }] : []),
      ...(validated.consentSensitiveData ? [{ type: "sensitive_data", version: "connection-os-1" }] : []),
    ];

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: validated.email,
          passwordHash,
          isAdultConfirmed: true,
          consentSensitiveData: validated.consentSensitiveData,
          role: "USER",
          referralCode: userReferralCode,
          referredBy: sponsor ? submittedReferral : null,
          profile: {
            create: {
              username: `user_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`,
              displayName: shortText(body.name, 60),
              age: calculatedAge,
              birthdate: validated.birthDate ? new Date(validated.birthDate) : null,
              city: shortText(body.city, 80),
              country,
              genderIdentity: genderIdentity ?? null,
              profileCompletionScore: (body.name ? 20 : 0) + (body.city ? 10 : 0) + (validated.birthDate ? 10 : 0),
              referralCode: userReferralCode,
              language: locale,
              onboardingStep: 0,
            },
          },
          consents: consentsToCreate.length ? { create: consentsToCreate } : undefined,
        },
        include: { profile: true },
      });
      await tx.analyticsEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventName: "signup_completed",
          eventVersion: 1,
          userId: created.id,
          occurredAt: now,
          language: locale,
          country,
          source,
          medium,
          campaign,
          properties: { onboardingStatus: "started" },
        },
      });
      await tx.acquisitionEvent.create({
        data: {
          userId: created.id,
          source,
          campaign,
          referralCode: sponsor ? submittedReferral : null,
          eventType: "register",
          metadata: JSON.stringify({ medium, locale, country }),
        },
      });
      return created;
    });

    const totalUsers = await prisma.user.count({ where: { deletedAt: null } });
    await enqueueAdminSignupNotification({
      occurredAt: now.toISOString(),
      country,
      language: locale,
      source,
      campaign,
      onboardingStatus: "started",
      totalUsers,
      dedupeKey: `admin-signup:${user.id}`,
    }).catch(async (error) => {
      const safeError = sanitizeOperationalError(error);
      console.error("[register] admin email queue unavailable", safeError);
      try {
        await prisma.analyticsEvent.create({
          data: {
            eventId: crypto.randomUUID(),
            eventName: "admin_signup_email_queue_failed",
            eventVersion: 1,
            userId: user.id,
            occurredAt: new Date(),
            properties: {
              reason: safeError.includes("must be configured")
                ? "configuration_missing"
                : "queue_failure",
            },
          },
        });
      } catch (trackingError) {
        console.error(
          "[register] unable to persist admin email queue failure",
          sanitizeOperationalError(trackingError),
        );
      }
    });

    const token = signToken({ userId: user.id, email: user.email });
    const response = Response.json(
      { user: { id: user.id, email: user.email, emailVerified: user.emailVerified }, token },
      { status: 201 },
    );
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    );
    return response;
  } catch (error) {
    console.error("Register error:", sanitizeOperationalError(error));
    return Response.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
