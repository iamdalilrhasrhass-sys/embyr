import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicProfileSelect } from "@/lib/profile-contract";
import { withApiLogging } from "@/lib/api-logger";

async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await getCurrentUser();
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
        bannedAt: null,
        deletedAt: null,
        profile: {
          is: {
            publicVisibility: true,
            visibilityStatus: { not: "HIDDEN" },
            moderationState: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        profile: { select: publicProfileSelect },
        media: {
          where: { type: "public_photo", status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: { id: true, url: true },
        },
      },
    });
    if (!user?.profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    if (auth && auth.id !== id) {
      const blocked = await prisma.block.findFirst({
        where: { OR: [{ blockerId: auth.id, blockedId: id }, { blockerId: id, blockedId: auth.id }] },
        select: { id: true },
      });
      if (blocked) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
      await prisma.$transaction([
        prisma.profileVisit.create({ data: { visitorId: auth.id, visitedId: id, hidden: false } }),
        prisma.analyticsEvent.create({
          data: {
            eventId: crypto.randomUUID(),
            eventName: "profile_opened",
            eventVersion: 1,
            userId: auth.id,
            occurredAt: new Date(),
            properties: { profileUserId: id },
          },
        }),
      ]);
    }
    const isFavorited = auth
      ? Boolean(await prisma.favorite.findFirst({ where: { fromUserId: auth.id, toUserId: id }, select: { id: true } }))
      : false;
    return NextResponse.json({
      profile: {
        ...user.profile,
        id: user.id,
        isFavorited,
        publicPhotos: user.media.map((media) => media.url),
      },
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
