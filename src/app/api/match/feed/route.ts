import { NextRequest, NextResponse } from "next/server";
import type { ConnectionIntent } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCompatibleCandidates, INTENTS } from "@/lib/matching";
import { getServerFeatureFlag } from "@/lib/feature-flags";
import { withApiLogging } from "@/lib/api-logger";

async function handleGet(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rawIntent = request.nextUrl.searchParams.get("intent");
  const intentFilter = rawIntent && INTENTS.includes(rawIntent as ConnectionIntent)
    ? (rawIntent as ConnectionIntent)
    : undefined;
  if (rawIntent && !intentFilter) {
    return NextResponse.json({ error: "Filtre d’intention invalide" }, { status: 400 });
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 5);
  const profile = await prisma.profile.findUnique({
    where: { userId: auth.id },
    select: { city: true },
  });
  const feedFlag = await getServerFeatureFlag<{ selectionSize?: number }>("connection_os_feed", {
    userId: auth.id,
    city: profile?.city,
  });
  if (!feedFlag.enabled) {
    return NextResponse.json({
      selectionId: null,
      profiles: [],
      hasMore: false,
      nextCursor: null,
      setupRequired: false,
      endOfSelection: true,
      featureDisabled: true,
      expansionOptions: [],
    });
  }
  const configuredLimit = typeof feedFlag.config.selectionSize === "number"
    ? Math.min(5, Math.max(1, Math.floor(feedFlag.config.selectionSize)))
    : 5;
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(configuredLimit, Math.max(1, requestedLimit))
    : configuredLimit;

  try {
    const result = await getCompatibleCandidates(auth.id, { limit, intentFilter });
    const selectionId = crypto.randomUUID();
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      if (result.candidates.length) {
        await tx.profileExposure.createMany({
          data: result.candidates.map((candidate, index) => ({
            viewerId: auth.id,
            candidateId: String(candidate.profile.userId),
            selectionId,
            rank: index + 1,
            reasonCodes: candidate.reasonCodes,
          })),
          skipDuplicates: true,
        });
      }

      await tx.analyticsEvent.createMany({
        data: [
          {
            eventId: crypto.randomUUID(),
            eventName: "feed_viewed",
            eventVersion: 1,
            userId: auth.id,
            occurredAt: now,
            properties: {
              selectionId,
              resultCount: result.candidates.length,
              intentFilter: intentFilter ?? null,
            },
          },
          ...result.candidates.map((candidate, index) => ({
            eventId: crypto.randomUUID(),
            eventName: "profile_exposed",
            eventVersion: 1,
            userId: auth.id,
            occurredAt: now,
            properties: {
              selectionId,
              candidateId: String(candidate.profile.userId),
              rank: index + 1,
              incomingSignal: candidate.incomingSignal,
            },
          })),
        ],
      });
    });

    const profiles = result.candidates.map((candidate) => ({
      ...candidate.profile,
      reasons: candidate.reasons,
      reasonCodes: candidate.reasonCodes,
      matchedIntents: candidate.matchedIntents,
      incomingSignal: candidate.incomingSignal,
    }));

    return NextResponse.json({
      selectionId,
      profiles,
      hasMore: result.hasMore,
      nextCursor: result.hasMore ? selectionId : null,
      setupRequired: result.setupRequired,
      endOfSelection: !result.hasMore,
      expansionOptions: profiles.length < limit
        ? ["augmenter volontairement le rayon", "élargir les intentions acceptées"]
        : [],
    });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
