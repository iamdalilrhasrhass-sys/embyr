import { NextRequest, NextResponse } from "next/server";
import { hermesAI } from "@/lib/ai-client";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "text et targetLang sont requis" },
        { status: 400 }
      );
    }

    // Si sourceLang est fourni, on l'utilise ; sinon on demande à l'IA de le détecter + traduire
    const sourceInstruction = sourceLang
      ? `Traduis ce texte du ${sourceLang} vers le ${targetLang}.`
      : `Détecte la langue de ce texte puis traduis-le vers le ${targetLang}.`;

    const system = `Tu es un traducteur professionnel. Ta mission : traduire un message d'une langue à une autre de façon naturelle et fluide, en conservant le ton et l'intention d'origine.

${sourceInstruction}

RÈGLES STRICTES :
- Réponds UNIQUEMENT avec un objet JSON valide au format suivant, sans markdown, sans backticks, sans texte autour.
- Le JSON doit contenir : { "translatedText": "la traduction", "sourceLang": "code ISO 639-1 de la langue source détectée", "targetLang": "${targetLang}" }
- Ne JAMAIS inventer ou modifier le sens du message.
- Conserve les emojis.
- Si le texte est déjà en ${targetLang}, retourne le texte tel quel avec sourceLang = "${targetLang}".`;

    const raw = await hermesAI(
      `Texte à traduire : "${text}"`,
      system
    );

    // Nettoyer la réponse : enlever les backticks markdown éventuels
    const clean = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const result = JSON.parse(clean);

    return NextResponse.json({
      translatedText: result.translatedText || text,
      sourceLang: result.sourceLang || sourceLang || "unknown",
      targetLang,
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Erreur de traduction" },
      { status: 500 }
    );
  }
}
