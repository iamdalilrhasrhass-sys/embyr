import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

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
