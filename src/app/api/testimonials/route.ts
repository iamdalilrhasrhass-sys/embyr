import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get("toUserId");
  const testimonials = await prisma.testimonial.findMany({
    where: targetId ? { toUserId: targetId, status: "approved" } : { toUserId: user.id },
    include: { fromUser: { select: { id: true, profile: { select: { username: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { toUserId, content } = await req.json();
  const testimonial = await prisma.testimonial.create({
    data: { fromUserId: user.id, toUserId, content },
  });
  return NextResponse.json(testimonial, { status: 201 });
}
