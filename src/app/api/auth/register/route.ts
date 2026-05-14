import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Email invalide" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: "Mot de passe trop court (8 caractères minimum)" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isAdultConfirmed: true,
        consentSensitiveData: true,
        profile: {
          create: {
            username: `user_${Date.now().toString(36)}`,
            age: 18,
          },
        },
        consents: {
          create: [
            { type: "cgu", version: "1.0" },
            { type: "privacy", version: "1.0" },
            { type: "sensitive_data", version: "1.0" },
          ],
        },
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    const response = Response.json(
      {
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
        },
        token,
      },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return Response.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
