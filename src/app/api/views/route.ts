import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null) as { targetUserId?: unknown } | null;
  const targetUserId = body?.targetUserId;
  if (typeof targetUserId !== "string" || !targetUserId || targetUserId.length > 64) {
    return NextResponse.json({ error: "invalid_target" }, { status: 400 });
  }
  if (targetUserId === auth.id) {
    return NextResponse.json({ ignored: true });
  }

  try {
    const [target, blocked] = await Promise.all([
      prisma.user.findFirst({
        where: {
          id: targetUserId,
          bannedAt: null,
          deletedAt: null,
          profile: { is: { profileSource: "user_registration", publicVisibility: true, visibilityStatus: { not: "HIDDEN" }, moderationState: "ACTIVE" } },
        },
        select: { id: true },
      }),
      prisma.block.findFirst({
        where: { OR: [{ blockerId: auth.id, blockedId: targetUserId }, { blockerId: targetUserId, blockedId: auth.id }] },
        select: { id: true },
      }),
    ]);
    if (!target || blocked) return NextResponse.json({ error: "target_not_available" }, { status: 404 });

    const recent = await prisma.profileVisit.findFirst({
      where: {
        visitorId: auth.id,
        visitedId: targetUserId,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (recent) return NextResponse.json({ success: true, duplicate: true });

    await prisma.profileVisit.create({
      data: {
        visitorId: auth.id,
        visitedId: targetUserId
      }
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
