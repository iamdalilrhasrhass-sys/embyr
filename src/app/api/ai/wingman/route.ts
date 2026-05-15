import { NextRequest, NextResponse } from "next/server";
import { hermesAIJSON } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { chat_history, profile_context } = await req.json();
    if (!chat_history || !Array.isArray(chat_history)) {
      return NextResponse.json({ error: "chat_history (array) requis" }, { status: 400 });
    }

    const result = await hermesAIJSON<{
      options: { type: string; text: string; vibe: string }[];
    }>(
      `Voici une conversation sur une app de rencontre gay :
${chat_history.map((m: string, i: number) => `${i % 2 === 0 ? "Moi" : "Lui"}: ${m}`).join("\n")}
${profile_context ? `\nContexte du profil : ${profile_context}` : ""}

Suggère 3 réponses possibles pour CONTINUER la conversation. 
Retourne un objet JSON avec "options", un tableau de 3 objets :
- "type": "drôle" | "mystérieux" | "direct" | "charmeur" | "provoc"
- "text": le texte de la réponse (max 200 chars)
- "vibe": l'énergie en un mot (ex: "taquin", "chill", "audacieux")`,

      "Tu es Hermes, le wingman IA de Embyr.xyz, l'app de rencontre gay. Tu aides les mecs à briller en conversation. Tu es drôle, confiant, et tu connais tous les codes du dating gay. Réponds en français."
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Wingman error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
