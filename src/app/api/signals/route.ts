import { NextRequest, NextResponse } from "next/server";
import type { ConnectionIntent, SignalFormat, SocialEnergy } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { INTENTS } from "@/lib/matching";
import { withApiLogging } from "@/lib/api-logger";

const ENERGIES = ["CALME", "OUVERTE", "SPONTANEE"] as const satisfies readonly SocialEnergy[];
const FORMATS = ["DISCUSSION", "CAFE", "BALADE", "SPORT", "SORTIE", "ACTIVITE", "AUTRE"] as const satisfies readonly SignalFormat[];

async function handleGet() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const now = new Date();
  const signal = await prisma.presenceSignal.findFirst({
    where: { userId: auth.id, active: true, expiresAt: { gt: now } },
    orderBy: { activatedAt: "desc" },
    select: {
      id: true,
      intent: true,
      socialEnergy: true,
      formats: true,
      availabilityText: true,
      approximateArea: true,
      visible: true,
      activatedAt: true,
      expiresAt: true,
    },
  });
  return NextResponse.json({ signal });
}

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.intent !== "string" || !INTENTS.includes(body.intent as ConnectionIntent)) {
      return NextResponse.json({ error: "Intention invalide" }, { status: 400 });
    }
    if (typeof body.socialEnergy !== "string" || !ENERGIES.includes(body.socialEnergy as SocialEnergy)) {
      return NextResponse.json({ error: "Énergie sociale invalide" }, { status: 400 });
    }
    if (
      !Array.isArray(body.formats) ||
      body.formats.length === 0 ||
      body.formats.length > 4 ||
      !body.formats.every((format) => typeof format === "string" && FORMATS.includes(format as SignalFormat))
    ) {
      return NextResponse.json({ error: "Choisis entre un et quatre formats" }, { status: 400 });
    }
    const formats = body.formats as SignalFormat[];
    const durationHours = Number(body.durationHours ?? 24);
    if (!Number.isInteger(durationHours) || durationHours < 1 || durationHours > 168) {
      return NextResponse.json({ error: "Durée invalide" }, { status: 400 });
    }
    const availabilityText = typeof body.availabilityText === "string"
      ? body.availabilityText.trim().replace(/\s+/g, " ").slice(0, 120)
      : null;
    const approximateArea = typeof body.approximateArea === "string"
      ? body.approximateArea.trim().replace(/\s+/g, " ").slice(0, 80)
      : null;
    const now = new Date();
    const recentCount = await prisma.presenceSignal.count({
      where: { userId: auth.id, createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } },
    });
    if (recentCount >= 10) {
      return NextResponse.json({ error: "Trop de modifications de signal", retryAfter: 3600 }, { status: 429 });
    }

    const signal = await prisma.$transaction(async (tx) => {
      await tx.presenceSignal.updateMany({
        where: { userId: auth.id, active: true },
        data: { active: false, expiredAt: now },
      });
      const created = await tx.presenceSignal.create({
        data: {
          userId: auth.id,
          intent: body.intent as ConnectionIntent,
          socialEnergy: body.socialEnergy as SocialEnergy,
          formats: [...new Set(formats)],
          availabilityText,
          approximateArea,
          visible: body.visible !== false,
          expiresAt: new Date(now.getTime() + durationHours * 60 * 60 * 1000),
        },
        select: {
          id: true,
          intent: true,
          socialEnergy: true,
          formats: true,
          availabilityText: true,
          approximateArea: true,
          visible: true,
          activatedAt: true,
          expiresAt: true,
        },
      });
      await tx.analyticsEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventName: "signal_activated",
          eventVersion: 1,
          userId: auth.id,
          occurredAt: now,
          properties: { signalId: created.id, intent: created.intent, durationHours, visible: created.visible },
        },
      });
      return created;
    });
    return NextResponse.json({ signal }, { status: 201 });
  } catch (error) {
    console.error("Signal activation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handleDelete() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const now = new Date();
  const active = await prisma.presenceSignal.findFirst({
    where: { userId: auth.id, active: true },
    select: { id: true },
  });
  if (!active) return NextResponse.json({ success: true, changed: false });
  await prisma.$transaction([
    prisma.presenceSignal.update({
      where: { id: active.id },
      data: { active: false, visible: false, expiredAt: now },
    }),
    prisma.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "signal_expired",
        eventVersion: 1,
        userId: auth.id,
        occurredAt: now,
        properties: { signalId: active.id, reason: "manual" },
      },
    }),
  ]);
  return NextResponse.json({ success: true, changed: true });
}

export const GET = withApiLogging(handleGet);
export const POST = withApiLogging(handlePost);
export const DELETE = withApiLogging(handleDelete);
