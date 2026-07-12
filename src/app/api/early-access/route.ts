import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { consumePublicForm } from "@/lib/public-form-rate-limit";

const schema = z.object({
  email: z.string().email(),
  city: z.string().trim().min(1).max(100),
  country: z.string().trim().max(80).optional(),
  orientation: z.string().trim().max(40).optional(),
  preference: z.string().trim().max(40).optional(),
  relationType: z.string().trim().max(40).optional(),
  source: z.string().trim().max(80).optional(),
  consent: z.literal(true),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const rateLimit = consumePublicForm(req, "early-access", 5);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const properties: Record<string, string> = { city: parsed.data.city };
    if (parsed.data.country) properties.country = parsed.data.country;
    if (parsed.data.source) properties.source = parsed.data.source;

    // Contact data belongs in an access-request record, never in analytics.
    await prisma.$transaction([
      prisma.feedback.create({
        data: {
          type: "early_access",
          message: JSON.stringify({
            city: parsed.data.city,
            country: parsed.data.country ?? null,
            source: parsed.data.source ?? "early_access_page",
            communicationsConsent: true,
          }),
          userEmail: parsed.data.email.toLowerCase(),
          pageUrl: "/early-access",
          userAgent: null,
        },
      }),
      prisma.analyticsEvent.create({
        data: {
          eventId: randomUUID(),
          eventName: "early_access_signup",
          eventVersion: 1,
          occurredAt: new Date(),
          properties,
          page: "/early-access",
          ipAddress: null,
          userAgent: null,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Early access error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
