import { NextRequest, NextResponse } from "next/server";
import { checkTransaction } from "@/lib/allopass";

/**
 * Webhook Allopass — reçoit les notifications de paiement
 * Allopass nous notifie quand un paiement SMS/Audiotel est confirmé
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transaction_id, status, reference, signature } = body;

    console.log("[Allopass Webhook] received:", { transaction_id, status, reference });

    if (!transaction_id || !status) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    // Vérifier la signature (à implémenter avec le secret Allopass)
    // const expectedSig = generateSignature(body, process.env.ALLOPASS_SECRET_KEY!)
    // if (signature !== expectedSig) {
    //   return NextResponse.json({ error: "invalid_signature" }, { status: 403 });
    // }

    // Extraire les infos de la référence: userId_plan_timestamp
    const [userId, plan] = reference.split("_");

    if (status === "completed") {
      console.log(`[Allopass] Paiement réussi: user=${userId}, plan=${plan}`);
      
      // TODO: Mettre à jour l'utilisateur en base de données
      // await updateUserSubscription(userId, plan);
      
      // TODO: Envoyer notification à l'utilisateur
    } else if (status === "failed") {
      console.log(`[Allopass] Paiement échoué: user=${userId}, plan=${plan}`);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const error = e as Error;
    console.error("[Allopass Webhook] error:", error.message);
    return NextResponse.json({ error: "webhook_error" }, { status: 500 });
  }
}
