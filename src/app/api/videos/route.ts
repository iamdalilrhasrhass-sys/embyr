import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const videos = await prisma.video.findMany({
    include: { user: { select: { id: true, profile: { select: { username: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { title, url, thumbnailUrl } = await req.json();
  const video = await prisma.video.create({
    data: { userId: user.id, title, url, thumbnailUrl },
  });
  return NextResponse.json(video, { status: 201 });
}
