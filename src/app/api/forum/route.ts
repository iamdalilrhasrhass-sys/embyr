import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get("categoryId");
  const categories = await prisma.forumCategory.findMany({
    include: { threads: { take: 5, orderBy: { createdAt: "desc" } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { categoryId, title, content } = await req.json();
  const thread = await prisma.forumThread.create({
    data: { categoryId, authorId: user.id, title },
  });
  await prisma.forumPost.create({
    data: { threadId: thread.id, authorId: user.id, content },
  });
  return NextResponse.json(thread, { status: 201 });
}
