import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ── Pure transition function (testable) ──

type MatchAction = "like" | "pass";
type MatchStatus = "pending" | "mutual" | "rejected";

interface TransitionInput {
  actorId: string;
  targetId: string;
  existingStatus: MatchStatus | null;
  existingInitiatorId: string | null;
  action: MatchAction;
}

interface TransitionResult {
  ok: true;
  newStatus: MatchStatus;
  initiatorId: string | null;
  matched: boolean;
}

export function decideMatchTransition(
  input: TransitionInput
): TransitionResult | { ok: false; status: 400; error: string } {
  const { actorId, targetId, existingStatus, existingInitiatorId, action } = input;

  // Self-like is always invalid
  if (actorId === targetId) {
    return { ok: false, status: 400, error: "Action invalide: vous-même" };
  }

  if (action === "pass") {
    return {
      ok: true,
      newStatus: "rejected",
      initiatorId: actorId,
      matched: false,
    };
  }

  // action === "like"
  if (!existingStatus || existingStatus === null) {
    // First like → pending
    return {
      ok: true,
      newStatus: "pending",
      initiatorId: actorId,
      matched: false,
    };
  }

  if (existingStatus === "rejected") {
    return {
      ok: true,
      newStatus: "rejected",
      initiatorId: existingInitiatorId,
      matched: false,
    };
  }

  if (existingStatus === "mutual") {
    return {
      ok: true,
      newStatus: "mutual",
      initiatorId: existingInitiatorId,
      matched: false,
    };
  }

  // existingStatus === "pending"
  if (existingInitiatorId === actorId) {
    // Same actor repeating → stay pending
    return {
      ok: true,
      newStatus: "pending",
      initiatorId: actorId,
      matched: false,
    };
  }

  // Different actor → mutual match!
  return {
    ok: true,
    newStatus: "mutual",
    initiatorId: existingInitiatorId, // preserve original initiator
    matched: true,
  };
}

// ── Route handler ──

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide." }, { status: 401 });
    const userId = decoded.userId;

    const { targetUserId, action } = await req.json();
    if (!targetUserId || !action) return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    if (!["like", "pass"].includes(action)) return NextResponse.json({ error: "Action invalide." }, { status: 400 });

    // Verify target exists and is not banned/deleted
    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, bannedAt: true, deletedAt: true },
    });
    if (!target || target.bannedAt || target.deletedAt) {
      return NextResponse.json({ error: "Utilisateur cible indisponible." }, { status: 400 });
    }

    const [u1, u2] = [userId, targetUserId].sort();
    const existing = await prisma.match.findUnique({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    });

    const transition = decideMatchTransition({
      actorId: userId,
      targetId: targetUserId,
      existingStatus: (existing?.status as MatchStatus) ?? null,
      existingInitiatorId: existing?.initiatorId ?? null,
      action: action as MatchAction,
    });

    if (!transition.ok) {
      return NextResponse.json({ error: transition.error }, { status: transition.status });
    }

    if (!existing) {
      await prisma.match.create({
        data: {
          user1Id: u1,
          user2Id: u2,
          status: transition.newStatus,
          initiatorId: transition.initiatorId,
          score: action === "like" ? 50 : 0,
        },
      });
    } else {
      await prisma.match.update({
        where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        data: {
          status: transition.newStatus,
          initiatorId: transition.initiatorId,
          score: transition.matched ? 100 : existing.score,
        },
      });
    }

    return NextResponse.json({ success: true, matched: transition.matched });
  } catch (e: any) {
    console.error("Match action error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
