import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notifications/preferences
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId: payload.userId },
    });

    // Default preferences if none set
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId: payload.userId, smsEnabled: true, inAppEnabled: true },
      });
    }

    // Get user phone status
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { phone: true, phoneVerified: true },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        smsEnabled: prefs.smsEnabled,
        inAppEnabled: prefs.inAppEnabled,
      },
      phone: user?.phone || null,
      phoneVerified: user?.phoneVerified || false,
    });
  } catch (e) {
    console.error("[notifications] GET error:", (e as Error).message);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// PUT /api/notifications/preferences
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { smsEnabled, inAppEnabled } = await req.json();

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: payload.userId },
      create: {
        userId: payload.userId,
        smsEnabled: smsEnabled !== undefined ? smsEnabled : true,
        inAppEnabled: inAppEnabled !== undefined ? inAppEnabled : true,
      },
      update: {
        ...(smsEnabled !== undefined ? { smsEnabled } : {}),
        ...(inAppEnabled !== undefined ? { inAppEnabled } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        smsEnabled: prefs.smsEnabled,
        inAppEnabled: prefs.inAppEnabled,
      },
    });
  } catch (e) {
    console.error("[notifications] PUT error:", (e as Error).message);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
