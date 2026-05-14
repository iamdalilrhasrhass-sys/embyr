import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Initier un appel
export async function POST(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Vérifier premium via profile
  const profile = await prisma.profile.findUnique({ where: { userId: auth.id } });
  const isPremium = profile?.isPremium || false;

  try {
    const { conversationId, type } = await request.json();

    if (!conversationId || !type) {
      return NextResponse.json({ error: "conversationId et type requis" }, { status: 400 });
    }
    if (!["audio", "video"].includes(type)) {
      return NextResponse.json({ error: "Type invalide (audio ou video)" }, { status: 400 });
    }

    // Premium check
    if (!isPremium) {
      return NextResponse.json({ error: "Premium requis pour les appels", redirectToPricing: true }, { status: 402 });
    }

    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });

    const receiverId = conv.user1Id === auth.id ? conv.user2Id : conv.user1Id;

    // Blocage
    const block = await prisma.block.findFirst({
      where: { blockerId: receiverId, blockedId: auth.id },
    });
    if (block) return NextResponse.json({ error: "Vous êtes bloqué" }, { status: 403 });

    // Créer session d'appel via SQL brut
    const id = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO "CallSession" ("id", "conversationId", "callerId", "receiverId", "type", "status", "startedAt", "createdAt")
       VALUES ($1, $2, $3, $4, $5, 'ringing', now(), now())`,
      id, conversationId, auth.id, receiverId, type
    );

    return NextResponse.json({
      callSession: {
        id,
        conversationId,
        callerId: auth.id,
        receiverId,
        type,
        status: "ringing",
      },
    });
  } catch (error) {
    console.error("Call init error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Mettre à jour statut appel (accepter/refuser/terminer)
export async function PUT(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { callSessionId, status } = await request.json();
    const validStatuses = ["accepted", "declined", "ended", "missed"];
    if (!callSessionId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "callSessionId et status valide requis" }, { status: 400 });
    }

    const call = await prisma.$queryRawUnsafe<Array<{ id: string; receiverId: string; callerId: string; status: string }>>(
      `SELECT * FROM "CallSession" WHERE id = $1`, callSessionId
    );
    if (!call || call.length === 0) {
      return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });
    }

    const session = call[0];
    if (session.receiverId !== auth.id && session.callerId !== auth.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const now = new Date();
    if (status === "accepted") {
      await prisma.$executeRawUnsafe(
        `UPDATE "CallSession" SET status = 'accepted', "answeredAt" = $2 WHERE id = $1`,
        callSessionId, now
      );
    } else if (status === "ended") {
      const answeredAt = session.status === "accepted" ? null : null;
      await prisma.$executeRawUnsafe(
        `UPDATE "CallSession" SET status = 'ended', "endedAt" = $2 WHERE id = $1`,
        callSessionId, now
      );
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "CallSession" SET status = $2 WHERE id = $1`,
        callSessionId, status
      );
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Call update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
