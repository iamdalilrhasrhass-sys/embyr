import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Rencontre amoureuse sérieuse gratuite par orientation | Embir" : "Serious dating by orientation — free for core connections | Embir",
    description: isFr ? "Découverte réciproque pour l'amour, intentions déclarées et badge selfie facultatif. Sans carte bancaire pour rencontrer quelqu'un." : "Reciprocal discovery for love, declared intentions, and an optional selfie badge. No credit card required to meet someone.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}amour`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/amour`,
        "en-US": `https://embir.xyz/amour`,
        "en-GB": `https://embir.xyz/amour`,
      },
    },
    openGraph: {
      title: isFr ? "Rencontre amoureuse sérieuse gratuite par orientation | Embir" : "Serious dating by orientation — free for core connections | Embir",
      description: isFr ? "Découverte réciproque pour l'amour, intentions déclarées et badge selfie facultatif. Sans carte bancaire pour rencontrer quelqu'un." : "Reciprocal discovery for love, declared intentions, and an optional selfie badge. No credit card required to meet someone.",
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
          <p className="inline-flex rounded-full border border-embir-rose/20 bg-embir-rose/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-embir-rose">
            {isFr ? "Embir · sans carte bancaire" : "Embir · free for core connections"}
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
              className="inline-flex items-center justify-center rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void transition hover:bg-embir-blush"
            >
              {isFr ? "Commencer gratuitement" : "Get started free"}
            </Link>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-embir-rose/35"
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
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-embir-rose">
            {isFr ? "Autres intentions" : "Other intentions"}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(isFr ? COPY.fr.links : COPY.en.links).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-embir-rose/35 hover:text-white"
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
                  <span className="ml-4 text-lg text-embir-rose transition-transform group-open:rotate-45">+</span>
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
            {isFr ? "sans carte bancaire. Aucune pub. Aucun abonnement." : "free for core connections. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register?intent=AMOUR"
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void transition hover:bg-embir-blush"
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
    sections: [{"title": "Pourquoi Embir pour l'amour", "text": "Embir organise la découverte autour de l'orientation, des intentions et des préférences déclarées, avec une sélection courte plutôt qu'un swipe infini."}, {"title": "Le filtre bidirectionnel", "text": "Le moteur applique les préférences dans les deux sens. Il réduit les découvertes mal alignées, sans garantir une réponse ou une rencontre."}, {"title": "Badge selfie facultatif", "text": "Une demande de vérification selfie approuvée ajoute un badge visible. Ce badge ne prouve ni l'identité complète, ni les intentions, ni l'absence de risque."}, {"title": "Ghosting et respect", "text": "Embir n'affiche aucun score de réponse et ne promet pas d'empêcher le ghosting. Les membres gardent le contrôle de leurs connexions."}],
    faq: [{"q": "Embir est-il vraiment gratuit pour trouver l'amour ?", "a": "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire."}, {"q": "Comment le filtre par orientation fonctionne-t-il ?", "a": "Tu renseignes ton genre, ton orientation et qui tu cherches. Le moteur applique ces préférences dans les deux sens."}, {"q": "Comment éviter ceux qui veulent juste du fun ?", "a": "Les intentions déclarées sont prises en compte dans la sélection. Cela réduit les malentendus sans les éliminer."}, {"q": "Tous les profils sont-ils vérifiés ?", "a": "Non. La vérification selfie est facultative. Un badge visible signale les demandes approuvées, sans garantir l'absence de risque."}, {"q": "Comment fonctionne la découverte ?", "a": "Embir propose une sélection courte de profils compatibles selon les critères déclarés."}],
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
    sections: [{"title": "Why Embir for love", "text": "Embir organizes discovery around declared orientation, intentions, and preferences, with a short selection instead of endless swiping."}, {"title": "Bidirectional filtering", "text": "The engine applies preferences in both directions. It reduces misaligned discovery without guaranteeing a reply or a meeting."}, {"title": "Optional selfie badge", "text": "An approved selfie-verification request adds a visible badge. It does not prove full identity, intentions, or the absence of risk."}, {"title": "Ghosting and respect", "text": "Embir does not display response scores or promise to prevent ghosting. Members stay in control of their connections."}],
    faq: [{"q": "Is Embir free for finding love?", "a": "Everything needed to meet someone is free. No credit card required."}, {"q": "How does the orientation filter work?", "a": "You enter your gender, orientation, and who you seek. The engine applies those preferences in both directions."}, {"q": "How do I avoid people who just want fun?", "a": "Declared intentions are included in the selection. This reduces misunderstandings without eliminating them."}, {"q": "Are all profiles verified?", "a": "No. Selfie verification is optional. A visible badge marks approved requests without guaranteeing the absence of risk."}, {"q": "How does discovery work?", "a": "Embir provides a short selection of compatible profiles based on declared criteria."}],
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
