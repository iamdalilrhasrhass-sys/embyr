import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  normalizeDiscoveryQuery,
  seekingToGenderIdentity,
  toPublicPreview,
} from "@/lib/discovery-preview";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = normalizeDiscoveryQuery({
    gender: params.get("gender"),
    seeking: params.get("seeking"),
    intent: params.get("intent"),
    city: params.get("city"),
  });

  try {
    const genderIdentity = seekingToGenderIdentity(query.seeking);
    const profiles = await prisma.profile.findMany({
      where: {
        publicVisibility: true,
        user: {
          deletedAt: null,
          bannedAt: null,
        },
        ...(query.city ? { city: { contains: query.city, mode: "insensitive" } } : {}),
        ...(query.intent ? { intentions: { has: query.intent } } : {}),
        ...(genderIdentity ? { genderIdentity } : {}),
      },
      select: {
        id: true,
        age: true,
        city: true,
        intentions: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    if (!profiles.length) {
      return NextResponse.json({ status: "empty", previews: [] });
    }

    return NextResponse.json({
      status: "results",
      previews: profiles.map(toPublicPreview),
    });
  } catch (error) {
    console.error("Discovery preview unavailable:", error);
    return NextResponse.json(
      { status: "unavailable", previews: [] },
      { status: 503 },
    );
  }
}

