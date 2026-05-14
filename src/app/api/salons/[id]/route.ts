import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const salon = await prisma.salon.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: "desc" }, take: 50, include: { user: { select: { id: true, profile: { select: { username: true } } } } } } } });
  if (!salon) return NextResponse.json({ error: "Salon introuvable" }, { status: 404 });
  return NextResponse.json(salon);
}
