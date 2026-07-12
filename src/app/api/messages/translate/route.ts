import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authorizeConversation } from "@/lib/connection-policy";
import { hermesAI } from "@/lib/ai-client";
import { withApiLogging } from "@/lib/api-logger";

export const dynamic = "force-dynamic";
const LANGUAGES = ["fr", "en", "es"] as const;

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.messageId !== "string" || typeof body.targetLang !== "string" || !LANGUAGES.includes(body.targetLang as typeof LANGUAGES[number])) {
    return NextResponse.json({ error: "Message et langue cible requis" }, { status: 400 });
  }
  const message = await prisma.message.findUnique({
    where: { id: body.messageId },
    select: { id: true, conversationId: true, content: true },
  });
  if (!message?.content) return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  const access = await authorizeConversation(prisma, auth.id, message.conversationId);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentTranslations = await prisma.analyticsEvent.count({
    where: { userId: auth.id, eventName: "message_translation_requested", occurredAt: { gte: oneHourAgo } },
  });
  if (recentTranslations >= 20) {
    return NextResponse.json({ error: "Limite de traductions atteinte", retryAfter: 3600 }, { status: 429 });
  }

  const targetLang = body.targetLang;
  try {
    const system = `Tu traduis fidèlement un court message vers ${targetLang}. Réponds uniquement en JSON valide: {"translatedText":"...","sourceLang":"code ISO","targetLang":"${targetLang}"}. N'ajoute, ne retranche et n'interprète aucun contenu.`;
    const raw = await hermesAI(`Message à traduire : ${JSON.stringify(message.content)}`, system);
    const parsed = JSON.parse(raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()) as Record<string, unknown>;
    const translatedText = typeof parsed.translatedText === "string" ? parsed.translatedText.slice(0, 4000) : message.content;
    const sourceLang = typeof parsed.sourceLang === "string" ? parsed.sourceLang.slice(0, 12) : "unknown";
    await prisma.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "message_translation_requested",
        eventVersion: 1,
        userId: auth.id,
        occurredAt: new Date(),
        properties: { messageId: message.id, targetLang },
      },
    });
    return NextResponse.json({ translatedText, sourceLang, targetLang });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Erreur de traduction" }, { status: 502 });
  }
}

export const POST = withApiLogging(handlePost);
