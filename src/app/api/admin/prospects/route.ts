import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const prospectSelect = {
  id: true,
  pseudo: true,
  sourcePlatform: true,
  organizationType: true,
  profileStyle: true,
  city: true,
  country: true,
  publicUrl: true,
  publicContact: true,
  contactChannel: true,
  contactSourceUrl: true,
  potential: true,
  status: true,
  permissionStatus: true,
  permissionRequestedAt: true,
  permissionGrantedAt: true,
  optedOutAt: true,
  nextFollowUpAt: true,
  campaign: true,
  utmSource: true,
  internalNotes: true,
  lastContactedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

const permissionStatuses = new Set([
  "not_requested",
  "permission_requested",
  "permission_granted",
  "permission_denied",
  "opted_out",
]);
const prospectStatuses = new Set([
  "a_rechercher",
  "researched",
  "contacte",
  "replied",
  "meeting",
  "active",
  "partenaire_actif",
  "closed",
]);

function text(value: unknown, max: number, required = false): string | null {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error("Champ requis");
    return null;
  }
  if (typeof value !== "string") throw new Error("Texte invalide");
  const clean = value.trim();
  if (!clean || clean.length > max || /[\u0000-\u001f\u007f]/.test(clean)) {
    throw new Error("Texte invalide");
  }
  return clean;
}

function url(value: unknown): string | null {
  const clean = text(value, 500);
  if (!clean) return null;
  const parsed = new URL(clean);
  if (parsed.protocol !== "https:") throw new Error("URL publique invalide");
  return parsed.toString();
}

function optionalText(value: unknown, max: number): string | null | undefined {
  return value === undefined ? undefined : text(value, max);
}

function optionalUrl(value: unknown): string | null | undefined {
  return value === undefined ? undefined : url(value);
}

function requirePublicProvenance(
  publicContact: string | null | undefined,
  contactSourceUrl: string | null | undefined,
): void {
  if (publicContact && !contactSourceUrl) {
    throw new Error("La provenance publique du contact est requise");
  }
}

function date(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new Error("Date invalide");
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error("Date invalide");
  return parsed;
}

function status(value: unknown, allowed: Set<string>, fallback?: string): string {
  const clean = text(value, 40) ?? fallback;
  if (!clean || !allowed.has(clean)) throw new Error("Statut invalide");
  return clean;
}

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

    if (body.action === "create") {
      const publicContact = text(body.publicContact, 254);
      const contactSourceUrl = url(body.contactSourceUrl);
      requirePublicProvenance(publicContact, contactSourceUrl);
      const prospect = await prisma.prospect.create({
        data: {
          pseudo: text(body.pseudo, 120, true)!,
          sourcePlatform: text(body.sourcePlatform, 80, true)!,
          organizationType: text(body.organizationType, 80),
          profileStyle: text(body.profileStyle, 120),
          city: text(body.city, 120),
          country: text(body.country, 80),
          publicUrl: url(body.publicUrl),
          publicContact,
          contactChannel: text(body.contactChannel, 40),
          contactSourceUrl,
          potential: text(body.potential, 40) ?? "moyen",
          status: status(body.status, prospectStatuses, "a_rechercher"),
          permissionStatus: status(
            body.permissionStatus,
            permissionStatuses,
            "not_requested",
          ),
          permissionRequestedAt: date(body.permissionRequestedAt),
          permissionGrantedAt: date(body.permissionGrantedAt),
          optedOutAt: date(body.optedOutAt),
          nextFollowUpAt: date(body.nextFollowUpAt),
          campaign: text(body.campaign, 120),
          utmSource: text(body.utmSource, 80),
          internalNotes: text(body.internalNotes, 2_000),
        },
        select: prospectSelect,
      });
      return NextResponse.json(prospect);
    }

    if (body.action === "update") {
      const id = text(body.id, 80, true)!;
      const current = await prisma.prospect.findUnique({
        where: { id },
        select: {
          status: true,
          permissionStatus: true,
          publicContact: true,
          contactSourceUrl: true,
          optedOutAt: true,
        },
      });
      if (!current) {
        return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });
      }
      const permissionStatus = status(
        body.permissionStatus,
        permissionStatuses,
        current.permissionStatus,
      );
      if (current.optedOutAt && permissionStatus !== "opted_out") {
        return NextResponse.json(
          { error: "Une opposition enregistrée ne peut pas être annulée" },
          { status: 409 },
        );
      }
      const publicContact = optionalText(body.publicContact, 254);
      const contactSourceUrl = optionalUrl(body.contactSourceUrl);
      requirePublicProvenance(
        publicContact === undefined ? current.publicContact : publicContact,
        contactSourceUrl === undefined ? current.contactSourceUrl : contactSourceUrl,
      );
      const now = new Date();
      const updated = await prisma.prospect.update({
        where: { id },
        data: {
          status: status(body.status, prospectStatuses, current.status),
          permissionStatus,
          internalNotes: optionalText(body.internalNotes, 2_000),
          publicUrl: optionalUrl(body.publicUrl),
          publicContact,
          contactChannel: optionalText(body.contactChannel, 40),
          contactSourceUrl,
          nextFollowUpAt: date(body.nextFollowUpAt),
          lastContactedAt: body.status === "contacte" ? now : undefined,
          permissionRequestedAt:
            permissionStatus === "permission_requested" &&
            current.permissionStatus !== permissionStatus
              ? now
              : undefined,
          permissionGrantedAt:
            permissionStatus === "permission_granted" &&
            current.permissionStatus !== permissionStatus
              ? now
              : undefined,
          optedOutAt:
            permissionStatus === "opted_out" &&
            current.permissionStatus !== permissionStatus
              ? now
              : undefined,
        },
        select: prospectSelect,
      });
      return NextResponse.json(updated);
    }

    if (body.action === "delete") {
      const id = text(body.id, 80, true)!;
      const current = await prisma.prospect.findUnique({
        where: { id },
        select: { permissionStatus: true, lastContactedAt: true },
      });
      if (!current) {
        return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });
      }
      if (current.permissionStatus !== "not_requested" || current.lastContactedAt) {
        return NextResponse.json(
          { error: "L’historique d’autorisation doit être conservé" },
          { status: 409 },
        );
      }
      await prisma.prospect.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
