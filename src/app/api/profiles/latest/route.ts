import { NextResponse } from "next/server";

// Public social proof stays disabled until enough consenting members exist.
export async function GET() {
  return NextResponse.json(
    { profiles: [] },
    { headers: { "Cache-Control": "public, s-maxage=300" } },
  );
}
