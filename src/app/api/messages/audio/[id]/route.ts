import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authorizeConversation } from "@/lib/connection-policy";

export const runtime = "nodejs";

function privateAudioDirectory() {
  return process.env.PRIVATE_UPLOAD_DIR
    ? path.resolve(process.env.PRIVATE_UPLOAD_DIR, "audio")
    : path.join(process.cwd(), "storage", "private", "audio");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const message = await prisma.message.findUnique({
    where: { id },
    select: { conversationId: true, type: true, mediaUrl: true, mediaType: true },
  });
  if (!message || message.type !== "audio" || !message.mediaUrl?.startsWith("private-audio:")) {
    return NextResponse.json({ error: "Audio introuvable" }, { status: 404 });
  }
  const access = await authorizeConversation(prisma, auth.id, message.conversationId);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  const filename = path.basename(message.mediaUrl.slice("private-audio:".length));
  const filePath = path.join(privateAudioDirectory(), filename);
  try {
    const info = await stat(filePath);
    const range = request.headers.get("range");
    let start = 0;
    let end = info.size - 1;
    let status = 200;
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      if (start > end || start >= info.size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
      status = 206;
    }
    const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
    return new Response(stream, {
      status,
      headers: {
        "Content-Type": message.mediaType || "application/octet-stream",
        "Content-Length": String(end - start + 1),
        "Accept-Ranges": "bytes",
        ...(status === 206 ? { "Content-Range": `bytes ${start}-${end}/${info.size}` } : {}),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Audio introuvable" }, { status: 404 });
  }
}
