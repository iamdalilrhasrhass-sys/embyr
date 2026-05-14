import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, city, birthDate, gender } = await request.json();

    // Map gender strings to GenderIdentity enum
    const genderMap: Record<string, string> = {
      female: "FEMME", femme: "FEMME",
      male: "HOMME", homme: "HOMME",
      trans_woman: "FEMME_TRANS", femme_trans: "FEMME_TRANS",
      travesti: "TRAVESTI",
      personne_feminine: "PERSONNE_FEMININE",
      couple: "COUPLE", autre: "AUTRE", non_binaire: "AUTRE",
    };
    const genderIdentity = gender ? (genderMap[gender.toLowerCase()] || "AUTRE") : undefined;

    if (!email || !password) {
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Email invalide" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: "Mot de passe trop court (8 caracteres minimum)" }, { status: 400 });
    }

    // Calculer l'age depuis la date de naissance
    let calculatedAge = 18;
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "Un compte existe deja avec cet email" }, { status: 409 });
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
            displayName: name || null,
            age: calculatedAge,
            birthdate: birthDate ? new Date(birthDate) : null,
            city: city || null,
            genderIdentity: (genderIdentity as any) || null,
            profileCompletionScore: (name ? 20 : 0) + (city ? 10 : 0) + (birthDate ? 10 : 0),
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
      { user: { id: user.id, email: user.email, emailVerified: user.emailVerified }, token },
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
