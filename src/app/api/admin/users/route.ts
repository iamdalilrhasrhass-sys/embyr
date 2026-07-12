import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        phoneVerified: true,
        emailVerified: true,
        role: true,
        isAdultConfirmed: true,
        bannedAt: true,
        banReason: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            age: true,
            city: true,
            country: true,
            profilePhotoUrl: true,
            isVerified: true,
            isPremium: true,
            moderationState: true,
            visibilityStatus: true,
            onboardingCompletedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
