import { NextResponse } from "next/server";

/**
 * Webhook Allopass — reçoit les notifications de paiement
 * Allopass nous notifie quand un paiement SMS/Audiotel est confirmé
 */
export async function POST() {
  return NextResponse.json(
    { error: "allopass_disabled" },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
