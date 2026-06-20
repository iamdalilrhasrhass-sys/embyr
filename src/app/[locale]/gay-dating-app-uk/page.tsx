import type { Metadata } from "next";
import Link from "next/link";
import TrackedLink from "@/components/TrackedLink";
import PageTypeTracker from "@/components/PageTypeTracker";

export const metadata: Metadata = {
  title: "Free Gay Dating App in the UK — Verified, Safe, No Ads",
  description: "Embir is a free gay dating app built for the UK. Verified profiles, AI-powered matching, zero ads, and free unlimited messaging. Available in London, Manchester, Birmingham, Brighton and beyond.",
  alternates: {
    canonical: "https://embir.xyz/gay-dating-app-uk",
    languages: {
      "en-US": "https://embir.xyz/gay-dating-app-usa",
      "fr-FR": "https://embir.xyz/application-rencontre-gay",
    },
  },
  openGraph: {
    title: "Free Gay Dating App in the UK",
    description: "Free, safe, and built for the UK. Verified profiles, AI matching, and unlimited messaging — no ads, no paywalls.",
    url: "https://embir.xyz/gay-dating-app-uk",
    locale: "en_GB",
    images: [`/api/og?title=Free+Gay+Dating+App+in+the+UK&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <PageTypeTracker type="landing" market="UK" />
      {/* Hero */}
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,165,116,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">United Kingdom</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            A gay dating app that<br />
            <span className="text-[#d4a574]">actually respects you.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            Embir is a new free gay dating app for men across the UK. No ads, no fake profiles, 
            no hidden paywalls — just verified people, smarter matching, and a community built 
            around respect. Launching in London, Manchester, Birmingham, and Brighton.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink href="/auth/register?source=uk-landing" label="Create my free profile" location="uk-landing-hero" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
              Create my free profile
            </TrackedLink>
            <Link href="/membres" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
              Browse UK members
            </Link>
          </div>
        </div>
      </section>

      {/* Why the UK market needs something better */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">Why Embir exists</p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
              The UK deserves better<br />
              <span className="text-white/50">than what&apos;s available.</span>
            </h2>
            <p className="mt-5 text-white/45 leading-relaxed">
              British gay men know the frustration: apps that nickel-and-dime you for every feature, 
              profiles that turn out to be fake, conversations that fizzle because nobody&apos;s verified, 
              and an experience that feels more like a marketplace than a community.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              Embir was built to fix this. We started with a simple question: what would a gay dating 
              app look like if it actually respected its users? The answer: free, verified, ad-free, 
              and built around genuine compatibility — not just proximity.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              During our UK launch, every feature is completely free. Founding members keep lifetime 
              premium access — no catches, no small print.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            <h3 className="text-lg font-bold text-white mb-6">What makes Embir different</h3>
            <ul className="space-y-4">
              {[
                { label: "Mandatory verification", desc: "Selfie check for every new profile. No bots, no catfish, no fake accounts." },
                { label: "Completely free during launch", desc: "Unlimited messages, full discovery, AI matching — all included." },
                { label: "Zero advertising", desc: "No banner ads, no promoted profiles, no third-party trackers." },
                { label: "Smarter matching", desc: "Our system suggests people based on shared preferences and genuine compatibility." },
                { label: "UK cities covered", desc: "London, Manchester, Birmingham, Brighton, Edinburgh, and expanding weekly." },
                { label: "Safety-first design", desc: "Granular privacy controls, block and report tools, and human moderation." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-[#d4a574]/10 text-[#d4a574] flex items-center justify-center text-xs">✓</span>
                  <div>
                    <span className="text-sm font-semibold text-white/80">{item.label}</span>
                    <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* UK Cities */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30 text-center">UK cities</p>
          <h2 className="mt-4 text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            From Soho to the Northern Quarter,<br />
            <span className="text-[#d4a574]">Embir is building real communities.</span>
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { city: "London", desc: "Soho, Vauxhall, Shoreditch — find genuine connections in the capital.", href: "/london" },
              { city: "Manchester", desc: "Canal Street to the Northern Quarter — a thriving scene deserves a better app.", href: "/manchester" },
              { city: "Birmingham", desc: "Hurst Street and beyond — the UK's second city, with a community to match.", href: "/birmingham" },
              { city: "Brighton", desc: "The UK's unofficial gay capital. If Embir works here, it works everywhere.", href: "/brighton" },
            ].map((c, i) => (
              <Link key={i} href={c.href} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#d4a574]/20 hover:bg-white/[0.04]">
                <h3 className="text-lg font-bold text-white group-hover:text-[#d4a574] transition-colors">{c.city}</h3>
                <p className="mt-2 text-sm text-white/40 leading-relaxed">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section — UK specific */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">Trust &amp; Safety</p>
          <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            Dating should feel safe,<br />
            <span className="text-[#d4a574]">not like a gamble.</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Verified profiles", desc: "Every member verifies with a real-time selfie. No exceptions. If someone can't verify, they can't join." },
              { title: "Your data stays yours", desc: "We don't sell your data to advertisers. We don't track you across the web. Your privacy is not our business model." },
              { title: "Human moderation", desc: "Reports are reviewed by real people, not just algorithms. Toxic behaviour gets removed quickly and permanently." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-left">
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-12">
            Your questions, answered
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is Embir actually free in the UK?", a: "Yes. Every feature — unlimited messaging, profile discovery, AI matching, and more — is completely free during our UK launch. Founding members who join now keep lifetime premium access at no cost." },
              { q: "How is Embir different from Grindr or Tinder?", a: "Three fundamental differences: (1) Embir is free with no paywalls, while Grindr and Tinder lock features behind subscriptions up to £25/month. (2) Every Embir profile is verified via selfie check — no bots, no catfish. (3) Embir uses AI to match based on compatibility, not just how close someone is geographically." },
              { q: "Is my privacy protected?", a: "Yes. Embir does not sell user data, does not run third-party ads, and does not track you outside the app. Your profile preferences are only visible to people you're compatible with." },
              { q: "Which UK cities have the most Embir members?", a: "London has our largest UK community, followed by Manchester, Birmingham, Brighton, Edinburgh, and Bristol. We're actively growing in all major British cities." },
              { q: "Can I use Embir outside the UK?", a: "Yes. Embir is available worldwide in 25 languages. Your profile and matches travel with you — perfect if you split time between the UK and elsewhere." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-white/80 group-open:text-[#d4a574] transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="px-6 pb-5 text-sm text-white/45 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            Join the UK launch.<br />
            <span className="text-[#d4a574]">Free. Verified. Real.</span>
          </h2>
          <p className="mt-4 text-white/35">No ads. No subscriptions. Just genuine connections.</p>
          <Link href="/auth/register?source=uk-landing" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
            Create my free profile
          </Link>
          <p className="mt-4 text-xs text-white/20">18+ only. Free during UK launch. No credit card required.</p>
        </div>
      </section>

      {/* Internal links */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-white/20 mb-4">More from Embir</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/blog/best-gay-dating-apps-uk" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Best gay dating apps UK</Link>
            <span className="text-white/10">·</span>
            <Link href="/blog/best-grindr-alternatives-2026" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Best Grindr alternatives</Link>
            <span className="text-white/10">·</span>
            <Link href="/london" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Gay dating London</Link>
            <span className="text-white/10">·</span>
            <Link href="/manchester" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Gay dating Manchester</Link>
            <span className="text-white/10">·</span>
            <Link href="/" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Embir home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
