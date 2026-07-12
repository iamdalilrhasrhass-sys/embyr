import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function privateAudioDirectory() {
  return process.env.PRIVATE_UPLOAD_DIR
    ? path.resolve(process.env.PRIVATE_UPLOAD_DIR, "audio")
    : path.join(process.cwd(), "storage", "private", "audio");
}

export async function DELETE(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => null) as { password?: unknown; confirm?: unknown } | null;
  if (body?.confirm !== "DELETE" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Confirmation et mot de passe requis" }, { status: 400 });
  }
  const account = await prisma.user.findUnique({ where: { id: auth.id }, select: { passwordHash: true } });
  if (!account || !(await verifyPassword(body.password, account.passwordHash))) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 403 });
  }

  const audioMessages = await prisma.message.findMany({
    where: { senderId: auth.id, type: "audio", mediaUrl: { startsWith: "private-audio:" } },
    select: { mediaUrl: true },
  });
  const now = new Date();
  const tombstone = crypto.randomUUID().replaceAll("-", "");
  const unusablePassword = await hashPassword(crypto.randomUUID() + crypto.randomUUID());

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      DELETE FROM "AnalyticsEvent"
      WHERE "userId" = ${auth.id}
         OR "properties"::text LIKE ${`%${auth.id}%`}
    `;
    await tx.notification.deleteMany({ where: { userId: auth.id } });
    await tx.emailLog.deleteMany({ where: { userId: auth.id } });
    await tx.consent.deleteMany({ where: { userId: auth.id } });
    await tx.presenceSignal.updateMany({ where: { userId: auth.id }, data: { active: false, visible: false, expiredAt: now } });
    await tx.message.updateMany({
      where: { senderId: auth.id },
      data: { content: null, mediaUrl: null, mediaType: null, status: "DELETED" },
    });
    await tx.media.deleteMany({ where: { userId: auth.id } });
    await tx.profile.update({
      where: { userId: auth.id },
      data: {
        username: `deleted_${tombstone.slice(0, 16)}`,
        displayName: null,
        birthdate: null,
        city: null,
        country: null,
        latitude: null,
        longitude: null,
        genderIdentity: null,
        orientation: null,
        seekingGenders: { set: [] },
        primaryIntent: null,
        acceptedIntents: { set: [] },
        intentions: { set: [] },
        activities: { set: [] },
        description: null,
        profilePhotoUrl: null,
        verificationPhotoUrl: null,
        publicVisibility: false,
        visibilityStatus: "HIDDEN",
        onlineStatus: false,
        canReceiveMessages: false,
        onboardingCompletedAt: null,
      },
    });
    await tx.user.update({
      where: { id: auth.id },
      data: {
        email: `deleted-${tombstone}@invalid.embir.local`,
        phone: null,
        passwordHash: unusablePassword,
        emailToken: null,
        referralCode: null,
        referredBy: null,
        consentSensitiveData: false,
        deletedAt: now,
      },
    });
  });

  for (const message of audioMessages) {
    if (!message.mediaUrl) continue;
    const filename = path.basename(message.mediaUrl.slice("private-audio:".length));
    await unlink(path.join(privateAudioDirectory(), filename)).catch(() => undefined);
  }
  const response = NextResponse.json({ success: true, deletedAt: now });
  response.cookies.set("token", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
