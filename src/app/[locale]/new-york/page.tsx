import type { Metadata } from "next";
import Link from "next/link";
import PageTypeTracker from "@/components/PageTypeTracker";

export const metadata: Metadata = {
  title: "Gay Dating in New York — Free, Verified, No Ads",
  description: "Find authentic gay connections in New York City with Embir. Verified profiles, AI matching, zero ads, and unlimited free messaging. Manhattan, Brooklyn, Queens and beyond.",
  alternates: { canonical: "https://embir.xyz/new-york" },
  openGraph: {
    title: "Gay Dating in New York",
    description: "New York has millions of people and yet meeting someone real still feels impossible. Embir changes that.",
    url: "https://embir.xyz/new-york",
    locale: "en_US",
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <PageTypeTracker type="city" city="New York" country="US" />
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,165,116,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">New York City</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            Eight million people.<br />
            <span className="text-[#d4a574]">Why is it so hard to meet one?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            New York is the densest city in America, and yet gay dating here can feel lonelier than 
            a small town. The apps are flooded with tourists, ghost profiles, and guys who never reply. 
            Embir is different: verified profiles, real conversations, and matching that goes deeper 
            than your GPS coordinates.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register?source=new-york" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
              Create my free profile
            </Link>
            <Link href="/membres" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
              Browse NYC members
            </Link>
          </div>
        </div>
      </section>

      {/* The NYC dating paradox */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">The paradox</p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
              More people than anywhere.<br />
              <span className="text-white/50">Fewer real connections.</span>
            </h2>
            <p className="mt-5 text-white/45 leading-relaxed">
              New York gay dating has a unique problem: abundance without depth. You can swipe through 
              a hundred profiles in a Chelsea coffee shop, but most are tourists passing through, bots 
              with stolen photos, or guys who treat the apps like a game they never intend to play seriously.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              Embir fixes this by making verification mandatory. Every profile you see in New York 
              belongs to a real person who actually lives here — not a tourist in Times Square for 
              the weekend, not a bot scraping photos from Instagram. Real New Yorkers, real connections.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            <h3 className="text-lg font-bold text-white mb-4">NYC neighborhoods covered</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-white/45">
              {["Hell's Kitchen", "Chelsea", "West Village", "East Village", "Williamsburg", "Bushwick", "Astoria", "Jackson Heights", "Harlem", "Park Slope", "Greenwich Village", "Lower East Side"].map((n) => (
                <div key={n} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#d4a574]/40" />{n}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Embir works in NYC */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-10">
            Why Embir works in New York
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "No tourists", desc: "Verification confirms people actually live here. No more matching with someone who's boarding a flight tomorrow." },
              { title: "Compatibility over proximity", desc: "Our AI matches based on who you are, not just how many feet away you happen to be standing." },
              { title: "Real pace", desc: "New York moves fast. Embir doesn't waste your time with endless swiping — it gets to the conversations that matter." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-12">NYC Dating FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is Embir free in New York?", a: "Yes — completely free during launch. Unlimited messages, full profiles, and AI matching with no subscription required. Founding members in NYC keep premium access for life." },
              { q: "How many active users does Embir have in NYC?", a: "We're in our launch phase, which means our NYC community is growing daily. The advantage of joining now: you're part of the founding group that shapes the community from day one." },
              { q: "Which NYC neighborhoods have the most Embir members?", a: "Hell's Kitchen, Chelsea, and Williamsburg currently have our strongest concentrations, but we have verified members in all five boroughs." },
              { q: "How does verification work for New Yorkers?", a: "Quick selfie check. Our system matches your live selfie to your profile photo — no personal data stored, no third-party verification services. Takes under a minute." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-white/80 group-open:text-[#d4a574] transition-colors list-none [&::-webkit-details-marker]:hidden">{faq.q}</summary>
                <p className="px-6 pb-5 text-sm text-white/45 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 text-center">
        <Link href="/auth/register?source=new-york" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
          Create my free NYC profile
        </Link>
        <p className="mt-4 text-xs text-white/20">18+ only. Free during launch. No credit card.</p>
      </section>
    </main>
  );
}
