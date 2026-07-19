import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Tinder vs Embir — Alternative gratuite a Tinder 2026" : "Tinder vs Embir — Free Tinder alternative 2026",
    description: isFr ? "Comparatif Tinder vs Embir. Tinder fait payer les sélection quotidienne courte, Embir est gratuit pour les connexions essentielles. Filtre par orientation, profils verifies. Decouvre la difference." : "Tinder vs Embir comparison. Tinder charges for a short daily selection, Embir's core connection features are free. Orientation filter, verified profiles. See the difference.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}tinder-vs-embir`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/tinder-vs-embir`,
        "en-US": `https://embir.xyz/tinder-vs-embir`,
        "en-GB": `https://embir.xyz/tinder-vs-embir`,
      },
    },
    openGraph: {
      title: isFr ? "Tinder vs Embir — Alternative gratuite a Tinder 2026" : "Tinder vs Embir — Free Tinder alternative 2026",
      description: isFr ? "Comparatif Tinder vs Embir. Tinder fait payer les sélection quotidienne courte, Embir est gratuit pour les connexions essentielles. Filtre par orientation, profils verifies. Decouvre la difference." : "Tinder vs Embir comparison. Tinder charges for a short daily selection, Embir's core connection features are free. Orientation filter, verified profiles. See the difference.",
      locale: isFr ? "fr_FR" : "en_US",
      type: "article",
    },
  };
}

