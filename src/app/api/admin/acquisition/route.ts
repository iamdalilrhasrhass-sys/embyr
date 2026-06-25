import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const [totalUsers, payingUsers, events] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.acquisitionEvent.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
    ]);

    const visits = events.filter((e: any) => e.eventType === "visit").length || 1;
    const registrations = events.filter((e: any) => e.eventType === "register").length;
    const checkouts = events.filter((e: any) => e.eventType === "checkout").length;
    const paid = events.filter((e: any) => e.eventType === "paid").length;

    return NextResponse.json({
      totals: { users: totalUsers, paying: payingUsers },
      funnel: { visits, registrations, checkouts, paid }
    });

  } catch (e: any) {
    console.error("Acquisition error:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
