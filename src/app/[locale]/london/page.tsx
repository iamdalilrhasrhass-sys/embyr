import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Dating in London — Verified Profiles, Real Compatibility | Embir",
    fr: "Rencontres à Londres — Profils Vérifiés, Compatibilité Réelle | Embir",
  };
  const descriptions: Record<string, string> = {
    en: "London dating app: inclusive, verified profiles, compatibility matching, and a founding community across Soho, Shoreditch, Clapham, and beyond. Core connections are free.",
    fr: "Application de rencontre à Londres : inclusive, profils vérifiés, matching par compatibilité, et une communauté fondatrice. gratuite pour les connexions essentielles.",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: "https://embir.xyz/london",
      languages: { "fr": "https://embir.xyz/fr/rencontre-londres" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: "https://embir.xyz/london",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      siteName: "Embir",
      images: [{ url: `/api/og?title=Dating+in+London+%7C+Embir&variant=default`, width: 1200, height: 630, alt: "Embir London dating" }],
    },
    twitter: { card: "summary_large_image", title: "Dating in London | Embir", description: "London dating app: verified profiles, compatibility matching, and a founding community.", images: [`/api/og?title=Dating+in+London+%7C+Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose/70">London · United Kingdom</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">London dating, with verified profiles and real compatibility</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          London has one of the most intense dating scenes in the world — over nine million people, countless neighbourhoods, and a pace that makes even seasoned daters feel overwhelmed. The apps haven&apos;t kept up: recycled profiles, fake accounts, and subscription fees that climb past £25 a month. Embir starts here with a different approach — fewer fakes, clearer intentions, and compatibility that goes deeper than a postcode match.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-embir-rose/10 bg-embir-rose/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why London</h2>
            <p className="mt-4">London is one of Embir&apos;s core launch cities. The density, diversity, and dating culture make it an essential market. From Soho&apos;s LGBTQ+ hub to Shoreditch creatives, from Clapham&apos;s young professionals to Hampstead&apos;s established crowd — London has every dating archetype. But density creates noise: ghosting is common, conversations stall, and many profiles haven&apos;t been active in months.</p>
            <p className="mt-3">We&apos;re building London neighbourhood by neighbourhood — starting with a core of founding members who value verification, clear intentions, and compatibility over the swipe grind. No inflated member counts. No fake activity. Just real Londoners building a real local community.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">London dating, but with substance</h2>
            <div className="mt-4 space-y-3">
              {[
                ["From Soho to Stratford, verified", "London neighbourhoods aren&apos;t just locations — they&apos;re identities. Someone in Hackney lives a different rhythm than someone in Kensington. Embir&apos;s compatibility signals go deeper than zone — they look at lifestyle, intentions, and what you actually want from dating."],
                ["Gay London, lesbian London, queer London", "London has one of the world&apos;s largest LGBTQ+ scenes — Soho, Vauxhall, Dalston, and beyond. Embir&apos;s orientation-aware visibility means you see only compatible profiles, whether you&apos;re a gay man in Vauxhall, a lesbian woman in Stoke Newington, or trans and looking for people who respect your identity."],
                ["No more &apos;hey, how&apos;s your week?&apos; loops", "London dating apps are notorious for conversations that never leave small talk. Embir encourages richer profiles — interests, preferences, intentions — so the first message can be about something real, not just another awkward opener on the Northern Line."],
                ["Founding members, not vanity metrics", "We won&apos;t tell you there are 500,000 members in London when there aren&apos;t. The founding community starts small, verified, and real. Every member matters. Quality over inflated numbers from day one."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-embir-rose-deep/10 bg-embir-rose-deep/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Core connections without a London price tag</h2>
            <p className="mt-4">London is expensive enough without another subscription. Embir&apos;s core connection features are free. Create your profile, set your preferences, browse compatible people and message reciprocal connections without a credit card. Optional services are clearly separated from core connections.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What London founding members get</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Verified community", "Selfie verification from day one. Know you&apos;re talking to real Londoners, not bots or catfish using stolen photos."],
                ["Orientation control", "Whether you&apos;re straight, gay, lesbian, bi, trans, or queer — set who sees your profile and who you want to discover."],
                ["Compatibility signals", "Shared interests, relationship intentions, lifestyle preferences. Match on what matters, not just a photo from All Bar One."],
                ["Invite-only early phase", "Bring friends, build your circle. The best London dating communities grow through trust, not ads on the Tube."],
                ["Shape the culture", "Founding members influence moderation norms, feature priorities, and community standards. Your voice shapes London&apos;s dating future."],
                ["First access to mobile app", "London founding members will be first in line when the native iOS and Android apps launch."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["How many members does Embir have in London?", "Embir is in its core connection experience. We&apos;re building the London founding community right now — starting with a core of verified members. We don&apos;t publish inflated numbers. The community grows through invitations and word of mouth across neighbourhoods like Soho, Shoreditch, and Clapham."],
                ["Is Embir only for gay dating in London?", "No. Embir is for all orientations. Gay and bi men, lesbian and bi women, trans and queer people, and straight daters all share the same platform. Orientation controls ensure everyone only sees compatible profiles. London&apos;s LGBTQ+ community is a core part of Embir, but they&apos;re not the only part."],
                ["How is Embir different from Tinder in London?", "Tinder in London is high-volume swipe fatigue central. Embir focuses on compatibility, verified profiles, and clearer intentions. Fewer random matches, more connections that have a real chance — especially in a city where everyone&apos;s too busy for dead-end conversations."],
                ["Is Embir a good Hinge alternative in London?", "If you want more than prompts and time-limited matches, yes. Embir&apos;s compatibility signals and verified profiles help you find people you&apos;re actually aligned with. All genders initiate equally. No pressure, no timers."],
                ["When is the London mobile app launching?", "In development. The web app works on mobile browsers today. London founding members will be first to access the native apps when they launch."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-embir-rose/15 bg-embir-rose/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Join the London founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Be among the first London members. Verified profile. Real compatibility. Core connection features are free. Help build a dating culture London deserves — from Soho to Stratford.</p>
          <Link href="/auth/register?utm_source=seo&utm_medium=organic&utm_campaign=city_landing" className="mt-7 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/uk", "UK dating"],
              ["/manchester", "Manchester dating"],
              ["/us", "US dating"],
              ["/los-angeles", "Los Angeles dating"],
              ["/switzerland", "Switzerland dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-embir-rose/30 hover:text-embir-rose">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
