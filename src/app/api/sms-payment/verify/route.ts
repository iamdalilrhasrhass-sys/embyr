import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { verifyPaymentCode } from "@/lib/smsPayment";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json();
    const { code, planId } = body;

    if (!code || !planId) return NextResponse.json({ error: "missing_data" }, { status: 400 });

    const isValid = await verifyPaymentCode(code);

    if (isValid) {
      // MOCK: Grant access (update user premium status in DB)
      await prisma.profile.update({
        where: { userId: payload.userId },
        data: {
          isPremium: true
        }
      });
      return NextResponse.json({ success: true, message: "Code valide. Accès accordé." });
    } else {
      return NextResponse.json({ error: "invalid_code", message: "Le code fourni est invalide ou expiré." }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
