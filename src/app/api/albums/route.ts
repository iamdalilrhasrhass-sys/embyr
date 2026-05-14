import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const albums = await prisma.album.findMany({
    where: { userId: user.id },
    include: { photos: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(albums);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { title, description, visibility } = await req.json();
  const album = await prisma.album.create({
    data: { userId: user.id, title, description, visibility: visibility || "public" },
  });
  return NextResponse.json(album, { status: 201 });
}
