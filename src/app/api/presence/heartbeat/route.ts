import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Force dynamique
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.profile.update({
      where: { userId: user.id },
      data: { lastSeenAt: new Date(), onlineStatus: true },
    });

    return NextResponse.json({
      success: true,
      lastSeenAt: new Date().toISOString(),
      isOnline: true,
    });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
