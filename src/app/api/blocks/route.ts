import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { blockUser, unblockUser } from "@/lib/block-service";
import { withApiLogging } from "@/lib/api-logger";

async function handlePost(request: NextRequest) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => null) as { targetUserId?: unknown } | null;
  if (typeof body?.targetUserId !== "string" || body.targetUserId === auth.id) {
    return NextResponse.json({ error: "Cible invalide" }, { status: 400 });
  }
  try {
    const result = body && "blocked" in body && body.blocked === false
      ? await unblockUser(auth.id, body.targetUserId)
      : await blockUser(auth.id, body.targetUserId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "TARGET_NOT_FOUND") {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    console.error("Block user error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
