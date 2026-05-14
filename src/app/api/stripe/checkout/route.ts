import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const SK = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://embir.xyz";

let stripe: any = null;
try {
  if (SK) {
    const Stripe = require("stripe");
    stripe = new Stripe(SK, { apiVersion: "2024-06-20" });
  }
} catch (e) {
  console.warn("[stripe] init failed:", (e as Error).message);
}

// Map plan slugs to Stripe Price IDs
const PRICE_IDS: Record<string, string | undefined> = {
  "premium_1w": process.env.STRIPE_PRICE_PREMIUM_1W,
  "premium_1m": process.env.STRIPE_PRICE_PREMIUM_1M,
  "premium_3m": process.env.STRIPE_PRICE_PREMIUM_3M,
  "premium_12m": process.env.STRIPE_PRICE_PREMIUM_12M,
  "decouverte_24h": process.env.STRIPE_PRICE_DECOUVERTE_24H,
  "boost_24h": process.env.STRIPE_PRICE_BOOST_24H,
  "highlight_7d": process.env.STRIPE_PRICE_HIGHLIGHT_7D,
};

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "stripe_not_configured", message: "Le paiement n'est pas encore configuré." }, { status: 503 });
    }

    // Verify auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { priceId: plan } = await req.json();
    const stripePriceId = PRICE_IDS[plan];

    if (!stripePriceId) {
      return NextResponse.json({ 
        error: "invalid_plan", 
        message: `Plan non configuré côté serveur. (${plan})` 
      }, { status: 400 });
    }

    // Determine mode: fast options and boosts might be one-time, premium might be subscription
    // If it's a recurring plan, use subscription, else payment
    const isSubscription = plan.startsWith("premium_");

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pricing?checkout=cancel`,
      allow_promotion_codes: true,
      customer_email: payload.email,
      metadata: {
        user_id: payload.userId,
        plan,
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata: { user_id: payload.userId, plan },
            },
          }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe/checkout] error:", (e as Error).message);
    return NextResponse.json({ error: "checkout_failed", message: "Erreur lors de la création du paiement." }, { status: 500 });
  }
}
