import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const { content } = await req.json();
  const message = await prisma.salonMessage.create({
    data: { salonId: id, userId: user.id, content },
    include: { user: { select: { id: true, profile: { select: { username: true } } } } },
  });
  return NextResponse.json(message, { status: 201 });
}
