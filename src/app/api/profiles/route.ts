import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany({
      where: { publicVisibility: true },
      select: {
        id: true,
        userId: true,
        username: true,
        age: true,
        city: true,
        genderIdentity: true,
        description: true,
        isVerified: true,
        isPremium: true,
        onlineStatus: true,
        createdAt: true,
        lastSeenAt: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    // Return only real database profiles — empty array if none exist
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("DB Error on profiles:", error);
    return NextResponse.json(
      { error: "Profiles temporarily unavailable" },
      { status: 503 }
    );
  }
}
