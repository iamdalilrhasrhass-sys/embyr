import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, age, city, country, instagram, platform, followers, motivation, consentAge, consentContact, consentImage } = body;

    // Validations
    if (!name || !email) {
      return NextResponse.json({ error: "Nom et email obligatoires." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return NextResponse.json({ error: "Âge minimum : 18 ans." }, { status: 400 });
    }

    if (!consentAge || !consentContact || !consentImage) {
      return NextResponse.json({ error: "Tous les consentements sont obligatoires." }, { status: 400 });
    }

    // Vérifier doublon email
    const existing = await prisma.ambassadorLead.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Une candidature existe déjà avec cet email." }, { status: 409 });
    }

    // Création du lead
    const lead = await prisma.ambassadorLead.create({
      data: {
        name,
        email,
        age: parsedAge,
        city: city || null,
        country: country || null,
        instagram: instagram || null,
        platform: platform || null,
        followers: followers ? parseInt(followers) : null,
        notes: motivation ? JSON.stringify({
          motivation,
          consentContact,
          consentImage,
          consentAge,
          submittedAt: new Date().toISOString()
        }) : null,
        priorityScore: 10,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Candidature reçue. Notre équipe examine ton profil sous 48h."
    });

  } catch (e: any) {
    console.error("Apply error:", e);
    return NextResponse.json({ error: "Erreur serveur. Réessaie plus tard." }, { status: 500 });
  }
}
