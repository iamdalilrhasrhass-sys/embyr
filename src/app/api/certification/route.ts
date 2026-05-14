import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const cert = await prisma.certificationRequest.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(cert || { status: "none" });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const existing = await prisma.certificationRequest.findFirst({ where: { userId: user.id, status: "pending" } });
  if (existing) return NextResponse.json({ error: "Demande déjà en cours" }, { status: 409 });
  const cert = await prisma.certificationRequest.create({ data: { userId: user.id } });
  return NextResponse.json(cert, { status: 201 });
}
