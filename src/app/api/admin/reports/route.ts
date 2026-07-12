import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const reports = await prisma.userReport.findMany({
      select: {
        id: true,
        reporterId: true,
        reportedUserId: true,
        targetType: true,
        targetId: true,
        reason: true,
        details: true,
        status: true,
        createdAt: true,
        resolvedAt: true,
        reporter: {
          select: {
            id: true,
            email: true,
            profile: { select: { username: true, displayName: true } },
          },
        },
        reported: {
          select: {
            id: true,
            email: true,
            bannedAt: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                profilePhotoUrl: true,
                moderationState: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
