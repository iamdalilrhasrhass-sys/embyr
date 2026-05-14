import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const ads = await prisma.classified.findMany({
    where: { isActive: true, ...(category ? { category } : {}), ...(city ? { city: { contains: city, mode: "insensitive" } } : {}) },
    include: { user: { select: { id: true, profile: { select: { username: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { title, content, category, city } = await req.json();
  const ad = await prisma.classified.create({
    data: { userId: user.id, title, content, category, city },
  });
  return NextResponse.json(ad, { status: 201 });
}
