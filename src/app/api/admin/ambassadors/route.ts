import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.ambassadorLead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads);
  } catch (e) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
