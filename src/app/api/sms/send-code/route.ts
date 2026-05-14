import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSmsCode } from "@/lib/sms";

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

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
    }

    // Basic French phone validation
    const phoneClean = phone.replace(/\s/g, "").replace(/\./g, "");
    const frenchPhoneRegex = /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/;
    if (!frenchPhoneRegex.test(phoneClean)) {
      return NextResponse.json({ error: "Numéro de téléphone français invalide (ex: 0612345678)" }, { status: 400 });
    }

    // Check if phone already used by another user
    const existing = await prisma.user.findUnique({ where: { phone: phoneClean } });
    if (existing && existing.id !== payload.userId) {
      return NextResponse.json({ error: "Ce numéro est déjà utilisé" }, { status: 409 });
    }

    // Send SMS code
    const result = await sendSmsCode(phoneClean);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    // Store verification code in database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete old codes for this user
    await prisma.smsVerification.deleteMany({ where: { userId: payload.userId } });

    await prisma.smsVerification.create({
      data: {
        userId: payload.userId,
        phone: phoneClean,
        code: result.code || "000000",
        expiresAt,
      },
    });

    // Update user's phone
    await prisma.user.update({
      where: { id: payload.userId },
      data: { phone: phoneClean, phoneVerified: false },
    });

    return NextResponse.json({
      success: true,
      message: "Code envoyé par SMS",
      // In dev mode, return code for auto-fill
      ...(result.code ? { devCode: result.code } : {}),
    });
  } catch (e) {
    console.error("[sms/send-code] error:", (e as Error).message);
    return NextResponse.json({ error: "Erreur d'envoi du code" }, { status: 500 });
  }
}
