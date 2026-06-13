import { NextRequest, NextResponse } from "next/server";
import { hermesAIJSON } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { red_flags, user_id } = await req.json();
    if (!red_flags || !Array.isArray(red_flags)) {
      return NextResponse.json({ error: "red_flags (array) requis" }, { status: 400 });
    }

    // TODO: query DB for users with similar red_flags
    // Pour l'instant, on génère l'analyse
    const result = await hermesAIJSON<{
      ick_cluster: string;
      compatibility_message: string;
      red_flag_analysis: string;
    }>(
      `Analyse ces red flags / aversions d'un utilisateur d'app de rencontre gay :
${red_flags.map((f: string) => `- ${f}`).join("\n")}

Retourne un objet JSON :
- "ick_cluster": nom du cluster de haine commune (ex: "Les anti-brunch", "Team ponctualité")
- "compatibility_message": message drôle sur pourquoi ces aversions créent une connexion
- "red_flag_analysis": analyse courte de ce que ces red flags disent de la personnalité`,

      "Tu es Hermes, l'IA de Embir.xyz. Tu es expert en psychologie du dating gay et tu sais que ce qu'on déteste en dit plus long que ce qu'on aime. Drôle et perspicace. Réponds en français."
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Compatibility error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
