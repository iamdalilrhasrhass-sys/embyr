import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, email, referralCode, referredBy } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "userId et email requis" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.HERMES_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || "836643845";

    if (!botToken) {
      console.log("[notify-signup] No Telegram bot token configured, skipping notification");
      return NextResponse.json({ skipped: true, reason: "no_bot_token" });
    }

    const totalUsers = await prisma.user.count();

    const message = [
      `🆕 **Nouvelle inscription Embir !**`,
      ``,
      `📧 Email: \`${email}\``,
      `🆔 ID: \`${userId}\``,
      referralCode ? `🔗 Code parrainage: \`${referralCode}\`` : "",
      referredBy ? `👤 Parrainé par: \`${referredBy}\`` : "",
      ``,
      `👥 Total utilisateurs: **${totalUsers}**`,
      ``,
      `🌐 [embir.xyz](https://embir.xyz)`,
    ]
      .filter(Boolean)
      .join("\n");

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const telegramResult = await res.json();

    if (!res.ok) {
      console.error("[notify-signup] Telegram error:", telegramResult);
      return NextResponse.json({ error: "telegram_failed", details: telegramResult }, { status: 500 });
    }

    return NextResponse.json({ success: true, totalUsers });
  } catch (error) {
    console.error("[notify-signup] Error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
