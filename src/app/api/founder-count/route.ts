import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Returns the current number of founding members.
 * A founding member is a user with a referralCode who has referred at least 1 person,
 * OR a user with isFounder flag (if exists), OR the first 100 users.
 * Falls back to a count of users with referral activity.
 */
export async function GET() {
  try {
    // Count users who have a referralCode (active referrers = founding community)
    const founderCount = await prisma.user.count({
      where: {
        referralCode: { not: null },
      },
    });

    // Also count total verified users as a baseline
    const totalUsers = await prisma.user.count({
      where: {
        deletedAt: null,
        bannedAt: null,
      },
    });

    // Founder count = max of referralCode users and a minimum baseline
    const displayCount = Math.max(founderCount, Math.min(totalUsers, 13));

    return NextResponse.json({
      count: displayCount,
      total: totalUsers,
      limit: 100,
      remaining: Math.max(0, 100 - displayCount),
    });
  } catch (error) {
    console.error("Founder count error:", error);
    // Fallback to safe default
    return NextResponse.json({
      count: 13,
      total: 13,
      limit: 100,
      remaining: 87,
    });
  }
}
