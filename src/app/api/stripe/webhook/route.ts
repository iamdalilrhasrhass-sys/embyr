import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Pool } from "pg";

const SK = process.env.STRIPE_SECRET_KEY;
const WS = process.env.STRIPE_WEBHOOK_SECRET;

let stripe: any = null;
try {
  if (SK) {
    const Stripe = require("stripe");
    stripe = new Stripe(SK, { apiVersion: "2024-06-20" });
  }
} catch (e) {
  console.warn("[stripe webhook] init failed:", (e as Error).message);
}

// Use raw PG pool for idempotency (avoids Prisma model issues with adapter-pg)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Plan durations ────────────────────────────────────────
const PLAN_DURATIONS: Record<string, { label: string; days: number; isPremium: boolean; isBoost: boolean; isVIP: boolean }> = {
  decouverte_24h: { label: "Découverte 24h",      days: 1,    isPremium: true,  isBoost: false, isVIP: false },
  premium_1w:     { label: "Premium 1 semaine",    days: 7,    isPremium: true,  isBoost: false, isVIP: false },
  premium_1m:     { label: "Premium 1 mois",       days: 30,   isPremium: true,  isBoost: false, isVIP: false },
  premium_3m:     { label: "Premium 3 mois",       days: 90,   isPremium: true,  isBoost: false, isVIP: false },
  premium_12m:    { label: "Premium 12 mois",       days: 365,  isPremium: true,  isBoost: false, isVIP: false },
  highlight_7d:   { label: "VIP annuel",            days: 365,  isPremium: true,  isBoost: false, isVIP: true  },
  boost_24h:      { label: "Boost profil 24h",      days: 1,    isPremium: false, isBoost: true,  isVIP: false },
};

function getPlanConfig(planSlug: string) {
  return PLAN_DURATIONS[planSlug] || PLAN_DURATIONS.premium_1m;
}

// ── Event log helper ──────────────────────────────────────
function log(...args: any[]) {
  const ts = new Date().toISOString();
  console.log(`[stripe webhook] ${ts} —`, ...args);
}

// ── Activate plan for one-time payment ────────────────────
async function activateOneTimePlan(userId: string, planSlug: string, eventId: string) {
  const cfg = getPlanConfig(planSlug);
  const expiresAt = new Date(Date.now() + cfg.days * 86400_000);

  log(`plan=${planSlug} label="${cfg.label}" user=${userId} expiresAt=${expiresAt.toISOString()}`);

  // Create subscription record
  const sub = await prisma.subscription.create({
    data: {
      userId,
      status: "ACTIVE",
      provider: "stripe",
      providerSubscriptionId: `one_${eventId.slice(0, 14)}`,
      planId: null,
      startedAt: new Date(),
      expiresAt,
    },
  });
  log(`subscription created id=${sub.id}`);

  // Update profile
  if (cfg.isPremium) {
    await prisma.profile.update({
      where: { userId },
      data: {
        isPremium: true,
        premiumUntil: expiresAt,
        ...(cfg.isVIP ? { popularityScore: { increment: 100 } } : {}),
      },
    });
    log(`profile premium activated until ${expiresAt.toISOString()}`);
  }

  if (cfg.isBoost) {
    await prisma.profile.update({
      where: { userId },
      data: {
        popularityScore: { increment: 50 },
      },
    });
    log(`boost profile 24h set until ${expiresAt.toISOString()}`);
  }

  return sub;
}

// ── Activate/renew subscription plan ──────────────────────
async function activateSubscriptionPlan(userId: string, planSlug: string, expiryDate: Date, subId: string) {
  const cfg = getPlanConfig(planSlug);

  log(`plan=${planSlug} label="${cfg.label}" user=${userId} stripeSub=${subId} expiresAt=${expiryDate.toISOString()}`);

  const existing = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: subId },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: { status: "ACTIVE", expiresAt: expiryDate, startedAt: new Date() },
    });
    log(`subscription renewed id=${existing.id}`);
  } else {
    const sub = await prisma.subscription.create({
      data: {
        userId,
        status: "ACTIVE",
        provider: "stripe",
        providerSubscriptionId: subId,
        planId: null,
        startedAt: new Date(),
        expiresAt: expiryDate,
      },
    });
    log(`subscription created id=${sub.id}`);
  }

  if (cfg.isPremium) {
    await prisma.profile.update({
      where: { userId },
      data: {
        isPremium: true,
        premiumUntil: expiryDate,
        ...(cfg.isVIP ? { courtesyBadges: { set: ["vip"] } } : {}),
      },
    });
    log(`profile premium updated until ${expiryDate.toISOString()}`);
  }
}

// ── Deactivate user premium ───────────────────────────────
async function deactivatePremium(userId: string, reason: string) {
  await prisma.subscription.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "EXPIRED", canceledAt: new Date() },
  });

  await prisma.profile.update({
    where: { userId },
    data: { isPremium: false, premiumUntil: null },
  });

  log(`user=${userId} premium deactivated: ${reason}`);
}

