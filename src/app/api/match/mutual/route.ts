import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide." }, { status: 401 });
    const userId = decoded.userId;

    const matches = await prisma.match.findMany({
      where: { status: "mutual", OR: [{ user1Id: userId }, { user2Id: userId }] },
      include: {
        user1: { select: { id: true, profile: true } },
        user2: { select: { id: true, profile: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      matches: matches.map(m => {
        const other = m.user1Id === userId ? m.user2 : m.user1;
        return { matchId: m.id, userId: other.id, profile: other.profile, createdAt: m.createdAt };
      })
    });

  } catch (e: any) {
    console.error("Mutual error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
