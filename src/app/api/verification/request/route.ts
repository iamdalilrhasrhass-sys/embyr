import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { withApiLogging } from "@/lib/api-logger";

/** GET: Récupère le statut de vérification actuel */
async function _GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide." }, { status: 401 });
    const userId = decoded.userId;

    const latest = await prisma.photoVerification.findFirst({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      select: { status: true, code: true, rejectionReason: true, submittedAt: true },
    });

    if (!latest) {
      return NextResponse.json({ status: null, message: "Aucune demande de vérification." });
    }

    return NextResponse.json({ status: latest.status, code: latest.code, rejectionReason: latest.rejectionReason, createdAt: latest.submittedAt });
  } catch (e: any) {
    console.error("Verification GET error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/** POST: Crée une nouvelle demande de vérification */
async function _POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide." }, { status: 401 });
    const userId = decoded.userId;

    // Vérifier s'il y a déjà une demande en attente
    const pending = await prisma.photoVerification.findFirst({ where: { userId, status: "pending" } });
    if (pending) {
      return NextResponse.json({ error: "Une demande est déjà en cours.", code: pending.code, status: "pending" }, { status: 200 });
    }

    // Vérifier si la dernière a été rejetée récemment (anti-spam)
    const lastRejected = await prisma.photoVerification.findFirst({
      where: { userId, status: "rejected" },
      orderBy: { submittedAt: "desc" },
    });
    if (lastRejected) {
      const hoursSinceRejection = (Date.now() - lastRejected.submittedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceRejection < 24) {
        return NextResponse.json({
          error: "Tu as déjà été vérifié il y a moins de 24h. Réessaie plus tard.",
          status: "rejected",
          rejectionReason: lastRejected.rejectionReason,
          canRetryAt: new Date(lastRejected.submittedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        }, { status: 429 });
      }
    }

    const code = randomBytes(2).toString("hex").toUpperCase();
    await prisma.photoVerification.create({ data: { userId, code, photoPath: "", status: "pending" } });
    return NextResponse.json({ success: true, code, status: "pending" });

  } catch (e: any) {
    console.error("Verification request error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export const GET = withApiLogging(_GET);
export const POST = withApiLogging(_POST);
