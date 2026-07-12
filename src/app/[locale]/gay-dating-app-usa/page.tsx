import type { Metadata } from "next";
import Link from "next/link";
import TrackedLink from "@/components/TrackedLink";
import PageTypeTracker from "@/components/PageTypeTracker";

export const metadata: Metadata = {
  title: "Gay Dating App in the USA — Reciprocal Preferences",
  description: "Embir is available across the USA with reciprocal preferences, an optional selfie badge, reporting, blocking, and messaging after a mutual connection.",
  alternates: {
    canonical: "https://embir.xyz/gay-dating-app-usa",
    languages: {
      "en-GB": "https://embir.xyz/gay-dating-app-uk",
      "fr-FR": "https://embir.xyz/application-rencontre-gay",
    },
  },
  openGraph: {
    title: "Free Gay Dating App in the USA",
    description: "Reciprocal preferences, an optional selfie badge, reporting, blocking, and a core connection path without a credit card.",
    url: "https://embir.xyz/gay-dating-app-usa",
    locale: "en_US",
    images: [`/api/og?title=Free+Gay+Dating+App+in+the+USA&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <PageTypeTracker type="landing" market="US" />
      {/* Hero */}
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,165,116,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">United States</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            A free gay dating app<br />
            <span className="text-[#d4a574]">built for the USA.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            Embir is a new gay dating app designed for American men who want something real.
            Reciprocal preferences, an optional selfie badge, reporting, blocking, and messaging
            after a mutual connection. Membership is open across the United States.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink href="/auth/register?source=usa-landing" label="Create my free profile" location="usa-landing-hero" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
              Create my free profile
            </TrackedLink>
            <Link href="/membres" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
              Browse US members
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">The problem</p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
              You shouldn&apos;t have to pay<br />
              <span className="text-white/50">to meet real people.</span>
            </h2>
            <p className="mt-5 text-white/45 leading-relaxed">
              Most gay dating apps in the US lock basic features behind monthly subscriptions.
              Grindr charges up to $30/month for features that should be free. Tinder limits your
              swipes. Scruff paywalls messages. The result? You pay more and meet fewer genuine people.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              Embir takes a different approach. Everything needed to meet someone is free. No credit card required.
              Founding members help shape the product and its community.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            <h3 className="text-lg font-bold text-white mb-6">What you get with Embir</h3>
            <ul className="space-y-4">
              {[
                { label: "Messaging after reciprocity", desc: "A conversation opens after a mutual connection and the required reveal steps." },
                { label: "Verified profiles", desc: "Selfie verification is available to every member. A visible badge identifies approved profiles; no system can eliminate every risk." },
                { label: "Reciprocal compatibility", desc: "The engine applies declared preferences and intentions in both directions." },
                { label: "Zero ads", desc: "No banner ads, no interstitials, no sponsored profiles. Clean experience." },
                { label: "Available across the US", desc: "Membership is open nationwide; real profile density varies by location and criteria." },
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

      {/* Cities */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30 text-center">Where we&apos;re live</p>
          <h2 className="mt-4 text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            Embir is growing across<br />
            <span className="text-[#d4a574]">every major US city.</span>
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { city: "New York", desc: "Manhattan to Brooklyn, real connections in the city that never sleeps.", href: "/new-york" },
              { city: "Los Angeles", desc: "West Hollywood to Silver Lake — find guys who match your energy.", href: "/los-angeles" },
              { city: "Miami", desc: "South Beach to Wynwood, where the heat goes beyond the weather.", href: "/miami" },
              { city: "Chicago", desc: "Boystown to Andersonville — authentic dating in the Windy City.", href: "/chicago" },
            ].map((c, i) => (
              <Link key={i} href={c.href} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#d4a574]/20 hover:bg-white/[0.04]">
                <h3 className="text-lg font-bold text-white group-hover:text-[#d4a574] transition-colors">{c.city}</h3>
                <p className="mt-2 text-sm text-white/40 leading-relaxed">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            How Embir compares<br />
            <span className="text-white/50">to what you&apos;re using now.</span>
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-4 border-b border-white/[0.04] px-6 py-4 text-sm font-semibold tracking-wider text-white/30 uppercase">
              <div>Feature</div>
              <div className="text-center">Grindr</div>
              <div className="text-center">Tinder</div>
              <div className="text-center text-[#d4a574]">Embir</div>
            </div>
            {[
              ["Price", "~$30/mo", "~$20/mo", "Free"],
              ["Ads", "Everywhere", "Frequent", "Zero"],
              ["Verification", "Optional", "Optional", "Mandatory"],
              ["Reciprocal preferences", "Varies", "Varies", "Declared criteria"],
              ["Free Messages", "Limited", "Match only", "Unlimited"],
              ["Profiles", "Basic", "Basic", "Detailed + Tags"],
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors">
                <div className="text-sm text-white/60">{row[0]}</div>
                <div className="text-sm text-center text-white/30">{row[1]}</div>
                <div className="text-sm text-center text-white/30">{row[2]}</div>
                <div className="text-sm text-center font-semibold text-[#d4a574]">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is Embir really free in the USA?", a: "Yes. Everything needed to meet someone is free. No credit card required." },
              { q: "Where is Embir available in the USA?", a: "Membership is open across the United States. Embir does not publish city-density rankings until they can be supported by measured data." },
              { q: "How does profile verification work?", a: "Selfie verification is optional: a member submits a photo with a unique code. If approved, a visible badge appears; no system eliminates every risk." },
              { q: "Is Embir a Grindr alternative?", a: "Embir uses declared reciprocal preferences rather than sorting only by distance. Optional selfie verification, blocking and reporting are available. Everything needed to meet someone is free. No credit card required." },
              { q: "Can I use Embir if I'm not in a major city?", a: "Yes. Membership is open nationwide. Results depend on the real profiles currently available around your criteria and location." },
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
            Ready to meet real guys<br />
            <span className="text-[#d4a574]">without the paywalls?</span>
          </h2>
          <p className="mt-4 text-white/35">Free. Verified. No ads. Just real connections.</p>
          <Link href="/auth/register?source=usa-landing" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
            Create my free profile
          </Link>
          <p className="mt-4 text-xs text-white/20">18+ only. Core connection features are free. No credit card required.</p>
        </div>
      </section>

      {/* Internal links */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-white/20 mb-4">Explore more</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/blog/best-free-gay-dating-apps-2026" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Best free gay dating apps 2026</Link>
            <span className="text-white/10">·</span>
            <Link href="/blog/best-grindr-alternatives-2026" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Best Grindr alternatives</Link>
            <span className="text-white/10">·</span>
            <Link href="/grindr-vs-alternatives" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Grindr vs alternatives</Link>
            <span className="text-white/10">·</span>
            <Link href="/new-york" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Gay dating New York</Link>
            <span className="text-white/10">·</span>
            <Link href="/" className="text-sm text-white/35 hover:text-[#d4a574] transition-colors underline underline-offset-4">Embir home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
