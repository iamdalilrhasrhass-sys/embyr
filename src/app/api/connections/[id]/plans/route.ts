import { NextRequest, NextResponse } from "next/server";
import type { SignalFormat } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withApiLogging } from "@/lib/api-logger";
import { authorizeConnection } from "@/lib/connection-policy";
import { getServerFeatureFlag } from "@/lib/feature-flags";

const FORMATS = ["DISCUSSION", "CAFE", "BALADE", "SPORT", "SORTIE", "ACTIVITE", "AUTRE"] as const satisfies readonly SignalFormat[];
const PLANNABLE_STATES = [
  "REVEAL_COMPLETED",
  "CONVERSATION",
  "PLAN_PROPOSED",
  "PLAN_CONFIRMED",
  "MET",
  "CONTINUE",
  "FRIENDS",
] as const;

async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const access = await authorizeConnection(prisma, auth.id, id);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  const plans = await prisma.datePlan.findMany({
    where: { matchId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      proposerId: true,
      proposedAt: true,
      format: true,
      publicPlace: true,
      approximateArea: true,
      status: true,
      acceptedAt: true,
      cancelledAt: true,
      safetySharedAt: true,
      createdAt: true,
    },
  });
  const now = new Date();
  return NextResponse.json({
    plans: plans.map(({ proposerId, ...plan }) => ({
      ...plan,
      canAccept:
        proposerId !== auth.id &&
        plan.proposedAt > now &&
        ["PROPOSED", "RESCHEDULED"].includes(plan.status),
      canReschedule: proposerId === auth.id && ["PROPOSED", "RESCHEDULED", "CONFIRMED"].includes(plan.status),
      canCancel: ["PROPOSED", "RESCHEDULED", "CONFIRMED"].includes(
        plan.status,
      ),
    })),
  });
}

