import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

type StripeClient = import("stripe").default;
let stripePromise: Promise<StripeClient> | null = null;

async function getStripe(): Promise<StripeClient | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  stripePromise ??= import("stripe").then(({ default: Stripe }) => new Stripe(secret));
  return stripePromise;
}

function priceIds(): Record<string, string | undefined> {
  return {
    premium_1w: process.env.STRIPE_PRICE_PREMIUM_1W,
    premium_1m: process.env.STRIPE_PRICE_PREMIUM_1M,
    premium_3m: process.env.STRIPE_PRICE_PREMIUM_3M,
    premium_12m: process.env.STRIPE_PRICE_PREMIUM_12M,
    decouverte_24h: process.env.STRIPE_PRICE_DECOUVERTE_24H,
    boost_24h: process.env.STRIPE_PRICE_BOOST_24H,
    highlight_7d: process.env.STRIPE_PRICE_HIGHLIGHT_7D,
  };
}

function frontendOrigin(): string {
  try {
    const configured = new URL(process.env.FRONTEND_URL || "https://embir.xyz");
    if (configured.protocol === "https:" || (process.env.NODE_ENV !== "production" && configured.protocol === "http:")) {
      return configured.origin;
    }
  } catch {}
  return "https://embir.xyz";
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (process.env.PAYMENTS_ENABLED !== "true") {
      return NextResponse.json({ error: "payments_disabled" }, { status: 503 });
    }

    const stripe = await getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "stripe_not_configured", message: "Le paiement n'est pas encore configuré." }, { status: 503 });
    }

    const body = await req.json().catch(() => null) as { priceId?: unknown } | null;
    const plan = typeof body?.priceId === "string" ? body.priceId : "";
    const stripePriceId = priceIds()[plan];

    if (!stripePriceId) {
      return NextResponse.json({
        error: "invalid_plan",
        message: `Plan non configuré côté serveur. (${plan})`
      }, { status: 400 });
    }

    // Determine mode: fast options and boosts might be one-time, premium might be subscription
    // If it's a recurring plan, use subscription, else payment
    const isSubscription = plan.startsWith("premium_");

    const baseUrl = frontendOrigin();
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancel`,
      allow_promotion_codes: true,
      customer_email: auth.email,
      metadata: {
        user_id: auth.id,
        plan,
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata: { user_id: auth.id, plan },
            },
          }
        : {}),
    });

    if (!session.url) return NextResponse.json({ error: "checkout_unavailable" }, { status: 502 });
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (e) {
    console.error("[stripe/checkout] error:", (e as Error).message);
    return NextResponse.json({ error: "checkout_failed", message: "Erreur lors de la création du paiement." }, { status: 500 });
  }
}
