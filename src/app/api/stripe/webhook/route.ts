import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type StripeClient = import("stripe").default;
type PlanConfig = {
  label: string;
  days: number;
  isPremium: boolean;
};

let stripePromise: Promise<StripeClient> | null = null;

const PLAN_DURATIONS = {
  decouverte_24h: { label: "Découverte 24h", days: 1, isPremium: true },
  premium_1w: { label: "Premium 1 semaine", days: 7, isPremium: true },
  premium_1m: { label: "Premium 1 mois", days: 30, isPremium: true },
  premium_3m: { label: "Premium 3 mois", days: 90, isPremium: true },
  premium_12m: { label: "Premium 12 mois", days: 365, isPremium: true },
  highlight_7d: { label: "Option annuelle", days: 365, isPremium: true },
  boost_24h: { label: "Option 24h", days: 1, isPremium: false },
} as const satisfies Record<string, PlanConfig>;

type PlanSlug = keyof typeof PLAN_DURATIONS;

function planSlug(value: unknown): PlanSlug | null {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(PLAN_DURATIONS, value)
    ? value as PlanSlug
    : null;
}

async function getStripe(): Promise<StripeClient | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  stripePromise ??= import("stripe").then(({ default: Stripe }) => new Stripe(secret));
  return stripePromise;
}

function externalId(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0 && value.length <= 255) return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" && id.length <= 255 ? id : null;
  }
  return null;
}

async function requireActiveBillingUser(userId: string) {
  if (!userId || userId.length > 64) throw new Error("invalid_billing_user");
  const user = await prisma.user.findFirst({
    where: { id: userId, bannedAt: null, deletedAt: null },
    select: { id: true, profile: { select: { id: true } } },
  });
  if (!user?.profile) throw new Error("billing_user_unavailable");
}

async function subscriptionPeriodEnd(stripe: StripeClient, subscriptionId: string): Promise<Date> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as {
    current_period_end?: number;
  };
  if (!Number.isFinite(subscription.current_period_end)) throw new Error("invalid_subscription_period");
  const periodEnd = new Date((subscription.current_period_end as number) * 1000);
  if (!Number.isFinite(periodEnd.getTime()) || periodEnd <= new Date()) {
    throw new Error("invalid_subscription_period");
  }
  return periodEnd;
}

async function activatePlan(input: {
  userId: string;
  plan: PlanSlug;
  providerSubscriptionId: string;
  expiresAt: Date;
}) {
  await requireActiveBillingUser(input.userId);
  const config = PLAN_DURATIONS[input.plan];

  await prisma.$transaction(async (tx) => {
    const existing = await tx.subscription.findFirst({
      where: { provider: "stripe", providerSubscriptionId: input.providerSubscriptionId },
      select: { id: true, userId: true },
    });
    if (existing && existing.userId !== input.userId) throw new Error("subscription_owner_mismatch");

    if (existing) {
      await tx.subscription.update({
        where: { id: existing.id },
        data: { status: "ACTIVE", expiresAt: input.expiresAt, canceledAt: null },
      });
    } else {
      await tx.subscription.create({
        data: {
          userId: input.userId,
          status: "ACTIVE",
          provider: "stripe",
          providerSubscriptionId: input.providerSubscriptionId,
          startedAt: new Date(),
          expiresAt: input.expiresAt,
        },
      });
    }

    if (config.isPremium) {
      const profile = await tx.profile.findUnique({
        where: { userId: input.userId },
        select: { premiumUntil: true },
      });
      const premiumUntil = profile?.premiumUntil && profile.premiumUntil > input.expiresAt
        ? profile.premiumUntil
        : input.expiresAt;
      await tx.profile.update({
        where: { userId: input.userId },
        data: { isPremium: true, premiumUntil },
      });
    }
  });
}

async function deactivateSubscription(providerSubscriptionId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { provider: "stripe", providerSubscriptionId },
    select: { id: true, userId: true },
  });
  if (!subscription) return;

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELLED", canceledAt: new Date() },
    });
    const remaining = await tx.subscription.findMany({
      where: {
        userId: subscription.userId,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
        id: { not: subscription.id },
      },
      select: { expiresAt: true },
      orderBy: { expiresAt: "desc" },
      take: 1,
    });
    await tx.profile.updateMany({
      where: { userId: subscription.userId },
      data: {
        isPremium: remaining.length > 0,
        premiumUntil: remaining[0]?.expiresAt ?? null,
      },
    });
  });
}

