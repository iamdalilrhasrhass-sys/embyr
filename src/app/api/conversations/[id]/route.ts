import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authorizeConversation } from "@/lib/connection-policy";
import { withApiLogging } from "@/lib/api-logger";

async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const access = await authorizeConversation(prisma, auth.id, id);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const [conversation, other] = await Promise.all([
    prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        matchId: true,
        messages: {
          where: { status: { not: "DELETED" } },
          orderBy: { createdAt: "desc" },
          take: 50,
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
    }),
    prisma.user.findUnique({
      where: { id: access.value.receiverId },
      select: {
        id: true,
        profile: { select: { displayName: true, username: true, profilePhotoUrl: true } },
      },
    }),
  ]);
  if (!conversation || !other) return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
  return NextResponse.json({
    conversation: {
      id: conversation.id,
      matchId: access.value.matchId,
      otherUser: {
        id: other.id,
        displayName: other.profile?.displayName || other.profile?.username || "Membre",
        photoUrl: other.profile?.profilePhotoUrl ?? null,
      },
      messages: conversation.messages.reverse(),
    },
  });
}

export const GET = withApiLogging(handleGet);
