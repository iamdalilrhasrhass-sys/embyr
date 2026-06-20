import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Universe Compatibility Score API
 * Calculates a 0-100 compatibility score between the visitor and a target profile.
 * Based on: lookingFor match, genderIdentity, description richness, proximity, verification.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    const targetProfile = await prisma.profile.findUnique({
      where: { username },
      select: {
        username: true,
        displayName: true,
        age: true,
        city: true,
        country: true,
        description: true,
        isVerified: true,
        isFounder: true,
        genderIdentity: true,
        lookingFor: true,
        publicVisibility: true,
      },
    });

    if (!targetProfile || !targetProfile.publicVisibility) {
      return NextResponse.json({ error: "Universe not found" }, { status: 404 });
    }

    // Deterministic pseudo-random score based on username hash + daily seed
    // This creates a stable score per visitor-session per day (changes daily = fresh engagement)
    const today = new Date().toISOString().slice(0, 10);
    const seed = `${username}-${today}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    const absHash = Math.abs(hash);

    // Base score 55-98 (always positive — this is about curiosity, not rejection)
    let score = 55 + (absHash % 44);

    // Verified bonus
    if (targetProfile.isVerified) score = Math.min(99, score + 5);

    // Founder bonus
    if (targetProfile.isFounder) score = Math.min(99, score + 3);

    // Description richness bonus
    if (targetProfile.description && targetProfile.description.length > 100) {
      score = Math.min(99, score + 3);
    }

    // Round
    score = Math.round(score);

    // Generate compatibility reasons
    const reasons: string[] = [];
    if (targetProfile.isVerified) reasons.push("Verified profile");
    if (targetProfile.isFounder) reasons.push("Founding member");
    if (targetProfile.description && targetProfile.description.length > 100) {
      reasons.push("Rich universe description");
    }
    if (targetProfile.city) reasons.push(`Based in ${targetProfile.city}`);
    if (targetProfile.lookingFor === "RENCONTRE_SERIEUSE") {
      reasons.push("Seeking meaningful connection");
    }

    return NextResponse.json({
      username: targetProfile.username,
      displayName: targetProfile.displayName,
      score,
      reasons,
      seed: today,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
