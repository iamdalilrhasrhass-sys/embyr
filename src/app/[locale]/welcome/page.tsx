"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => {
        if (d.referralCode) setReferralCode(d.referralCode);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const refLink = `https://embir.xyz/auth/register?ref=${referralCode}`;
  const shareMsg = encodeURIComponent(`Je viens de rejoindre Embyr, une app de rencontre gay 100% gratuite ! Rejoins-moi avec mon code ${referralCode} → https://embir.xyz/auth/register?ref=${referralCode}`);

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="emb-page min-h-screen flex items-center justify-center px-4">
      <div className="emb-container max-w-lg text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3">
          Bienvenue sur <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">Embyr</span> !
        </h1>
        <p className="text-white/50 text-lg mb-8">
          Ton compte est créé. Maintenant, invite tes potes et fais grandir la communauté.
        </p>

        {/* Referral card */}
        <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-300 mb-4">
            Ton code de parrainage
          </div>
          <div className="text-3xl md:text-4xl font-black tracking-[0.15em] text-white mb-2">
            {loading ? "..." : referralCode || "EMB-XXXXXX"}
          </div>
          <p className="text-white/40 text-sm mb-6">
            Partage ce code. Chaque personne qui s&apos;inscrit avec devient ton filleul.
          </p>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40 hover:scale-[1.02]"
          >
            {copied ? "✅ Copié !" : "📋 Copier mon lien"}
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <a
            href={`https://wa.me/?text=${shareMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-center"
          >
            💬 WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("Rejoins-moi sur Embyr ! 🏳️‍🌈")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-blue-400/20 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors text-center"
          >
            ✈️ Telegram
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] transition-colors text-center"
          >
            𝕏 Twitter
          </a>
          <a
            href={`sms:?body=${shareMsg}`}
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] transition-colors text-center"
          >
            📱 SMS
          </a>
        </div>

        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/70 backdrop-blur transition-all hover:bg-white/[0.06] hover:text-white"
        >
          Compléter mon profil →
        </Link>
      </div>
    </main>
  );
}
