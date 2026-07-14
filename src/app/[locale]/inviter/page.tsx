"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supportedLocale } from "@/components/connection-os/types";
import AppShell from "@/components/layout/AppShell";
import {
  trackInvitePageView,
  trackReferralLinkCopied,
  trackReferralShare,
} from "@/lib/analytics";

const copy = {
  fr: {
    title: "Inviter sans bruit",
    subtitle: "Partage Embir avec quelques personnes que tu connais. Aucune invitation n’améliore la visibilité ou le matching.",
    code: "Ton code",
    referrals: "Inscriptions attribuées",
    signedOut: "Connecte-toi pour obtenir un lien personnel et suivre les inscriptions attribuées.",
    link: "Lien personnel",
    message: "Message proposé",
    share: "Partager",
    copyLink: "Copier le lien",
    copyMessage: "Copier le message",
    copied: "Copié",
    note: "Envoie ce lien uniquement à des personnes que tu connais. Pas de publication automatique, pas de récompense de visibilité, pas de relance cachée.",
    subject: "Découvre Embir avec moi",
    defaultMessage: "Découvre Embir : des préférences réciproques, une progression vers une vraie rencontre et des connexions essentielles gratuites.",
    personalMessage: (link: string) => `Je teste Embir, une app fondée sur les préférences réciproques et une progression vers une vraie rencontre. Le profil, la découverte, la réciprocité et les messages sont gratuits. Si tu veux essayer avec moi : ${link}`,
  },
  en: {
    title: "Invite with intention",
    subtitle: "Share Embir with a few people you know. Invites never improve profile visibility or matching.",
    code: "Your code",
    referrals: "Attributed signups",
    signedOut: "Sign in to get a personal link and track attributed signups.",
    link: "Personal link",
    message: "Suggested message",
    share: "Share",
    copyLink: "Copy link",
    copyMessage: "Copy message",
    copied: "Copied",
    note: "Send this link only to people you know. No automatic posting, visibility reward or hidden follow-up.",
    subject: "Discover Embir with me",
    defaultMessage: "Discover Embir: reciprocal preferences, real progression and free core connections.",
    personalMessage: (link: string) => `I’m trying Embir, an app built around reciprocal preferences and progression toward a real meeting. Profiles, discovery, reciprocity and messaging are free. Try it with me: ${link}`,
  },
  es: {
    title: "Invita con intención",
    subtitle: "Comparte Embir con algunas personas que conoces. Las invitaciones no mejoran la visibilidad ni el matching.",
    code: "Tu código",
    referrals: "Registros atribuidos",
    signedOut: "Inicia sesión para obtener un enlace personal y seguir los registros atribuidos.",
    link: "Enlace personal",
    message: "Mensaje sugerido",
    share: "Compartir",
    copyLink: "Copiar enlace",
    copyMessage: "Copiar mensaje",
    copied: "Copiado",
    note: "Envía este enlace solo a personas que conoces. Sin publicaciones automáticas, premios de visibilidad ni seguimientos ocultos.",
    subject: "Descubre Embir conmigo",
    defaultMessage: "Descubre Embir: preferencias recíprocas, progresión real y conexiones esenciales gratuitas.",
    personalMessage: (link: string) => `Estoy probando Embir, una app basada en preferencias recíprocas y una progresión hacia un encuentro real. El perfil, el descubrimiento, la reciprocidad y los mensajes son gratuitos. Pruébala conmigo: ${link}`,
  },
};

export default function InviterPage() {
  const params = useParams<{ locale?: string }>();
  const locale = supportedLocale(params.locale ?? "en");
  const text = copy[locale];
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);

  useEffect(() => {
    trackInvitePageView();
    fetch("/api/referral")
      .then((response) => response.json())
      .then((data) => {
        if (!data.referralCode) return;
        setReferralCode(data.referralCode);
        setReferralCount(Number(data.referralCount) || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const referralLink = referralCode
    ? `https://embir.xyz${localePrefix}/auth/register?ref=${encodeURIComponent(referralCode)}&utm_source=member_referral&utm_medium=referral&utm_campaign=member_invite`
    : `https://embir.xyz${localePrefix || "/"}`;
  const message = referralCode ? text.personalMessage(referralLink) : text.defaultMessage;

  async function copyValue(value: string, kind: "link" | "message") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      if (kind === "link") trackReferralLinkCopied();
      else trackReferralShare("copy_message");
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  const channels = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}` },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}` },
    { name: "SMS", href: `sms:?body=${encodeURIComponent(message)}` },
    { name: "Email", href: `mailto:?subject=${encodeURIComponent(text.subject)}&body=${encodeURIComponent(message)}` },
  ];

  return (
    <AppShell>
      <main className="min-h-screen bg-[#0a0614] pb-24 pt-24 text-white">
        <div className="noise-overlay pointer-events-none fixed inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#c56f4e]">Member to member</p>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{text.title}</h1>
          <p className="mb-9 mt-4 max-w-xl leading-relaxed text-white/50">{text.subtitle}</p>

          {loading && (
            <div className="mb-6 min-h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" aria-label="Loading" />
          )}

          {!loading && referralCode && (
            <section className="mb-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#c56f4e]/25 bg-[#c56f4e]/[0.06]">
              <div className="border-r border-[#c56f4e]/20 p-5">
                <h2 className="text-xs uppercase tracking-wider text-white/45">{text.code}</h2>
                <p className="mt-2 break-all font-mono text-xl font-bold text-[#e4a187]">{referralCode}</p>
              </div>
              <div className="p-5 text-right">
                <p className="text-xs uppercase tracking-wider text-white/45">{text.referrals}</p>
                <p className="mt-1 font-serif text-4xl text-white">{referralCount}</p>
              </div>
            </section>
          )}

          {!loading && !referralCode && (
            <p className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5 text-sm text-amber-200/80">{text.signedOut}</p>
          )}

          {referralCode && (
            <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <h2 className="text-lg font-semibold">{text.link}</h2>
              <p className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs leading-relaxed text-[#e4a187]">{referralLink}</p>
              <button type="button" onClick={() => copyValue(referralLink, "link")} className="min-h-11 rounded-full bg-[#c56f4e] px-5 text-sm font-semibold text-[#130b0d] hover:bg-[#e4a187] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {copied === "link" ? text.copied : text.copyLink}
              </button>
            </section>
          )}

          <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <h2 className="text-lg font-semibold">{text.message}</h2>
            <p className="my-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/65">{message}</p>
            <button type="button" onClick={() => copyValue(message, "message")} className="min-h-11 rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {copied === "message" ? text.copied : text.copyMessage}
            </button>
          </section>

          <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">{text.share}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {channels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target={channel.name === "SMS" || channel.name === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={() => trackReferralShare(channel.name)}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {channel.name}
                </a>
              ))}
            </div>
          </section>

          <p className="rounded-2xl border border-[#c56f4e]/15 bg-[#c56f4e]/[0.04] p-5 text-xs leading-relaxed text-[#e4a187]/80">{text.note}</p>
        </div>
      </main>
    </AppShell>
  );
}
