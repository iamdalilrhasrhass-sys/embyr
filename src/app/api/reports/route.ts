import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withApiLogging } from "@/lib/api-logger";

const REASONS = ["harassment", "hate", "spam", "fake_profile", "underage", "unsafe_behavior", "other"] as const;
const TARGET_TYPES = ["profile", "message", "connection", "media"] as const;

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.reportedUserId !== "string" || body.reportedUserId === auth.id) {
    return NextResponse.json({ error: "Utilisateur signalé invalide" }, { status: 400 });
  }
  if (typeof body.reason !== "string" || !REASONS.includes(body.reason as typeof REASONS[number])) {
    return NextResponse.json({ error: "Motif invalide" }, { status: 400 });
  }
  const targetType = typeof body.targetType === "string" && TARGET_TYPES.includes(body.targetType as typeof TARGET_TYPES[number])
    ? body.targetType as typeof TARGET_TYPES[number]
    : "profile";
  const targetId = typeof body.targetId === "string" ? body.targetId.slice(0, 80) : null;
  const details = typeof body.details === "string" ? body.details.trim().slice(0, 1000) || null : null;
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.userReport.count({ where: { reporterId: auth.id, createdAt: { gte: dayAgo } } });
  if (recentCount >= 5) return NextResponse.json({ error: "Limite de signalements atteinte", retryAfter: 86400 }, { status: 429 });

  const target = await prisma.user.findFirst({
    where: { id: body.reportedUserId, deletedAt: null },
    select: { id: true },
  });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (targetType === "message") {
    if (!targetId) return NextResponse.json({ error: "Message requis" }, { status: 400 });
    const message = await prisma.message.findFirst({
      where: {
        id: targetId,
        senderId: body.reportedUserId,
        conversation: { OR: [{ user1Id: auth.id }, { user2Id: auth.id }] },
      },
      select: { id: true },
    });
    if (!message) return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  const now = new Date();
  const report = await prisma.$transaction(async (tx) => {
    const created = await tx.userReport.create({
      data: {
        reporterId: auth.id,
        reportedUserId: body.reportedUserId as string,
        targetType,
        targetId,
        reason: body.reason as string,
        details,
      },
      select: { id: true, status: true, createdAt: true },
    });
    await tx.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "report_submitted",
        eventVersion: 1,
        userId: auth.id,
        occurredAt: now,
        properties: { targetType },
      },
    });
    return created;
  });
  return NextResponse.json({ success: true, report }, { status: 201 });
}

export const POST = withApiLogging(handlePost);
