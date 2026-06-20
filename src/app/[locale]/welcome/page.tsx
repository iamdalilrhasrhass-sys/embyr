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

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="emb-page min-h-screen flex items-center justify-center px-4">
      <div className="emb-container max-w-lg text-center py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          Welcome to Embir
        </h1>
        <p className="text-white/50 text-lg mb-8">
          Your account is ready. Invite your friends and help grow the community.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">
            Your referral code
          </div>
          <div className="text-3xl md:text-4xl font-bold tracking-[0.15em] text-white mb-2">
            {loading ? "..." : referralCode || "EMB-XXXXXX"}
          </div>
          <p className="text-white/30 text-sm">
            Share this code. When someone signs up with it, you both get
            founder status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={copyLink}
            className="rounded-full border border-white/20 bg-white/[0.06] px-8 py-3 text-sm font-medium text-white hover:bg-white/[0.10] transition-colors"
          >
            {copied ? "Copied" : "Copy my link"}
          </button>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("Join me on Embir")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 bg-white/[0.06] px-8 py-3 text-sm font-medium text-white hover:bg-white/[0.10] transition-colors"
          >
            Share on Telegram
          </a>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black hover:bg-white/90 transition-colors"
          >
            Go to dashboard
          </Link>
          <Link
            href="/decouvrir"
            className="rounded-full border border-white/20 bg-white/[0.06] px-8 py-3 text-sm font-medium text-white hover:bg-white/[0.10] transition-colors"
          >
            Browse profiles
          </Link>
        </div>
      </div>
    </main>
  );
}
