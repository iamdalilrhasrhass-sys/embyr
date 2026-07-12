import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPhoneVerificationCode } from "@/lib/phone-verification";
import {
  clearSensitiveActions,
  consumeSensitiveAction,
} from "@/lib/sensitive-action-rate-limit";

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const rateLimit = consumeSensitiveAction("sms-verify", auth.id, 8);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Demande un nouveau code." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await req.json().catch(() => null) as { code?: unknown } | null;
    const code = typeof body?.code === "string" ? body.code.trim() : "";
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    // Find the latest verification code for this user
    const verification = await prisma.smsVerification.findFirst({
      where: {
        userId: auth.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json({ error: "Aucun code en attente. Demande un nouveau code." }, { status: 400 });
    }

    if (!verifyPhoneVerificationCode({
      userId: auth.id,
      phone: verification.phone,
      code,
      storedDigest: verification.code,
    })) {
      return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const claimed = await tx.smsVerification.updateMany({
        where: { id: verification.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) throw new Error("verification_already_consumed");
      await tx.user.update({
        where: { id: auth.id },
        data: { phone: verification.phone, phoneVerified: true },
      });
      await tx.notificationPreference.upsert({
        where: { userId: auth.id },
        create: { userId: auth.id, smsEnabled: true, inAppEnabled: true },
        update: {},
      });
    });

    clearSensitiveActions("sms-verify", auth.id);
    return NextResponse.json({ success: true, message: "Téléphone vérifié ✅" });
  } catch (e) {
    console.error("[sms/verify-code] error:", (e as Error).message);
    return NextResponse.json({ error: "Erreur de vérification" }, { status: 500 });
  }
}
