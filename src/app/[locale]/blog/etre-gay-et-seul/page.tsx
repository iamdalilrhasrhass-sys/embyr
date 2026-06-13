import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Being Gay and Lonely — You're Not Alone | Embir Blog",
  description: "Navigating loneliness as a gay man. Understanding it and finding real connection.",
  alternates: { canonical: "https://embir.xyz/blog/etre-gay-et-seul" },
};

export default function BlogPost() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <p className="text-white/40 text-sm font-semibold mb-2 uppercase tracking-wider">Embir Blog</p>
          <h1 className="text-3xl md:text-5xl font-black mb-6 text-white">Being Gay and Lonely</h1>
          <div className="prose prose-invert max-w-none text-white/50 space-y-4 leading-relaxed">
            <p>Loneliness affects many gay men, especially when coming out or living in less accepting environments. You are not alone. At Embir, we believe in authentic dating between men. No ads, no subscriptions, no intrusive algorithm.</p>
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
