import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { blockUser, unblockUser } from "@/lib/block-service";
import { withApiLogging } from "@/lib/api-logger";

async function handlePost(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { userId } = await params;
  if (userId === auth.id) return NextResponse.json({ error: "Cible invalide" }, { status: 400 });
  try {
    return NextResponse.json(await blockUser(auth.id, userId));
  } catch (error) {
    if (error instanceof Error && error.message === "TARGET_NOT_FOUND") {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handleDelete(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const auth = await getCurrentUser();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { userId } = await params;
  return NextResponse.json(await unblockUser(auth.id, userId));
}

export const POST = withApiLogging(handlePost);
export const DELETE = withApiLogging(handleDelete);
