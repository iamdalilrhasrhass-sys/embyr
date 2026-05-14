import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide." }, { status: 401 });
    const userId = decoded.userId;

    const pending = await prisma.photoVerification.findFirst({ where: { userId, status: "pending" } });
    if (pending) {
      return NextResponse.json({ error: "Une demande est déjà en cours.", code: pending.code }, { status: 409 });
    }

    const code = randomBytes(2).toString("hex").toUpperCase();
    await prisma.photoVerification.create({ data: { userId, code, photoPath: "", status: "pending" } });
    return NextResponse.json({ success: true, code });

  } catch (e: any) {
    console.error("Verification request error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
