import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PublicProfile {
  username: string;
  displayName: string | null;
  age: number;
  city: string | null;
  country: string | null;
  description: string | null;
  isVerified: boolean;
  isFounder: boolean;
  genderIdentity: string | null;
  lookingFor: string | null;
  popularityScore: number;
  trustScore: number;
  profileCompletionScore: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ error: "Username required" }, { status: 400 });
  }

  try {
    const profile = await prisma.profile.findUnique({
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
        popularityScore: true,
        trustScore: true,
        profileCompletionScore: true,
        publicVisibility: true,
      },
    });

    if (!profile || !profile.publicVisibility) {
      return Response.json({ error: "Universe not found" }, { status: 404 });
    }

    // Strip publicVisibility before returning
    const { publicVisibility, ...publicData } = profile;
    return Response.json(publicData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
