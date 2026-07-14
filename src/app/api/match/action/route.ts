import { NextRequest, NextResponse } from "next/server";
import type { ConnectionState, ContextualTargetType, Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateCompatibility, internalCandidateSelect } from "@/lib/matching";
import { withApiLogging } from "@/lib/api-logger";
import { getServerFeatureFlag } from "@/lib/feature-flags";

type MatchAction = "like" | "pass";
type MatchStatus = "pending" | "mutual" | "rejected" | "expired";

interface TransitionInput {
  actorId: string;
  targetId: string;
  existingStatus: MatchStatus | null;
  existingInitiatorId: string | null;
  action: MatchAction;
}

interface TransitionResult {
  ok: true;
  newStatus: MatchStatus;
  initiatorId: string | null;
  matched: boolean;
}

export function decideMatchTransition(
  input: TransitionInput,
): TransitionResult | { ok: false; status: 400 | 409; error: string } {
  const { actorId, targetId, existingStatus, existingInitiatorId, action } = input;
  if (actorId === targetId) return { ok: false, status: 400, error: "Action invalide" };
  if (action === "pass") {
    return { ok: true, newStatus: "rejected", initiatorId: existingInitiatorId, matched: false };
  }
  if (!existingStatus) {
    return { ok: true, newStatus: "pending", initiatorId: actorId, matched: false };
  }
  if (existingStatus === "rejected" || existingStatus === "expired") {
    return { ok: false, status: 409, error: "Cette proposition est clôturée" };
  }
  if (existingStatus === "mutual") {
    return { ok: true, newStatus: "mutual", initiatorId: existingInitiatorId, matched: false };
  }
  if (!existingInitiatorId) {
    return { ok: false, status: 409, error: "Cette ancienne proposition a expiré" };
  }
  if (existingInitiatorId === actorId) {
    return { ok: true, newStatus: "pending", initiatorId: actorId, matched: false };
  }
  return { ok: true, newStatus: "mutual", initiatorId: existingInitiatorId, matched: true };
}

class ActionError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

const TARGET_TYPES = ["PHOTO", "PROMPT", "ACTIVITY", "VOICE", "PROFILE_DETAIL"] as const;
const ACTIVE_STATES: ConnectionState[] = [
  "RECIPROCAL",
  "REVEAL_PENDING",
  "REVEAL_COMPLETED",
  "CONVERSATION",
  "PLAN_PROPOSED",
  "PLAN_CONFIRMED",
  "MET",
  "CONTINUE",
  "FRIENDS",
];

function revealPrompt(matchId: string): string {
  const prompts = [
    "Quel petit moment rendrait ta semaine meilleure ?",
    "Quelle activité aimerais-tu partager bientôt ?",
    "Qu’est-ce qui te met immédiatement à l’aise avec quelqu’un ?",
  ];
  const index = [...matchId].reduce((total, char) => total + char.charCodeAt(0), 0) % prompts.length;
  return prompts[index];
}

function canonicalPair(first: string, second: string): [string, string] {
  return first < second ? [first, second] : [second, first];
}

