import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(
    { error: "sms_payment_disabled", message: "Aucun code SMS ne peut accorder de privilège." },
    { status: 410 },
  );
}
