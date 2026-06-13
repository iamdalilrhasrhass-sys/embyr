import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — 100% Free Forever | Embir",
  description: "Embir is 100% free. No subscriptions, no hidden fees, no premium tiers. Unlimited messaging for everyone.",
  alternates: { canonical: "https://embir.xyz/pricing" },
};

export default function PricingPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">Free. Forever.</h1>
          <p className="text-white/50 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            No pricing tiers. No hidden fees. No premium upsells. Embir is built for the community, not for shareholders.
          </p>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 mb-10 max-w-md mx-auto">
            <div className="text-white/40 text-sm mb-2">Everything included</div>
            <div className="text-5xl font-black text-white mb-2">Free</div>
            <div className="text-white/40 text-sm mb-6">forever</div>
            <ul className="text-left text-white/60 space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-white/80 mt-0.5">—</span> Unlimited messaging
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/80 mt-0.5">—</span> Full profiles with photos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/80 mt-0.5">—</span> 25 languages with auto-translation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/80 mt-0.5">—</span> Discreet mode
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/80 mt-0.5">—</span> No ads, no tracking
              </li>
            </ul>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Get started free
            </Link>
          </div>

          <p className="text-white/30 text-sm">No credit card required. No trial period that expires. Just free.</p>
        </div>
      </section>
    </main>
  );
}
