import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { withApiLogging } from "@/lib/api-logger";

async function handlePost(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.bannedAt || user.deletedAt) {
      return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
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
    console.error("Login error:", error);
    return Response.json({ error: "Erreur lors de la connexion" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
