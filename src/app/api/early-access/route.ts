import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  city: z.string().min(1),
  country: z.string().optional(),
  orientation: z.string().optional(),
  preference: z.string().optional(),
  relationType: z.string().optional(),
  source: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Save as AnalyticsEvent to ensure we capture the lead without needing a schema migration right now
    await prisma.analyticsEvent.create({
      data: {
        eventName: "early_access_signup",
        properties: parsed.data as any,
        page: "/early-access",
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Early access error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
