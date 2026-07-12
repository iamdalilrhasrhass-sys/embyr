import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authorizeConversation } from "@/lib/connection-policy";
import { checkMessageRateLimit } from "@/lib/rate-limit";
import { withApiLogging } from "@/lib/api-logger";

async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const access = await authorizeConversation(prisma, auth.id, id);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 30) || 30));
  const messages = await prisma.message.findMany({
    where: { conversationId: id, status: { not: "DELETED" } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      content: true,
      type: true,
      status: true,
      mediaUrl: true,
      mediaType: true,
      durationSeconds: true,
      createdAt: true,
      readAt: true,
    },
  });
  const hasMore = messages.length > limit;
  const page = messages.slice(0, limit);
  await prisma.message.updateMany({
    where: { id: { in: page.map((message) => message.id) }, receiverId: auth.id, status: "SENT" },
    data: { status: "READ", readAt: new Date() },
  });
  return NextResponse.json({
    messages: page.reverse().map((message) => ({
      ...message,
      status: message.receiverId === auth.id && message.status === "SENT" ? "READ" : message.status,
      mediaUrl: message.type === "audio" ? `/api/messages/audio/${message.id}` : message.mediaUrl,
    })),
    hasMore,
    nextCursor: hasMore ? page[0]?.id ?? null : null,
  });
}

async function handlePost(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const access = await authorizeConversation(prisma, auth.id, id);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null) as { content?: unknown } | null;
  if (typeof body?.content !== "string" || !body.content.trim() || body.content.trim().length > 2000) {
    return NextResponse.json({ error: "Message requis (2 000 caractères maximum)" }, { status: 400 });
  }
  const content = body.content.trim();
  const rateCheck = await checkMessageRateLimit(auth.id, access.value.receiverId, content, "text");
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: rateCheck.reason, retryAfter: rateCheck.retryAfter },
      { status: 429, headers: rateCheck.retryAfter ? { "Retry-After": String(rateCheck.retryAfter) } : undefined },
    );
  }

  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: {
        conversationId: id,
        senderId: auth.id,
        receiverId: access.value.receiverId,
        content,
        type: "text",
        status: "SENT",
      },
      select: { id: true, senderId: true, receiverId: true, content: true, type: true, status: true, createdAt: true },
    });
    const now = new Date();
    await tx.conversation.update({ where: { id }, data: { lastMessageAt: now } });
    await tx.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "message_sent",
        eventVersion: 1,
        userId: auth.id,
        occurredAt: now,
        properties: { matchId: access.value.matchId, conversationId: id, messageType: "text" },
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
  return NextResponse.json({ message }, { status: 201 });
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
