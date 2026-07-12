import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Returns exact active account counts. No synthetic baseline or fake scarcity. */
export async function GET() {
  try {
    const totalUsers = await prisma.user.count({
      where: {
        deletedAt: null,
        bannedAt: null,
      },
    });
    return NextResponse.json({ count: totalUsers, total: totalUsers });
  } catch (error) {
    console.error("Founder count error:", error);
    return NextResponse.json({ error: "Compteur indisponible" }, { status: 503 });
  }
}
