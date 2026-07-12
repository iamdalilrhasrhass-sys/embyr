import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSmsCode } from "@/lib/sms";
import {
  digestPhoneVerificationCode,
  generatePhoneVerificationCode,
  normalizePhoneNumber,
} from "@/lib/phone-verification";
import { consumeSensitiveAction } from "@/lib/sensitive-action-rate-limit";

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const rateLimit = consumeSensitiveAction("sms-send", auth.id, 3);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de demandes. Réessaie plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await req.json().catch(() => null) as { phone?: unknown } | null;
    const phone = normalizePhoneNumber(body?.phone);
    if (!phone) {
      return NextResponse.json({ error: "Numéro de téléphone international invalide" }, { status: 400 });
    }

    // Check if phone already used by another user
    const existing = await prisma.user.findUnique({ where: { phone }, select: { id: true } });
    if (existing && existing.id !== auth.id) {
      return NextResponse.json({ error: "Ce numéro est déjà utilisé" }, { status: 409 });
    }

    const code = generatePhoneVerificationCode();
    const verification = await prisma.$transaction(async (tx) => {
      await tx.smsVerification.deleteMany({ where: { userId: auth.id, usedAt: null } });
      return tx.smsVerification.create({
        data: {
          userId: auth.id,
          phone,
          code: digestPhoneVerificationCode({ userId: auth.id, phone, code }),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
        select: { id: true },
      });
    });

    const result = await sendSmsCode(phone, code);

    if (!result.success) {
      await prisma.smsVerification.deleteMany({ where: { id: verification.id, usedAt: null } });
      return NextResponse.json({ error: result.message }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      message: "Code envoyé par SMS",
      ...(process.env.NODE_ENV === "development" ? { devCode: code } : {}),
    });
  } catch (e) {
    console.error("[sms/send-code] error:", (e as Error).message);
    return NextResponse.json({ error: "Erreur d'envoi du code" }, { status: 500 });
  }
}
