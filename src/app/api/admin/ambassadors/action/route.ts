import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { randomBytes, randomInt } from "crypto";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const { action, ambassadorId, reason } = await req.json();

    if (!ambassadorId || !action) {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    const lead = await prisma.ambassadorLead.findUnique({ where: { id: ambassadorId } });
    if (!lead) {
      return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 });
    }

    // === REJECT ===
    if (action === "reject") {
      await prisma.ambassadorLead.update({
        where: { id: ambassadorId },
        data: {
          status: "rejected",
          notes: reason ? `${lead.notes || ""}\nRejet: ${reason}` : lead.notes
        }
      });
      return NextResponse.json({ success: true, status: "rejected" });
    }

    // === APPROVE ===
    if (action === "approve") {
      if (lead.status === "approved") {
        return NextResponse.json({ error: "Cette candidature a déjà été approuvée." }, { status: 400 });
      }

      const referralCode = (lead.name?.substring(0, 3) || "FYN").toUpperCase() + randomInt(1000, 9999);
      const tempPassword = randomBytes(8).toString("hex");
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      const slug = (lead.name || "ambassador")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .substring(0, 30) + "-" + randomInt(100, 999);

      const result = await prisma.$transaction(async (tx) => {
        // 1. Create User
        const user = await tx.user.create({
          data: {
            email: lead.email,
            passwordHash: tempPassword,
            emailVerified: false,
            isAdultConfirmed: true,
            consentSensitiveData: true,
            role: "AMBASSADOR"
          }
        });

        // 2. Create Profile
        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            username: lead.email.split("@")[0] + "-" + randomInt(100, 999),
            age: lead.age || 25,
            city: lead.city || undefined,
            country: lead.country || "FR",
            isVerified: true,
            isPremium: true,
            premiumUntil: oneYearFromNow,
            isFounder: true,
            consentGivenAt: new Date(),
            imageRightsConfirmed: true,
            ageVerified: true,
            referralCode: referralCode,
            referralEarnings: 0
          }
        });

        // 3. Create Ambassador record
        await tx.ambassador.create({
          data: {
            userId: user.id,
            profileId: profile.id,
            publicName: lead.name,
            slug: slug,
            referralCode: referralCode,
            lifetimePremium: true,
            status: "active"
          }
        });

        // 4. Find or create Founder Plan
        let founderPlan = await tx.plan.findFirst({ where: { name: "VIP Fondateur" } });
        if (!founderPlan) {
          founderPlan = await tx.plan.create({
            data: {
              name: "VIP Fondateur",
              duration: 12,
              priceCents: 0,
              currency: "EUR",
              isActive: true
            }
          });
        }

        await tx.subscription.create({
          data: {
            userId: user.id,
            planId: founderPlan.id,
            status: "ACTIVE",
            provider: "founder_program",
            startedAt: new Date(),
            expiresAt: oneYearFromNow
          }
        });

        // 5. Create Consent record
        await tx.consent.create({
          data: {
            userId: user.id,
            type: "ambassador_founder",
            version: "1.0",
            acceptedAt: new Date()
          }
        });

        // 6. Update lead
        await tx.ambassadorLead.update({
          where: { id: ambassadorId },
          data: {
            status: "approved",
            referralCode: referralCode,
            notes: `${lead.notes || ""}\n\nValidé: ${new Date().toISOString()}\nCode: ${referralCode}\nUserID: ${user.id}`
          }
        });

        return { userId: user.id, referralCode };
      });

      return NextResponse.json({
        success: true,
        status: "approved",
        referralCode: result.referralCode,
        userId: result.userId,
        tempPassword
      });

    }

    return NextResponse.json({ error: "Action inconnue. Utilisez 'approve' ou 'reject'." }, { status: 400 });

  } catch (e: any) {
    console.error("Ambassador action error:", e);
    return NextResponse.json({
      error: "Erreur serveur.",
      detail: process.env.NODE_ENV === "development" ? e.message : undefined
    }, { status: 500 });
  }
}
