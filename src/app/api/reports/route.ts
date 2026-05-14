import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const { reportedUserId, reason, targetType } = await request.json();

    if (!reportedUserId || !reason) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const report = await prisma.userReport.create({
      data: {
        reporterId: decoded.userId,
        reportedUserId,
        targetType: targetType || "profile",
        reason,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Erreur lors du signalement" }, { status: 500 });
  }
}
