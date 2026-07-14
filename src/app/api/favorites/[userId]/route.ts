import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!userId || userId.length > 64 || userId === user.id) {
    return NextResponse.json({ error: "Cible invalide" }, { status: 400 });
  }
  try {
    const [target, blocked] = await Promise.all([
      prisma.user.findFirst({
        where: {
          id: userId,
          bannedAt: null,
          deletedAt: null,
          profile: { is: { profileSource: "user_registration", publicVisibility: true, visibilityStatus: { not: "HIDDEN" }, moderationState: "ACTIVE" } },
        },
        select: { id: true },
      }),
      prisma.block.findFirst({
        where: { OR: [{ blockerId: user.id, blockedId: userId }, { blockerId: userId, blockedId: user.id }] },
        select: { id: true },
      }),
    ]);
    if (!target || blocked) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    const existing = await prisma.favorite.findUnique({
      where: { fromUserId_toUserId: { fromUserId: user.id, toUserId: userId } }
    });
    if (existing) return NextResponse.json({ active: true, message: "Déjà en favori" });
    await prisma.favorite.create({ data: { fromUserId: user.id, toUserId: userId } });
    return NextResponse.json({ active: true, message: "Ajouté aux favoris" });
  } catch { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!userId || userId.length > 64 || userId === user.id) {
    return NextResponse.json({ error: "Cible invalide" }, { status: 400 });
  }
  try {
    const existing = await prisma.favorite.findUnique({
      where: { fromUserId_toUserId: { fromUserId: user.id, toUserId: userId } }
    });
    if (!existing) return NextResponse.json({ active: false, message: "Pas en favori" });
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ active: false, message: "Retiré des favoris" });
  } catch { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}
