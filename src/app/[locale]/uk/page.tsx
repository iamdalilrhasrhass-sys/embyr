import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Dating App for the UK — London, Manchester, Birmingham | Embir",
  description: "Embir is free at launch in the UK. Verified profiles, compatibility-first dating, clear intentions, and a founding community across London, Manchester and Birmingham.",
  alternates: {
    canonical: "https://embir.xyz/uk",
    languages: { "fr": "https://embir.xyz/fr/royaume-uni" },
  },
  openGraph: {
    title: "Free Dating App for the UK — London, Manchester, Birmingham | Embir",
    description: "Embir is free at launch in the UK. Verified profiles, compatibility-first dating, and a founding community across London, Manchester and Birmingham.",
    url: "https://embir.xyz/uk",
    locale: "en_GB",
    siteName: "Embir",
    images: [`/api/og?title=Free+Dating+App+for+the+UK+—+London,+Manchester,+Birmingham+%7C+Embir&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Free Dating App for the UK | Embir", description: "Embir is free at launch in the UK. Verified profiles and compatibility-first dating.", images: [`/api/og?title=Free+Dating+App+for+the+UK+—+London,+Manchester,+Birmingham+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">United Kingdom</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">UK dating with clearer intentions</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          British dating culture has its own rhythm — more understated than the US, more diverse than stereotypes suggest. Embir is building UK communities in London, Manchester, and Birmingham, with an approach that values compatibility, verified profiles, and clear intentions over the usual swipe fatigue.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">London, Manchester, Birmingham — starting where density matters</h2>
            <p className="mt-4">The UK&apos;s dating scene is concentrated in its major cities. London has the density but also the noise — millions of profiles, endless options, and paradoxically, a harder time finding genuine connections. Manchester and Birmingham have vibrant, diverse communities but fewer dedicated dating platforms paying attention to them. Embir starts in these three cities to build real local density before expanding.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What makes UK dating different</h2>
            <div className="mt-4 space-y-3">
              {[
                ["The pub test matters", "British dating often revolves around pub culture — casual, low-pressure, conversational. Embir's compatibility signals help you find people you'd actually enjoy a pint with, not just people who look good in photos."],
                ["Banter is currency", "British humor doesn't always translate well to dating app bios. Embir's detailed profiles give more room to show your personality — interests, preferences, intentions — than a 200-character bio ever could."],
                ["Multicultural Britain", "The UK, especially London and Birmingham, is deeply multicultural. Embir's orientation-aware visibility and preference settings let people from all backgrounds find compatible connections without unwanted attention."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">How Embir fits the UK market</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {[
                ["Tinder", "Swipe culture, massive user base", "Compatibility-first, verified profiles, clearer intentions"],
                ["Bumble", "Women-first messaging", "All genders initiate, orientation-aware visibility"],
                ["Hinge", "Prompt-based profiles", "Personal universe profiles, compatibility signals"],
                ["Grindr", "Gay/bi men, proximity grid", "All orientations, compatibility over distance"],
              ].map(([app, them, us]) => (
                <div key={app} className="grid grid-cols-[120px_1fr_1fr] border-b border-white/[0.04] px-5 py-4 text-sm last:border-b-0">
                  <div className="font-semibold text-white/70">{app}</div>
                  <div className="text-white/30">{them}</div>
                  <div className="text-[#d4a574]">{us}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Is Embir available everywhere in the UK?", "The app is accessible from anywhere in the UK, but the founding community is concentrated in London, Manchester, and Birmingham. We're building density before expanding."],
                ["Is Embir free in the UK?", "Yes, completely free during launch. Messaging, matching, verification — all included. A freemium model will come later to fund the mobile app and safety tools."],
                ["Will Embir have UK-specific features?", "The core experience is global, but local market pages, city-specific founding communities, and UK-oriented content help make the experience locally relevant."],
                ["When is the mobile app launching?", "In development. The web version works on mobile browsers. Founding members will be among the first to access the native apps."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Join the UK founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free profile and help build a better dating experience for the UK — one that values compatibility and safety.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/us", "US dating"],
              ["/switzerland", "Switzerland dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
              ["/grindr-alternative", "Grindr alternative"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
