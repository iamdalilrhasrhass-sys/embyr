import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const prospectSelect = {
  id: true,
  pseudo: true,
  sourcePlatform: true,
  profileStyle: true,
  city: true,
  country: true,
  publicUrl: true,
  potential: true,
  status: true,
  internalNotes: true,
  lastContactedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const prospects = await prisma.prospect.findMany({
      orderBy: { createdAt: "desc" },
      select: prospectSelect,
    });
    return NextResponse.json(prospects, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.action === 'create') {
      const prospect = await prisma.prospect.create({
        data: {
          pseudo: body.pseudo,
          sourcePlatform: body.sourcePlatform || 'divineva',
          profileStyle: body.profileStyle || '',
          city: body.city || '',
          country: body.country || '',
          publicUrl: body.publicUrl || '',
          potential: body.potential || 'moyen',
          status: 'a_rechercher',
          internalNotes: body.internalNotes || '',
        },
        select: prospectSelect,
      });
      return NextResponse.json(prospect);
    }

    if (body.action === 'update') {
      const updated = await prisma.prospect.update({
        where: { id: body.id },
        data: {
          status: body.status,
          internalNotes: body.internalNotes,
          publicUrl: body.publicUrl,
          lastContactedAt: body.status === 'contacte' ? new Date() : undefined,
        },
        select: prospectSelect,
      });
      return NextResponse.json(updated);
    }

    if (body.action === 'delete') {
      await prisma.prospect.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
