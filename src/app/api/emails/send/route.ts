import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { enqueueUserEmail } from "@/lib/email-outbox";
import type { UserEmailTemplateType } from "@/lib/email-core";
import { buildJobWindow } from "@/lib/job-schedule";

function validUserId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 128;
}

function normalizeArticles(value: unknown): Array<{ title: string; url: string }> {
  if (!Array.isArray(value)) return [];
  const articles: Array<{ title: string; url: string }> = [];
  for (const item of value.slice(0, 5)) {
    if (!item || typeof item !== "object") continue;
    const title = (item as { title?: unknown }).title;
    const rawUrl = (item as { url?: unknown }).url;
    if (typeof title !== "string" || typeof rawUrl !== "string") continue;
    try {
      const url = new URL(rawUrl);
      if (
        url.protocol !== "https:" ||
        (url.hostname !== "embir.xyz" && !url.hostname.endsWith(".embir.xyz"))
      ) {
        continue;
      }
      articles.push({ title: title.slice(0, 120), url: url.toString() });
    } catch {}
  }
  return articles;
}

function buildEmailRequest(
  type: unknown,
  userId: string,
  data: unknown,
): {
  type: UserEmailTemplateType;
  subject: string;
  data: Record<string, unknown>;
  dedupeKey: string;
} | null {
  const objectData =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};

  if (type === "welcome") {
    return {
      type,
      subject: "Bienvenue sur Embir",
      data: {},
      dedupeKey: `welcome:${userId}:v1`,
    };
  }
  if (type === "profile-reminder") {
    const rawPercent = Number(objectData.completionPercent ?? 0);
    const completionPercent = Number.isFinite(rawPercent)
      ? Math.max(0, Math.min(100, Math.round(rawPercent)))
      : 0;
    const day = buildJobWindow("daily").bucketStart.toISOString().slice(0, 10);
    return {
      type,
      subject: `Ton profil Embir est complété à ${completionPercent}%`,
      data: { completionPercent },
      dedupeKey: `profile-reminder:${userId}:${day}`,
    };
  }
  if (type === "weekly-digest") {
    const rawMatches = Number(objectData.newMatches ?? 0);
    const newMatches = Number.isFinite(rawMatches)
      ? Math.max(0, Math.min(10_000, Math.round(rawMatches)))
      : 0;
    const week = buildJobWindow("weekly").bucketStart.toISOString().slice(0, 10);
    return {
      type,
      subject: "Ton récapitulatif Embir",
      data: {
        newMatches,
        topArticles: normalizeArticles(objectData.topArticles),
      },
      dedupeKey: `weekly-digest:${userId}:${week}`,
    };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Accès administrateur requis" },
      { status: 401 },
    );
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 32_768) {
    return NextResponse.json({ error: "Requête trop volumineuse" }, { status: 413 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }
    const { type, userId, data } = body as Record<string, unknown>;
    if (!validUserId(userId)) {
      return NextResponse.json({ error: "userId invalide" }, { status: 400 });
    }
    const request = buildEmailRequest(type, userId, data);
    if (!request) {
      return NextResponse.json({ error: "Type d’email invalide" }, { status: 400 });
    }

    const result = await enqueueUserEmail({ userId, ...request });
    return NextResponse.json(result, { status: 202 });
  } catch {
    return NextResponse.json(
      { error: "Impossible de mettre l’email en file d’attente" },
      { status: 500 },
    );
  }
}
