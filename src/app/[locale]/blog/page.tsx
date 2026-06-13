import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embir Blog — Gay Dating Tips, Guides & Community Stories",
  description: "The Embir blog: gay dating tips, coming out stories, safety guides, and everything you need for authentic connections.",
  keywords: ["gay blog", "gay dating tips", "gay dating guide", "LGBTQ community", "gay dating app"],
  alternates: { canonical: "https://embir.xyz/blog" },
};

const articles = [
  { title: "5 Best Free Grindr Alternatives in 2026", slug: "free-grindr-alternatives-2026", desc: "Sick of paying for Grindr? Discover the 5 best 100% free alternatives to Grindr in 2026. Gay dating apps with no subscription and no ads.", tags: ["grindr alternative", "free gay app", "no ads"] },
  { title: "Top 7 Free Gay Dating Apps in 2026", slug: "best-free-gay-dating-apps-2026", desc: "Looking for a free gay dating app? Our complete comparison of the best apps to meet guys in 2026.", tags: ["gay dating app", "free gay dating", "gay app ranking"] },
  { title: "How to Flirt With a Guy — The Complete Guide", slug: "how-to-flirt-with-guys", desc: "Nervous about flirting with a guy? Tips on approaching, seducing, and creating a real connection. From first message to first date.", tags: ["flirting", "gay dating", "dating tips"] },
  { title: "First Gay Date — 10 Tips for Success", slug: "first-gay-date-tips", desc: "Stressed about your first gay date? Our complete guide to a successful first date without the pressure.", tags: ["first date", "gay date", "dating advice"] },
  { title: "How to Create a Gay Dating Profile That Attracts", slug: "create-gay-dating-profile", desc: "Your gay dating profile isn't getting matches? Here's how to optimize your photos and bio to attract the right guys.", tags: ["dating profile", "gay profile tips", "bio tips"] },
  { title: "Coming Out and Dating — Supportive Guide", slug: "coming-out-dating-advice", desc: "Just came out and want to start dating? A supportive guide for your first gay dates.", tags: ["coming out", "gay dating", "LGBTQ advice"] },
  { title: "Gay Dating Safety — 12 Golden Rules", slug: "gay-dating-safety-rules", desc: "Meeting guys online safely. Our tips for safe and respectful dates. Protect yourself and enjoy.", tags: ["safety", "safe dating", "protection tips"] },
  { title: "10 Rules for Gay Dating — The Complete Guide", slug: "10-gay-dating-commandments", desc: "The 10 essential rules for successful gay dating. Respect, communication, safety — everything for fulfilling dates.", tags: ["gay dating rules", "dating etiquette", "respect"] },
  { title: "Top 5 Ad-Free Gay Dating Apps in 2026", slug: "ad-free-gay-dating-apps", desc: "The best gay dating apps with no intrusive advertising. A comparison of privacy-respecting free apps.", tags: ["ad-free app", "free gay dating", "privacy"] },
  { title: "Coming Out Later in Life — Stories After 30", slug: "late-coming-out-stories", desc: "Coming out later in life is more common than you think. Advice, stories, and resources for coming out at any age.", tags: ["coming out late", "real stories", "gay after 30"] },
  { title: "How to Tell If a Guy Is Gay — Signs to Look For", slug: "how-to-tell-if-guy-is-gay", desc: "Complete guide to knowing if a guy is gay. Signs, behaviors, and how to approach the conversation naturally.", tags: ["gay signs", "gaydar", "behavior"] },
  { title: "How to Flirt on a Gay Dating App", slug: "flirting-on-dating-apps", desc: "Gay flirting guide for dating apps. How to send the first message, stand out, and get dates.", tags: ["gay flirting", "first message", "dating app"] },
  { title: "Being Gay and Lonely — Coping Guide", slug: "being-gay-and-lonely", desc: "Loneliness among gay men is more common than you think. Tips to accept it, understand it, and move through it.", tags: ["gay loneliness", "wellbeing", "advice"] },
  { title: "History of LGBTQ+ Pride Month", slug: "pride-month-history", desc: "The history of Pride Month. From the Stonewall riots to today's marches. A legacy of struggle and celebration.", tags: ["pride", "LGBTQ history", "Stonewall"] },
  { title: "Best Gay-Friendly Neighborhoods in France", slug: "best-gay-neighborhoods-france", desc: "Guide to gay-friendly neighborhoods in Paris, Lyon, Marseille, Bordeaux, and more.", tags: ["gay neighborhood", "France", "gay-friendly cities"] },
  { title: "10 Tips for a Successful First Gay Date", slug: "successful-first-gay-date", desc: "Everything you need for a successful first gay date. From venue choice to conversation tips.", tags: ["first date", "successful date", "tips"] },
  { title: "Serious Relationship or Hookup — Know What You Want", slug: "serious-relationship-vs-hookup", desc: "How to know if you want a serious relationship or just casual. A guide to being honest with yourself and others.", tags: ["serious relationship", "hookup", "honesty"] },
  { title: "Gay Dating Safety — Essential Guide", slug: "gay-dating-safety", desc: "Safety guide for gay dating online and in real life. Protect your privacy and stay safe.", tags: ["safety", "gay dating", "protection"] },
];

export default function BlogPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Embir <span className="text-white/50">Blog</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 max-w-2xl">
            Tips, guides, and stories for gay dating. From first message to first date — we've got you covered.
          </p>

          <Link href="/grindr-cost-calculator" className="block mb-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group">
            <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Featured Tool</span>
            <h2 className="text-xl font-bold text-white mt-1 group-hover:text-white/80 transition-colors">Grindr Cost Calculator</h2>
            <p className="text-white/40 text-sm mt-1">Find out how much you've spent on dating apps — and how much you'd save with Embir.</p>
          </Link>

          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]">
                <h2 className="text-lg font-bold text-white group-hover:text-white/80 transition-colors mb-2">{article.title}</h2>
                <p className="text-white/45 text-sm leading-relaxed mb-4">{article.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (<span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] text-white/35">{tag}</span>))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
