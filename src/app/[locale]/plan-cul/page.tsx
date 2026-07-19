import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Plan cul gratuit avec consentement et respect | Embir" : "Casual encounters free with consent and respect | Embir",
    description: isFr ? "Du plaisir clair, du consentement, zéro jugement. Embir filtre par orientation pour des rencontres sans engagement sûres. Sans carte bancaire." : "Clear pleasure, consent, zero judgment. Embir filters by orientation for safe casual encounters. Core connections are free.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}plan-cul`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/plan-cul`,
        "en-US": `https://embir.xyz/plan-cul`,
        "en-GB": `https://embir.xyz/plan-cul`,
      },
    },
    openGraph: {
      title: isFr ? "Plan cul gratuit avec consentement et respect | Embir" : "Casual encounters free with consent and respect | Embir",
      description: isFr ? "Du plaisir clair, du consentement, zéro jugement. Embir filtre par orientation pour des rencontres sans engagement sûres. Sans carte bancaire." : "Clear pleasure, consent, zero judgment. Embir filters by orientation for safe casual encounters. Core connections are free.",
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
          <div className="mt-8 text-6xl">✸</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Transparence sur les intentions. Consentement explicite. Sécurité par la vérification. Embir rend les rencontres sans engagement plus sûres et plus honnêtes." : "Transparency on intentions. Explicit consent. Safety through verification. Embir makes casual encounters safer and more honest."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=PLAN_CUL"
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
            href="/auth/register?intent=PLAN_CUL"
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
    h1: "Du plaisir clair, du consentement, zéro jugement.",
    sections: [{"title": "Transparence sur les intentions", "text": "L'intention casual est déclarée et prise en compte dans la sélection. Cela réduit les malentendus sans les éliminer."}, {"title": "Consentement et respect", "text": "Une intention affichée n'est jamais un consentement à une interaction. Le signalement est enregistré et le blocage prend effet immédiatement."}, {"title": "Badge selfie facultatif", "text": "Un badge indique qu'un contrôle selfie a été approuvé ; il ne prouve ni l'identité complète ni les intentions. Aucun outil ne garantit la sécurité d'une rencontre."}, {"title": "Connexions essentielles", "text": "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire."}],
    faq: [{"q": "Embir garantit-il la sécurité des rencontres casual ?", "a": "Non. Aucun service ne peut garantir la sécurité. La vérification facultative, le blocage et le signalement sont disponibles ; rencontre d'abord dans un lieu public."}, {"q": "Le parcours casual est-il gratuit ?", "a": "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire."}, {"q": "Comment le consentement est-il traité ?", "a": "Le consentement doit être explicite et peut être retiré à tout moment. Une intention de profil ne vaut jamais consentement."}, {"q": "Le filtre par orientation est-il actif ?", "a": "Le moteur applique les préférences déclarées dans les deux sens, y compris pour l'intention casual."}, {"q": "Puis-je sélectionner plusieurs intentions ?", "a": "Oui. La sélection tient compte des intentions partagées."}],
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
    h1: "Clear pleasure, consent, zero judgment.",
    sections: [{"title": "Transparency on intentions", "text": "The casual intention is declared and included in selection. This reduces misunderstandings without eliminating them."}, {"title": "Consent and respect", "text": "A displayed intention is never consent to an interaction. Reports are recorded and blocking takes effect immediately."}, {"title": "Optional selfie badge", "text": "A badge shows that a selfie check was approved; it does not prove full identity or intentions. No tool guarantees the safety of a meeting."}, {"title": "Core connections", "text": "Everything needed to meet someone is free. No credit card required."}],
    faq: [{"q": "Does Embir guarantee safe casual meetings?", "a": "No. No service can guarantee safety. Optional verification, blocking, and reporting are available; meet in public first."}, {"q": "Is the casual path free?", "a": "Everything needed to meet someone is free. No credit card required."}, {"q": "How is consent handled?", "a": "Consent must be explicit and can be withdrawn at any time. A profile intention is never consent."}, {"q": "Is reciprocal filtering active?", "a": "The engine applies declared preferences in both directions, including the casual intention."}, {"q": "Can I select multiple intentions?", "a": "Yes. Selection takes shared intentions into account."}],
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
