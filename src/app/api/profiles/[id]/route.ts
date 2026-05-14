import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getCurrentUser();

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        media: {
          where: { type: "public_photo", status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          select: { url: true, id: true },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const profile = user.profile;
    if (!profile) return NextResponse.json({ error: "Profil incomplet" }, { status: 404 });

    const isBlocked = auth
      ? !!(await prisma.block.findFirst({
          where: { blockerId: id, blockedId: auth.id },
        }))
      : false;

    if (isBlocked) return NextResponse.json({ error: "Ce profil vous a bloqué" }, { status: 403 });

    const isFavorited = auth
      ? !!(await prisma.favorite.findFirst({
          where: { fromUserId: auth.id, toUserId: id },
        }))
      : false;

    const isOnline = profile.onlineStatus === true;
    const publicPhotos = user.media.map((m) => m.url);

    return NextResponse.json({
      profile: {
        id: user.id,
        username: profile.username,
        displayName: profile.displayName,
        age: profile.age,
        city: profile.city,
        description: profile.description,
        genderIdentity: profile.genderIdentity,
        lookingFor: profile.lookingFor,
        isPremium: profile.isPremium,
        isVerified: profile.isVerified,
        isOnline,
        isFavorited,
        isBlocked,
        isCertified: profile.isVerified,
        publicPhotos,
        lastActive: profile.lastActiveAt,
      },
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
