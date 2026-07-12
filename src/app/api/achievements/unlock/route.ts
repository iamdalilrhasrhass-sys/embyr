import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Les badges sont désactivés tant que leurs critères ne sont pas calculés côté serveur.",
      code: "ACHIEVEMENTS_DISABLED",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
