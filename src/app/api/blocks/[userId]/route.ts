import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (userId === user.id) return NextResponse.json({ error: "Impossible" }, { status: 400 });
  const existing = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId: user.id, blockedId: userId } }
  });
  if (existing) return NextResponse.json({ blocked: true, message: "Déjà bloqué" });
  await prisma.block.create({ data: { blockerId: user.id, blockedId: userId } });
  return NextResponse.json({ blocked: true, message: "Bloqué" });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const existing = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId: user.id, blockedId: userId } }
  });
  if (!existing) return NextResponse.json({ blocked: false, message: "Pas bloqué" });
  await prisma.block.delete({ where: { id: existing.id } });
  return NextResponse.json({ blocked: false, message: "Débloqué" });
}
