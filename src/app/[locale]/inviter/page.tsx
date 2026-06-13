"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

export default function InviterPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referralDays, setReferralDays] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/referral")
      .then((res) => res.json())
      .then((data) => {
        if (data.referralCode) {
          setReferralCode(data.referralCode);
          setReferralCount(data.referralCount || 0);
          setReferralDays(data.referralDays || data.referralCount * 7 || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const referralLink = referralCode
    ? `https://embir.xyz/fr/auth/register?ref=${referralCode}`
    : "";

  const message = referralCode
    ? ` Rejoins-moi sur Embir, la nouvelle app de rencontre gay élégante et gratuite ! Inscris-toi avec mon code ${referralCode} ou via ce lien : ${referralLink}`
    : "Je viens de rejoindre Embir, une nouvelle app de rencontre gay gratuite pendant son lancement. Rejoins les premiers membres : https://embir.xyz";

  const lien = referralLink || "https://embir.xyz";

  const copier = (texte: string, label: string) => {
    navigator.clipboard.writeText(texte).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      alert(`${label} copié !`);
    });
  };

  return (
    <AppShell>
      <main className="min-h-screen text-white pt-20 pb-24" style={{ background: "var(--color-premium-dark)" }}>
        <div className="fixed inset-0 noise-overlay pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
            style={{ background: "linear-gradient(135deg, #E2E8F0 60%, #06B6D4 80%, #6366F1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Invite tes amis sur Embir
          </h1>
          <p className="text-white/40 mb-8">
            Embir est gratuit pendant le lancement. Invite quelques personnes
            à rejoindre les premiers membres.
          </p>

          {/* Compteur de filleuls */}
          {!loading && referralCode && (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Ton code de parrainage</h2>
                  <p className="text-3xl font-black tracking-widest text-cyan-400">{referralCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/40 mb-1">Filleuls</p>
                  <p className="text-3xl font-black text-white">{referralCount}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 mb-6 animate-pulse">
              <div className="h-16 bg-white/[0.03] rounded-xl" />
            </div>
          )}

          {!loading && !referralCode && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 mb-6">
              <p className="text-amber-400/80 text-sm">
                Connecte-toi pour obtenir ton lien de parrainage personnalisé et suivre tes invitations.
              </p>
            </div>
          )}

          {/* Lien de parrainage */}
          {referralCode && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-3">Ton lien de parrainage</h2>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-cyan-400 text-sm mb-4 break-all font-mono">
                {referralLink}
              </div>
              <button
                onClick={() => copier(referralLink, "Lien")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
                {copied === "Lien" ? "✅ Copié !" : "🔗 Copier mon lien"}
              </button>
            </div>
          )}

          {/* Message copiable */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-3">Message à partager</h2>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 text-sm mb-4 whitespace-pre-wrap">
              {message}
            </div>
            <button
              onClick={() => copier(message, "Message")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
              {copied === "Message" ? "✅ Copié !" : "📋 Copier le message"}
            </button>
          </div>

          {/* Boutons de partage */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Partager directement</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-center">
                💬 WhatsApp
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-blue-400/20 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors text-center">
                ✈️ Telegram
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] transition-colors text-center">
                𝕏 Twitter
              </a>

              {/* SMS */}
              <a
                href={`sms:?body=${encodeURIComponent(message)}`}
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] transition-colors text-center">
                📱 SMS
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent("Rejoins-moi sur Embir ")}&body=${encodeURIComponent(message)}`}
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] transition-colors text-center">
                📧 Email
              </a>

              {/* Copier lien */}
              <button
                onClick={() => copier(referralLink, "Lien2")}
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] transition-colors">
                {copied === "Lien2" ? "✅ Copié !" : "🔗 Copier lien"}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-5">
            <p className="text-xs text-amber-400/70">
              ✦ Les premiers membres actifs recevront le badge Fondateur et
              des avantages Premium offerts lors du lancement des options payantes.
            </p>
          </div>

          {/* Premium reward banner */}
          {referralCode && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎁</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">7 jours Premium offerts par filleul</h3>
                  <p className="text-sm text-white/50 mb-3">
                    Chaque ami qui s'inscrit avec ton lien te rapporte <strong className="text-emerald-400">7 jours de Premium</strong>.
                    Les jours s'accumulent automatiquement. Plus tu invites, plus tu gagnes !
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-2xl font-black">{referralCount}</span>
                    <span className="text-white/40 text-sm">filleuls · {referralDays} jours Premium cumulés</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
