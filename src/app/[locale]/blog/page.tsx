import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embir Blog — Gay Dating Tips, Guides & Community Stories",
  description: "The Embir blog: gay dating tips, coming out stories, safety guides, and everything you need for authentic connections.",
  keywords: ["gay blog", "gay dating tips", "gay dating guide", "LGBTQ community", "gay dating app"],
  alternates: { canonical: "https://embir.xyz/blog" },
};

interface Article {
  title: string; slug: string; desc: string; tags: string[]; category?: string;
}

const categories = [
  { name: "Dating Tips", path: "dating-tips" },
  { name: "Safety", path: "safety" },
  { name: "Culture", path: "culture" },
  { name: "City Guides", path: "city-guides" },
];

const articles: Article[] = [
  // ---- NEW ARTICLES (Phase 3) ----
  { title: "Building Confidence: A Guide for Shy Gay Men", slug: "dating-tips/building-confidence-shy-gay-men", desc: "Practical confidence-building strategies for shy gay men in dating. From first message to first date.", tags: ["confidence", "shy", "social anxiety"], category: "Dating Tips" },
  { title: "How to Have Difficult Conversations in Gay Relationships", slug: "dating-tips/difficult-conversations-gay-relationships", desc: "Master difficult conversations in gay relationships. Communication frameworks for exclusivity, needs, and boundaries.", tags: ["communication", "relationships", "conflict"], category: "Dating Tips" },
  { title: "The Psychology of Attraction: What Really Matters", slug: "dating-tips/psychology-of-attraction-gay-men", desc: "What science says about gay male attraction. Beyond looks — personality and chemistry that create lasting bonds.", tags: ["attraction", "psychology", "chemistry"], category: "Dating Tips" },
  { title: "Long-Distance Gay Relationships: Making Them Work", slug: "dating-tips/long-distance-gay-relationships", desc: "How to make long-distance gay relationships thrive. Communication, trust, and practical tools for LDR success.", tags: ["long distance", "LDR", "communication"], category: "Dating Tips" },
  { title: "First Date Ideas for Gay Men: Beyond the Usual Bars", slug: "dating-tips/first-date-ideas-gay-men", desc: "Creative first date ideas for gay men that go beyond drinks. Make your first impression memorable and authentic.", tags: ["first date", "date ideas", "creative"], category: "Dating Tips" },
  { title: "How to Create an Authentic Gay Dating Profile in 2026", slug: "dating-tips/authentic-gay-dating-profile-2026", desc: "Create a gay dating profile that actually attracts the right guys. Practical tips for authentic profiles.", tags: ["profile", "authentic", "tips"], category: "Dating Tips" },

  { title: "Online Safety Guide: Protecting Yourself on Gay Dating Apps", slug: "safety/online-dating-safety-guide", desc: "Stay safe on gay dating apps. Practical safety guide covering privacy, first meetings, and red flags.", tags: ["safety", "privacy", "protection"], category: "Safety" },
  { title: "How to Spot Catfish and Scammers on Dating Apps", slug: "safety/spot-catfish-scammers-dating-apps", desc: "Learn to identify fake profiles, catfish, and scammers. Red flags, verification tips, and protection strategies.", tags: ["catfish", "scammers", "verification"], category: "Safety" },

  { title: "Coming Out at Your Own Pace: A Modern Guide", slug: "culture/coming-out-at-your-own-pace", desc: "Modern coming out guide for gay men. Your timeline, your terms. No pressure, just practical support.", tags: ["coming out", "support", "identity"], category: "Culture" },
  { title: "Gay Dating in 2026: Trends and Changes", slug: "culture/gay-dating-trends-2026", desc: "How gay dating is changing in 2026. AI matching, privacy-first apps, and the decline of traditional paywalls.", tags: ["trends", "2026", "AI matching"], category: "Culture" },
  { title: "Navigating Hookup Culture vs. Meaningful Connections", slug: "culture/hookup-culture-vs-meaningful-connections", desc: "Finding balance between hookup culture and meaningful relationships. Honest, no-judgment perspective.", tags: ["hookup", "connections", "culture"], category: "Culture" },

  { title: "The Best LGBTQ+ Friendly Cities in Europe", slug: "city-guides/best-lgbtq-friendly-cities-europe", desc: "The top LGBTQ+ friendly cities in Europe for gay travelers. Nightlife, culture, safety, and community.", tags: ["cities", "Europe", "travel"], category: "City Guides" },

  // ---- ORIGINAL ARTICLES ----
  { title: "5 Best Free Grindr Alternatives in 2026", slug: "free-grindr-alternatives-2026", desc: "Sick of paying for Grindr? Discover the 5 best 100% free alternatives to Grindr in 2026.", tags: ["grindr alternative", "free", "no ads"] },
  { title: "Top 7 Free Gay Dating Apps in 2026", slug: "best-free-gay-dating-apps-2026", desc: "Looking for a free gay dating app? Our complete comparison of the best apps to meet guys in 2026.", tags: ["gay dating app", "free", "ranking"] },
  { title: "How to Flirt With a Guy — The Complete Guide", slug: "how-to-flirt-with-guys", desc: "Nervous about flirting with a guy? Tips on approaching, seducing, and creating real connection.", tags: ["flirting", "dating", "tips"] },
  { title: "First Gay Date — 10 Tips for Success", slug: "first-gay-date-tips", desc: "Stressed about your first gay date? Complete guide to a successful first date without the pressure.", tags: ["first date", "date", "advice"] },
  { title: "How to Create a Gay Dating Profile That Attracts", slug: "create-gay-dating-profile", desc: "Your gay dating profile isn't getting matches? How to optimize photos and bio for the right guys.", tags: ["profile", "bio", "photos"] },
  { title: "Coming Out and Dating — Supportive Guide", slug: "coming-out-dating-advice", desc: "Just came out and want to start dating? A supportive guide for your first gay dates.", tags: ["coming out", "dating", "LGBTQ"] },
  { title: "Gay Dating Safety — 12 Golden Rules", slug: "gay-dating-safety-rules", desc: "Meeting guys online safely. Our tips for safe and respectful dates.", tags: ["safety", "safe dating", "protection"] },
  { title: "10 Rules for Gay Dating — The Complete Guide", slug: "10-gay-dating-commandments", desc: "The 10 essential rules for successful gay dating. Respect, communication, safety.", tags: ["rules", "etiquette", "respect"] },
  { title: "Top 5 Ad-Free Gay Dating Apps in 2026", slug: "ad-free-gay-dating-apps", desc: "The best gay dating apps with no intrusive advertising. Privacy-respecting free apps.", tags: ["ad-free", "free", "privacy"] },
  { title: "Coming Out Later in Life — Stories After 30", slug: "late-coming-out-stories", desc: "Coming out later in life is more common than you think. Stories, advice, and resources.", tags: ["coming out late", "stories", "gay after 30"] },
  { title: "How to Tell If a Guy Is Gay — Signs to Look For", slug: "how-to-tell-if-guy-is-gay", desc: "Complete guide to knowing if a guy is gay. Signs, behaviors, and natural conversation approaches.", tags: ["signs", "gaydar", "behavior"] },
  { title: "How to Flirt on a Gay Dating App", slug: "flirting-on-dating-apps", desc: "Gay flirting guide for dating apps. How to send the first message, stand out, and get dates.", tags: ["flirting", "first message", "app"] },
  { title: "Being Gay and Lonely — Coping Guide", slug: "being-gay-and-lonely", desc: "Loneliness among gay men is more common than you think. Tips to accept, understand, and move through it.", tags: ["loneliness", "wellbeing", "advice"] },
  { title: "History of LGBTQ+ Pride Month", slug: "pride-month-history", desc: "The history of Pride Month. From the Stonewall riots to today's marches.", tags: ["pride", "LGBTQ history", "Stonewall"] },
  { title: "Best Gay-Friendly Neighborhoods in France", slug: "best-gay-neighborhoods-france", desc: "Guide to gay-friendly neighborhoods in Paris, Lyon, Marseille, Bordeaux, and more.", tags: ["neighborhoods", "France", "cities"] },
  { title: "10 Tips for a Successful First Gay Date", slug: "successful-first-gay-date", desc: "Everything for a successful first gay date. From venue choice to conversation tips.", tags: ["first date", "success", "tips"] },
  { title: "Serious Relationship or Hookup — Know What You Want", slug: "serious-relationship-vs-hookup", desc: "How to know if you want a serious relationship or just casual. Be honest with yourself and others.", tags: ["relationship", "hookup", "honesty"] },
  { title: "Gay Dating Safety — Essential Guide", slug: "gay-dating-safety", desc: "Safety guide for gay dating online and in real life. Protect your privacy and stay safe.", tags: ["safety", "dating", "protection"] },
];

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]">
      <h2 className="text-lg font-bold text-white group-hover:text-white/80 transition-colors mb-2">{article.title}</h2>
      <p className="text-white/45 text-sm leading-relaxed mb-4">{article.desc}</p>
      <div className="flex flex-wrap gap-2">
        {article.tags.map((tag) => (<span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] text-white/35">{tag}</span>))}
      </div>
    </Link>
  );
}

export default function BlogPage() {
  // Group articles by category
  const grouped: Record<string, Article[]> = {};
  for (const a of articles) {
    const cat = a.category || "More";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(a);
  }

  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Embir <span className="text-white/50">Blog</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 max-w-2xl">
            30 articles on gay dating — tips, safety, culture, and city guides. New content every week.
          </p>

          <Link href="/grindr-cost-calculator" className="block mb-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group">
            <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Featured Tool</span>
            <h2 className="text-xl font-bold text-white mt-1 group-hover:text-white/80 transition-colors">Grindr Cost Calculator</h2>
            <p className="text-white/40 text-sm mt-1">Find out how much you've spent on dating apps — and how much you'd save with Embir.</p>
          </Link>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <Link key={cat.path} href={`/blog/${cat.path}`} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Articles grouped by category */}
          {Object.entries(grouped).map(([cat, catArticles]) => (
            <div key={cat} className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/25 mb-4">{cat}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {catArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