const DATA = {
  fr: {
    h1: "Tinder vs Embir : la fin du paywall",
    tagline: "Tinder te fait payer pour matcher. Embir te laisse matcher gratuitement, avec de vrais filtres.",
    competitor: "Tinder",
    competitorPros: ["Enorme base d'utilisateurs", "Interface simple et rapide", "Tinder Plus/Gold/Platinum bien etablis"],
    competitorCons: ["Payant (20-45 EUR/mois pour les fonctionnalites de base)", "Beaucoup de faux profils et bots", "Pas de filtre par orientation LGBT+", "Publicite agressive", "Focus sur le swipe superficiel"],
    embirPros: ["Connexions essentielles sans carte bancaire", "Préférences appliquées dans les deux sens", "Badge selfie facultatif et visible", "Intentions déclarées", "Sélection courte"],
    embirCons: ["Base d'utilisateurs plus petite", "Moins de notoriete"],
    faq: [["En quoi Embir diffère-t-il de Tinder ?", "Embir utilise une sélection courte, les intentions déclarées et des préférences réciproques. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire."], ["Embir a-t-il moins de faux profils que Tinder ?", "Embir ne publie pas de comparaison chiffrée sur les faux profils. La vérification selfie facultative ajoute un badge visible ; le blocage et le signalement restent disponibles."], ["Puis-je chercher autre chose que de l'amour ?", "Oui. Embir propose plusieurs intentions, dont amour, amitié, casual, sport, sorties et conversation."]],
  },
  en: {
    h1: "Tinder vs Embir: the end of the paywall",
    tagline: "Tinder charges you to match. Embir lets you match for free, with real filters.",
    competitor: "Tinder",
    competitorPros: ["Enorme base d'utilisateurs", "Interface simple et rapide", "Tinder Plus/Gold/Platinum bien etablis"],
    competitorCons: ["Payant (20-45 EUR/mois pour les fonctionnalites de base)", "Beaucoup de faux profils et bots", "Pas de filtre par orientation LGBT+", "Publicite agressive", "Focus sur le swipe superficiel"],
    embirPros: ["Core connections without a credit card", "Preferences applied in both directions", "Optional visible selfie badge", "Declared intentions", "Short selection"],
    embirCons: ["Base d'utilisateurs plus petite", "Moins de notoriete"],
    faq: [["How is Embir different from Tinder?", "Embir uses a short selection, declared intentions, and reciprocal preferences. Everything needed to meet someone is free. No credit card required."], ["Does Embir have fewer fake profiles than Tinder?", "Embir does not publish a measured fake-profile comparison. Optional selfie verification adds a visible badge; blocking and reporting remain available."], ["Can I look for things other than love?", "Yes. Embir supports multiple intentions including love, friendship, casual, sports, outings, and conversation."]],
  },
} as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const c = isFr ? DATA.fr : DATA.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faq.map((item) => ({
      "@type": "Question",
      "name": item[0],
      "acceptedAnswer": { "@type": "Answer", "text": item[1] },
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
            {isFr ? "Comparatif" : "Comparison"} · {c.competitor} vs Embir
          </p>
          <h1 className="mt-8 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/55">
            {c.tagline}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void transition hover:bg-embir-blush"
            >
              {isFr ? "Essayer Embir gratuitement" : "Try Embir free"}
            </Link>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mx-auto max-w-4xl py-12">
          <div className="overflow-hidden rounded-3xl border border-white/[0.07]">
            <div className="grid grid-cols-3 border-b border-white/[0.07] bg-white/[0.03]">
              <div className="p-5 text-sm font-semibold text-white/60">
                {isFr ? "Critere" : "Criteria"}
              </div>
              <div className="border-l border-white/[0.07] p-5 text-center">
                <span className="font-serif text-xl text-white">Embir</span>
                <span className="mt-1 block text-xs font-semibold text-embir-rose">gratuit pour les connexions essentielles</span>
              </div>
              <div className="border-l border-white/[0.07] p-5 text-center">
                <span className="font-serif text-xl text-white/70">{c.competitor}</span>
                <span className="mt-1 block text-xs font-semibold text-embir-rose-deep">{isFr ? "Payant" : "Paid"}</span>
              </div>
            </div>
            {[
              { label: isFr ? "Connexions essentielles" : "Core connections", embir: isFr ? "Sans carte bancaire" : "No credit card", competitor: isFr ? "Offres variables" : "Plans vary" },
              { label: isFr ? "Découverte" : "Discovery", embir: isFr ? "Sélection courte" : "Short selection", competitor: isFr ? "Selon l'offre" : "Depends on plan" },
              { label: isFr ? "Messagerie" : "Messaging", embir: isFr ? "Connexions réciproques" : "Reciprocal connections", competitor: isFr ? "Selon l'offre" : "Depends on plan" },
              { label: isFr ? "Filtre par orientation" : "Orientation filter", embir: "Oui Strict", competitor: "Non" },
              { label: isFr ? "Multi-intentions" : "Multi-intention", embir: "Oui 6 modes", competitor: "Non" },
              { label: isFr ? "Badge selfie" : "Selfie badge", embir: isFr ? "Facultatif" : "Optional", competitor: isFr ? "Variable" : "Varies" },
              { label: isFr ? "Publicites" : "Ads", embir: "Aucune", competitor: "Intrusives" },
              { label: isFr ? "Invitations" : "Invitations", embir: isFr ? "Partage facultatif" : "Optional sharing", competitor: isFr ? "Variable" : "Varies" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/[0.05] last:border-0">
                <div className="p-4 text-sm text-white/60">{row.label}</div>
                <div className="border-l border-white/[0.05] p-4 text-center text-sm font-semibold text-embir-rose">
                  {row.embir}
                </div>
                <div className="border-l border-white/[0.05] p-4 text-center text-sm text-white/40">
                  {row.competitor}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROS & CONS */}
        <section className="mx-auto max-w-5xl py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Embir */}
            <div className="rounded-3xl border border-embir-rose/20 bg-embir-rose/[0.03] p-8">
              <h2 className="font-serif text-2xl font-light text-white">
                Embir
                <span className="ml-2 rounded-full bg-embir-rose/10 px-2 py-0.5 text-xs font-semibold text-embir-rose">
                  {isFr ? "Gratuit" : "Free"}
                </span>
              </h2>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-embir-rose">
                  {isFr ? "Avantages" : "Pros"}
                </p>
                {c.embirPros.map((pro, i) => (
                  <div key={"embir-pro-" + i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-embir-rose">Oui</span>
                    <span className="text-sm text-white/60">{pro}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  {isFr ? "Inconvenients" : "Cons"}
                </p>
                {c.embirCons.map((con, i) => (
                  <div key={"embir-con-" + i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-white/30">-</span>
                    <span className="text-sm text-white/40">{con}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor */}
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8">
              <h2 className="font-serif text-2xl font-light text-white/70">
                {c.competitor}
                <span className="ml-2 rounded-full bg-embir-rose-deep/10 px-2 py-0.5 text-xs font-semibold text-embir-rose-deep">
                  {isFr ? "Payant" : "Paid"}
                </span>
              </h2>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {isFr ? "Avantages" : "Pros"}
                </p>
                {c.competitorPros.map((pro, i) => (
                  <div key={"comp-pro-" + i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-white/50">Oui</span>
                    <span className="text-sm text-white/50">{pro}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-embir-rose-deep">
                  {isFr ? "Inconvenients" : "Cons"}
                </p>
                {c.competitorCons.map((con, i) => (
                  <div key={"comp-con-" + i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-embir-rose-deep">Non</span>
                    <span className="text-sm text-white/50">{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl py-12">
          <h2 className="text-center font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Questions frequentes" : "Frequently asked"}
          </h2>
          <div className="mt-10 space-y-3">
            {c.faq.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white/80">
                  {item[0]}
                  <span className="ml-4 text-lg text-embir-rose transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/48">{item[1]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl py-16 text-center">
          <h2 className="font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Pret a essayer Embir ?" : "Ready to try Embir?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/45">
            {isFr ? "gratuit pour les connexions essentielles. Aucune pub. Aucun abonnement." : "core connection features are free. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register"
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void transition hover:bg-embir-blush"
          >
            {isFr ? "Creer mon profil gratuit" : "Create my free profile"}
          </Link>
        </section>
      </main>
    </>
  );
}
