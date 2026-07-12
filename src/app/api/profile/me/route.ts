import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateProfileUpdate } from "@/lib/profile-contract";
import { withApiLogging } from "@/lib/api-logger";

async function handleGet() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { userId: auth.id } });
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  return NextResponse.json(profile);
}

async function handlePut(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const [user, currentProfile] = await Promise.all([
      prisma.user.findUnique({
        where: { id: auth.id },
        select: { consentSensitiveData: true },
      }),
      prisma.profile.findUnique({
        where: { userId: auth.id },
        select: {
          genderIdentity: true,
          orientation: true,
          seekingGenders: true,
          acceptedIntents: true,
          seekingAgeMin: true,
          seekingAgeMax: true,
          seekingRadiusKm: true,
          onboardingStep: true,
          onboardingCompletedAt: true,
        },
      }),
    ]);
    if (!user || !currentProfile) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const validated = validateProfileUpdate(body, user.consentSensitiveData);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    if (body.onboardingComplete === true) {
      const submittedIntents = body.acceptedIntents ?? body.intentions;
      const intentCount = Array.isArray(submittedIntents)
        ? submittedIntents.length
        : currentProfile.acceptedIntents.length;
      const complete = Boolean(
        (body.genderIdentity ?? currentProfile.genderIdentity) &&
        (body.orientation ?? currentProfile.orientation) &&
        (Array.isArray(body.seekingGenders) ? body.seekingGenders.length : currentProfile.seekingGenders.length) &&
        intentCount &&
        (body.seekingAgeMin ?? currentProfile.seekingAgeMin) &&
        (body.seekingAgeMax ?? currentProfile.seekingAgeMax) &&
        (body.seekingRadiusKm ?? currentProfile.seekingRadiusKm),
      );
      if (!complete) {
        return NextResponse.json({ error: "Complète les préférences réciproques avant de terminer" }, { status: 400 });
      }
    }
    const firstCompletion = body.onboardingComplete === true && !currentProfile.onboardingCompletedAt;

    const profile = await prisma.$transaction(async (tx) => {
      if (validated.consentSensitiveData && !user.consentSensitiveData) {
        await tx.user.update({
          where: { id: auth.id },
          data: { consentSensitiveData: true },
        });
        await tx.consent.create({
          data: {
            userId: auth.id,
            type: "sensitive_data",
            version: "connection-os-1",
          },
        });
      }

      const updated = await tx.profile.update({
        where: { userId: auth.id },
        data: {
          ...validated.profile,
          lastActiveAt: new Date(),
        },
      });

      const occurredAt = new Date();
      const analyticsEvents = [];
      if (currentProfile.onboardingStep === 0 && updated.onboardingStep > 0) {
        analyticsEvents.push({
          eventName: "onboarding_started",
          eventId: crypto.randomUUID(),
          eventVersion: 1,
          userId: auth.id,
          language: updated.language,
          occurredAt,
          properties: { onboardingVersion: updated.onboardingVersion },
        });
      }
      if (updated.onboardingStep > currentProfile.onboardingStep) {
        analyticsEvents.push({
          eventName: "onboarding_step_completed",
          eventId: crypto.randomUUID(),
          eventVersion: 1,
          userId: auth.id,
          language: updated.language,
          occurredAt,
          properties: { step: updated.onboardingStep },
        });
      }
      if (firstCompletion) {
        analyticsEvents.push({
          eventName: "profile_completed",
          eventId: crypto.randomUUID(),
          eventVersion: 1,
          userId: auth.id,
          language: updated.language,
          occurredAt,
          properties: { onboardingVersion: updated.onboardingVersion },
        });
      }
      if (analyticsEvents.length) {
        await tx.analyticsEvent.createMany({ data: analyticsEvents });
      }
      return updated;
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
export const PUT = withApiLogging(handlePut);
