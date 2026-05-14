import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";



export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const favorites = await prisma.favorite.findMany({
      where: { fromUserId: payload.userId },
      include: {
        toUser: {
          include: { profile: true }
        }
      }
    });
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: payload.userId,
          toUserId: targetUserId
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: "removed", active: false });
    } else {
      await prisma.favorite.create({
        data: {
          fromUserId: payload.userId,
          toUserId: targetUserId
        }
      });
      return NextResponse.json({ message: "added", active: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
