import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grindr vs Alternatives — The Honest 2026 Comparison | Embir",
  description: "Tired of Grindr's paywalls and ads? Compare Grindr against the best free gay dating alternatives in 2026. Real features, real prices, no bias.",
  keywords: ["Grindr alternative", "gay app comparison", "free gay dating", "Grindr vs", "gay app no ads"],
  alternates: { canonical: "https://embir.xyz/grindr-vs-alternatives" },
};

const alternatives = [
  {
    name: "Embir",
    price: "Free forever",
    ads: "None",
    messaging: "Unlimited",
    bestFor: "Real connections, no paywalls",
    verdict: "The only truly free option.",
  },
  {
    name: "Scruff",
    price: "Freemium (from $14.99/mo)",
    ads: "Yes (free tier)",
    messaging: "Limited on free tier",
    bestFor: "Bears, otters, and community features",
    verdict: "Good community, but paywalled.",
  },
  {
    name: "Romeo",
    price: "Freemium (from $9.99/mo)",
    ads: "Yes (free tier)",
    messaging: "Limited on free tier",
    bestFor: "European users, travel features",
    verdict: "Strong in Europe, same paywall model.",
  },
  {
    name: "Tinder",
    price: "Freemium (from $19.99/mo)",
    ads: "Yes (free tier)",
    messaging: "Match required + limited swipes",
    bestFor: "Mainstream appeal, large userbase",
    verdict: "Massive but not gay-focused. Paywalled hard.",
  },
  {
    name: "Jack'd",
    price: "Freemium (from $9.99/mo)",
    ads: "Yes (free tier)",
    messaging: "Limited on free tier",
    bestFor: "Diverse community, POC-focused",
    verdict: "Inclusive but still freemium.",
  },
];

export default function GrindrVsPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Grindr vs Alternatives — The Honest 2026 Comparison
          </h1>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">
            Let&apos;s be real: Grindr is the biggest name in gay dating. But between the ads,
            the paywalls, and the bots, many guys are looking for something better.
            Here&apos;s how the alternatives actually stack up.
          </p>

          <div className="space-y-4 mb-10">
            {alternatives.map((alt, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${alt.name === "Embir" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06] bg-white/[0.02]"}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{alt.name}</h3>
                  <span className="text-sm text-white/40">{alt.price}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                  <div><span className="text-white/30">Ads: </span><span className="text-white/60">{alt.ads}</span></div>
                  <div><span className="text-white/30">Messages: </span><span className="text-white/60">{alt.messaging}</span></div>
                  <div className="col-span-2"><span className="text-white/30">Best for: </span><span className="text-white/60">{alt.bestFor}</span></div>
                </div>
                <p className="text-white/40 text-sm">{alt.verdict}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Try the only 100% free option</h2>
            <p className="text-white/50 mb-6">No ads. No limits. No catch. Just real guys.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>

          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">What to look for in a Grindr alternative</h2>
            <p>
              The gay dating app market runs on a simple formula: get users in for free,
              then lock essential features behind a subscription. Messaging limits, swipe
              counters, ad removal — all monetized. Embir breaks that model entirely.
            </p>
            <h3 className="text-white/80 text-lg font-semibold">No paywalls, period</h3>
            <p>If messaging is the core feature, why paywall it? Embir keeps everything free — messages, profiles, discovery, and even AI matching.</p>
            <h3 className="text-white/80 text-lg font-semibold">No ads, no tracking</h3>
            <p>Most free apps sell your attention to advertisers. Embir doesn&apos;t run ads and doesn&apos;t sell your data.</p>
            <h3 className="text-white/80 text-lg font-semibold">Real profiles, not bots</h3>
            <p>Free apps attract bots. Embir starts with real founding members in Paris — quality over quantity from day one.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
