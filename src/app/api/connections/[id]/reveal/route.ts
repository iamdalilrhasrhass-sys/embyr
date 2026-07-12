import { NextRequest, NextResponse } from "next/server";
import type { ConnectionState } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withApiLogging } from "@/lib/api-logger";
import { authorizeConnection } from "@/lib/connection-policy";

function canonicalPair(first: string, second: string): [string, string] {
  return first < second ? [first, second] : [second, first];
}

const REVEAL_READABLE_STATES: ConnectionState[] = [
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

const REVEAL_RESPONDABLE_STATES: ConnectionState[] = [
  "RECIPROCAL",
  "REVEAL_PENDING",
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
  const match = access.value;
  if (
    match.status !== "mutual" ||
    !REVEAL_READABLE_STATES.includes(match.state)
  ) {
    return NextResponse.json({ error: "Connexion introuvable" }, { status: 404 });
  }
  const reveal = await prisma.connectionReveal.findFirst({
    where: { matchId: id },
    orderBy: { createdAt: "desc" },
    include: { responses: { select: { userId: true, content: true, createdAt: true } } },
  });
  if (!reveal) return NextResponse.json({ reveal: null });
  const bothResponded = reveal.responses.length >= 2;
  return NextResponse.json({
    reveal: {
      id: reveal.id,
      kind: reveal.kind,
      prompt: reveal.prompt,
      responded: reveal.responses.some((response) => response.userId === auth.id),
      bothResponded,
      completedAt: reveal.completedAt,
      responses: bothResponded
        ? reveal.responses.map((response) => ({
            isMine: response.userId === auth.id,
            content: response.content,
            createdAt: response.createdAt,
          }))
        : reveal.responses
            .filter((response) => response.userId === auth.id)
            .map((response) => ({ isMine: true, content: response.content, createdAt: response.createdAt })),
    },
  });
}

async function handlePost(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null) as { content?: unknown } | null;
  if (typeof body?.content !== "string" || !body.content.trim() || body.content.trim().length > 500) {
    return NextResponse.json({ error: "Réponse requise (500 caractères maximum)" }, { status: 400 });
  }
  const content = body.content.trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`embir-reveal:${id}`}))::text`;
      const access = await authorizeConnection(tx, auth.id, id);
      if (!access.ok) {
        throw new Response(JSON.stringify({ error: access.error }), { status: access.status });
      }
      const match = access.value;
      if (
        match.status !== "mutual" ||
        !REVEAL_READABLE_STATES.includes(match.state)
      ) {
        throw new Response(
          JSON.stringify({ error: "La résonance n’accepte plus de réponse" }),
          { status: 409 },
        );
      }

      let reveal = await tx.connectionReveal.findFirst({
        where: { matchId: id },
        orderBy: { createdAt: "desc" },
      });
      if (!REVEAL_RESPONDABLE_STATES.includes(match.state)) {
        if (!reveal?.completedAt) {
          throw new Response(
            JSON.stringify({ error: "La résonance n’accepte plus de réponse" }),
            { status: 409 },
          );
        }
        const responses = await tx.revealResponse.findMany({
          where: { revealId: reveal.id },
          orderBy: { createdAt: "asc" },
          select: { userId: true, content: true, createdAt: true },
        });
        if (!responses.some((response) => response.userId === auth.id)) {
          throw new Response(
            JSON.stringify({ error: "La résonance n’accepte plus de réponse" }),
            { status: 409 },
          );
        }
        const conversation = await tx.conversation.findUnique({
          where: { matchId: match.id },
          select: { id: true },
        });
        return {
          revealId: reveal.id,
          waiting: false,
          bothResponded: responses.length >= 2,
          responses: responses.map((response) => ({
            isMine: response.userId === auth.id,
            content: response.content,
            createdAt: response.createdAt,
          })),
          conversationId: conversation?.id ?? null,
        };
      }
      if (!reveal) {
        reveal = await tx.connectionReveal.create({
          data: { matchId: id, kind: "TEXT", prompt: "Quelle activité aimerais-tu partager bientôt ?" },
        });
        if (match.state === "RECIPROCAL") {
          const now = new Date();
          await tx.match.update({
            where: { id: match.id },
            data: { state: "REVEAL_PENDING", lastTransitionAt: now },
          });
          await tx.connectionEvent.create({
            data: {
              matchId: match.id,
              actorId: auth.id,
              fromState: "RECIPROCAL",
              toState: "REVEAL_PENDING",
            },
          });
        }
      }
      const existing = await tx.revealResponse.findUnique({
        where: { revealId_userId: { revealId: reveal.id, userId: auth.id } },
      });
      if (!existing) {
        await tx.revealResponse.create({
          data: { revealId: reveal.id, userId: auth.id, content },
        });
      } else if (!reveal.completedAt && existing.content !== content) {
        await tx.revealResponse.update({
          where: { id: existing.id },
          data: { content },
        });
      }

      const responses = await tx.revealResponse.findMany({
        where: { revealId: reveal.id },
        orderBy: { createdAt: "asc" },
        select: { userId: true, content: true, createdAt: true },
      });
      if (responses.length < 2) {
        return {
          revealId: reveal.id,
          waiting: true,
          bothResponded: false,
          responses: responses
            .filter((response) => response.userId === auth.id)
            .map((response) => ({ isMine: true, content: response.content, createdAt: response.createdAt })),
          conversationId: null,
        };
      }

      const firstCompletion = !reveal.completedAt;
      let conversation = await tx.conversation.findUnique({ where: { matchId: match.id } });
      if (!conversation) {
        const [user1Id, user2Id] = canonicalPair(match.user1Id, match.user2Id);
        conversation = await tx.conversation.findFirst({ where: { user1Id, user2Id } });
        if (conversation) {
          conversation = await tx.conversation.update({ where: { id: conversation.id }, data: { matchId: match.id } });
        } else {
          conversation = await tx.conversation.create({ data: { user1Id, user2Id, matchId: match.id } });
        }
      }

      if (firstCompletion) {
        const now = new Date();
        await tx.connectionReveal.update({ where: { id: reveal.id }, data: { completedAt: now } });
        await tx.match.update({
          where: { id: match.id },
          data: { state: "CONVERSATION", lastTransitionAt: now },
        });
        await tx.connectionEvent.createMany({
          data: [
            { matchId: match.id, actorId: auth.id, fromState: "REVEAL_PENDING", toState: "REVEAL_COMPLETED" },
            { matchId: match.id, actorId: auth.id, fromState: "REVEAL_COMPLETED", toState: "CONVERSATION" },
          ],
        });
        await tx.analyticsEvent.createMany({
          data: [
            {
              eventId: crypto.randomUUID(),
              eventName: "reveal_completed",
              eventVersion: 1,
              userId: auth.id,
              occurredAt: now,
              properties: { matchId: match.id, revealId: reveal.id },
            },
            {
              eventId: crypto.randomUUID(),
              eventName: "conversation_started",
              eventVersion: 1,
              userId: auth.id,
              occurredAt: now,
              properties: { matchId: match.id, conversationId: conversation.id },
            },
          ],
        });
        for (const userId of [match.user1Id, match.user2Id]) {
          await tx.notification.upsert({
            where: { dedupeKey: `reveal-complete:${reveal.id}:${userId}` },
            update: {},
            create: {
              userId,
              type: "reveal_completed",
              title: "Résonance révélée",
              body: "Vous avez répondu tous les deux. Découvrez vos réponses.",
              link: `/connections/${match.id}`,
              dedupeKey: `reveal-complete:${reveal.id}:${userId}`,
            },
          });
        }
      }

      return {
        revealId: reveal.id,
        waiting: false,
        bothResponded: true,
        responses: responses.map((response) => ({
          isMine: response.userId === auth.id,
          content: response.content,
          createdAt: response.createdAt,
        })),
        conversationId: conversation.id,
      };
    }, { isolationLevel: "Serializable" });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Reveal response error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
