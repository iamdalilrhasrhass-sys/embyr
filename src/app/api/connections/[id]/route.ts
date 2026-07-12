import { NextRequest, NextResponse } from "next/server";
import type { ConnectionState } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { withApiLogging } from "@/lib/api-logger";
import { prisma } from "@/lib/prisma";
import { publicProfileSelect } from "@/lib/profile-contract";

const VISIBLE_STATES: ConnectionState[] = [
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

async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const match = await prisma.match.findFirst({
    where: {
      id,
      OR: [{ user1Id: currentUser.id }, { user2Id: currentUser.id }],
      status: "mutual",
      AND: [
        { state: { in: VISIBLE_STATES } },
        { user1: { is: { bannedAt: null, deletedAt: null } } },
        { user2: { is: { bannedAt: null, deletedAt: null } } },
      ],
    },
    select: {
      id: true,
      user1Id: true,
      user2Id: true,
      state: true,
      status: true,
      matchedAt: true,
      updatedAt: true,
      user1: { select: { id: true, profile: { select: publicProfileSelect } } },
      user2: { select: { id: true, profile: { select: publicProfileSelect } } },
      conversation: { select: { id: true } },
      outcomes: {
        where: { userId: currentUser.id },
        take: 1,
        select: { outcome: true, note: true, updatedAt: true },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Connexion introuvable" }, { status: 404 });
  }

  const otherId = match.user1Id === currentUser.id ? match.user2Id : match.user1Id;
  const blocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: currentUser.id, blockedId: otherId },
        { blockerId: otherId, blockedId: currentUser.id },
      ],
    },
    select: { id: true },
  });
  if (blocked) {
    return NextResponse.json({ error: "Connexion indisponible" }, { status: 403 });
  }

  const other = match.user1Id === currentUser.id ? match.user2 : match.user1;
  return NextResponse.json(
    {
      connection: {
        id: match.id,
        state: match.state,
        status: match.status,
        matchedAt: match.matchedAt,
        updatedAt: match.updatedAt,
        conversationId: match.conversation?.id ?? null,
        profile: other.profile,
        myOutcome: match.outcomes[0] ?? null,
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export const GET = withApiLogging(handleGet);
