import { NextRequest, NextResponse } from "next/server";
import { hermesAIJSON } from "@/lib/ai-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { answers, profile } = await req.json();
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "answers (array) requis" }, { status: 400 });
    }

    // Vérifie si l'utilisateur existe
    if (profile?.userId) {
      const existing = await prisma.profile.findUnique({ where: { userId: profile.userId } });
      if (!existing) {
        return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
      }
    }

    const result = await hermesAIJSON<{
      status: "accepted" | "rejected" | "waitlist";
      verdict: string;
      personality_tags: string[];
      feedback: string;
    }>(
      `Évalue si cet utilisateur a la "vibe" pour rejoindre Embir, une app de rencontre gay exclusive.

Profil: ${profile?.bio || "non spécifié"}
Réponses au mini-entretien :
${answers.map((a: string, i: number) => `Q${i + 1}: ${a}`).join("\n")}

Critères :
- Originalité / authenticité
- Humour / second degré
- Énergie / vibe générale

Retourne un objet JSON :
- "status": "accepted" (accepté), "rejected" (refusé poli), ou "waitlist" (liste d'attente)
- "verdict": verdict en une phrase drôle (style physionomiste de boîte de nuit)
- "personality_tags": 3 tags qui décrivent la personnalité
- "feedback": feedback constructif si refusé, ou compliment si accepté`,

      "Tu es Hermes, le physionomiste IA de Embir.xyz, un club de rencontre gay exclusif. Tu es drôle, exigeant, mais juste. Tu sais repérer les personnalités intéressantes. Réponds en français."
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Bouncer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
