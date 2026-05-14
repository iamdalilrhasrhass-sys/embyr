import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const salons = await prisma.salon.findMany({
    include: { messages: { take: 1, orderBy: { createdAt: "desc" }, include: { user: { select: { profile: { select: { username: true } } } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(salons);
}
