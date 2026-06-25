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
    description: isFr ? "Comparatif Tinder vs Embir. Tinder fait payer les likes illimites, Embir est gratuit au lancement. Filtre par orientation, profils verifies. Decouvre la difference." : "Tinder vs Embir comparison. Tinder charges for unlimited likes, Embir is free at launch. Orientation filter, verified profiles. See the difference.",
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
      description: isFr ? "Comparatif Tinder vs Embir. Tinder fait payer les likes illimites, Embir est gratuit au lancement. Filtre par orientation, profils verifies. Decouvre la difference." : "Tinder vs Embir comparison. Tinder charges for unlimited likes, Embir is free at launch. Orientation filter, verified profiles. See the difference.",
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
    embirPros: ["gratuit au lancement — zero paywall", "Filtre strict par orientation", "Profils verifies par selfie (anti-bot)", "Multi-intentions (amour, amis, fun, sport, evenements)", "Aucune pub, aucune limite de likes"],
    embirCons: ["Base d'utilisateurs plus petite", "Moins de notoriete"],
    faq: [["Embir est-il une meilleure alternative a Tinder?", "Oui si tu cherches une app gratuite au lancement avec de vrais filtres. Tinder fait payer 20-45 EUR/mois pour les likes illimites et les super likes. Embir donne tout gratuitement."], ["Embir a-t-il moins de faux profils que Tinder?", "Oui. La verification par selfie d'Embir elimine la plupart des bots. Les profils verifies ont un badge et sont mis en avant. Tinder est connu pour son probleme de faux profils."], ["Puis-je chercher autre chose que de l'amour sur Embir?", "Oui. Contrairement a Tinder qui se concentre sur le dating, Embir propose 6 intentions : amour, amis, fun, plan cul, sport, evenements."]],
  },
  en: {
    h1: "Tinder vs Embir: the end of the paywall",
    tagline: "Tinder charges you to match. Embir lets you match for free, with real filters.",
    competitor: "Tinder",
    competitorPros: ["Enorme base d'utilisateurs", "Interface simple et rapide", "Tinder Plus/Gold/Platinum bien etablis"],
    competitorCons: ["Payant (20-45 EUR/mois pour les fonctionnalites de base)", "Beaucoup de faux profils et bots", "Pas de filtre par orientation LGBT+", "Publicite agressive", "Focus sur le swipe superficiel"],
    embirPros: ["gratuit au lancement — zero paywall", "Filtre strict par orientation", "Profils verifies par selfie (anti-bot)", "Multi-intentions (amour, amis, fun, sport, evenements)", "Aucune pub, aucune limite de likes"],
    embirCons: ["Base d'utilisateurs plus petite", "Moins de notoriete"],
    faq: [["Is Embir a better alternative to Tinder?", "Yes if you want a free-at-launch app with real filters. Tinder charges $20-45/month for unlimited likes and super likes. Embir gives everything for free."], ["Does Embir have fewer fake profiles than Tinder?", "Yes. Embir's selfie verification eliminates most bots. Verified profiles have a badge and are featured. Tinder is known for its fake profile problem."], ["Can I look for things other than love on Embir?", "Yes. Unlike Tinder which focuses on dating, Embir offers 6 intentions: love, friends, fun, casual, sports, events."]],
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
          <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
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
              className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
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
                <span className="mt-1 block text-xs font-semibold text-[#d4a574]">gratuit au lancement</span>
              </div>
              <div className="border-l border-white/[0.07] p-5 text-center">
                <span className="font-serif text-xl text-white/70">{c.competitor}</span>
                <span className="mt-1 block text-xs font-semibold text-[#ff5e36]">{isFr ? "Payant" : "Paid"}</span>
              </div>
            </div>
            {[
              { label: isFr ? "Prix" : "Price", embir: "0 EUR", competitor: "20-45 EUR/mois" },
              { label: isFr ? "Likes illimites" : "Unlimited likes", embir: "Oui", competitor: "Non" },
              { label: isFr ? "Messages illimites" : "Unlimited messages", embir: "Oui", competitor: "Non" },
              { label: isFr ? "Filtre par orientation" : "Orientation filter", embir: "Oui Strict", competitor: "Non" },
              { label: isFr ? "Multi-intentions" : "Multi-intention", embir: "Oui 6 modes", competitor: "Non" },
              { label: isFr ? "Profils verifies" : "Verified profiles", embir: "Oui Selfie", competitor: "Partiel" },
              { label: isFr ? "Publicites" : "Ads", embir: "Aucune", competitor: "Intrusives" },
              { label: isFr ? "Parrainage viral" : "Viral referral", embir: "Oui 7j premium", competitor: "Non" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/[0.05] last:border-0">
                <div className="p-4 text-sm text-white/60">{row.label}</div>
                <div className="border-l border-white/[0.05] p-4 text-center text-sm font-semibold text-[#d4a574]">
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
            <div className="rounded-3xl border border-[#d4a574]/20 bg-[#d4a574]/[0.03] p-8">
              <h2 className="font-serif text-2xl font-light text-white">
                Embir
                <span className="ml-2 rounded-full bg-[#d4a574]/10 px-2 py-0.5 text-xs font-semibold text-[#d4a574]">
                  {isFr ? "Gratuit" : "Free"}
                </span>
              </h2>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a574]">
                  {isFr ? "Avantages" : "Pros"}
                </p>
                {c.embirPros.map((pro, i) => (
                  <div key={"embir-pro-" + i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#d4a574]">Oui</span>
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
                <span className="ml-2 rounded-full bg-[#ff5e36]/10 px-2 py-0.5 text-xs font-semibold text-[#ff5e36]">
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
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ff5e36]">
                  {isFr ? "Inconvenients" : "Cons"}
                </p>
                {c.competitorCons.map((con, i) => (
                  <div key={"comp-con-" + i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#ff5e36]">Non</span>
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
                  <span className="ml-4 text-lg text-[#d4a574] transition-transform group-open:rotate-45">+</span>
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
            {isFr ? "gratuit au lancement. Aucune pub. Aucun abonnement." : "free at launch. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register"
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
          >
            {isFr ? "Creer mon profil gratuit" : "Create my free profile"}
          </Link>
        </section>
      </main>
    </>
  );
}
