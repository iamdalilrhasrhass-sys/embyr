import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coming Out and Dating — Practical Advice | Embir Blog",
  description: "Navigate coming out and gay dating with confidence. Real advice from the community.",
  keywords: ["coming out dating", "gay coming out", "dating after coming out", "coming out advice gay", "LGBTQ coming out guide"],
  alternates: { canonical: "https://embir.xyz/blog/coming-out-rencontres-conseils" },
  openGraph: {
    title: "Coming Out and Dating — Practical Advice | Embir Blog",
    description: "Navigate coming out and gay dating with confidence. Real advice from the community.",
    url: "https://embir.xyz/blog/coming-out-rencontres-conseils",
    type: "article", siteName: "Embir", locale: "en_US",
  },
};

export default function ArticlePage() {
  return (
    <main className="emb-page min-h-screen">
      <article className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <Link href="/blog" className="text-white/40 hover:text-white/70 text-sm mb-8 inline-block transition-colors">← Blog</Link>
          <h1 className="text-3xl md:text-4xl font-black mb-6 text-white">Coming Out and Dating: What You Need to Know</h1>
          <p className="text-white/50 text-sm mb-8">Published June 1, 2026 · 6 min read</p>
          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed space-y-6">
            <p>
              Coming out is a process, not a single event. And it intersects with dating in ways that can be confusing, liberating, or both. Whether you&apos;re freshly out, considering it, or been out for years — this guide covers the real intersection of coming out and dating.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Coming out before dating</h2>
            <p>
              You don&apos;t need to be fully out to date. Many gay men start dating while still in the closet with certain people in their lives. That&apos;s okay. Take the steps that feel right for you, at your pace. Your safety and well-being come first.
            </p>
            <p>
              That said, dating before coming out comes with challenges: you may need to be discreet about where you&apos;re going or who you&apos;re seeing. Communicate this early with potential dates so they understand your situation.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">When to tell your date</h2>
            <p>
              This is personal. Some men disclose their situation early to filter out incompatible matches. Others wait until they feel safe. There&apos;s no wrong approach, but honesty builds trust. If you&apos;re closeted with friends or family and it affects your availability, let them know after a date or two.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Dating someone who isn&apos;t out</h2>
            <p>
              If you&apos;re out and dating someone who isn&apos;t, patience is required. They may not want to be seen in public together, may cancel last minute out of fear, or may not introduce you to friends. Decide for yourself what you&apos;re comfortable with. It&apos;s not selfish to want a partner who can show up fully in your life.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Coming out later in life</h2>
            <p>
              More and more men come out after 30, after marriage, after kids. This path comes with unique challenges — navigating divorce, custody, and rebuilding identity. But it&apos;s never too late. Resources and communities exist specifically for men coming out later. You&apos;re not alone.
            </p>
            <p>
              Check out <Link href="/blog/coming-out-tardif-temoignages" className="text-white/80 hover:text-white underline">real stories from men who came out later</Link>.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">You belong</h2>
            <p>
              Whether you&apos;re out to everyone or just yourself — you belong in the gay community. Embir is built for every stage of the journey. Discreet mode, private profiles, and a welcoming community. Start where you are, with what you have.
            </p>
          </div>
          <div className="mt-12 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-white/70 mb-4">Join a community that welcomes you at any stage.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all">Create my free profile</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.06]">
            <p className="text-white/40 text-sm mb-4">Also read:</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blog/coming-out-tardif-temoignages" className="text-white/50 hover:text-white/80 text-sm underline transition-colors">Coming out later: real stories →</Link>
              <Link href="/blog/10-commandements-rencontre-gay" className="text-white/50 hover:text-white/80 text-sm underline transition-colors">10 rules for gay dating →</Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
