import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide." }, { status: 401 });
    const userId = decoded.userId;

    const formData = await req.formData();
    const file = formData.get("photo") as File;
    if (!file) return NextResponse.json({ error: "Photo requise." }, { status: 400 });

    const pending = await prisma.photoVerification.findFirst({ where: { userId, status: "pending" } });
    if (!pending) {
      return NextResponse.json({ error: "Demande un code d'abord." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${userId}_${randomBytes(4).toString("hex")}.${ext}`;
    const uploadDir = "/root/embyr/uploads/verifications";
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(`${uploadDir}/${filename}`, buffer);

    await prisma.photoVerification.update({
      where: { id: pending.id },
      data: { photoPath: `/uploads/verifications/${filename}`, submittedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: "Photo envoyée. Vérification par notre équipe sous 24h." });

  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
