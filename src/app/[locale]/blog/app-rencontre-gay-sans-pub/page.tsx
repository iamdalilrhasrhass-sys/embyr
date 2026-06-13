import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating App Without Ads — The 2026 Guide | Embir Blog",
  description: "Looking for a gay dating app with no ads? Compare ad-free options and find the right one.",
  alternates: { canonical: "https://embir.xyz/blog/app-rencontre-gay-sans-pub" },
};

export default function BlogPost() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <p className="text-white/40 text-sm font-semibold mb-2 uppercase tracking-wider">Embir Blog</p>
          <h1 className="text-3xl md:text-5xl font-black mb-6 text-white">Gay Dating App Without Ads</h1>
          <div className="prose prose-invert max-w-none text-white/50 space-y-4 leading-relaxed">
            <p>Sick of intrusive ads ruining your dating experience? Embir is the only 100% ad-free gay dating app. No banners, no video ads, no sponsored content.</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mt-10">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to meet guys?</h2>
            <p className="text-white/50 mb-6">Embir is 100% free. No ads, no subscription.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
