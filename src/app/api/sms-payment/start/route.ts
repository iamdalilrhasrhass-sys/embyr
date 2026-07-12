import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(
    { error: "sms_payment_disabled", message: "Le paiement par code SMS est désactivé." },
    { status: 410 },
  );
}
