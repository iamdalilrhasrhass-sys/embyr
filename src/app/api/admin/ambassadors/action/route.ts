import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    const { action, ambassadorId, reason } = body as Record<string, unknown>;

    if (typeof ambassadorId !== "string" || !ambassadorId || typeof action !== "string") {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    const lead = await prisma.ambassadorLead.findUnique({
      where: { id: ambassadorId },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        city: true,
        country: true,
        notes: true,
        status: true,
      },
    });
    if (!lead) {
      return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 });
    }

    // === REJECT ===
    if (action === "reject") {
      await prisma.ambassadorLead.update({
        where: { id: ambassadorId },
        data: {
          status: "REJECTED",
          notes:
            typeof reason === "string" && reason.trim()
              ? `${lead.notes || ""}\nRejet: ${reason.trim().slice(0, 500)}`
              : lead.notes
        }
      });
      return NextResponse.json({ success: true, status: "REJECTED" });
    }

    // === APPROVE ===
    if (action === "approve") {
      if (lead.status.toUpperCase() === "APPROVED") {
        return NextResponse.json({ error: "Cette candidature a déjà été approuvée." }, { status: 400 });
      }

      const referralCode = (lead.name?.substring(0, 3) || "FYN").toUpperCase() + randomInt(1000, 9999);
      const result = await prisma.ambassadorLead.update({
        where: { id: ambassadorId },
        data: {
          status: "APPROVED",
          referralCode,
          notes: `${lead.notes || ""}\n\nCandidature validée: ${new Date().toISOString()}\nCode: ${referralCode}`,
        },
        select: { id: true, referralCode: true },
      });

      return NextResponse.json(
        {
          success: true,
          status: "APPROVED",
          referralCode: result.referralCode,
          accountCreated: false,
          message: "Candidature validée. La personne doit créer et consentir à son propre compte.",
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );

    }

    return NextResponse.json({ error: "Action inconnue. Utilisez 'approve' ou 'reject'." }, { status: 400 });

  } catch {
    console.error("Ambassador action failed");
    return NextResponse.json({
      error: "Erreur serveur.",
    }, { status: 500 });
  }
}
