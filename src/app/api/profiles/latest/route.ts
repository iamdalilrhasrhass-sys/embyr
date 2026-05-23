import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const latest = await prisma.profile.findMany({
      where: {
        displayName: { not: null },
        city: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        displayName: true,
        city: true,
        age: true,
      },
    });
    return NextResponse.json({ profiles: latest });
  } catch (e) {
    return NextResponse.json({ profiles: [] });
  }
}
