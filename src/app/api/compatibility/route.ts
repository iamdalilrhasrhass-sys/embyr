import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateCompatibility, internalCandidateSelect } from "@/lib/matching";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const username = request.nextUrl.searchParams.get("username")?.trim();
  if (!username || username.length > 30) return NextResponse.json({ error: "Username required" }, { status: 400 });

  const now = new Date();
  const [viewer, target, blocked, viewerSignal] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: auth.id }, select: internalCandidateSelect }),
    prisma.profile.findFirst({
      where: {
        username,
        user: { is: { bannedAt: null, deletedAt: null } },
      },
      select: internalCandidateSelect,
    }),
    prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: auth.id, blocked: { profile: { username } } },
          { blockedId: auth.id, blocker: { profile: { username } } },
        ],
      },
      select: { id: true },
    }),
    prisma.presenceSignal.findFirst({
      where: { userId: auth.id, active: true, visible: true, expiresAt: { gt: now } },
      orderBy: { activatedAt: "desc" },
    }),
  ]);
  if (!viewer || !target || blocked) return NextResponse.json({ error: "Universe not found" }, { status: 404 });
  const targetSignal = await prisma.presenceSignal.findFirst({
    where: { userId: target.userId, active: true, visible: true, expiresAt: { gt: now } },
    orderBy: { activatedAt: "desc" },
  });
  const result = evaluateCompatibility(viewer, target, { now, userSignal: viewerSignal, candidateSignal: targetSignal });
  if (!result.eligible) {
    return NextResponse.json(
      { eligible: false, reasons: [], message: "Ce profil ne fait pas partie de ta sélection réciproque actuelle." },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }
  return NextResponse.json(
    { eligible: true, reasons: result.reasons.slice(0, 3) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
