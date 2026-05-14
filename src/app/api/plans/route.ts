import { NextResponse } from "next/server";

export async function GET() {
  // Return plan info — price_ids presence indicates Stripe is configured
  const plans = [
    {
      id: "24h",
      name: "24h",
      price: 2.49,
      priceLabel: "2,49€",
      period: "jour",
      features: ["Accès complet", "Messagerie illimitée"],
      popular: false,
      stripeConfigured: !!process.env.STRIPE_PRICE_DECOUVERTE_24H,
    },
    {
      id: "premium",
      name: "Premium",
      price: 14.99,
      priceLabel: "14,99€",
      period: "mois",
      features: ["Messagerie illimitée", "Albums privés", "Visiteurs", "Mode discret"],
      popular: true,
      stripeConfigured: !!process.env.STRIPE_PRICE_PREMIUM_1M,
    },
    {
      id: "vip",
      name: "VIP",
      price: 69.99,
      priceLabel: "69,99€",
      period: "an",
      features: ["Tout Premium", "Économie -61%", "Badge VIP", "Support prioritaire"],
      popular: false,
      stripeConfigured: !!process.env.STRIPE_PRICE_PREMIUM_12M,
    },
  ];

  return NextResponse.json({ plans, stripeReady: !!process.env.STRIPE_SECRET_KEY });
}
