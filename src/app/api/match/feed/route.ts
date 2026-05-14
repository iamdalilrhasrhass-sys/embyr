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

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return NextResponse.json({ error: "Complète ton profil d'abord." }, { status: 400 });

    const existingMatches = await prisma.match.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      select: { user1Id: true, user2Id: true, status: true }
    });
    const excludeIds = new Set<string>();
    existingMatches.forEach(m => {
      if (m.user1Id === userId) excludeIds.add(m.user2Id);
      else excludeIds.add(m.user1Id);
    });
    excludeIds.add(userId);

    const candidates = await prisma.profile.findMany({
      where: { userId: { notIn: Array.from(excludeIds) }, publicVisibility: true },
      take: 50,
      orderBy: { lastActiveAt: "desc" }
    });

    const scored = candidates.map(c => {
      let score = 0;
      if (profile.intentions?.some((i: string) => c.intentions?.includes(i))) score += 25;
      if (profile.city && c.city && profile.city === c.city) score += 25;
      else if (profile.country && c.country && profile.country === c.country) score += 15;
      if (c.isVerified) score += 15;
      if (c.lastActiveAt && c.lastActiveAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) score += 10;
      score += Math.min(10, Math.round((c.profileCompletionScore || 0) / 10));
      return { ...c, score };
    });

    scored.sort((a: any, b: any) => b.score - a.score);
    return NextResponse.json({ profiles: scored.slice(0, 10) });

  } catch (e: any) {
    console.error("Feed error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
