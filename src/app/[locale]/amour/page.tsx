import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Rencontre amoureuse sérieuse gratuite par orientation | Embir" : "Serious dating by orientation — 100% free | Embir",
    description: isFr ? "Trouve l'amour sur Embir. Rencontres sérieuses filtrées par orientation, profils vérifiés, anti-ghosting. 100% gratuit, sans pub, sans abonnement." : "Find love on Embir. Serious dating filtered by orientation, verified profiles, anti-ghosting. 100% free, no ads, no subscription.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}amour`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/amour`,
        "en-US": `https://embir.xyz/amour`,
        "en-GB": `https://embir.xyz/amour`,
      },
    },
    openGraph: {
      title: isFr ? "Rencontre amoureuse sérieuse gratuite par orientation | Embir" : "Serious dating by orientation — 100% free | Embir",
      description: isFr ? "Trouve l'amour sur Embir. Rencontres sérieuses filtrées par orientation, profils vérifiés, anti-ghosting. 100% gratuit, sans pub, sans abonnement." : "Find love on Embir. Serious dating filtered by orientation, verified profiles, anti-ghosting. 100% free, no ads, no subscription.",
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const c = isFr ? COPY.fr : COPY.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faq.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  };

  return (
    <>
      <Navbar showLogo />
      <main className="emb-page min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <SchemaOrg />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* HERO */}
        <section className="mx-auto max-w-5xl py-12 text-center lg:py-20">
          <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            {isFr ? "Embir · 100% gratuit" : "Embir · 100% free"}
          </p>
          <div className="mt-8 text-6xl">♥</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Pas de swipe infini. Des profils qui veulent construire. Embir filtre par orientation et par intention pour te montrer les personnes qui cherchent une relation sérieuse." : "No endless swiping. Profiles from people who want to build. Embir filters by orientation and intention to show you people looking for a serious relationship."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=AMOUR"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
            >
              {isFr ? "Commencer gratuitement" : "Get started free"}
            </Link>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-[#d4a574]/35"
            >
              {isFr ? "Voir toutes les intentions" : "See all intentions"}
            </Link>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="mx-auto max-w-4xl py-12">
          <div className="space-y-12">
            {c.sections.map((section, i) => (
              <article key={i} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">
                <h2 className="font-serif text-2xl font-light text-white sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKING */}
        <section className="mx-auto max-w-4xl py-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            {isFr ? "Autres intentions" : "Other intentions"}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(isFr ? COPY.fr.links : COPY.en.links).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-[#d4a574]/35 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl py-12">
          <h2 className="text-center font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Questions fréquentes" : "Frequently asked"}
          </h2>
          <div className="mt-10 space-y-3">
            {c.faq.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white/80">
                  {item.q}
                  <span className="ml-4 text-lg text-[#d4a574] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/48">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl py-16 text-center">
          <h2 className="font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Prêt à commencer ?" : "Ready to start?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/45">
            {isFr ? "100% gratuit. Aucune pub. Aucun abonnement." : "100% free. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register?intent=AMOUR"
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
          >
            {isFr ? "Créer mon profil" : "Create my profile"}
          </Link>
        </section>
      </main>
    </>
  );
}

const COPY = {
  fr: {
    h1: "Trouve quelqu'un qui cherche la même chose que toi.",
    sections: [{"title": "Pourquoi Embir pour l'amour", "text": "La plupart des apps de rencontre sont conçues pour te garder. Embir est conçu pour te faire trouver quelqu'un. Quand tu cherches l'amour, tu veux des profils qui partagent tes valeurs, pas une infinité de swipes. Embir filtre par orientation, par intention et par géographie pour te montrer les personnes qui veulent la même chose : une relation durable."}, {"title": "Le filtre bidirectionnel change tout", "text": "Le filtre par orientation est strict dans les deux sens. Tu ne vois que les profils qui te correspondent et qui te cherchent aussi. Fini les matchs unilatéraux, fini les profils qui ne te répondront jamais. Chaque profil dans ton feed est une vraie possibilité."}, {"title": "Profils vérifiés, confiance réelle", "text": "La vérification par selfie élimine les faux profils. Les profils vérifiés ont un badge et sont mis en avant. Tu sais à qui tu parles, dès le premier message. La confiance est la base d'une relation amoureuse — Embir la garantit avant le premier match."}, {"title": "Anti-ghosting et respect", "text": "Embir encourage les réponses et pénalise le ghosting. Les membres qui répondent régulièrement sont mis en avant. Si quelqu'un ne répond pas, Embir ne le montre plus. Parce que chercher l'amour mérite du respect, pas du silence."}],
    faq: [{"q": "Embir est-il vraiment gratuit pour trouver l'amour ?", "a": "Oui, 100% gratuit. Aucune fonctionnalité payante. Tu peux matcher, discuter et rencontrer sans jamais payer. Pas d'abonnement, pas de pub, pas de limite de likes."}, {"q": "Comment le filtre par orientation fonctionne-t-il ?", "a": "Tu renseignes ton genre et ton orientation à l'inscription, puis tu choisis qui tu cherches. Embir ne te montre que les profils compatibles dans les deux sens : ils te correspondent et ils te cherchent aussi."}, {"q": "Comment éviter ceux qui veulent juste du fun ?", "a": "Chaque membre choisit ses intentions (amour, amis, fun, etc.). Si tu sélectionnes 'amour', tu ne vois que les profils qui ont aussi sélectionné 'amour'. Pas de malentendu possible."}, {"q": "Les profils sont-ils vérifiés ?", "a": "Oui, par selfie. Les profils vérifiés ont un badge bleu et sont mis en avant dans le feed. La vérification est gratuite et élimine les faux profils."}, {"q": "Y a-t-il une limite de likes par jour ?", "a": "Non. Aucune limite. Tu peux liker autant de profils que tu veux, quand tu veux. Embir ne limite pas l'amour pour te vendre un abonnement premium."}],
    links: [
      { href: "/amour", label: "\u2665 Amour" },
      { href: "/amis", label: "\u2726 Amis" },
      { href: "/fun", label: "\u26a1 Fun" },
      { href: "/plan-cul", label: "\u2738 Plan cul" },
      { href: "/sport", label: "\u25c6 Sport" },
      { href: "/evenements", label: "\u2756 \u00c9v\u00e9nements" },
    ],
  },
  en: {
    h1: "Find someone who wants the same thing as you.",
    sections: [{"title": "Why Embir for love", "text": "Most dating apps are designed to keep you. Embir is designed to help you find someone. When you're looking for love, you want profiles that share your values, not endless swipes. Embir filters by orientation, intention, and geography to show you people who want the same: a lasting relationship."}, {"title": "The bidirectional filter changes everything", "text": "The orientation filter is strict in both directions. You only see profiles that match you AND are looking for you. No more one-sided matches, no more profiles that will never respond. Every profile in your feed is a real possibility."}, {"title": "Verified profiles, real trust", "text": "Selfie verification eliminates fake profiles. Verified profiles have a badge and are featured. You know who you're talking to, from the first message. Trust is the foundation of a romantic relationship — Embir guarantees it before the first match."}, {"title": "Anti-ghosting and respect", "text": "Embir encourages responses and penalizes ghosting. Members who reply regularly are featured. If someone doesn't respond, Embir stops showing them. Because looking for love deserves respect, not silence."}],
    faq: [{"q": "Is Embir really free for finding love?", "a": "Yes, 100% free. No paid features. You can match, chat, and meet without ever paying. No subscription, no ads, no like limits."}, {"q": "How does the orientation filter work?", "a": "You enter your gender and orientation during signup, then choose who you're looking for. Embir only shows you mutually compatible profiles: they match you and they're looking for you too."}, {"q": "How do I avoid people who just want fun?", "a": "Each member chooses their intentions (love, friends, fun, etc.). If you select 'love', you only see profiles that also selected 'love'. No misunderstanding possible."}, {"q": "Are profiles verified?", "a": "Yes, by selfie. Verified profiles have a blue badge and are featured in the feed. Verification is free and eliminates fake profiles."}, {"q": "Is there a daily like limit?", "a": "No. No limits. You can like as many profiles as you want, whenever you want. Embir doesn't limit love to sell you a premium subscription."}],
    links: [
      { href: "/amour", label: "\u2665 Love" },
      { href: "/amis", label: "\u2726 Friends" },
      { href: "/fun", label: "\u26a1 Fun" },
      { href: "/plan-cul", label: "\u2738 Casual" },
      { href: "/sport", label: "\u25c6 Sports" },
      { href: "/evenements", label: "\u2756 Events" },
    ],
  },
} as const;