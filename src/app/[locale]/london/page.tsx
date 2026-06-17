import type { Metadata } from "next";
import Link from "next/link";
import PageTypeTracker from "@/components/PageTypeTracker";

export const metadata: Metadata = {
  title: "Gay Dating in London — Free, Verified, No Ads",
  description: "Find authentic gay connections in London with Embir. Verified profiles, AI matching, zero ads, and free unlimited messaging. Soho, Vauxhall, Shoreditch, and across the capital.",
  alternates: { canonical: "https://embir.xyz/london" },
  openGraph: {
    title: "Gay Dating in London",
    description: "London has one of the world's largest gay scenes. Embir makes it easier to find someone real within it.",
    url: "https://embir.xyz/london",
    locale: "en_GB",
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <PageTypeTracker type="city" city="London" country="UK" />
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,165,116,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">London</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            Nine million people.<br />
            <span className="text-[#d4a574]">Surely there&apos;s one for you.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            London has one of the largest and most diverse gay scenes in the world. But the apps 
            haven&apos;t kept up — they&apos;re still serving the same recycled profiles, the same bots, 
            the same paywalls. Embir is the fresh start London deserves: verified, free, and built 
            for genuine compatibility, not just the nearest postcode.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register?source=london" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
              Create my free profile
            </Link>
            <Link href="/membres" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
              Browse London members
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">The London reality</p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
              The scene is massive.<br />
              <span className="text-white/50">The apps are broken.</span>
            </h2>
            <p className="mt-5 text-white/45 leading-relaxed">
              Soho on a Friday night is electric. Vauxhall on a Sunday morning is legendary. 
              And yet, open any dating app in London and you&apos;re met with the same experience: 
              paywalls at every turn, profiles that haven&apos;t been active in months, and an 
              overwhelming sense that nobody is actually looking for anything real.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              The problem isn&apos;t London. The problem is that dating apps treat London like a 
              cash register — charging £20-25/month for basic features while doing nothing to 
              improve the quality of connections. Embir takes the opposite approach: free, 
              verified, and built to help you find people you&apos;re actually compatible with.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            <h3 className="text-lg font-bold text-white mb-4">London areas covered</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-white/45">
              {["Soho", "Vauxhall", "Shoreditch", "Hackney", "Clapham", "Brixton", "Islington", "Camden", "Dalston", "Bermondsey", "Stratford", "Earl's Court"].map((n) => (
                <div key={n} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#d4a574]/40" />{n}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-10">
            Why Londoners are choosing Embir
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Actually free", desc: "No £25/month subscription. No premium tiers. No 'unlock this feature for £9.99.' Just a full dating experience, free." },
              { title: "Verified Londoners only", desc: "Every profile is verified via selfie. No bots from overseas, no fake profiles farming your data. Just real people in London." },
              { title: "Compatibility, not just proximity", desc: "Living 200 metres from someone in Vauxhall doesn't mean you're compatible. Our AI learns what you like and suggests better matches." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-12">London Dating FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is Embir completely free in London?", a: "Yes. Unlimited messages, full profiles, AI matching — all free during our UK launch. Founding members in London get lifetime premium access." },
              { q: "How many London members does Embir have?", a: "We're growing fast. London is our primary UK launch city, and new verified members join daily. You'll be part of the founding group." },
              { q: "How is Embir different from other gay apps in London?", a: "Three things: (1) Completely free — no £20-25/month fees. (2) Mandatory verification — no fake profiles. (3) AI matching based on compatibility, not just distance." },
              { q: "Which London areas have the most Embir members?", a: "Soho and Vauxhall currently lead, with strong communities in Shoreditch, Clapham, and Brixton. Members across all zones." },
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
        <Link href="/auth/register?source=london" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
          Create my free London profile
        </Link>
        <p className="mt-4 text-xs text-white/20">18+ only. Free during UK launch. No credit card.</p>
      </section>
    </main>
  );
}
