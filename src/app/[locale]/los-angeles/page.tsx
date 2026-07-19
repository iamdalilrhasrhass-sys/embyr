import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Dating in Los Angeles — Verified Profiles, Real Compatibility | Embir",
    fr: "Rencontres à Los Angeles — Profils Vérifiés, Compatibilité Réelle | Embir",
  };
  const descriptions: Record<string, string> = {
    en: "LA dating app: verified profiles, compatibility matching, and a founding community across Silver Lake, West Hollywood, Santa Monica, DTLA, and beyond. Free at LA launch.",
    fr: "Application de rencontre à Los Angeles : profils vérifiés, matching par compatibilité, et une communauté fondatrice. gratuite pour les connexions essentielles.",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: "https://embir.xyz/los-angeles",
      languages: { "fr": "https://embir.xyz/fr/rencontre-los-angeles" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: "https://embir.xyz/los-angeles",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "Embir",
      images: [{ url: `/api/og?title=Dating+in+Los+Angeles+%7C+Embir&variant=default`, width: 1200, height: 630, alt: "Embir Los Angeles dating" }],
    },
    twitter: { card: "summary_large_image", title: "Dating in Los Angeles | Embir", description: "LA dating app: verified profiles, compatibility matching, and a founding community.", images: [`/api/og?title=Dating+in+Los+Angeles+%7C+Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose/70">Los Angeles · United States</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Los Angeles dating, with verified profiles and real compatibility</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Los Angeles dating is notorious — a sprawling metropolis where geography is destiny, where &quot;I&apos;m on the Westside&quot; might as well be a breakup text, and where dating apps often feel like a casting call rather than a path to genuine connection. In a city of four million people spread across 500 square miles, proximity alone is a terrible matchmaker. Embir starts here with a different approach: verified profiles, compatibility signals that matter, and a founding community built for connection over convenience.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-embir-rose/10 bg-embir-rose/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why Los Angeles</h2>
            <p className="mt-4">LA is one of Embir&apos;s first US launch cities — and for good reason. The city&apos;s geography makes dating uniquely challenging. Someone in Silver Lake and someone in Santa Monica might be 25 miles apart with an hour of traffic between them. The entertainment industry shapes dating culture in ways no other city experiences. And yet, LA is full of people genuinely looking for connection — they just need better tools to find it.</p>
            <p className="mt-3">We&apos;re building LA neighbourhood by neighbourhood — West Hollywood, Silver Lake, DTLA, Santa Monica, Echo Park, Culver City — starting with a core of founding members who value verification, clear intentions, and compatibility over the endless swipe. No system can guarantee the absence of fake profiles. No inflated numbers. Just real Angelenos building a real local community.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">LA dating, but make it real</h2>
            <div className="mt-4 space-y-3">
              {[
                ["From WeHo to the Valley, verified", "LA neighbourhoods aren&apos;t just places — they&apos;re lifestyles. Someone in Venice has a different rhythm than someone in Los Feliz. Embir&apos;s compatibility signals go deeper than zip code — they look at lifestyle, intentions, whether you&apos;re a morning hiker or a night owl, and what you actually want."],
                ["Gay LA, lesbian LA, queer LA", "LA has one of the largest LGBTQ+ communities in the world — West Hollywood, Silver Lake, and beyond. Embir&apos;s orientation-aware visibility means you see only compatible profiles, whether you&apos;re a gay man in WeHo, a lesbian woman in Echo Park, or trans and looking for people who respect your identity."],
                ["No more &apos;let&apos;s grab coffee sometime&apos; that never happens", "LA dating is infamous for flakiness — plans that are always &apos;tentative.&apos; Embir encourages richer profiles with clear intentions so that when someone says they want a relationship, you know they mean it. The compatibility system helps filter for people whose intentions match yours."],
                ["Founding members, not Hollywood hype", "We&apos;re not going to inflate our LA numbers. The founding community starts small, verified, and real. Every member matters. Quality over quantity — no fake activity, no bots, no smoke and mirrors."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-embir-rose-deep/10 bg-embir-rose-deep/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Core connections without an LA premium</h2>
            <p className="mt-4">LA is expensive enough without another dating app subscription. Embir&apos;s core connection features are free. Create your profile, set your preferences, browse compatible people and message reciprocal connections without a credit card. Optional services are clearly separated from core connections.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What LA founding members get</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Verified community", "Selfie verification from day one. Know you&apos;re talking to real Angelenos, not bots or catfish with stolen headshots."],
                ["Orientation control", "Whether you&apos;re straight, gay, lesbian, bi, trans, or queer — set who sees your profile and who you want to discover across LA&apos;s diverse communities."],
                ["Compatibility signals", "Shared interests, relationship intentions, lifestyle preferences. Match on what matters — not just a beach photo and a vague bio."],
                ["Invite-only early phase", "Bring friends, build your circle. The best LA dating communities grow through trust and real connections, not Super Bowl ads."],
                ["Shape the culture", "Founding members influence moderation norms, feature priorities, and community standards. Help build an LA dating culture that values authenticity over aesthetics."],
                ["First access to mobile app", "LA founding members will be first in line when the native iOS and Android apps launch."],
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
                ["How many members does Embir have in Los Angeles?", "Embir is in its core connection experience. We&apos;re building the LA founding community right now — starting with a core of verified members across key neighbourhoods. We don&apos;t publish inflated numbers. Growth is organic, through invitations and word of mouth."],
                ["Is Embir only for gay dating in LA?", "No. Embir serves all orientations. LA&apos;s LGBTQ+ community is a vital, celebrated part of the platform — but straight, bi, trans, and queer daters all share the same space. Orientation controls ensure everyone only sees compatible profiles."],
                ["How is Embir different from Tinder in LA?", "Tinder in LA is a numbers game driven by appearances. Embir focuses on verified profiles, compatibility signals, and clearer intentions. Less swiping through people who are &apos;just visiting from New York,&apos; more connections with people who are actually available and aligned."],
                ["Is Embir a good Hinge alternative in Los Angeles?", "If you want deeper compatibility than a few prompts can provide, yes. Embir&apos;s detailed profiles and compatibility system help you cut through LA&apos;s noise. All orientations welcome, no gendered messaging rules, and a focus on verified, real people."],
                ["When is the LA mobile app launching?", "In development. The web app works great on mobile browsers today. LA founding members will be among the first to get native app access when it&apos;s ready."],
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
          <h2 className="font-serif text-3xl text-white">Join the LA founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Be among the first LA members. Verified profile. Real compatibility. Core connection features are free. Help build a dating culture that Los Angeles deserves — from the Westside to the Eastside.</p>
          <Link href="/auth/register?utm_source=seo&utm_medium=organic&utm_campaign=city_landing" className="mt-7 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/us", "US dating"],
              ["/new-york", "New York dating"],
              ["/uk", "UK dating"],
              ["/switzerland", "Switzerland dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
              ["/tinder-alternative", "Tinder alternative"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-embir-rose/30 hover:text-embir-rose">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
