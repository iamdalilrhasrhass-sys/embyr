import { NextResponse } from "next/server";

export function experimentalAiUnavailable() {
  return NextResponse.json(
    {
      error: "Cette fonction expérimentale est désactivée jusqu’à ce que son consentement et son périmètre de données soient finalisés.",
      code: "EXPERIMENTAL_AI_DISABLED",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
