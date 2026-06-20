import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embir Blog — 5,000+ Gay Dating Tips, City Guides & LGBTQ+ Articles",
  description: "Over 5,000 articles on gay dating, city guides, relationships, health, pride, and LGBTQ+ culture. The largest gay blog on the web. Free, expert advice.",
  alternates: { canonical: "https://embir.xyz/blog" },
  openGraph: { title: "Embir Blog — 5,000+ Gay Articles", description: "The largest gay dating and lifestyle blog. City guides, dating tips, health, pride, and more.", url: "https://embir.xyz/blog", type: "website", siteName: "Embir",
    images: [`/api/og?title=Embir+Blog+—+5,000++Gay+Articles&variant=market`],
  }
};

const categories = [
  { name: "🇺🇸 US City Guides", path: "gay-new-york-city", desc: "Gay scene in 50+ American cities" },
  { name: "🇬🇧 UK City Guides", path: "gay-london", desc: "LGBTQ+ life across the United Kingdom" },
  { name: "🇫🇷 French City Guides", path: "rencontre-gay-paris-guide-complet", desc: "Guides des rencontres gay en France" },
  { name: "💕 Dating Tips", path: "how-to-flirt-with-a-guy", desc: "Advice for better connections" },
  { name: "🏳️‍🌈 Pride & Events", path: "gay-pride-guide-2026", desc: "Pride celebrations worldwide" },
  { name: "🛡️ Safety & Health", path: "gay-dating-safety-guide", desc: "Stay safe and healthy" },
  { name: "📖 Coming Out", path: "coming-out-dating-advice", desc: "Stories, advice, and support" },
  { name: "💑 Relationships", path: "gay-relationship-guide-2026", desc: "Love, commitment, and growth" },
];

export default function BlogPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-20 px-4 sm:px-6">
        <div className="emb-container max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-white">Embir <span className="text-white/30">Blog</span></h1>
          <p className="text-white/40 text-xl mb-2 max-w-2xl mx-auto">The largest gay dating and lifestyle blog on the web.</p>
          <p className="text-white/25 text-lg mb-10">5,013 articles · City guides · Dating tips · Pride · Health · Relationships · Culture</p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(c => (
              <Link key={c.path} href={`/blog/${c.path}`} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white/45 hover:text-white hover:border-white/20 transition-all group">
                <span className="font-bold">{c.name}</span>
                <span className="hidden group-hover:inline ml-2 text-white/25">{c.desc}</span>
              </Link>
            ))}
          </div>

          <div className="py-12 rounded-3xl border border-white/[0.04] bg-white/[0.01]">
            <p className="text-white/30 text-lg mb-4">Search through <strong className="text-white/50">5,013 articles</strong> covering every aspect of gay life</p>
            <p className="text-white/20 text-sm">US cities · UK towns · French cities · Dating advice · Relationships · Coming out · Health & safety · Pride events · Gay culture · Gay travel · LGBTQ+ history · Gay bars & nightlife · Gay apps · Gay marriage · Gay parenting · Gay fitness · Gay fashion · Gay movies · Gay books · Gay music</p>
            <div className="mt-6">
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black hover:opacity-90 transition-all">Join Embir — 100% Free</Link>
              <p className="text-white/20 text-xs mt-3">No credit card. No ads. No limits.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
