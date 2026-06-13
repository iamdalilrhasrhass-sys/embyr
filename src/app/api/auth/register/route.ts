import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

// Génère un code de parrainage unique format EMB-XXXXXXXX
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O/1/I pour éviter confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EMB-${code}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, city, birthDate, gender, referralCode } = await request.json();

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

    const LIFETIME_DATE = new Date("2099-12-31T23:59:59Z");

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isAdultConfirmed: true,
        consentSensitiveData: true,
        role: "AMBASSADOR",
        referralCode: userReferralCode,
        referredBy: referredById ? referralCode?.trim() : null,
        profile: {
          create: {
            username: `user_${Date.now().toString(36)}`,
            displayName: name || null,
            age: calculatedAge,
            birthdate: birthDate ? new Date(birthDate) : null,
            city: city || null,
            genderIdentity: (genderIdentity as any) || null,
            profileCompletionScore: (name ? 20 : 0) + (city ? 10 : 0) + (birthDate ? 10 : 0),
            referralCode: userReferralCode,
            isPremium: true,
            premiumUntil: LIFETIME_DATE,
            isFounder: true,
            courtesyBadges: ["ambassadeur"],
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

    // Créer le record Ambassador
    await prisma.ambassador.create({
      data: {
        userId: user.id,
        profileId: user.id,
        publicName: name || email.split("@")[0],
        slug: `amb-${user.id.slice(0, 8)}`,
        bio: "Ambassadeur·ice EMBIR — accès gratuit à vie",
        socialLinks: "{}",
        referralCode: userReferralCode,
        lifetimePremium: true,
        status: "active",
      },
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
        `📧 Email: \`${email}\``,
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