async function handlePost(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const planFlag = await getServerFeatureFlag("date_planning", { userId: auth.id });
  if (!planFlag.enabled) {
    return NextResponse.json({ error: "La proposition de rencontre est temporairement indisponible" }, { status: 404 });
  }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const proposedAt = new Date(String(body?.proposedAt ?? ""));
  const format = body?.format;
  const now = new Date();
  if (
    Number.isNaN(proposedAt.getTime()) ||
    proposedAt <= now ||
    proposedAt > new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  ) {
    return NextResponse.json({ error: "Créneau invalide" }, { status: 400 });
  }
  if (typeof format !== "string" || !FORMATS.includes(format as SignalFormat)) {
    return NextResponse.json({ error: "Format invalide" }, { status: 400 });
  }
  const publicPlace = typeof body?.publicPlace === "string" ? body.publicPlace.trim().slice(0, 120) : null;
  const approximateArea = typeof body?.approximateArea === "string" ? body.approximateArea.trim().slice(0, 80) : null;
  if (!publicPlace && !approximateArea) {
    return NextResponse.json({ error: "Indique un lieu public ou une zone approximative" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`embir-plan:${id}`}))::text`;
      const access = await authorizeConnection(tx, auth.id, id);
      if (!access.ok) throw new Response(JSON.stringify({ error: access.error }), { status: access.status });
      const match = access.value;
      if (!PLANNABLE_STATES.includes(match.state as typeof PLANNABLE_STATES[number])) {
        throw new Response(JSON.stringify({ error: "La connexion doit d’abord atteindre la conversation" }), { status: 409 });
      }
      const otherId = access.value.otherId;

      const plan = await tx.datePlan.create({
        data: {
          matchId: match.id,
          proposerId: auth.id,
          proposedAt,
          format: format as SignalFormat,
          publicPlace,
          approximateArea,
        },
      });
      await tx.match.update({
        where: { id: match.id },
        data: { state: "PLAN_PROPOSED", lastTransitionAt: now },
      });
      await tx.connectionEvent.create({
        data: { matchId: match.id, actorId: auth.id, fromState: match.state, toState: "PLAN_PROPOSED", metadata: { planId: plan.id } },
      });
      await tx.analyticsEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventName: "plan_proposed",
          eventVersion: 1,
          userId: auth.id,
          occurredAt: now,
          properties: { matchId: match.id, planId: plan.id, format: plan.format },
        },
      });
      await tx.notification.upsert({
        where: { dedupeKey: `plan:${plan.id}:${otherId}` },
        update: {},
        create: {
          userId: otherId,
          type: "plan_proposed",
          title: "Une rencontre est proposée",
          body: "Une proposition concrète vous attend. Tu gardes le contrôle.",
          link: `/connections/${match.id}`,
          dedupeKey: `plan:${plan.id}:${otherId}`,
        },
      });
      return plan;
    });
    return NextResponse.json({ plan: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Plan proposal error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handlePatch(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.planId !== "string" || !["accept", "cancel", "reschedule", "mark_safety_shared"].includes(String(body.action))) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`embir-plan:${id}`}))::text`;
      const access = await authorizeConnection(tx, auth.id, id);
      if (!access.ok) throw new Response(JSON.stringify({ error: access.error }), { status: access.status });
      const match = access.value;
      if (
        match.status !== "mutual" ||
        !PLANNABLE_STATES.includes(
          match.state as (typeof PLANNABLE_STATES)[number],
        )
      ) {
        throw new Response(
          JSON.stringify({ error: "La connexion n’accepte plus de modification de rencontre" }),
          { status: 409 },
        );
      }
      const plan = await tx.datePlan.findFirst({ where: { id: body.planId as string, matchId: match.id } });
      if (!plan) throw new Response(JSON.stringify({ error: "Proposition introuvable" }), { status: 404 });
      const now = new Date();

      if (body.action === "accept") {
        if (plan.proposerId === auth.id) throw new Response(JSON.stringify({ error: "La confirmation doit venir de l’autre personne" }), { status: 409 });
        if (plan.status === "CONFIRMED") return plan;
        if (!['PROPOSED', 'RESCHEDULED'].includes(plan.status)) throw new Response(JSON.stringify({ error: "Transition invalide" }), { status: 409 });
        if (plan.proposedAt <= now) {
          throw new Response(
            JSON.stringify({ error: "Ce créneau est déjà passé" }),
            { status: 409 },
          );
        }
        const updated = await tx.datePlan.update({ where: { id: plan.id }, data: { status: "CONFIRMED", acceptedAt: now } });
        await tx.match.update({ where: { id: match.id }, data: { state: "PLAN_CONFIRMED", lastTransitionAt: now } });
        await tx.connectionEvent.create({ data: { matchId: match.id, actorId: auth.id, fromState: match.state, toState: "PLAN_CONFIRMED", metadata: { planId: plan.id } } });
        await tx.analyticsEvent.create({ data: { eventId: crypto.randomUUID(), eventName: "plan_accepted", eventVersion: 1, userId: auth.id, occurredAt: now, properties: { matchId: match.id, planId: plan.id } } });
        await tx.notification.upsert({
          where: { dedupeKey: `plan-confirmed:${plan.id}:${plan.proposerId}` },
          update: {},
          create: {
            userId: plan.proposerId,
            type: "meeting_confirmed",
            title: "Rencontre confirmée",
            body: "Votre proposition a été acceptée. Retrouvez les détails dans votre connexion.",
            link: `/connections/${match.id}`,
            dedupeKey: `plan-confirmed:${plan.id}:${plan.proposerId}`,
          },
        });
        return updated;
      }

      if (body.action === "cancel") {
        if (plan.status === "CANCELLED") return plan;
        if (!["PROPOSED", "RESCHEDULED", "CONFIRMED"].includes(plan.status)) {
          throw new Response(JSON.stringify({ error: "Transition invalide" }), { status: 409 });
        }
        const updated = await tx.datePlan.update({ where: { id: plan.id }, data: { status: "CANCELLED", cancelledAt: now } });
        await tx.match.update({ where: { id: match.id }, data: { state: "CONVERSATION", lastTransitionAt: now } });
        await tx.connectionEvent.create({ data: { matchId: match.id, actorId: auth.id, fromState: match.state, toState: "CONVERSATION", metadata: { planId: plan.id, reason: "cancelled" } } });
        await tx.analyticsEvent.create({ data: { eventId: crypto.randomUUID(), eventName: "plan_cancelled", eventVersion: 1, userId: auth.id, occurredAt: now, properties: { matchId: match.id, planId: plan.id } } });
        return updated;
      }

      if (body.action === "reschedule") {
        if (plan.proposerId !== auth.id) {
          throw new Response(JSON.stringify({ error: "Seule la personne qui a proposé peut modifier ce créneau" }), { status: 409 });
        }
        if (!["PROPOSED", "RESCHEDULED", "CONFIRMED"].includes(plan.status)) {
          throw new Response(JSON.stringify({ error: "Transition invalide" }), { status: 409 });
        }
        const next = new Date(String(body.proposedAt ?? ""));
        if (Number.isNaN(next.getTime()) || next <= now || next > new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)) {
          throw new Response(JSON.stringify({ error: "Nouveau créneau invalide" }), { status: 400 });
        }
        const updated = await tx.datePlan.update({ where: { id: plan.id }, data: { status: "RESCHEDULED", proposedAt: next, acceptedAt: null } });
        await tx.match.update({ where: { id: match.id }, data: { state: "PLAN_PROPOSED", lastTransitionAt: now } });
        await tx.notification.upsert({
          where: { dedupeKey: `plan-rescheduled:${plan.id}:${next.toISOString()}:${access.value.otherId}` },
          update: {},
          create: {
            userId: access.value.otherId,
            type: "plan_proposed",
            title: "Nouveau créneau proposé",
            body: "Le créneau de votre rencontre a été modifié et attend votre confirmation.",
            link: `/connections/${match.id}`,
            dedupeKey: `plan-rescheduled:${plan.id}:${next.toISOString()}:${access.value.otherId}`,
          },
        });
        return updated;
      }

      if (plan.status !== "CONFIRMED") {
        throw new Response(JSON.stringify({ error: "La rencontre doit d’abord être confirmée" }), { status: 409 });
      }
      return tx.datePlan.update({ where: { id: plan.id }, data: { safetySharedAt: plan.safetySharedAt ?? now } });
    });
    return NextResponse.json({ plan: result });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Plan update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
export const PATCH = withApiLogging(handlePatch);
