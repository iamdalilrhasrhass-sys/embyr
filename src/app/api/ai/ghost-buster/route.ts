import { NextRequest, NextResponse } from "next/server";
import { hermesAI } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { last_message, silence_hours, context } = await req.json();
    if (!last_message) {
      return NextResponse.json({ error: "Dernier message requis" }, { status: 400 });
    }

    const hours = silence_hours || 48;
    const result = await hermesAI(
      `Génère UNE relance irrésistible pour quelqu'un qui n'a pas répondu depuis ${hours}h.

Dernier message envoyé (qui a été ignoré) : "${last_message}"
${context ? `Contexte additionnel : ${context}` : ""}

Règles :
- Sois créatif, drôle, pas désespéré
- Une seule phrase, max 200 caractères
- Style "high value", zéro needy
- Format : retourne juste la phrase, sans guillemets, sans explication`,

      "Tu es Hermes, le coach dating de Embyr.xyz. Tu es expert en relances qui marchent. Tu es drôle, confiant, jamais needy. Réponds en français."
    );

    return NextResponse.json({ success: true, message: result.trim() });
  } catch (error: any) {
    console.error("Ghost buster error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
