import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Dating in Manchester — Verified Profiles, Real Compatibility | Embir",
    fr: "Rencontres à Manchester — Profils Vérifiés, Compatibilité Réelle | Embir",
  };
  const descriptions: Record<string, string> = {
    en: "Manchester dating app: verified profiles, compatibility matching, and a founding community across Northern Quarter, Didsbury, Chorlton, and beyond. Free at launch for Manchester founding members.",
    fr: "Application de rencontre à Manchester : profils vérifiés, matching par compatibilité, et une communauté fondatrice. Gratuite au lancement.",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: "https://embir.xyz/manchester",
      languages: { "fr": "https://embir.xyz/fr/rencontre-manchester" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: "https://embir.xyz/manchester",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      siteName: "Embir",
      images: [{ url: `/api/og?title=Dating+in+Manchester+%7C+Embir&variant=default`, width: 1200, height: 630, alt: "Embir Manchester dating" }],
    },
    twitter: { card: "summary_large_image", title: "Dating in Manchester | Embir", description: "Manchester dating app: verified profiles, compatibility matching, and a founding community.", images: [`/api/og?title=Dating+in+Manchester+%7C+Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Manchester · United Kingdom</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Manchester dating, with verified profiles and real compatibility</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Manchester has one of the most vibrant social scenes in the UK — a city of students, creatives, tech workers, and a legendary music culture. But dating here has its own frustrations: most apps feel built for London, the same small pool of profiles cycles endlessly, and the city&apos;s famous friendliness doesn&apos;t always translate into genuine romantic connections. Embir brings verified profiles and real compatibility matching to Manchester&apos;s unique dating landscape.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why Manchester</h2>
            <p className="mt-4">Manchester is the UK&apos;s second city in everything but official status — and its dating scene punches above its weight. The Northern Quarter attracts creatives and independents. Didsbury and Chorlton draw young professionals and families. The universities inject thousands of new faces every September. But Manchester is also a city where everyone seems to know everyone — which makes dating app fatigue feel especially personal when the same profiles keep appearing.</p>
            <p className="mt-3">We&apos;re building Manchester neighbourhood by neighbourhood — starting with a core of founding members who value verification, clear intentions, and compatibility over the swipe grind. Real Mancunians building a real local community, with none of the inflated numbers you see on other platforms.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Manchester dating, done properly</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Northern Quarter to Didsbury, verified", "Manchester&apos;s neighbourhoods have distinct personalities. Someone in Ancoats lives differently than someone in Altrincham. Embir&apos;s compatibility signals go deeper than postcode — they look at lifestyle, intentions, and what you want from a relationship."],
                ["Gay Manchester, lesbian Manchester, queer Manchester", "Canal Street is iconic, but Manchester&apos;s LGBTQ+ scene extends across the entire city. Embir&apos;s orientation-aware visibility means you see only compatible profiles, whether you&apos;re a gay man in the Village, a lesbian woman in Chorlton, or trans and looking for respectful connections."],
                ["No more &apos;alright?&apos; going nowhere", "Manchester is famously friendly, but dating app conversations often stall at pleasantries. Embir encourages richer profiles — interests, preferences, intentions — so the first message can skip the small talk and get to something real."],
                ["Founding members, not inflated counts", "We won&apos;t fabricate member numbers. The founding community starts small, verified, and genuine. Every member counts. Quality over quantity from the very beginning."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Free at launch — because Manchester rents are enough</h2>
            <p className="mt-4">Manchester living costs have soared, but Embir is free during launch. Create your profile, set your preferences, browse compatible people, send messages — all without a subscription. When a freemium model arrives later, it will fund the mobile app, verification, and moderation. Core features stay accessible. Founding members get advance notice.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What Manchester founding members get</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Verified community", "Selfie verification from day one. Talk to real people from Manchester, not bots pretending to be from Salford."],
                ["Orientation control", "Straight, gay, lesbian, bi, trans, or queer — you decide who sees your profile and who you want to discover."],
                ["Compatibility signals", "Shared interests, relationship intentions, lifestyle preferences. Match on what matters, not just a photo from 20 Stories."],
                ["Invite-only early phase", "Bring friends, build your circle. Manchester&apos;s best dating communities grow through trust and word of mouth."],
                ["Shape the culture", "Founding members influence moderation norms, feature priorities, and community standards. Your voice matters in shaping Manchester&apos;s dating future."],
                ["First access to mobile app", "Manchester founding members get priority access when the native iOS and Android apps launch."],
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
                ["How many members does Embir have in Manchester?", "Embir is in its launch phase. We&apos;re building the Manchester founding community right now — starting with a core of verified members. No inflated numbers. Growth happens through invitations and word of mouth across neighbourhoods like the Northern Quarter, Chorlton, and Didsbury."],
                ["Is Embir only for gay dating in Manchester?", "No. Embir serves all orientations. Manchester&apos;s LGBTQ+ community is a vital part of the platform, but straight, bi, trans, and queer daters all share the same space. Orientation controls ensure you only see compatible profiles."],
                ["How is Embir different from Tinder in Manchester?", "Tinder in Manchester is the same swipe grind you&apos;ll find anywhere. Embir focuses on compatibility, verified profiles, and clearer intentions. Fewer dead-end matches, more connections with potential — in a city where everyone deserves better than endless swiping."],
                ["Is Embir a good alternative to Bumble in Manchester?", "If you want a platform where all genders initiate equally and compatibility matters more than who messages first, yes. Embir doesn&apos;t impose gendered messaging rules. Verified profiles and compatibility signals help you find people you&apos;re genuinely aligned with."],
                ["When is the Manchester mobile app launching?", "In development. The web app works on mobile browsers now. Manchester founding members will be first notified when native apps are ready."],
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
          <h2 className="font-serif text-3xl text-white">Join the Manchester founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Be among the first Manchester members. Verified profile. Real compatibility. Free during launch. Help build a dating culture that Manchester can be proud of — from the Northern Quarter to the suburbs.</p>
          <Link href="/auth/register?utm_source=seo&utm_medium=organic&utm_campaign=city_landing" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/uk", "UK dating"],
              ["/london", "London dating"],
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
