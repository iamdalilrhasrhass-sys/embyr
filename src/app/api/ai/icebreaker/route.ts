import { NextRequest, NextResponse } from "next/server";
import { hermesAIJSON } from "@/lib/ai-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { user_a, user_b } = await req.json();
    if (!user_a || !user_b) {
      return NextResponse.json({ error: "Deux utilisateurs requis" }, { status: 400 });
    }

    const result = await hermesAIJSON<{
      question: string;
      context: string;
      category: string;
    }>(
      `Trouve un point commun OBSCUR et une question brise-glace pour ces deux profils :

Profil A: intérêts = ${JSON.stringify(user_a.interests || [])}, bio = "${user_a.bio || ""}"
Profil B: intérêts = ${JSON.stringify(user_b.interests || [])}, bio = "${user_b.bio || ""}"

Retourne un objet JSON :
- "question": une question ultra-spécifique, décalée et impossible à ignorer (ex: "Vous aimez tous les deux les champignons, demande-lui quel est le fungus le plus underrated")
- "context": pourquoi cette question va marcher
- "category": catégorie (humour, profond, geek, etc.)`,

      "Tu es Hermes, l'IA de Embir.xyz, expert en icebreakers pour dating gay. Tu trouves des connexions inattendues et crées des questions irrésistibles. Réponds en français."
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Icebreaker error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
