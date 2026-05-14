import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: auth.id }, { user2Id: auth.id }],
      },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
    });

    const result = [];
    for (const conv of conversations) {
      const otherId = conv.user1Id === auth.id ? conv.user2Id : conv.user1Id;
      const other = await prisma.user.findUnique({
        where: { id: otherId },
        include: {
          profile: {
            select: {
              id: true,
              displayName: true,
              username: true,
            },
          },
          media: {
            where: { type: "public_photo", status: "APPROVED" },
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { url: true },
          },
        },
      });

      const profile = other?.profile;
      const photoUrl = other?.media?.[0]?.url || null;
      const lastMsg = conv.messages[0];
      
      result.push({
        id: conv.id,
        otherUser: {
          id: other?.id,
          displayName: profile?.displayName || profile?.username || "Membre",
          photoUrl,
        },
        lastMessage: lastMsg ? {
          content: lastMsg.content,
          createdAt: lastMsg.createdAt,
          senderId: lastMsg.senderId,
          status: lastMsg.status,
        } : null,
        lastMessageAt: conv.lastMessageAt || conv.updatedAt,
        unreadCount: 0, // Embyr schema: status field on messages
      });
    }

    return NextResponse.json({ conversations: result });
  } catch (error) {
    console.error("GET conversations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { targetUserId } = await request.json();
    if (!targetUserId || typeof targetUserId !== "string")
      return NextResponse.json({ error: "targetUserId requis" }, { status: 400 });
    if (targetUserId === auth.id)
      return NextResponse.json({ error: "Impossible de converser avec soi-même" }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const user1Id = auth.id < targetUserId ? auth.id : targetUserId;
    const user2Id = auth.id < targetUserId ? targetUserId : auth.id;

    let conv = await prisma.conversation.findFirst({
      where: { user1Id, user2Id },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: { user1Id, user2Id },
      });
    }

    return NextResponse.json({ conversation: conv });
  } catch (error) {
    console.error("POST conversations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
