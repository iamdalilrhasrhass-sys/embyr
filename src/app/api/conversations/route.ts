import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canonicalPair, findConversationForConnection, MESSAGEABLE_STATES } from "@/lib/connection-policy";
import { withApiLogging } from "@/lib/api-logger";

const participantSelect = {
  id: true,
  bannedAt: true,
  deletedAt: true,
  profile: {
    select: {
      displayName: true,
      username: true,
      profilePhotoUrl: true,
      canReceiveMessages: true,
    },
  },
} as const;

async function handleGet(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 25) || 25));

  try {
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ user1Id: auth.id }, { user2Id: auth.id }] },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
        matchId: true,
        lastMessageAt: true,
        updatedAt: true,
        user1: { select: participantSelect },
        user2: { select: participantSelect },
        match: { select: { id: true, status: true, state: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, content: true, type: true, createdAt: true, senderId: true, status: true },
        },
        _count: {
          select: { messages: { where: { receiverId: auth.id, status: "SENT" } } },
        },
      },
      orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
      take: limit * 2,
    });
    const otherIds = conversations.map((conversation) => conversation.user1Id === auth.id ? conversation.user2Id : conversation.user1Id);
    const legacyPairs = conversations.filter((conversation) => !conversation.matchId);
    const [blocks, legacyMatches] = await Promise.all([
      prisma.block.findMany({
        where: {
          OR: [
            { blockerId: auth.id, blockedId: { in: otherIds } },
            { blockedId: auth.id, blockerId: { in: otherIds } },
          ],
        },
        select: { blockerId: true, blockedId: true },
      }),
      legacyPairs.length
        ? prisma.match.findMany({
            where: { status: "mutual", OR: [{ user1Id: auth.id }, { user2Id: auth.id }] },
            select: { id: true, user1Id: true, user2Id: true, status: true, state: true },
          })
        : Promise.resolve([]),
    ]);
    const blockedIds = new Set(blocks.map((block) => block.blockerId === auth.id ? block.blockedId : block.blockerId));
    const legacyByPair = new Map(legacyMatches.map((match) => [`${match.user1Id}:${match.user2Id}`, match]));

    const safe = conversations.flatMap((conversation) => {
      const other = conversation.user1Id === auth.id ? conversation.user2 : conversation.user1;
      if (blockedIds.has(other.id) || other.bannedAt || other.deletedAt || other.profile?.canReceiveMessages === false) return [];
      const [pair1, pair2] = canonicalPair(conversation.user1Id, conversation.user2Id);
      const match = conversation.match ?? legacyByPair.get(`${pair1}:${pair2}`);
      const legitimateLegacy = !conversation.matchId && match?.status === "mutual";
      if (!match || match.status !== "mutual") return [];
      if (!legitimateLegacy && !MESSAGEABLE_STATES.includes(match.state as typeof MESSAGEABLE_STATES[number])) return [];
      const lastMessage = conversation.messages[0] ?? null;
      return [{
        id: conversation.id,
        matchId: match.id,
        otherUser: {
          id: other.id,
          displayName: other.profile?.displayName || other.profile?.username || "Membre",
          photoUrl: other.profile?.profilePhotoUrl ?? null,
        },
        lastMessage,
        lastMessageAt: conversation.lastMessageAt ?? conversation.updatedAt,
        unreadCount: conversation._count.messages,
      }];
    }).slice(0, limit);
    return NextResponse.json({ conversations: safe });
  } catch (error) {
    console.error("GET conversations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => null) as { targetUserId?: unknown } | null;
  if (typeof body?.targetUserId !== "string") {
    return NextResponse.json({ error: "targetUserId requis" }, { status: 400 });
  }
  const access = await findConversationForConnection(prisma, auth.id, body.targetUserId);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  return NextResponse.json({
    conversation: {
      id: access.value.conversation.id,
      matchId: access.value.matchId,
    },
  });
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
