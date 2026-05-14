import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = await prisma.forumThread.findUnique({
    where: { id },
    include: {
      category: true,
      posts: {
        include: { author: { select: { id: true, profile: { select: { displayName: true } } } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { posts: true } },
    },
  });
  if (!thread) return NextResponse.json({ error: "Discussion introuvable" }, { status: 404 });
  return NextResponse.json(thread);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
  const post = await prisma.forumPost.create({
    data: { threadId: id, authorId: user.id, content },
    include: { author: { select: { id: true, profile: { select: { displayName: true } } } } },
  });
  return NextResponse.json(post);
}
