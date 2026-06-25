import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { validateRegistrationInput } from "@/lib/registration";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EMB-${code}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      isAdult,
      acceptTerms,
      acceptPrivacy,
      name,
      city,
      birthDate,
      gender,
      referralCode,
      consentSensitiveData,
    } = body;

    // Validate all consent flags explicitly
    const validation = validateRegistrationInput({
      email,
      password,
      isAdult,
      acceptTerms,
      acceptPrivacy,
      consentSensitiveData,
      birthDate,
    });

    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }

    const validated = validation.value;

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

    // Calculer l'age depuis la date de naissance
    let calculatedAge = 18;
    if (validated.birthDate) {
      const birth = new Date(validated.birthDate);
      const today = new Date();
      calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existingUser) {
      return Response.json({ error: "Un compte existe deja avec cet email" }, { status: 409 });
    }

    const passwordHash = await hashPassword(validated.password);

    // Générer un code de parrainage unique
    let userReferralCode = generateReferralCode();
    let attempts = 0;
    while (await prisma.user.findUnique({ where: { referralCode: userReferralCode } })) {
      userReferralCode = generateReferralCode();
      attempts++;
      if (attempts > 10) {
        userReferralCode = `EMB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
        break;
      }
    }

    // Vérifier le code de parrainage si fourni
    let referredById: string | null = null;
    if (referralCode && referralCode.trim()) {
      const sponsor = await prisma.user.findFirst({
        where: { referralCode: referralCode.trim() },
        select: { id: true },
      });
      if (sponsor) {
        referredById = sponsor.id;
      }
    }

    // Build consents array from explicitly accepted flags only
    const consentsToCreate: { type: string; version: string }[] = [];
    if (validated.acceptTerms) {
      consentsToCreate.push({ type: "cgu", version: "1.0" });
    }
    if (validated.acceptPrivacy) {
      consentsToCreate.push({ type: "privacy", version: "1.0" });
    }
    if (validated.consentSensitiveData) {
      consentsToCreate.push({ type: "sensitive_data", version: "1.0" });
    }

    // NO privilege fabrication: role stays USER, no auto-premium, no ambassador creation
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        isAdultConfirmed: validated.isAdult,
        consentSensitiveData: validated.consentSensitiveData,
        role: "USER",
        referralCode: userReferralCode,
        referredBy: referredById ? referralCode?.trim() : null,
        profile: {
          create: {
            username: `user_${Date.now().toString(36)}`,
            displayName: name || null,
            age: calculatedAge,
            birthdate: validated.birthDate ? new Date(validated.birthDate) : null,
            city: city || null,
            genderIdentity: (genderIdentity as any) || null,
            profileCompletionScore: (name ? 20 : 0) + (city ? 10 : 0) + (validated.birthDate ? 10 : 0),
            referralCode: userReferralCode,
          },
        },
        consents: consentsToCreate.length > 0
          ? { create: consentsToCreate }
          : undefined,
      },
      include: { profile: true },
    });

    // ── Referral reward: grant 7 premium days to referrer ──
    if (referredById) {
      const REFERRAL_REWARD_DAYS = 7;
      const rewardMs = REFERRAL_REWARD_DAYS * 24 * 60 * 60 * 1000;

      const sponsorProfile = await prisma.profile.findUnique({
        where: { userId: referredById },
        select: { id: true, premiumUntil: true, referralEarnings: true },
      });

      if (sponsorProfile) {
        const now = new Date();
        const currentUntil = sponsorProfile.premiumUntil;
        const base = currentUntil && currentUntil > now ? currentUntil : now;
        const newUntil = new Date(base.getTime() + rewardMs);

        await prisma.profile.update({
          where: { id: sponsorProfile.id },
          data: {
            isPremium: true,
            premiumUntil: newUntil,
            referralEarnings: { increment: REFERRAL_REWARD_DAYS },
          },
        });

        console.log(`[referral reward] sponsor=${referredById} days=${REFERRAL_REWARD_DAYS} newUntil=${newUntil.toISOString()}`);
      }
    }

    const token = signToken({ userId: user.id, email: user.email });

    // Notification Telegram (fire-and-forget)
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.HERMES_TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || "836643845";
    if (botToken) {
      const totalUsers = await prisma.user.count();
      const notifMsg = [
        `🆕 **Nouvelle inscription Embir !**`,
        ``,
        `📧 Email: \`${validated.email}\``,
        `🆔 ID: \`${user.id}\``,
        userReferralCode ? `🔗 Code: \`${userReferralCode}\`` : "",
        referredById ? `👤 Parrainé: Oui` : "",
        ``,
        `👥 Total: **${totalUsers}**`,
      ].filter(Boolean).join("\n");

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: notifMsg,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }).catch((e) => console.error("[register] Telegram notif failed:", e));
    }

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
