import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating Safety — The Complete Checklist 2026 | Embir Blog",
  description: "Essential safety rules for gay dating. From meeting strangers to protecting your privacy — the complete safety checklist.",
  keywords: ["gay dating safety", "safe gay dating", "dating safety tips gay", "how to stay safe dating gay", "LGBTQ dating safety"],
  alternates: { canonical: "https://embir.xyz/blog/gay-dating-safety-rules" },
  openGraph: {
    title: "Gay Dating Safety — The Complete Checklist 2026 | Embir Blog",
    description: "Essential safety rules for gay dating. From meeting strangers to protecting your privacy — the complete safety checklist.",
    url: "https://embir.xyz/blog/gay-dating-safety-rules",
    type: "article", siteName: "Embir", locale: "en_US",
  },
};

export default function ArticlePage() {
  return (
    <main className="emb-page min-h-screen">
      <article className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <Link href="/blog" className="text-white/40 hover:text-white/70 text-sm mb-8 inline-block transition-colors">← Blog</Link>
          <h1 className="text-3xl md:text-4xl font-black mb-6 text-white">Gay Dating Safety: The Complete Checklist</h1>
          <p className="text-white/50 text-sm mb-8">Published May 15, 2026 · 8 min read</p>
          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed space-y-6">
            <p>
              Dating should be exciting, not scary. But when you're meeting someone for the first time — especially when you're a gay man meeting another man — taking basic precautions is just smart, not paranoid.
            </p>
            <p>
              This guide covers <strong>gay dating safety</strong> from every angle: before you meet, during the date, and after. Follow these rules and your dating life will be safer, more enjoyable, and far less stressful.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Before the date</h2>
            <p><strong>Video call first.</strong> A 5-minute video call confirms they're real and who they claim to be. If they refuse or make excuses, move on.</p>
            <p><strong>Share your location.</strong> Tell a friend where you're going, who you're meeting, and when you expect to be back. Apps like Find My or WhatsApp Live Location make this effortless.</p>
            <p><strong>Choose a public place.</strong> Coffee shop, bar, restaurant — somewhere with people around. No "straight to mine" or "let me pick you up" on a first meeting.</p>
            <p><strong>Keep transport independent.</strong> Drive yourself, take public transit, or use a ride-sharing app. Don't let them pick you up or drop you off.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">During the date</h2>
            <p><strong>Trust your gut.</strong> If something feels off, it probably is. You're allowed to leave at any time — no explanation needed.</p>
            <p><strong>Watch your drink.</strong> Always know where your drink came from. Never leave it unattended.</p>
            <p><strong>Keep your phone accessible.</strong> A quick "I need to use the restroom" can be your exit if things get uncomfortable. Text a friend a code word if you need an "emergency call."</p>
            <p><strong>Stay off your phone during the date,</strong> but keep it unlocked and accessible. If you need to leave, you leave.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">After the date</h2>
            <p><strong>Check in with your friend.</strong> Let them know you're safe and home.</p>
            <p><strong>Don't rush the second date.</strong> Take time to reflect. Did you feel safe? Did they respect your boundaries? Would you feel comfortable being alone with them?</p>
            <p><strong>Trust is earned, not given.</strong> No matter how good the first date was, protecting yourself is always the priority.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Digital safety</h2>
            <p><strong>Don't share personal info too early.</strong> Full name, address, workplace, social media handles — keep these until you've met in person and feel comfortable.</p>
            <p><strong>Reverse image search their photos.</strong> Google Image Search or TinEye can reveal if their profile pictures are stolen or belong to someone else.</p>
            <p><strong>Block and report if needed.</strong> Anyone who pressures you, sends unsolicited explicit content, or makes you uncomfortable should be blocked immediately. Report them to the platform.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Sexual health safety</h2>
            <p><strong>Discuss status and protection before hooking up.</strong> Not during, not after. Before.</p>
            <p><strong>Get tested regularly.</strong> Every 3 months if you're sexually active. Know your status and ask about theirs.</p>
            <p><strong>Consider PrEP.</strong> Pre-exposure prophylaxis is highly effective and available in most countries, often free or low-cost.</p>
            <p><strong>No glove, no love is still the rule for casual encounters.</strong> Carry your own if you plan to hook up.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">What Embir does for safety</h2>
            <p>
              We built safety into the app: profile verification, discreet mode, blocking and reporting tools, a moderation system, and moderation guidelines. On Embir, you can date knowing the platform has your back.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Bottom line</h2>
            <p>
              Safety is not about being afraid — it's about being prepared. Follow these rules, trust your instincts, and don't let anyone make you feel like you're overreacting for taking care of yourself. A good date will respect your boundaries. A bad one will reveal themselves early.
            </p>
          </div>
          <div className="mt-12 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-white/70 mb-4">Dating should be safe. Join a community that takes safety seriously.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all">Create my free profile</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.06]">
            <p className="text-white/40 text-sm mb-4">Also read:</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blog/10-commandements-rencontre-gay" className="text-white/50 hover:text-white/80 text-sm underline transition-colors">10 rules for gay dating →</Link>
              <Link href="/blog/premier-date-gay-conseils" className="text-white/50 hover:text-white/80 text-sm underline transition-colors">First gay date tips →</Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