async function claimEvent(eventId: string, type: string): Promise<boolean> {
  try {
    await prisma.stripeEvent.create({ data: { id: eventId, type, status: "processing" } });
    return true;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      const reclaimed = await prisma.stripeEvent.updateMany({
        where: {
          id: eventId,
          status: "processing",
          processedAt: { lt: new Date(Date.now() - 15 * 60 * 1000) },
        },
        data: { type, processedAt: new Date() },
      });
      return reclaimed.count === 1;
    }
    throw error;
  }
}
async function processEvent(
  stripe: StripeClient,
  type: string,
  eventId: string,
  object: Record<string, unknown>,
) {
  if (type === "checkout.session.completed") {
    if (object.payment_status !== "paid") throw new Error("checkout_not_paid");
    const metadata = object.metadata && typeof object.metadata === "object"
      ? object.metadata as Record<string, unknown>
      : {};
    const userId = typeof metadata.user_id === "string" ? metadata.user_id : "";
    const plan = planSlug(metadata.plan);
    if (!userId || !plan) throw new Error("invalid_checkout_metadata");

    const stripeSubscriptionId = externalId(object.subscription);
    const config = PLAN_DURATIONS[plan];
    const expiresAt = stripeSubscriptionId
      ? await subscriptionPeriodEnd(stripe, stripeSubscriptionId)
      : new Date(Date.now() + config.days * 24 * 60 * 60 * 1000);
    await activatePlan({
      userId,
      plan,
      providerSubscriptionId: stripeSubscriptionId ?? `checkout:${eventId}`,
      expiresAt,
    });
    return;
  }

  if (type === "invoice.paid" || type === "invoice.payment_succeeded") {
    const stripeSubscriptionId = externalId(object.subscription);
    if (!stripeSubscriptionId) return;
    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId) as unknown as {
      current_period_end?: number;
      metadata?: Record<string, unknown>;
    };
    const plan = planSlug(stripeSubscription.metadata?.plan);
    if (!plan || !Number.isFinite(stripeSubscription.current_period_end)) {
      throw new Error("invalid_invoice_subscription");
    }
    const databaseSubscription = await prisma.subscription.findFirst({
      where: { provider: "stripe", providerSubscriptionId: stripeSubscriptionId },
      select: { userId: true },
    });
    if (!databaseSubscription) throw new Error("subscription_not_found");
    const expiresAt = new Date((stripeSubscription.current_period_end as number) * 1000);
    if (!Number.isFinite(expiresAt.getTime())) throw new Error("invalid_subscription_period");
    await activatePlan({ userId: databaseSubscription.userId, plan, providerSubscriptionId: stripeSubscriptionId, expiresAt });
    return;
  }

  if (type === "customer.subscription.deleted") {
    const stripeSubscriptionId = externalId(object.id);
    if (stripeSubscriptionId) await deactivateSubscription(stripeSubscriptionId);
  }
}

export async function POST(request: NextRequest) {
  if (process.env.PAYMENTS_ENABLED !== "true") {
    return NextResponse.json(
      { error: "payments_disabled" },
      { status: 410, headers: { "Cache-Control": "no-store" } },
    );
  }
  const stripe = await getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 1_000_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  const body = await request.text();
  if (body.length > 1_000_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  let event: import("stripe").default.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    const claimed = await claimEvent(event.id, event.type);
    if (!claimed) return NextResponse.json({ received: true, skipped: true });
    await processEvent(
      stripe,
      event.type,
      event.id,
      event.data.object as unknown as Record<string, unknown>,
    );
    await prisma.stripeEvent.update({
      where: { id: event.id },
      data: { status: "processed", processedAt: new Date() },
    });
    return NextResponse.json({ received: true });
  } catch {
    await prisma.stripeEvent.deleteMany({ where: { id: event.id, status: "processing" } }).catch(() => undefined);
    console.error("[stripe webhook] processing failed");
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
