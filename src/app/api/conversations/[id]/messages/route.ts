import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
    });

    if (!conv) return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });

    const { content } = await request.json();
    if (!content || typeof content !== "string" || !content.trim())
      return NextResponse.json({ error: "Message requis" }, { status: 400 });

    const receiverId = conv.user1Id === auth.id ? conv.user2Id : conv.user1Id;

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: auth.id,
        receiverId,
        content: content.trim(),
        status: "SENT",
      },
    });

    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({
      message: {
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        status: message.status,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
