import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { checkMessageRateLimit } from "@/lib/rate-limit";
import { withApiLogging } from "@/lib/api-logger";

async function _GET(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    // Get all conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: decoded.userId },
          { user2Id: decoded.userId }
        ]
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function _POST(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const { receiverId, content, type } = await request.json();
    const messageType = type || "text";

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Contenu ou destinataire manquant" }, { status: 400 });
    }

    // Vérifier que le destinataire existe
    const receiverExists = await prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } });
    if (!receiverExists) {
      return NextResponse.json({ error: "Destinataire introuvable" }, { status: 404 });
    }

    // ── Anti-spam rate limit check ─────────────────────────────────
    const rateCheck = await checkMessageRateLimit(
      decoded.userId,
      receiverId,
      content,
      messageType,
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: rateCheck.reason,
          retryAfter: rateCheck.retryAfter,
        },
        {
          status: 429,
          headers: rateCheck.retryAfter
            ? { "Retry-After": String(rateCheck.retryAfter) }
            : undefined,
        },
      );
    }

    // ── Block check ────────────────────────────────────────────────
    const block = await prisma.block.findFirst({
      where: { blockerId: receiverId, blockedId: decoded.userId },
    });
    if (block) {
      return NextResponse.json({ error: "Vous ne pouvez pas envoyer de message à cet utilisateur" }, { status: 403 });
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: decoded.userId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: decoded.userId }
        ]
      }
    });

    const isNewConversation = !conversation;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: decoded.userId,
          user2Id: receiverId,
        }
      });
    }

    // Create Message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: decoded.userId,
        receiverId,
        content,
        type: messageType,
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date(), updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message, isNewConversation });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(_GET);
export const POST = withApiLogging(_POST);
