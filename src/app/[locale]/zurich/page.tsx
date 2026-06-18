import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Dating in Zurich — Verified Profiles, Real Compatibility | Embir",
    fr: "Rencontres à Zurich — Profils Vérifiés, Compatibilité Réelle | Embir",
  };
  const descriptions: Record<string, string> = {
    en: "Zurich dating app: verified profiles, compatibility matching, and a founding community across Kreis 4, Seefeld, Niederdorf, and beyond. Free at launch. Bilingual EN/FR.",
    fr: "Application de rencontre à Zurich : profils vérifiés, matching par compatibilité, communauté fondatrice. Gratuite au lancement. Bilingue FR/EN.",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: "https://embir.xyz/zurich",
      languages: { "fr": "https://embir.xyz/fr/rencontre-zurich" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
      url: "https://embir.xyz/zurich",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "Embir",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Embir Zurich dating" }],
    },
    twitter: { card: "summary_large_image", title: "Dating in Zurich | Embir", description: "Zurich dating app: verified profiles, compatibility matching, and a founding community.", images: ["/og-image.png"] },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Zurich · Switzerland</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Zurich dating, with verified profiles and real compatibility</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Zurich is Switzerland&apos;s largest city and its most intense dating market — fast-paced, professional, multilingual, and surprisingly difficult to navigate. The density is there: bankers in Seefeld, creatives in Kreis 4, students near the ETH. But Swiss dating culture values discretion, and most dating apps don&apos;t respect that. Embir starts here with a different approach: verified profiles, compatibility signals, and privacy controls that align with how Zurich actually dates.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why Zurich</h2>
            <p className="mt-4">Zurich has Switzerland&apos;s highest concentration of dating app users, but the experience is inconsistent. German is the dominant language, but the city is deeply international — English is common, and French speakers form a significant minority. Dating apps that treat Zurich like a German-only market miss the multilingual reality. And Swiss privacy expectations mean many people are hesitant to broadcast their profile to everyone nearby.</p>
            <p className="mt-3">We&apos;re building Zurich neighbourhood by neighbourhood — Kreis 4 for the creative crowd, Seefeld for professionals, Niederdorf for the nightlife scene, and across the lake to communities in Wollishofen and beyond. Founding members who value verification, privacy, and compatibility over the swipe grind. No fake profiles. Just real people in Zurich building a real community.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Zurich dating, with the privacy you expect</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Kreis 4 to Seefeld, verified", "Zurich&apos;s districts have distinct identities — from the alternative energy of Kreis 4 and 5 to the polished lakefront of Seefeld. Embir&apos;s compatibility signals go deeper than location: lifestyle, career rhythm, outdoor interests, and what you actually want from dating in a city where work-life boundaries are sacred."],
                ["Multilingual by design", "Zurich speaks German, Swiss German, English, and French daily. Embir supports English and French at launch — you write your profile in whatever language feels natural. No one is forced into a linguistic bubble. The platform is designed for a city where switching languages mid-conversation is normal."],
                ["Privacy-first discovery", "Swiss dating culture values discretion. Embir&apos;s orientation-based visibility controls mean your profile is only visible to people who are compatible with your preferences. You decide who sees you, not the algorithm. This aligns naturally with how Zurich approaches dating — intentional, not broadcast."],
                ["Founding members, not Swiss banking hype", "We&apos;re not going to fabricate Zurich member counts. The founding community starts small, verified, and real. Every profile is verified. Every member matters. Quality over quantity — Swiss precision applied to dating."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Free at launch — no Zurich price tag</h2>
            <p className="mt-4">Zurich is one of the most expensive cities in the world. Embir is free during launch. Create your profile, set your preferences, browse compatible people, send messages — all without paying a single franc. When a freemium model arrives later, it will fund the mobile app, verification, and human moderation. Core features will remain accessible. Founding members will be informed well in advance.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What Zurich founding members get</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Verified community", "Selfie verification from day one. Know you&apos;re talking to real people in Zurich, not bots or fake profiles — something Swiss daters particularly value."],
                ["Orientation control", "Whether you&apos;re straight, gay, lesbian, bi, trans, or queer — set who sees your profile and who you want to discover. Full control over your visibility."],
                ["Compatibility signals", "Shared interests, relationship intentions, lifestyle preferences. Match on what matters — whether you&apos;re into lake swimming, skiing, or Zurich&apos;s nightlife."],
                ["Invite-only early phase", "Bring friends, build your circle. The best Zurich dating communities grow through genuine social connections, not aggressive advertising."],
                ["Shape the culture", "Founding members influence moderation norms, feature priorities, and community standards. Help build a dating culture that respects Swiss values: quality, discretion, and authenticity."],
                ["First access to mobile app", "Zurich founding members will be first in line when the native iOS and Android apps launch."],
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
                ["How many members does Embir have in Zurich?", "Embir is in its launch phase. We&apos;re building the Zurich founding community right now — starting with a core of verified members. We don&apos;t publish inflated numbers. The community grows through invitations and word of mouth across Zurich&apos;s districts."],
                ["Is Embir available in German?", "Embir currently supports English and French. The interface is in English (or French), but your profile can be written in German, Swiss German, or any language you prefer. We may add a German interface based on community demand."],
                ["Is Embir only for gay dating in Zurich?", "No. Embir serves all orientations. Zurich&apos;s LGBTQ+ community is an important part of the platform, but straight, bi, trans, and queer daters all share the same space. Orientation controls ensure everyone only sees compatible profiles."],
                ["How is Embir different from Tinder in Zurich?", "Tinder in Zurich is the same high-volume swipe experience as everywhere else. Embir focuses on verified profiles, compatibility signals, and privacy controls that Swiss daters actually want. Fewer random matches, more intentional connections."],
                ["Can I date across Swiss cities with Embir?", "Yes. Zurich to Bern is under an hour by train, and Zurich to Zug or Winterthur is even closer. Embir lets you set your preferred discovery range. You&apos;re not limited to a single city — your compatibility preferences matter more than municipal borders."],
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
          <h2 className="font-serif text-3xl text-white">Join the Zurich founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Be among the first Zurich members. Verified profile. Real compatibility. Free during launch. Help build a dating culture Zurich deserves — private, intentional, and real.</p>
          <Link href="/auth/register?utm_source=seo&utm_medium=organic&utm_campaign=city_landing" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/switzerland", "Switzerland dating"],
              ["/uk", "UK dating"],
              ["/us", "US dating"],
              ["/paris", "Paris dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
              ["/safety", "Safety tools"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
