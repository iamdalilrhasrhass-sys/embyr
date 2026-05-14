import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === "ADMIN";
}

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  if (!(await isAdmin(decoded.userId))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
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
