import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authorizeConversation } from "@/lib/connection-policy";
import { checkMessageRateLimit } from "@/lib/rate-limit";
import { validateAudioSignature, validateAudioUpload } from "@/lib/upload-policy";
import { withApiLogging } from "@/lib/api-logger";

export const runtime = "nodejs";

function privateAudioDirectory() {
  return process.env.PRIVATE_UPLOAD_DIR
    ? path.resolve(process.env.PRIVATE_UPLOAD_DIR, "audio")
    : path.join(process.cwd(), "storage", "private", "audio");
}

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("audio");
    const conversationId = formData.get("conversationId");
    const duration = Number(formData.get("duration") ?? 0);
    if (!(file instanceof File) || typeof conversationId !== "string") {
      return NextResponse.json({ error: "Fichier audio et conversation requis" }, { status: 400 });
    }
    if (!Number.isFinite(duration) || duration < 1 || duration > 300) {
      return NextResponse.json({ error: "Durée audio invalide" }, { status: 400 });
    }
    const policy = validateAudioUpload(file.type, file.size);
    if (!policy.ok) return NextResponse.json({ error: policy.error }, { status: policy.status });
    const access = await authorizeConversation(prisma, auth.id, conversationId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
    const rate = await checkMessageRateLimit(auth.id, access.value.receiverId, "", "media");
    if (!rate.allowed) {
      return NextResponse.json({ error: rate.reason, retryAfter: rate.retryAfter }, { status: 429 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!validateAudioSignature(buffer, file.type)) {
      return NextResponse.json({ error: "Le contenu du fichier ne correspond pas au format audio" }, { status: 400 });
    }
    const directory = privateAudioDirectory();
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const filename = `${crypto.randomUUID()}.${policy.extension}`;
    const filePath = path.join(directory, filename);
    await writeFile(filePath, buffer, { mode: 0o600, flag: "wx" });

    try {
      const now = new Date();
      const message = await prisma.$transaction(async (tx) => {
        const created = await tx.message.create({
          data: {
            conversationId,
            senderId: auth.id,
            receiverId: access.value.receiverId,
            type: "audio",
            content: null,
            mediaUrl: `private-audio:${filename}`,
            mediaType: file.type,
            durationSeconds: Math.round(duration),
            status: "SENT",
          },
          select: { id: true, senderId: true, receiverId: true, type: true, durationSeconds: true, status: true, createdAt: true },
        });
        await tx.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: now } });
        await tx.analyticsEvent.create({
          data: {
            eventId: crypto.randomUUID(),
            eventName: "message_sent",
            eventVersion: 1,
            userId: auth.id,
            occurredAt: now,
            properties: { matchId: access.value.matchId, conversationId, messageType: "audio" },
          },
        });
        return created;
      });
      return NextResponse.json({ message: { ...message, mediaUrl: `/api/messages/audio/${message.id}` } }, { status: 201 });
    } catch (error) {
      await unlink(filePath).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
