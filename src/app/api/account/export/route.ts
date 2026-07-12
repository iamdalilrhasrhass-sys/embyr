import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const [user, messages, notifications, reports, blocks, signals, outcomes, events] = await Promise.all([
    prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        email: true,
        phone: true,
        phoneVerified: true,
        emailVerified: true,
        role: true,
        isAdultConfirmed: true,
        consentSensitiveData: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        profile: true,
        consents: { select: { type: true, acceptedAt: true, version: true } },
      },
    }),
    prisma.message.findMany({
      where: { senderId: auth.id },
      select: { id: true, conversationId: true, receiverId: true, content: true, type: true, status: true, createdAt: true, readAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.notification.findMany({
      where: { userId: auth.id },
      select: { id: true, type: true, title: true, body: true, read: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.userReport.findMany({
      where: { reporterId: auth.id },
      select: { id: true, reportedUserId: true, targetType: true, targetId: true, reason: true, details: true, status: true, createdAt: true },
    }),
    prisma.block.findMany({ where: { blockerId: auth.id }, select: { blockedId: true, createdAt: true } }),
    prisma.presenceSignal.findMany({
      where: { userId: auth.id },
      select: { intent: true, socialEnergy: true, formats: true, availabilityText: true, approximateArea: true, visible: true, active: true, activatedAt: true, expiresAt: true },
    }),
    prisma.connectionOutcome.findMany({
      where: { userId: auth.id },
      select: { matchId: true, outcome: true, note: true, createdAt: true, updatedAt: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { userId: auth.id },
      select: { eventName: true, eventVersion: true, occurredAt: true, page: true, language: true, source: true, medium: true, campaign: true, properties: true },
      orderBy: { occurredAt: "asc" },
      take: 10_000,
    }),
  ]);
  if (!user) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
  const exportedAt = new Date().toISOString();
  return new NextResponse(JSON.stringify({ exportedAt, user, messages, notifications, reports, blocks, signals, outcomes, events }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="embir-export-${exportedAt.slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
