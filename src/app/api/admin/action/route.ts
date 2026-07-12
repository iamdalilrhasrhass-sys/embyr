import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }
    const { action, targetId } = body as Record<string, unknown>;
    if (typeof action !== "string" || typeof targetId !== "string" || targetId.length > 64) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

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
