import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeOperationalError } from "@/lib/email-core";
import { consumePublicForm } from "@/lib/public-form-rate-limit";

const MAX_BODY_BYTES = 20_000;

function shortText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function publicUrl(value: unknown): string | null {
  const cleaned = shortText(value, 300);
  if (!cleaned) return null;
  try {
    const parsed = new URL(cleaned);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString().slice(0, 300);
  } catch {
    return null;
  }
}

function responseError(code: string, status: number) {
  return NextResponse.json({ ok: false, code }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = consumePublicForm(request, "ambassador-application", 4);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, code: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return responseError("payload_too_large", 413);

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(rawBody);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return responseError("invalid_request", 400);
      body = parsed as Record<string, unknown>;
    } catch {
      return responseError("invalid_request", 400);
    }

    const name = shortText(body.name, 100);
    const email = shortText(body.email, 255)?.toLowerCase() ?? null;
    const age = Number(body.age);
    const motivation = shortText(body.motivation, 2_000);
    if (!name || !email || !motivation) return responseError("required_fields", 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return responseError("invalid_email", 400);
    if (!Number.isInteger(age) || age < 18 || age > 120) return responseError("minimum_age", 400);
    if (body.consentAge !== true || body.consentContact !== true) return responseError("required_consents", 400);

    const followersValue = body.followers === "" || body.followers === undefined ? null : Number(body.followers);
    const followers = Number.isInteger(followersValue) && Number(followersValue) >= 0
      ? Math.min(Number(followersValue), 1_000_000_000)
      : null;
    const language = ["fr", "en", "es"].includes(String(body.locale)) ? String(body.locale) : "en";
    const profileUrl = publicUrl(body.publicUrl);

    const existing = await prisma.ambassadorLead.findUnique({ where: { email }, select: { id: true } });
    if (existing) return responseError("already_applied", 409);

    await prisma.ambassadorLead.create({
      data: {
        name,
        email,
        age,
        city: shortText(body.city, 100),
        country: shortText(body.country, 100),
        platform: shortText(body.platform, 60),
        publicUrl: profileUrl,
        instagram: String(body.platform).toLowerCase() === "instagram" ? profileUrl : null,
        followers,
        audienceEstimate: followers,
        language,
        contactMethod: "email",
        contactValue: email,
        notes: JSON.stringify({
          motivation,
          consentAge: true,
          consentContact: true,
          consentImage: body.consentImage === true,
          submittedAt: new Date().toISOString(),
        }),
        priorityScore: 0,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Ambassador application error:", sanitizeOperationalError(error));
    return responseError("application_failed", 500);
  }
}
