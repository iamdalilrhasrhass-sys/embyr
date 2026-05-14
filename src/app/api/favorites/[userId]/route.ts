import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const existing = await prisma.favorite.findUnique({
      where: { fromUserId_toUserId: { fromUserId: user.id, toUserId: userId } }
    });
    if (existing) return NextResponse.json({ active: true, message: "Déjà en favori" });
    await prisma.favorite.create({ data: { fromUserId: user.id, toUserId: userId } });
    return NextResponse.json({ active: true, message: "Ajouté aux favoris" });
  } catch (e) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const existing = await prisma.favorite.findUnique({
      where: { fromUserId_toUserId: { fromUserId: user.id, toUserId: userId } }
    });
    if (!existing) return NextResponse.json({ active: false, message: "Pas en favori" });
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ active: false, message: "Retiré des favoris" });
  } catch (e) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}
