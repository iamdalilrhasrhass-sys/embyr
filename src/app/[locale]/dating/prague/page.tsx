import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dating in Prague — Free App for Authentic Connections",
  description: "Discover Embir for dating in Prague. Free dating app with verified profiles, smart AI matching, and zero ads. Join Prague's dating community.",
  alternates: { canonical: "https://embir.xyz/dating/prague" },
  openGraph: {
    title: "Dating in Prague",
    description: "Free dating app in Prague. Verified profiles, AI matching, no ads.",
    url: "https://embir.xyz/dating/prague",
    locale: "en_US",
    siteName: "Embir",
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Prague · Czech Republic</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Dating in Prague<br/><span className="text-[#d4a574]">is about to get better.</span></h1>
          <p className="mt-6 text-lg text-white/50">Prague, the city of a hundred spires, is full of people looking for genuine connections. Embir brings verified profiles and AI matching to Prague's dating scene — completely free during launch.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create Free Profile</Link>
            <Link href="/free-dating-app" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">How It Works</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Why Prague chooses Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Verified Profiles</h3><p className="text-sm text-white/45">Every member in Prague is verified by selfie. No bots, no fakes.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Free During Launch</h3><p className="text-sm text-white/45">Unlimited messaging, AI matching, zero ads. No subscription needed.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Smart AI Matching</h3><p className="text-sm text-white/45">DeepSeek AI learns your preferences for truly compatible matches in Prague.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Inclusive for All</h3><p className="text-sm text-white/45">Gay, lesbian, bi, trans, queer — Embir welcomes everyone in Prague.</p></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl"><h2 className="font-serif text-3xl text-white mb-8">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Is Embir available in Prague?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Yes! Embir is available in Prague and growing its local community every day.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Is it really free in Prague?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Yes. During launch, every feature is free — unlimited messages, AI matching, full profiles.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Start Dating in Prague — Free</Link>
      </section>
    </main>
  );
}