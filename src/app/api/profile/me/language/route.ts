import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { routing } from "@/i18n/routing";
import { withApiLogging } from "@/lib/api-logger";

const SUPPORTED_LANGUAGES = new Set<string>(routing.locales);

// Récupérer la langue du profil utilisateur
async function handleGet() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: auth.id },
    select: { language: true },
  });

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  return NextResponse.json(
    { language: profile.language || "fr" },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

// Mettre à jour la langue du profil utilisateur
async function handlePatch(req: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json() as { language?: unknown };
    const language = typeof body.language === "string" ? body.language.trim().toLowerCase() : "";

    if (!SUPPORTED_LANGUAGES.has(language)) {
      return NextResponse.json(
        { error: "Langue invalide. Utilisez un code ISO 639-1 (ex: fr, en, es)" },
        { status: 400 }
      );
    }

    const updated = await prisma.profile.update({
      where: { userId: auth.id },
      data: { language },
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

export const GET = withApiLogging(handleGet);
export const PATCH = withApiLogging(handlePatch);
