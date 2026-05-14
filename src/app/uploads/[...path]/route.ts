import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    const filePath = path.join(UPLOAD_ROOT, ...segments);

    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve(UPLOAD_ROOT))) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    if (!existsSync(resolved)) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    const buffer = await readFile(resolved);

    const ext = path.extname(resolved).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".ogg": "audio/ogg",
      ".opus": "audio/ogg; codecs=opus",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".webm": "audio/webm",
      ".m4a": "audio/mp4",
      ".aac": "audio/aac",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".mp4": "video/mp4",
      ".pdf": "application/pdf",
    };
    const contentType = mimeMap[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=86400, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Upload serve error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
