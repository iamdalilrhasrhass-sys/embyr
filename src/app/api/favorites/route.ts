import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { publicProfileSelect } from "@/lib/profile-contract";

export async function GET() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        fromUserId: auth.id,
        toUser: {
          is: {
            bannedAt: null,
            deletedAt: null,
            profile: { is: { profileSource: "user_registration", publicVisibility: true, visibilityStatus: { not: "HIDDEN" }, moderationState: "ACTIVE" } },
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        toUser: {
          select: { id: true, profile: { select: publicProfileSelect } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(favorites, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null) as { targetUserId?: unknown } | null;
  const targetUserId = body?.targetUserId;
  if (typeof targetUserId !== "string" || !targetUserId || targetUserId.length > 64 || targetUserId === auth.id) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
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

    const existing = await prisma.favorite.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: auth.id,
          toUserId: targetUserId
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: "removed", active: false });
    } else {
      await prisma.favorite.create({
        data: {
          fromUserId: auth.id,
          toUserId: targetUserId
        }
      });
      return NextResponse.json({ message: "added", active: true });
    }
  } catch {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
