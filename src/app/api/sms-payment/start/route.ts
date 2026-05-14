import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { generatePaymentCode } from "@/lib/smsPayment";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json();
    const { planId, phone } = body;

    if (!planId) return NextResponse.json({ error: "missing_plan" }, { status: 400 });

    const result = await generatePaymentCode({
      planId,
      userId: payload.userId,
      phone
    });

    if (result.success) {
      return NextResponse.json({ message: result.message, code: result.code });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
