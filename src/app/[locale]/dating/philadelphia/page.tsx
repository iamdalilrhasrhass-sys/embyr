import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dating in Philadelphia — Free App for Authentic Connections",
  description: "Discover Embir for dating in Philadelphia. Free dating app with verified profiles, reciprocal compatibility, and zero ads. Join Philadelphia's dating community.",
  alternates: { canonical: "https://embir.xyz/dating/philadelphia" },
  openGraph: {
    title: "Dating in Philadelphia",
    description: "Free dating app in Philadelphia. Verified profiles, reciprocal compatibility, no ads.",
    url: "https://embir.xyz/dating/philadelphia",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Dating+in+Philadelphia&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-embir-rose/20 bg-embir-rose/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-embir-rose" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-embir-rose/80">Philadelphia · USA</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Dating in Philadelphia<br/><span className="text-embir-rose">is about to get better.</span></h1>
          <p className="mt-6 text-lg text-white/50">Philadelphia, the city of brotherly love, is full of people looking for genuine connections. Embir brings verified profiles and reciprocal compatibility to Philadelphia's dating scene — free for core connections.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Create Free Profile</Link>
            <Link href="/free-dating-app" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">How It Works</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Why Philadelphia chooses Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Verified Profiles</h3><p className="text-sm text-white/45">Selfie verification is available in Philadelphia. A visible badge identifies verified profiles; no system can eliminate every risk.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">free for core connections</h3><p className="text-sm text-white/45">messaging between reciprocal connections, reciprocal compatibility, zero ads. No subscription needed.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">reciprocal compatibility</h3><p className="text-sm text-white/45">our compatibility system suggests profiles based on your preferences for truly compatible matches in Philadelphia.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Inclusive for All</h3><p className="text-sm text-white/45">Gay, lesbian, bi, trans, queer — Embir welcomes everyone in Philadelphia.</p></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl"><h2 className="font-serif text-3xl text-white mb-8">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Is Embir available in Philadelphia?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Yes! Embir is available in Philadelphia and growing its local community every day.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Is it really free in Philadelphia?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Yes. Everything needed to meet someone is free. No credit card is required — messages between reciprocal connections, reciprocal compatibility, full profiles.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-10 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Start Dating in Philadelphia — Free</Link>
      </section>
    </main>
  );
}