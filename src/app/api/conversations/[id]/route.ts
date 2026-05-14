import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const conv = await prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ user1Id: auth.id }, { user2Id: auth.id }],
      },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!conv) return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });

    const otherId = conv.user1Id === auth.id ? conv.user2Id : conv.user1Id;
    const other = await prisma.user.findUnique({
      where: { id: otherId },
      include: {
        profile: {
          select: { id: true, displayName: true, username: true },
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

    return NextResponse.json({
      conversation: {
        id: conv.id,
        otherUser: {
          id: other?.id,
          displayName: profile?.displayName || profile?.username || "Membre",
          photoUrl,
        },
        messages: conv.messages.reverse().map((m) => ({
          id: m.id,
          senderId: m.senderId,
          content: m.content,
          status: m.status,
          createdAt: m.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("GET conversation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
