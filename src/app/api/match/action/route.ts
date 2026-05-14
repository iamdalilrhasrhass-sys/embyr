import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

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

    const [u1, u2] = [userId, targetUserId].sort();
    const existing = await prisma.match.findUnique({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } }
    });

    if (action === "pass") {
      if (!existing) {
        await prisma.match.create({ data: { user1Id: u1, user2Id: u2, status: "rejected", score: 0 } });
      }
      return NextResponse.json({ success: true, matched: false });
    }

    if (existing) {
      if (existing.status === "mutual" || existing.status === "rejected") {
        return NextResponse.json({ success: true, matched: false });
      }
      await prisma.match.update({
        where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        data: { status: "mutual" }
      });
      return NextResponse.json({ success: true, matched: true });
    }

    await prisma.match.create({ data: { user1Id: u1, user2Id: u2, status: "pending", score: 50 } });
    return NextResponse.json({ success: true, matched: false });

  } catch (e: any) {
    console.error("Match action error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
