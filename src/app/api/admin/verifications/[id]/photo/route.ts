import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  privateVerificationDirectory,
  privateVerificationFilename,
} from "@/lib/private-storage";
import { prisma } from "@/lib/prisma";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 64) return NextResponse.json({ error: "Demande invalide" }, { status: 400 });

  const verification = await prisma.photoVerification.findUnique({
    where: { id },
    select: { photoPath: true },
  });
  const filename = verification ? privateVerificationFilename(verification.photoPath) : null;
  if (!filename) return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });

  try {
    const buffer = await readFile(path.join(privateVerificationDirectory(), filename));
    const contentType = CONTENT_TYPES[path.extname(filename).toLocaleLowerCase()];
    if (!contentType) return NextResponse.json({ error: "Format invalide" }, { status: 415 });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
  }
}
