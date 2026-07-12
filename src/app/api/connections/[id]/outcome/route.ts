import { NextRequest, NextResponse } from "next/server";
import type { ConnectionState, PrivateOutcome } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withApiLogging } from "@/lib/api-logger";
import { authorizeConnection } from "@/lib/connection-policy";

const OUTCOMES = ["CONTINUE", "FRIENDS", "PAUSE", "CLOSE", "REPORT"] as const satisfies readonly PrivateOutcome[];
const OUTCOME_STATES: ConnectionState[] = [
  "RECIPROCAL",
  "REVEAL_PENDING",
  "REVEAL_COMPLETED",
  "CONVERSATION",
  "PLAN_PROPOSED",
  "PLAN_CONFIRMED",
  "MET",
  "CONTINUE",
  "FRIENDS",
  "PAUSED",
];

async function handleGet(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const access = await authorizeConnection(prisma, auth.id, id);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  const outcome = await prisma.connectionOutcome.findUnique({
    where: { matchId_userId: { matchId: id, userId: auth.id } },
    select: { outcome: true, note: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json({ outcome });
}

async function handlePost(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.outcome !== "string" || !OUTCOMES.includes(body.outcome as PrivateOutcome)) {
    return NextResponse.json({ error: "Retour invalide" }, { status: 400 });
  }
  if (body.note !== undefined && (typeof body.note !== "string" || body.note.length > 500)) {
    return NextResponse.json({ error: "Note trop longue" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`embir-outcome:${id}`}))::text`;
      const access = await authorizeConnection(tx, auth.id, id);
      if (!access.ok) throw new Response(JSON.stringify({ error: access.error }), { status: access.status });
      const match = access.value;
      if (
        match.status !== "mutual" ||
        !OUTCOME_STATES.includes(match.state)
      ) {
        throw new Response(
          JSON.stringify({ error: "Cette connexion est déjà clôturée" }),
          { status: 409 },
        );
      }
      const otherId = access.value.otherId;
      const outcome = body.outcome as PrivateOutcome;
      const saved = await tx.connectionOutcome.upsert({
        where: { matchId_userId: { matchId: match.id, userId: auth.id } },
        update: { outcome, note: typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null },
        create: { matchId: match.id, userId: auth.id, outcome, note: typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null },
      });
      const allOutcomes = await tx.connectionOutcome.findMany({
        where: { matchId: match.id },
        select: { userId: true, outcome: true },
      });
      const now = new Date();
      let nextState = match.state;
      let analyticsEvent: "connection_paused" | "connection_closed" | "report_submitted" | null = null;

      if (outcome === "PAUSE") {
        nextState = "PAUSED";
        analyticsEvent = "connection_paused";
      } else if (outcome === "CLOSE") {
        nextState = "CLOSED";
        analyticsEvent = "connection_closed";
      } else if (outcome === "REPORT") {
        nextState = "PAUSED";
        analyticsEvent = "report_submitted";
        await tx.userReport.create({
          data: {
            reporterId: auth.id,
            reportedUserId: otherId,
            targetType: "connection",
            targetId: match.id,
            reason: "post_connection_safety",
            details: typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null,
          },
        });
      } else if (allOutcomes.length === 2 && allOutcomes.every((item) => item.outcome === "CONTINUE")) {
        nextState = "CONTINUE";
      } else if (allOutcomes.length === 2 && allOutcomes.every((item) => item.outcome === "FRIENDS")) {
        nextState = "FRIENDS";
      }

      if (nextState !== match.state) {
        await tx.match.update({ where: { id: match.id }, data: { state: nextState, lastTransitionAt: now } });
        await tx.connectionEvent.create({
          data: { matchId: match.id, actorId: auth.id, fromState: match.state, toState: nextState, metadata: { privateOutcomeRecorded: true } },
        });
      }
      if (analyticsEvent) {
        await tx.analyticsEvent.create({
          data: {
            eventId: crypto.randomUUID(),
            eventName: analyticsEvent,
            eventVersion: 1,
            userId: auth.id,
            occurredAt: now,
            properties: { matchId: match.id },
          },
        });
      }
      if (outcome === "PAUSE" || outcome === "CLOSE") {
        await tx.notification.upsert({
          where: { dedupeKey: `connection-${outcome.toLowerCase()}:${match.id}:${otherId}` },
          update: {},
          create: {
            userId: otherId,
            type: outcome === "PAUSE" ? "connection_paused" : "connection_closed",
            title: outcome === "PAUSE" ? "Connexion mise en pause" : "Connexion clôturée",
            body: outcome === "PAUSE"
              ? "Cette connexion est en pause. Aucun détail privé n’est partagé."
              : "Cette connexion a été clôturée respectueusement.",
            link: "/dashboard",
            dedupeKey: `connection-${outcome.toLowerCase()}:${match.id}:${otherId}`,
          },
        });
      }
      return { outcome: saved, state: nextState };
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Connection outcome error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
