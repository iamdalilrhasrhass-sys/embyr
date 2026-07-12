import { NextRequest, NextResponse } from "next/server";
import type { ConnectionIntent } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { getCompatibleCandidates, INTENTS } from "@/lib/matching";

export async function GET(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const rawIntent = request.nextUrl.searchParams.get("intent");
  const intentFilter = rawIntent && INTENTS.includes(rawIntent as ConnectionIntent)
    ? rawIntent as ConnectionIntent
    : undefined;
  try {
    const result = await getCompatibleCandidates(auth.id, { limit: 5, intentFilter });
    const profiles = result.candidates.map((candidate) => ({ ...candidate.profile, reasons: candidate.reasons }));
    return NextResponse.json({ profiles, setupRequired: result.setupRequired, hasMore: result.hasMore });
  } catch (error) {
    console.error("Profiles compatibility error:", error);
    return NextResponse.json({ error: "Profiles temporarily unavailable" }, { status: 503 });
  }
}