// ──────────────────────────────────────────────────────────
// MAIN HANDLER
// ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!stripe || !WS) {
    log("Stripe not configured, skipping");
    return NextResponse.json({ received: true, note: "stripe_not_configured" });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  // Verify signature
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WS);
  } catch (e) {
    console.error(`[stripe webhook] ❌ SIGNATURE VERIFICATION FAILED: ${(e as Error).message}`);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const { type, id: eventId, data } = event;
  const obj = data?.object || {};

  log(`📩 EVENT received: ${type} (id=${eventId})`);

  // ── Idempotency: atomic check-and-mark (avoids race conditions) ──
  let isNewEvent = false;
  try {
    const result = await pool.query(
      'INSERT INTO "StripeEvent" (id, type, status, "processedAt") VALUES ($1, $2, $3, NOW()) ON CONFLICT (id) DO NOTHING RETURNING id',
      [eventId, type, "processing"]
    );
    isNewEvent = result.rows.length > 0;
  } catch (e) {
    log(`⚠️ idempotency table error (proceeding): ${(e as Error).message}`);
    isNewEvent = true; // proceed if we can't check
  }

  if (!isNewEvent) {
    log(`⏭️ SKIP (already processed): ${eventId}`);
    return NextResponse.json({ received: true, skipped: true });
  }

  // ── Process event ──────────────────────────────────
  let processingError: string | null = null;
  try {
    switch (type) {
      case "checkout.session.completed": {
        const session = obj;
        const userId = session.metadata?.user_id;
        const plan = (session.metadata?.plan || "premium_1m") as string;
        const stripeSubId = session.subscription;

        if (!userId) {
          log(`❌ no user_id in session metadata`);
          break;
        }

        log(`💰 CHECKOUT completed: user=${userId} plan=${plan} stripeSub=${stripeSubId || "one-time"}`);

        if (stripeSubId) {
          let periodEnd: Date;
          try {
            const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
            periodEnd = new Date(stripeSub.current_period_end * 1000);
          } catch (subErr) {
            const cfg = getPlanConfig(plan);
            periodEnd = new Date(Date.now() + cfg.days * 86400_000);
            log(`⚠️ sub fetch failed (${(subErr as Error).message}), using calculated end: ${periodEnd.toISOString()}`);
          }
          await activateSubscriptionPlan(userId, plan, periodEnd, stripeSubId);
        } else {
          await activateOneTimePlan(userId, plan, eventId);
        }

        log(`✅ DONE checkout: user=${userId} plan=${plan}`);
        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = obj;
        const stripeSubId = invoice.subscription;
        if (!stripeSubId) {
          log(`skipped invoice without subscription`);
          break;
        }

        let periodEnd: Date;
        let plan = "premium_1m";
        try {
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
          periodEnd = new Date(stripeSub.current_period_end * 1000);
          plan = (stripeSub.metadata?.plan || "premium_1m") as string;
        } catch (subErr) {
          log(`⚠️ sub fetch for invoice failed (${(subErr as Error).message}), skipping`);
          break;
        }

        const dbSub = await prisma.subscription.findFirst({
          where: { providerSubscriptionId: stripeSubId },
        });

        if (!dbSub) {
          log(`⚠️ INVOICE paid but no matching subscription: stripeSub=${stripeSubId}`);
          break;
        }

        await activateSubscriptionPlan(dbSub.userId, plan, periodEnd, stripeSubId);
        log(`✅ INVOICE paid: user=${dbSub.userId} plan=${plan} until=${periodEnd.toISOString()}`);
        break;
      }

      case "invoice.payment_failed": {
        const failInvoice = obj;
        const failSubId = failInvoice.subscription;
        if (!failSubId) break;

        const failSub = await prisma.subscription.findFirst({
          where: { providerSubscriptionId: failSubId },
        });

        if (failSub) {
          log(`⚠️ PAYMENT FAILED: user=${failSub.userId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const cancelledSub = obj;
        const cancelledId = cancelledSub.id;

        const existing = await prisma.subscription.findFirst({
          where: { providerSubscriptionId: cancelledId },
        });

        if (existing) {
          await deactivatePremium(existing.userId, "stripe_cancellation");
          log(`🗑️ CANCELLED: user=${existing.userId}`);
        }
        break;
      }

      default:
        log(`unhandled event type: ${type}`);
    }
  } catch (e) {
    const errMsg = (e as Error).message;
    processingError = errMsg;
    console.error(`[stripe webhook] 💥 ERROR handling ${type}: ${errMsg}`);
    console.error(`[stripe webhook] 💥 Stack:`, (e as Error).stack);
  }

  return NextResponse.json({ received: true });
}
