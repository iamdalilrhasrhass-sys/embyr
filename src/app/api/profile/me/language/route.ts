import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Récupérer la langue du profil utilisateur
export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: decoded.userId },
    select: { language: true },
  });

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  return NextResponse.json({ language: profile.language || "fr" });
}

// Mettre à jour la langue du profil utilisateur
export async function PATCH(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const { language } = await req.json();

    if (!language || typeof language !== "string" || language.length > 10) {
      return NextResponse.json(
        { error: "Langue invalide. Utilisez un code ISO 639-1 (ex: fr, en, es)" },
        { status: 400 }
      );
    }

    const updated = await prisma.profile.update({
      where: { userId: decoded.userId },
      data: { language: language.toLowerCase() },
      select: { language: true },
    });

    return NextResponse.json({ language: updated.language });
  } catch (error) {
    console.error("Language update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la langue" },
      { status: 500 }
    );
  }
}
