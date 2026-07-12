import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { verifyAdminPassword, createAdminSessionToken } from "@/lib/admin-auth";
import {
  clearAdminLoginAttempts,
  consumeAdminLoginAttempt,
} from "@/lib/admin-login-rate-limit";

function loginKey(req: NextRequest): string {
  const address =
    req.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(address).digest("hex");
}

function dashboardUrl(req: NextRequest, failed = false): URL {
  return new URL(`/analytics-dashboard${failed ? "?error=1" : ""}`, req.url);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== req.nextUrl.host) {
        return NextResponse.json({ error: "Origine invalide" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Origine invalide" }, { status: 403 });
    }
  }

  const key = loginKey(req);
  const rateLimit = consumeAdminLoginAttempt(key);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.redirect(dashboardUrl(req, true), 303);
  }
  const submittedPassword = formData.get("password");
  const password = typeof submittedPassword === "string" ? submittedPassword : "";

  if (!password || password.length > 256) {
    return NextResponse.redirect(dashboardUrl(req, true), 303);
  }

  if (verifyAdminPassword(password)) {
    clearAdminLoginAttempts(key);
    const sessionToken = createAdminSessionToken();
    const response = NextResponse.redirect(dashboardUrl(req), 303);
    response.cookies.set("embir_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });
    return response;
  }

  return NextResponse.redirect(dashboardUrl(req, true), 303);
}
