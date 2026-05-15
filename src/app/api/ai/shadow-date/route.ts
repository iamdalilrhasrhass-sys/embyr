import { NextRequest, NextResponse } from "next/server";
import { hermesAIJSON } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { profile_a, profile_b } = await req.json();
    if (!profile_a || !profile_b) {
      return NextResponse.json({ error: "Deux profils requis" }, { status: 400 });
    }

    const result = await hermesAIJSON<{
      dialogue_sample: string;
      success_rate: number;
      crash_score: number;
      common_icks: string[];
      chemistry: string;
      verdict: string;
    }>(
      `Simule un premier rendez-vous entre deux mecs sur une app de rencontre gay.

Profil A: "${profile_a.bio || profile_a}"
Profil B: "${profile_b.bio || profile_b}"

Retourne un objet JSON :
- "dialogue_sample": un extrait de dialogue de 5 répliques qui montre la dynamique
- "success_rate": pourcentage de chance que ça marche (0-100)
- "crash_score": pourcentage de chance que ça foire (0-100)
- "common_icks": 2-3 trucs qu'ils pourraient détester ensemble
- "chemistry": une phrase décrivant l'alchimie
- "verdict": verdict final drôle en une phrase (style "Ça passe crème" ou "Fuyez")`,

      "Tu es Hermes, l'IA de Embyr.xyz, expert en dating gay. Tu simules des premiers rendez-vous de façon drôle et perspicace. Réponds en français."
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Shadow date error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