async function runAction(
  actorId: string,
  payload: {
    targetUserId: string;
    action: MatchAction;
    targetType?: ContextualTargetType;
    targetId?: string;
    note?: string;
  },
  features: {
    activeConnectionLimit: { enabled: boolean; maxActive: number };
    reciprocalReveal: boolean;
  },
) {
  const { targetUserId, action, targetType, targetId, note } = payload;
  const [user1Id, user2Id] = canonicalPair(actorId, targetUserId);

  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`embir-match:${user1Id}:${user2Id}`}))::text`;

    // Interactive transactions use one PostgreSQL connection. Keep queries
    // sequential to avoid overlapping client.query calls on that connection.
    const lookupTime = new Date();
    const actorProfile = await tx.profile.findFirst({ where: { userId: actorId, profileSource: "user_registration" }, select: internalCandidateSelect });
    const targetProfile = await tx.profile.findFirst({
      where: {
        userId: targetUserId,
        profileSource: "user_registration",
        user: { is: { bannedAt: null, deletedAt: null } },
      },
      select: internalCandidateSelect,
    });
    const blocked = await tx.block.findFirst({
      where: {
        OR: [
          { blockerId: actorId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: actorId },
        ],
      },
      select: { id: true },
    });
    const existing = await tx.match.findUnique({ where: { user1Id_user2Id: { user1Id, user2Id } } });
    const actorSignal = await tx.presenceSignal.findFirst({
      where: { userId: actorId, active: true, visible: true, expiresAt: { gt: lookupTime } },
      orderBy: { activatedAt: "desc" },
    });
    const targetSignal = await tx.presenceSignal.findFirst({
      where: { userId: targetUserId, active: true, visible: true, expiresAt: { gt: lookupTime } },
      orderBy: { activatedAt: "desc" },
    });

    if (!actorProfile || !targetProfile) throw new ActionError(404, "PROFILE_UNAVAILABLE", "Profil indisponible");
    if (blocked) throw new ActionError(403, "BLOCKED", "Connexion indisponible");

    const compatibility = evaluateCompatibility(actorProfile, targetProfile, {
      userSignal: actorSignal,
      candidateSignal: targetSignal,
    });
    if (!compatibility.eligible) {
      throw new ActionError(409, "INCOMPATIBLE", "Ces préférences ne sont plus compatibles");
    }

    const transition = decideMatchTransition({
      actorId,
      targetId: targetUserId,
      existingStatus: (existing?.status as MatchStatus | undefined) ?? null,
      existingInitiatorId: existing?.initiatorId ?? null,
      action,
    });
    if (!transition.ok) throw new ActionError(transition.status, "INVALID_TRANSITION", transition.error);

    const now = new Date();
    if (action === "pass") {
      const closed = existing
        ? await tx.match.update({
            where: { id: existing.id },
            data: { status: "rejected", state: "CLOSED", lastTransitionAt: now },
          })
        : await tx.match.create({
            data: {
              user1Id,
              user2Id,
              status: "rejected",
              state: "CLOSED",
              initiatorId: null,
              lastTransitionAt: now,
            },
          });
      await tx.connectionEvent.create({
        data: { matchId: closed.id, actorId, fromState: existing?.state, toState: "CLOSED", metadata: { reason: "pass" } },
      });
      return { success: true, matched: false, matchId: closed.id, state: closed.state };
    }

    if (!targetType || !TARGET_TYPES.includes(targetType) || !targetId) {
      throw new ActionError(400, "CONTEXT_REQUIRED", "Réagis à un élément précis du profil");
    }

    const normalizedTargetId = targetId.trim().slice(0, 120);
    let validTarget = false;
    if (targetType === "ACTIVITY") {
      validTarget = targetProfile.activities.some(
        (activity) => activity.toLocaleLowerCase() === normalizedTargetId.toLocaleLowerCase(),
      );
    } else if (targetType === "PROFILE_DETAIL") {
      validTarget = normalizedTargetId === "profile" ||
        (normalizedTargetId === "description" && Boolean(targetProfile.description));
    } else if (targetType === "PHOTO" || targetType === "VOICE") {
      const media = await tx.media.findFirst({
        where: {
          id: normalizedTargetId,
          userId: targetUserId,
          status: "APPROVED",
          type: targetType === "PHOTO" ? "public_photo" : "public_audio",
        },
        select: { id: true },
      });
      validTarget = Boolean(media);
    }
    if (!validTarget) {
      throw new ActionError(400, "INVALID_CONTEXT", "Cet élément du profil n’est plus disponible");
    }

    if (existing?.status === "mutual") {
      return { success: true, matched: false, matchId: existing.id, state: existing.state };
    }

    if (existing?.status === "pending" && existing.initiatorId === actorId) {
      return { success: true, matched: false, matchId: existing.id, state: existing.state };
    }

    let match = existing;
    if (!match) {
      match = await tx.match.create({
        data: {
          user1Id,
          user2Id,
          initiatorId: actorId,
          status: "pending",
          state: "SIGNAL_SENT",
          score: compatibility.score,
          lastTransitionAt: now,
        },
      });
      await tx.contextualSignal.create({
        data: {
          matchId: match.id,
          senderId: actorId,
          recipientId: targetUserId,
          targetType,
          targetId: normalizedTargetId,
          note: note?.trim().slice(0, 280) || null,
        },
      });
      await tx.connectionEvent.create({
        data: { matchId: match.id, actorId, fromState: "EXPOSED", toState: "SIGNAL_SENT" },
      });
      await tx.notification.upsert({
        where: { dedupeKey: `signal:${match.id}:${actorId}` },
        update: {},
        create: {
          userId: targetUserId,
          type: "contextual_signal",
          title: "Une étincelle réelle",
          body: "Quelqu’un de compatible a réagi à un élément de ton profil.",
          link: "/dashboard",
          dedupeKey: `signal:${match.id}:${actorId}`,
        },
      });
      await tx.analyticsEvent.createMany({
        data: [
          {
            eventId: crypto.randomUUID(),
            eventName: "contextual_signal_sent",
            eventVersion: 1,
            userId: actorId,
            occurredAt: now,
            properties: { matchId: match.id, targetType },
          },
          {
            eventId: crypto.randomUUID(),
            eventName: "contextual_signal_received",
            eventVersion: 1,
            userId: targetUserId,
            occurredAt: now,
            properties: { matchId: match.id, targetType },
          },
        ],
      });
      return { success: true, matched: false, matchId: match.id, state: match.state };
    }

    if (features.activeConnectionLimit.enabled) {
      const maxActive = features.activeConnectionLimit.maxActive;
      const actorActive = await tx.match.count({
        where: { state: { in: ACTIVE_STATES }, OR: [{ user1Id: actorId }, { user2Id: actorId }] },
      });
      const targetActive = await tx.match.count({
        where: { state: { in: ACTIVE_STATES }, OR: [{ user1Id: targetUserId }, { user2Id: targetUserId }] },
      });
      if (actorActive >= maxActive || targetActive >= maxActive) {
        throw new ActionError(409, "ACTIVE_CONNECTION_LIMIT", "Une connexion active doit d’abord avancer, être mise en pause ou être clôturée");
      }
    }

    await tx.contextualSignal.upsert({
      where: { matchId_senderId: { matchId: match.id, senderId: actorId } },
      update: {},
      create: {
        matchId: match.id,
        senderId: actorId,
        recipientId: targetUserId,
        targetType,
        targetId: normalizedTargetId,
        note: note?.trim().slice(0, 280) || null,
      },
    });
    const nextState = features.reciprocalReveal ? "REVEAL_PENDING" : "CONVERSATION";
    match = await tx.match.update({
      where: { id: match.id },
      data: {
        status: "mutual",
        state: nextState,
        matchedAt: now,
        score: compatibility.score,
        lastTransitionAt: now,
      },
    });
    const reveal = features.reciprocalReveal
      ? await tx.connectionReveal.create({
          data: { matchId: match.id, prompt: revealPrompt(match.id), kind: "TEXT" },
        })
      : null;
    let conversationId: string | null = null;
    if (!features.reciprocalReveal) {
      const existingConversation = await tx.conversation.findFirst({
        where: { user1Id, user2Id },
        select: { id: true, matchId: true },
      });
      const conversation = existingConversation
        ? await tx.conversation.update({
            where: { id: existingConversation.id },
            data: existingConversation.matchId ? {} : { matchId: match.id },
            select: { id: true },
          })
        : await tx.conversation.create({
            data: { user1Id, user2Id, matchId: match.id },
            select: { id: true },
          });
      conversationId = conversation.id;
    }
    await tx.connectionEvent.createMany({
      data: features.reciprocalReveal
        ? [
            { matchId: match.id, actorId, fromState: "SIGNAL_SENT", toState: "RECIPROCAL" },
            { matchId: match.id, actorId, fromState: "RECIPROCAL", toState: "REVEAL_PENDING" },
          ]
        : [
            { matchId: match.id, actorId, fromState: "SIGNAL_SENT", toState: "RECIPROCAL" },
            { matchId: match.id, actorId, fromState: "RECIPROCAL", toState: "CONVERSATION" },
          ],
    });
    for (const userId of [actorId, targetUserId]) {
      await tx.notification.upsert({
        where: { dedupeKey: `reciprocal:${match!.id}:${userId}` },
        update: {},
        create: {
          userId,
          type: "reciprocal_connection",
          title: "Ça résonne des deux côtés",
          body: features.reciprocalReveal
            ? "Votre intérêt est réciproque. Répondez chacun à la même question."
            : "Votre intérêt est réciproque. Votre conversation est ouverte.",
          link: `/connections/${match!.id}`,
          dedupeKey: `reciprocal:${match!.id}:${userId}`,
        },
      });
    }
    await tx.analyticsEvent.createMany({
      data: [
        {
          eventId: crypto.randomUUID(),
          eventName: "reciprocal_connection_created",
          eventVersion: 1,
          userId: actorId,
          occurredAt: now,
          properties: { matchId: match.id },
        },
        {
          eventId: crypto.randomUUID(),
            eventName: features.reciprocalReveal ? "reveal_started" : "conversation_started",
          eventVersion: 1,
          userId: actorId,
          occurredAt: now,
            properties: features.reciprocalReveal
              ? { matchId: match.id, revealId: reveal!.id }
              : { matchId: match.id, conversationId },
        },
      ],
    });

    return {
      success: true,
      matched: true,
      matchId: match.id,
      state: match.state,
      revealId: reveal?.id ?? null,
      conversationId,
    };
  }, { isolationLevel: "Serializable" satisfies Prisma.TransactionIsolationLevel });
}

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.targetUserId !== "string" || body.targetUserId === auth.id) {
      return NextResponse.json({ error: "Cible invalide" }, { status: 400 });
    }
    if (body.action !== "like" && body.action !== "pass") {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }
    if (body.note !== undefined && (typeof body.note !== "string" || body.note.length > 280)) {
      return NextResponse.json({ error: "Réaction trop longue" }, { status: 400 });
    }

    const actorProfile = await prisma.profile.findUnique({
      where: { userId: auth.id },
      select: { city: true },
    });
    const [limitFlag, revealFlag] = await Promise.all([
      getServerFeatureFlag<{ maxActive?: number }>("active_connection_limit", {
        userId: auth.id,
        city: actorProfile?.city,
      }),
      getServerFeatureFlag("reciprocal_reveal", {
        userId: auth.id,
        city: actorProfile?.city,
      }),
    ]);
    const maxActive = typeof limitFlag.config.maxActive === "number"
      ? Math.min(10, Math.max(1, Math.floor(limitFlag.config.maxActive)))
      : 3;

    const result = await runAction(auth.id, {
      targetUserId: body.targetUserId,
      action: body.action,
      targetType: typeof body.targetType === "string" ? body.targetType as ContextualTargetType : undefined,
      targetId: typeof body.targetId === "string" ? body.targetId : undefined,
      note: typeof body.note === "string" ? body.note : undefined,
    }, {
      activeConnectionLimit: { enabled: limitFlag.enabled, maxActive },
      reciprocalReveal: revealFlag.enabled,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ActionError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("Match action error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
