import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { withApiLogging } from "@/lib/api-logger";
import { sanitizeOperationalError } from "@/lib/email-core";
import { consumePublicForm } from "@/lib/public-form-rate-limit";

async function handlePost(request: NextRequest) {
  try {
    const rateLimit = consumePublicForm(request, "auth-login", 30);
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Trop de tentatives", code: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body: unknown = await request.json();
    const email = body && typeof body === "object" && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
    const password = body && typeof body === "object" && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

    if (!email || !password) {
      return Response.json(
        { error: "Email et mot de passe requis", code: "credentials_required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.bannedAt || user.deletedAt) {
      return Response.json(
        { error: "Email ou mot de passe incorrect", code: "credentials_invalid" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return Response.json(
        { error: "Email ou mot de passe incorrect", code: "credentials_invalid" },
        { status: 401 },
      );
    }

    const token = signToken({ userId: user.id, email: user.email });

    const loginAt = new Date();
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: loginAt },
      }),
      prisma.analyticsEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventName: "login_completed",
          eventVersion: 1,
          userId: user.id,
          occurredAt: loginAt,
          properties: {},
        },
      }),
    ]);

    const response = Response.json({
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      token,
    });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );

    return response;
  } catch (error) {
    console.error("Login error:", sanitizeOperationalError(error));
    return Response.json(
      { error: "Erreur lors de la connexion", code: "login_failed" },
      { status: 500 },
    );
  }
}

export const POST = withApiLogging(handlePost);
