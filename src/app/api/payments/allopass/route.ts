import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(
    {
      error: "allopass_disabled",
      message: "Le paiement SMS/Audiotel est désactivé tant qu'un flux signé et idempotent n'est pas opérationnel.",
    },
    { status: 410 },
  );
}
