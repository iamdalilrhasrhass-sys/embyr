import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicProfileSelect } from "@/lib/profile-contract";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim();
  if (!username || username.length > 30) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        username,
        publicVisibility: true,
        visibilityStatus: "PUBLIC",
        moderationState: "ACTIVE",
        user: { is: { bannedAt: null, deletedAt: null } },
      },
      select: publicProfileSelect,
    });
    if (!profile) return NextResponse.json({ error: "Universe not found" }, { status: 404 });
    const { id: _profileId, userId: _userId, ...publicProfile } = profile;
    return NextResponse.json(publicProfile, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
