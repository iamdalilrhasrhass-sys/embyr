import { NextRequest, NextResponse } from "next/server";
import { hermesAIJSON } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { bio, interests } = await req.json();
    if (!bio) return NextResponse.json({ error: "Bio requise" }, { status: 400 });

    const result = await hermesAIJSON<{
      aura_name: string;
      color_hex: string;
      color_hex_secondary: string;
      dominant_trait: string;
      vibe_score: number;
      story_caption: string;
      roast: string;
      glow_up: string;
    }>(
      `Analyse ce profil de rencontre gay :
Bio: "${bio}"
Intérêts: ${(interests || []).join(", ") || "non spécifiés"}

Retourne un objet JSON avec :
- "aura_name": un nom d'aura stylé en français (ex: "Néon Solaire", "Cyber-Mystic", "Velours Pourpre")
- "color_hex": couleur principale en hex (ex: "#FF00ED")
- "color_hex_secondary": couleur secondaire en hex
- "dominant_trait": le trait de personnalité dominant
- "vibe_score": score de 0 à 100
- "story_caption": texte viral prêt à être partagé en story Instagram (max 150 chars)
- "roast": un roast drôle et piquant (2 phrases, max 200 chars)
- "glow_up": un conseil pour améliorer le profil (1 phrase)`,

      "Tu es Hermes, l'IA de Embyr.xyz, une app de rencontre gay nouvelle génération. Tu es un expert en psychologie, créatif, drôle, impertinent mais bienveillant. Tu officies comme 'conseiller en personnalité numérique'. Réponds en français."
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Aura error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
