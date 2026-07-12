import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Legacy Telegram transport. Signup reporting now goes through the durable,
 * privacy-safe email outbox from the registration transaction.
 */
export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Transport obsolète", replacement: "admin_email_outbox" },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
