import { NextRequest, NextResponse } from "next/server";
import type { ConnectionState } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicProfileSelect } from "@/lib/profile-contract";
import { withApiLogging } from "@/lib/api-logger";

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
  "PAUSED",
];

function nextAction(state: ConnectionState, responded: boolean, bothResponded: boolean) {
  if (state === "REVEAL_PENDING") {
    if (!responded) return "answer_reveal";
    return bothResponded ? "open_reveal" : "wait_for_reveal";
  }
  if (state === "PAUSED") return "resume_or_close";
  if (state === "PLAN_PROPOSED") return "review_plan";
  if (state === "PLAN_CONFIRMED") return "prepare_meeting";
  return "continue_conversation";
}

async function handleGet(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const limit = Math.min(25, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 10) || 10));
  const cursor = request.nextUrl.searchParams.get("cursor");

  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: auth.id }, { user2Id: auth.id }],
        status: "mutual",
        AND: [
          { state: { in: ACTIVE_STATES } },
          { user1: { is: { bannedAt: null, deletedAt: null } } },
          { user2: { is: { bannedAt: null, deletedAt: null } } },
        ],
      },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
        state: true,
        matchedAt: true,
        createdAt: true,
        updatedAt: true,
        user1: { select: { id: true, profile: { select: publicProfileSelect } } },
        user2: { select: { id: true, profile: { select: publicProfileSelect } } },
        conversation: { select: { id: true } },
        reveals: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            kind: true,
            prompt: true,
            completedAt: true,
            responses: { select: { userId: true } },
          },
        },
        datePlans: {
          where: { status: { in: ["PROPOSED", "CONFIRMED", "RESCHEDULED"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, status: true, proposedAt: true, format: true, approximateArea: true },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const hasMore = matches.length > limit;
    const page = matches.slice(0, limit);

    return NextResponse.json({
      matches: page.map((match) => {
        const other = match.user1Id === auth.id ? match.user2 : match.user1;
        const reveal = match.reveals[0];
        const responded = reveal?.responses.some((response) => response.userId === auth.id) ?? false;
        const bothResponded = (reveal?.responses.length ?? 0) >= 2;
        return {
          matchId: match.id,
          userId: other.id,
          profile: other.profile,
          state: match.state,
          matchedAt: match.matchedAt ?? match.createdAt,
          conversationId: match.conversation?.id ?? null,
          reveal: reveal ? {
            id: reveal.id,
            kind: reveal.kind,
            prompt: reveal.prompt,
            completed: Boolean(reveal.completedAt),
            responded,
            bothResponded,
          } : null,
          plan: match.datePlans[0] ?? null,
          nextAction: nextAction(match.state, responded, bothResponded),
        };
      }),
      nextCursor: hasMore ? page.at(-1)?.id ?? null : null,
      hasMore,
    });
  } catch (error) {
    console.error("Mutual connections error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
