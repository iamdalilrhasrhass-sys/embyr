"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface ReferralData {
  referralCode: string | null;
  referralCount: number;
  referralDays?: number;
  referralLink: string | null;
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/referral", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const copyLink = useCallback(() => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  const shareLinks = data?.referralLink
    ? {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent("I found a dating app built around reciprocal preferences and real progression. Everything needed to meet someone is free. No credit card required. Join me on Embir:")}&url=${encodeURIComponent(data.referralLink)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.referralLink)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent("Join me on Embir — reciprocal connections without swipe fatigue: " + data.referralLink)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(data.referralLink)}&text=${encodeURIComponent("Join me on Embir — dating without swipe fatigue")}`,
        email: `mailto:?subject=${encodeURIComponent("Join me on Embir")}&body=${encodeURIComponent("Embir is built around reciprocal preferences and real progression. Everything needed to meet someone is free. No credit card required. Join me: " + data.referralLink)}`,
      }
    : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-embir-void text-white">
        <div className="animate-pulse text-embir-rose">Loading your referral hub…</div>
      </div>
    );
  }

  if (error || !data?.referralCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-embir-void p-6 text-white md:p-12">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-6">🔐</div>
          <h1 className="text-2xl font-bold mb-3 text-white">Log in to access your referral hub</h1>
          <p className="text-white/50 mb-8">Your unique referral code is tied to your Embir account.</p>
          <a href="/auth/login" className="inline-block rounded-full bg-embir-rose px-8 py-3 font-bold text-embir-void transition-colors hover:bg-embir-blush">
            Log in to Embir
          </a>
          <p className="mt-4 text-sm text-white/30">
            No account yet?{" "}
            <a href="/auth/register" className="text-embir-rose underline">
              Create one free
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-embir-void p-6 text-white md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-embir-rose/70">Referral Hub</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-white mb-4">
            Build the <span className="text-embir-rose">founding community</span> together
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Invite people you genuinely trust. A denser, compatible local community makes every reciprocal connection more useful.
          </p>
        </div>

        {/* Honest community message — no synthetic scarcity. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-embir-rose-deep/20 bg-gradient-to-r from-embir-rose-deep/10 via-embir-rose/5 to-embir-plum-soft/10 p-6"
        >
          <p className="text-sm font-semibold text-embir-blush">Quality before volume</p>
          <p className="mt-2 text-sm leading-relaxed text-white/50">Share your link selectively. Embir never invents member counts, fake activity or artificial scarcity.</p>
        </motion.div>

        {/* Referral Link Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 mb-6">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Your referral link</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              readOnly
              value={data.referralLink || ""}
              className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white/80 font-mono focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="whitespace-nowrap rounded-lg bg-embir-rose px-6 py-3 text-sm font-bold text-embir-void transition-colors hover:bg-embir-blush"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* Social Share */}
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Share your link</p>
          <div className="flex flex-wrap gap-2">
            {shareLinks && (
              <>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] text-center py-2.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors text-sm">
                  𝕏 Twitter
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] text-center py-2.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors text-sm">
                  f Facebook
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] text-center py-2.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors text-sm">
                  ✆ WhatsApp
                </a>
                <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] text-center py-2.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors text-sm">
                  ✈ Telegram
                </a>
                <a href={shareLinks.email} className="flex-1 min-w-[100px] text-center py-2.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors text-sm">
                  ✉ Email
                </a>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="text-2xl mb-1">👥</p>
            <p className="text-3xl font-black text-white">{data.referralCount}</p>
            <p className="text-white/30 text-xs">Friends invited</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="text-2xl mb-1">🎯</p>
            <p className="text-3xl font-black text-white">{data.referralCode}</p>
            <p className="text-white/30 text-xs">Your code</p>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6">
          <h2 className="text-xl font-serif text-white mb-4">How invitations work</h2>
          <div className="space-y-4 text-sm text-white/55">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-embir-rose/10 text-xs font-bold text-embir-rose">1</span>
              <p>Share your unique referral link with people you trust — friends, community members, anyone who'd benefit from a better dating experience.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-embir-rose/10 text-xs font-bold text-embir-rose">2</span>
              <p>When they sign up via your link, they're automatically tracked as your referral. No codes to remember, no extra steps.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-embir-rose/10 text-xs font-bold text-embir-rose">3</span>
              <p>Your dashboard shows the exact number of completed referrals. Invitations never create paid privileges, safety shortcuts or priority over other compatible members.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
