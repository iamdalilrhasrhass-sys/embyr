import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    // Find the latest verification code for this user
    const verification = await prisma.smsVerification.findFirst({
      where: {
        userId: payload.userId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json({ error: "Aucun code en attente. Demande un nouveau code." }, { status: 400 });
    }

    if (new Date() > verification.expiresAt) {
      return NextResponse.json({ error: "Code expiré. Demande un nouveau code." }, { status: 400 });
    }

    if (verification.code !== code) {
      return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
    }

    // Mark as used
    await prisma.smsVerification.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    });

    // Verify phone
    await prisma.user.update({
      where: { id: payload.userId },
      data: { phoneVerified: true },
    });

    // Create notification preferences (default: SMS on, in-app on)
    await prisma.notificationPreference.upsert({
      where: { userId: payload.userId },
      create: { userId: payload.userId, smsEnabled: true, inAppEnabled: true },
      update: {},
    });

    return NextResponse.json({ success: true, message: "Téléphone vérifié ✅" });
  } catch (e) {
    console.error("[sms/verify-code] error:", (e as Error).message);
    return NextResponse.json({ error: "Erreur de vérification" }, { status: 500 });
  }
}
