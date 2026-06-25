import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const { action, targetId } = await request.json();

    if (action === "dismiss_report") {
      await prisma.userReport.update({
        where: { id: targetId },
        data: { status: "DISMISSED", resolvedAt: new Date() }
      });
      return NextResponse.json({ success: true, message: "Signalement ignoré" });
    }

    if (action === "ban_user") {
      await prisma.user.update({
        where: { id: targetId },
        data: { bannedAt: new Date(), banReason: "Banni par l'administration" }
      });
      return NextResponse.json({ success: true, message: "Utilisateur banni" });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
