import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authorizeConversation, canonicalPair, findConversationForConnection, MESSAGEABLE_STATES } from "@/lib/connection-policy";
import { checkMessageRateLimit } from "@/lib/rate-limit";
import { withApiLogging } from "@/lib/api-logger";

const safeParticipant = {
  id: true,
  profile: { select: { displayName: true, username: true, profilePhotoUrl: true } },
} as const;

async function handleGet() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const [conversations, blocks, mutualMatches] = await Promise.all([
      prisma.conversation.findMany({
        where: { OR: [{ user1Id: auth.id }, { user2Id: auth.id }] },
        select: {
          id: true,
          user1Id: true,
          user2Id: true,
          matchId: true,
          user1: { select: safeParticipant },
          user2: { select: safeParticipant },
          match: { select: { id: true, status: true, state: true } },
          messages: {
            where: { status: { not: "DELETED" } },
            orderBy: { createdAt: "asc" },
            take: 100,
            select: {
              id: true,
              senderId: true,
              receiverId: true,
              content: true,
              type: true,
              status: true,
              durationSeconds: true,
              createdAt: true,
              readAt: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 25,
      }),
      prisma.block.findMany({
        where: { OR: [{ blockerId: auth.id }, { blockedId: auth.id }] },
        select: { blockerId: true, blockedId: true },
      }),
      prisma.match.findMany({
        where: { status: "mutual", OR: [{ user1Id: auth.id }, { user2Id: auth.id }] },
        select: { id: true, user1Id: true, user2Id: true, status: true, state: true },
      }),
    ]);
    const blockedIds = new Set(blocks.map((block) => block.blockerId === auth.id ? block.blockedId : block.blockerId));
    const mutualByPair = new Map(mutualMatches.map((match) => [`${match.user1Id}:${match.user2Id}`, match]));
    const safe = conversations.filter((conversation) => {
      const otherId = conversation.user1Id === auth.id ? conversation.user2Id : conversation.user1Id;
      if (blockedIds.has(otherId)) return false;
      const [user1Id, user2Id] = canonicalPair(conversation.user1Id, conversation.user2Id);
      const match = conversation.match ?? mutualByPair.get(`${user1Id}:${user2Id}`);
      if (!match || match.status !== "mutual") return false;
      return !conversation.matchId || MESSAGEABLE_STATES.includes(match.state as typeof MESSAGEABLE_STATES[number]);
    });
    return NextResponse.json(safe);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.content !== "string" || !body.content.trim() || body.content.trim().length > 2000) {
    return NextResponse.json({ error: "Message requis (2 000 caractères maximum)" }, { status: 400 });
  }

  const access = typeof body.conversationId === "string"
    ? await authorizeConversation(prisma, auth.id, body.conversationId)
    : typeof body.receiverId === "string"
      ? await findConversationForConnection(prisma, auth.id, body.receiverId)
      : { ok: false as const, status: 400 as const, error: "Conversation requise" };
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  if (typeof body.receiverId === "string" && body.receiverId !== access.value.receiverId) {
    return NextResponse.json({ error: "Destinataire invalide" }, { status: 403 });
  }
  const content = body.content.trim();
  const rateCheck = await checkMessageRateLimit(auth.id, access.value.receiverId, content, "text");
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: rateCheck.reason, retryAfter: rateCheck.retryAfter },
      { status: 429, headers: rateCheck.retryAfter ? { "Retry-After": String(rateCheck.retryAfter) } : undefined },
    );
  }
  const now = new Date();
  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: {
        conversationId: access.value.conversation.id,
        senderId: auth.id,
        receiverId: access.value.receiverId,
        content,
        type: "text",
      },
      select: { id: true, senderId: true, receiverId: true, content: true, type: true, status: true, createdAt: true },
    });
    await tx.conversation.update({ where: { id: access.value.conversation.id }, data: { lastMessageAt: now } });
    await tx.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "message_sent",
        eventVersion: 1,
        userId: auth.id,
        occurredAt: now,
        properties: { matchId: access.value.matchId, conversationId: access.value.conversation.id, messageType: "text" },
      },
    });
    await tx.notification.upsert({
      where: { dedupeKey: `message:${created.id}` },
      update: {},
      create: {
        userId: access.value.receiverId,
        type: "new_message",
        title: "Nouveau message",
        body: "Une connexion active t’a écrit.",
        link: "/messages",
        dedupeKey: `message:${created.id}`,
      },
    });
    return created;
  });
  return NextResponse.json({ success: true, message, isNewConversation: false });
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
