import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { referralCode: true },
  });

  const referralCount = profile?.referralCode
    ? await prisma.user.count({
        where: { referredBy: profile.referralCode, deletedAt: null, bannedAt: null },
      })
    : 0;

  // Legacy profile codes stay readable during the data transition.
  const profileData = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { referralCode: true },
  });

  const code = profile?.referralCode || profileData?.referralCode || null;

  return NextResponse.json({
    referralCode: code,
    referralCount,
    referralLink: code ? `https://embir.xyz/fr/auth/register?ref=${code}` : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as { code?: unknown } | null;
    if (typeof body?.code !== "string") {
      return NextResponse.json({ valid: false, error: "Code requis" }, { status: 400 });
    }
    const code = body.code.trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,40}$/.test(code)) {
      return NextResponse.json({ valid: false, error: "Code invalide" }, { status: 400 });
    }

    // Search in User model first
    const referrer = await prisma.user.findFirst({
      where: { referralCode: code },
      select: { id: true },
    });

    if (referrer) {
      return NextResponse.json({ valid: true });
    }

    // Fallback: search in Profile model (legacy ambassador codes)
    const profileReferrer = await prisma.profile.findFirst({
      where: { referralCode: code },
      select: { id: true },
    });

    if (profileReferrer) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false, error: "Code de parrainage invalide" }, { status: 404 });
  } catch (error) {
    console.error("Referral check error:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}
