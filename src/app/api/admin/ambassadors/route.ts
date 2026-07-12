import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const leads = await prisma.ambassadorLead.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        city: true,
        country: true,
        instagram: true,
        followers: true,
        platform: true,
        publicUrl: true,
        language: true,
        audienceEstimate: true,
        contactMethod: true,
        contactValue: true,
        notes: true,
        status: true,
        priorityScore: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(leads, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
