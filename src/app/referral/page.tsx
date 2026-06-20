"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReferralData {
  referralCode: string | null;
  referralCount: number;
  referralDays: number;
  referralLink: string | null;
}

const FOUNDER_LIMIT = 100;
const REWARD_TIERS = [
  { invites: 1, reward: "7 days of premium", icon: "✨", unlocked: false },
  { invites: 3, reward: "21 days of premium + priority Discover placement", icon: "🚀", unlocked: false },
  { invites: 5, reward: "Founder badge on your profile", icon: "👑", unlocked: false },
  { invites: 10, reward: "Lifetime premium access + exclusive ambassador status", icon: "💎", unlocked: false },
  { invites: 25, reward: "Co-creator status — shape Embir's roadmap", icon: "🔮", unlocked: false },
];

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [founderCount, setFounderCount] = useState(13);

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

    // Fetch founder count
    fetch("/api/founder-count", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => d?.count && setFounderCount(d.count))
      .catch(() => {});
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
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent("I found a dating app that's actually different — no swipe fatigue, verified profiles, free at launch. Join me on Embir:")}&url=${encodeURIComponent(data.referralLink)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.referralLink)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent("Join me on Embir — a dating app without swipe fatigue. Free at launch: " + data.referralLink)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(data.referralLink)}&text=${encodeURIComponent("Join me on Embir — dating without swipe fatigue")}`,
        email: `mailto:?subject=${encodeURIComponent("Join me on Embir")}&body=${encodeURIComponent("I've been using Embir — a dating app that's actually different. No swipe fatigue, verified profiles, free at launch. Join me: " + data.referralLink)}`,
      }
    : null;

  const remainingFounderSpots = Math.max(0, FOUNDER_LIMIT - founderCount);
  const founderProgress = (founderCount / FOUNDER_LIMIT) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06030F] text-white flex items-center justify-center">
        <div className="animate-pulse text-[#d4a574]">Loading your referral hub…</div>
      </div>
    );
  }

  if (error || !data?.referralCode) {
    return (
      <div className="min-h-screen bg-[#06030F] text-white p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-6">🔐</div>
          <h1 className="text-2xl font-bold mb-3 text-white">Log in to access your referral hub</h1>
          <p className="text-white/50 mb-8">Your unique referral code and rewards are tied to your Embir account.</p>
          <a href="/auth/login" className="inline-block px-8 py-3 bg-[#d4a574] text-[#0a0614] rounded-full font-bold hover:bg-[#ff5e36] transition-colors">
            Log in to Embir
          </a>
          <p className="mt-4 text-sm text-white/30">
            No account yet?{" "}
            <a href="/auth/register" className="text-[#d4a574] underline">
              Create one free
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06030F] text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#d4a574]/70 mb-3">Referral Hub</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-white mb-4">
            Build the <span className="text-[#d4a574]">founding community</span> together
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Every person you invite makes Embir better for everyone. Earn premium access, founder status, and shape the future of dating.
          </p>
        </div>

        {/* FOMO Banner — Founder Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-[#ff5e36]/20 bg-gradient-to-r from-[#ff5e36]/10 via-[#d4a574]/5 to-[#ff1f5a]/10 p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-white/60">Founding members</p>
              <p className="text-3xl font-black text-white">
                {founderCount}<span className="text-white/30 text-lg">/{FOUNDER_LIMIT}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#ff5e36] font-bold">{remainingFounderSpots} spots left</p>
              <p className="text-xs text-white/40">at current rate</p>
            </div>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${founderProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#d4a574] via-[#ff5e36] to-[#ff1f5a]"
            />
          </div>
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
              className="px-6 py-3 bg-[#d4a574] text-[#0a0614] rounded-lg text-sm font-bold hover:bg-[#ff5e36] transition-colors whitespace-nowrap"
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
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="text-2xl mb-1">👥</p>
            <p className="text-3xl font-black text-white">{data.referralCount}</p>
            <p className="text-white/30 text-xs">Friends invited</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="text-2xl mb-1">⭐</p>
            <p className="text-3xl font-black text-white">{data.referralDays}</p>
            <p className="text-white/30 text-xs">Premium days earned</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="text-2xl mb-1">🎯</p>
            <p className="text-3xl font-black text-white">{data.referralCode}</p>
            <p className="text-white/30 text-xs">Your code</p>
          </div>
        </div>

        {/* Reward Tiers */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-5">Reward journey</h2>
          <div className="space-y-3">
            {REWARD_TIERS.map((tier, i) => {
              const unlocked = data.referralCount >= tier.invites;
              const progress = Math.min(100, (data.referralCount / tier.invites) * 100);
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-5 transition-all ${
                    unlocked
                      ? "border-[#d4a574]/30 bg-[#d4a574]/[0.05]"
                      : "border-white/[0.06] bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${unlocked ? "" : "opacity-30 grayscale"}`}>{tier.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{tier.invites} invites</span>
                        {unlocked && <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4a574] text-[#0a0614] font-bold">UNLOCKED</span>}
                      </div>
                      <p className="text-sm text-white/50">{tier.reward}</p>
                    </div>
                  </div>
                  {!unlocked && (
                    <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4a574]/40 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6">
          <h2 className="text-xl font-serif text-white mb-4">How invitations work</h2>
          <div className="space-y-4 text-sm text-white/55">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4a574]/10 text-[#d4a574] flex items-center justify-center font-bold text-xs">1</span>
              <p>Share your unique referral link with people you trust — friends, community members, anyone who'd benefit from a better dating experience.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4a574]/10 text-[#d4a574] flex items-center justify-center font-bold text-xs">2</span>
              <p>When they sign up via your link, they're automatically tracked as your referral. No codes to remember, no extra steps.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4a574]/10 text-[#d4a574] flex items-center justify-center font-bold text-xs">3</span>
              <p>You earn premium days and unlock rewards automatically as your invite count grows. The more people you bring, the more everyone benefits.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4a574]/10 text-[#d4a574] flex items-center justify-center font-bold text-xs">4</span>
              <p>At 5 invites, you become a verified Founder with a badge on your profile. At 10, you get lifetime premium. At 25, you join our co-creator circle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
