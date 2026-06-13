import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { referralCode: true },
  });

  const referralCount = await prisma.user.count({
    where: { referredBy: profile?.referralCode || "" },
  });

  // Also check Profile for referralCode fallback and earnings
  const profileData = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { referralCode: true, referralEarnings: true },
  });

  const code = profile?.referralCode || profileData?.referralCode || null;

  return NextResponse.json({
    referralCode: code,
    referralCount,
    referralDays: profileData?.referralEarnings ? Number(profileData.referralEarnings) : referralCount * 7,
    referralLink: code ? `https://embir.xyz/fr/auth/register?ref=${code}` : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ valid: false, error: "Code requis" }, { status: 400 });

    // Search in User model first
    const referrer = await prisma.user.findFirst({
      where: { referralCode: code },
      select: { id: true, referralCode: true },
    });

    if (referrer) {
      return NextResponse.json({ valid: true, referrerId: referrer.id });
    }

    // Fallback: search in Profile model (legacy ambassador codes)
    const profileReferrer = await prisma.profile.findFirst({
      where: { referralCode: code },
      select: { userId: true },
    });

    if (profileReferrer) {
      return NextResponse.json({ valid: true, referrerId: profileReferrer.userId });
    }

    return NextResponse.json({ valid: false, error: "Code de parrainage invalide" }, { status: 404 });
  } catch (error) {
    console.error("Referral check error:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}
