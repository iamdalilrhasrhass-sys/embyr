import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { createPayment, isAllopassConfigured, ALLOPASS_PLANS } from "@/lib/allopass";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://feminia.xyz";
const BACKEND_URL = process.env.BACKEND_URL || "https://feminia.xyz";

export async function POST(req: NextRequest) {
  try {
    if (!isAllopassConfigured()) {
      return NextResponse.json({
        error: "allopass_not_configured",
        message: "Paiement par SMS/téléphone pas encore configuré.",
      }, { status: 503 });
    }

    // Vérifier l'auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { plan, paymentMethod } = await req.json();
    const planConfig = ALLOPASS_PLANS[plan];

    if (!planConfig) {
      return NextResponse.json({
        error: "invalid_plan",
        message: `Plan "${plan}" non reconnu.`,
      }, { status: 400 });
    }

    const reference = `${payload.userId}_${plan}_${Date.now()}`;

    const payment = await createPayment({
      amount: planConfig.amount,
      currency: "EUR",
      country: "FR",
      description: planConfig.description,
      reference,
      returnUrl: `${FRONTEND_URL}/dashboard?checkout=success&method=allopass`,
      notifyUrl: `${BACKEND_URL}/api/payments/allopass/webhook`,
      paymentMethods: paymentMethod ? [paymentMethod] : ["sms", "audiotel"],
      endUserId: payload.userId,
      email: payload.email,
    });

    return NextResponse.json({
      url: payment.paymentUrl,
      transactionId: payment.transactionId,
      instructions: payment.instructions,
    });
  } catch (e) {
    const error = e as Error;
    console.error("[allopass/payment] error:", error.message);
    return NextResponse.json({
      error: "payment_failed",
      message: "Erreur lors de la création du paiement.",
    }, { status: 500 });
  }
}
