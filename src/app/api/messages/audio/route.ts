import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Vérifier premium via profile
  const profile = await prisma.profile.findUnique({ where: { userId: auth.id } });
  const isPremium = profile?.isPremium || false;

  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File;
    const conversationId = formData.get("conversationId") as string;
    const duration = parseInt(formData.get("duration") as string) || 0;

    if (!file || !conversationId) {
      return NextResponse.json({ error: "Fichier audio et conversation requis" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio trop volumineux (max 10 Mo)" }, { status: 413 });
    }

    const validTypes = ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"];
    if (!validTypes.includes(file.type) && !file.type.startsWith("audio/")) {
      return NextResponse.json({ error: "Format audio non supporté" }, { status: 400 });
    }

    // Vérifier conversation
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conv) return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    if (conv.user1Id !== auth.id && conv.user2Id !== auth.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Vérifier blocage
    const receiverId = conv.user1Id === auth.id ? conv.user2Id : conv.user1Id;
    const block = await prisma.block.findFirst({
      where: { blockerId: receiverId, blockedId: auth.id },
    });
    if (block) return NextResponse.json({ error: "Vous êtes bloqué" }, { status: 403 });

    // Vérifier premium pour vocaux
    if (!isPremium) {
      return NextResponse.json({ error: "Premium requis pour les messages vocaux" }, { status: 402 });
    }

    // Stocker fichier
    const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
    await mkdir(uploadDir, { recursive: true });
    const ext = file.type.includes("webm") ? "webm" : file.type.includes("mp4") ? "mp4" : "ogg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    const url = `/uploads/audio/${filename}`;

    // Créer message de type audio
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: auth.id,
        receiverId,
        type: "audio",
        content: null,
        mediaUrl: url,
        mediaType: "audio/webm",
        durationSeconds: duration,
        status: "SENT",
      },
    });

    // Mettre à jour lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ message, url });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
