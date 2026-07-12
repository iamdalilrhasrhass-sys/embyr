import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const selectPreferences = {
  smsEnabled: true,
  emailEnabled: true,
  inAppEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: true,
  quietHoursEnd: true,
  timezone: true,
} as const;

export async function GET() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: auth.id },
      update: {},
      create: { userId: auth.id },
      select: selectPreferences,
    });
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { phone: true, phoneVerified: true },
    });
    return NextResponse.json(
      { success: true, preferences, phone: user?.phone ?? null, phoneVerified: user?.phoneVerified ?? false },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[notifications] GET preferences error", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "invalid_preferences" }, { status: 400 });
  const allowed = new Set([
    "smsEnabled",
    "emailEnabled",
    "inAppEnabled",
    "quietHoursEnabled",
    "quietHoursStart",
    "quietHoursEnd",
    "timezone",
  ]);
  if (!Object.keys(body).length || Object.keys(body).some((key) => !allowed.has(key))) {
    return NextResponse.json({ error: "invalid_preferences" }, { status: 400 });
  }
  for (const key of ["smsEnabled", "emailEnabled", "inAppEnabled", "quietHoursEnabled"] as const) {
    if (body[key] !== undefined && typeof body[key] !== "boolean") {
      return NextResponse.json({ error: "invalid_preferences" }, { status: 400 });
    }
  }
  const timePattern = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
  for (const key of ["quietHoursStart", "quietHoursEnd"] as const) {
    if (body[key] !== undefined && (typeof body[key] !== "string" || !timePattern.test(body[key]))) {
      return NextResponse.json({ error: "invalid_preferences" }, { status: 400 });
    }
  }
  if (body.timezone !== undefined) {
    if (typeof body.timezone !== "string" || body.timezone.length > 64) {
      return NextResponse.json({ error: "invalid_preferences" }, { status: 400 });
    }
    try {
      new Intl.DateTimeFormat("en", { timeZone: body.timezone }).format();
    } catch {
      return NextResponse.json({ error: "invalid_preferences" }, { status: 400 });
    }
  }
  const update = Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined));
  const preferences = await prisma.notificationPreference.upsert({
    where: { userId: auth.id },
    create: { userId: auth.id, ...update },
    update,
    select: selectPreferences,
  });
  await prisma.analyticsEvent.create({
    data: {
      eventId: crypto.randomUUID(),
      eventName: "notification_preferences_updated",
      eventVersion: 1,
      userId: auth.id,
      occurredAt: new Date(),
      properties: { changedFields: Object.keys(update) },
    },
  });
  return NextResponse.json({ success: true, preferences });
}
