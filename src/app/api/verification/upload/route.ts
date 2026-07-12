import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import { randomBytes } from "crypto";
import { validateImageSignature, validateImageUpload } from "@/lib/upload-policy";
import {
  privateVerificationDirectory,
  privateVerificationReference,
} from "@/lib/private-storage";
import { withApiLogging } from "@/lib/api-logger";

async function handlePost(req: NextRequest) {
  let writtenFile: string | null = null;
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("photo");
    if (!(file instanceof File)) return NextResponse.json({ error: "Photo requise." }, { status: 400 });

    const policyCheck = validateImageUpload(file.type, file.size);
    if (!policyCheck.ok) {
      return NextResponse.json({ error: policyCheck.error }, { status: policyCheck.status });
    }

    const pending = await prisma.photoVerification.findFirst({
      where: { userId: auth.id, status: "pending" },
      orderBy: { submittedAt: "desc" },
      select: { id: true },
    });
    if (!pending) {
      return NextResponse.json({ error: "Demande un code d'abord." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!validateImageSignature(buffer, file.type)) {
      return NextResponse.json({ error: "Le contenu du fichier ne correspond pas au format annoncé." }, { status: 400 });
    }

    const filename = `${auth.id}_${randomBytes(16).toString("hex")}.${policyCheck.extension}`;
    const uploadDir = privateVerificationDirectory();
    await mkdir(uploadDir, { recursive: true, mode: 0o700 });
    writtenFile = `${uploadDir}/${filename}`;
    await writeFile(writtenFile, buffer, { flag: "wx", mode: 0o600 });

    await prisma.photoVerification.update({
      where: { id: pending.id },
      data: { photoPath: privateVerificationReference(filename), submittedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: "Photo envoyée. Tu recevras une notification quand la demande aura été examinée." });

  } catch {
    if (writtenFile) await unlink(writtenFile).catch(() => undefined);
    console.error("Verification upload failed");
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
