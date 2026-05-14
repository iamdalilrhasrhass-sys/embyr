import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";



export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();

  if (!targetUserId || targetUserId === payload.userId) {
    return NextResponse.json({ ignored: true });
  }

  try {
    // Basic rate limit: 1 view per user per hour? (Simplified here)
    await prisma.profileVisit.create({
      data: {
        visitorId: payload.userId,
        visitedId: targetUserId
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
