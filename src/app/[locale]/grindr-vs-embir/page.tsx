import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Grindr vs Embir — Alternative gratuite a Grindr 2026" : "Grindr vs Embir — Free Grindr alternative 2026",
    description: isFr ? "Comparatif Grindr vs Embir. Grindr fait payer 30 EUR/mois, Embir est gratuit pour les connexions essentielles. Filtre par orientation, profils verifies, multi-intentions." : "Grindr vs Embir comparison. Grindr charges $30/month, Embir's core connection features are free. Orientation filter, verified profiles, multi-intention.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}grindr-vs-embir`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/grindr-vs-embir`,
        "en-US": `https://embir.xyz/grindr-vs-embir`,
        "en-GB": `https://embir.xyz/grindr-vs-embir`,
      },
    },
    openGraph: {
      title: isFr ? "Grindr vs Embir — Alternative gratuite a Grindr 2026" : "Grindr vs Embir — Free Grindr alternative 2026",
      description: isFr ? "Comparatif Grindr vs Embir. Grindr fait payer 30 EUR/mois, Embir est gratuit pour les connexions essentielles. Filtre par orientation, profils verifies, multi-intentions." : "Grindr vs Embir comparison. Grindr charges $30/month, Embir's core connection features are free. Orientation filter, verified profiles, multi-intention.",
      locale: isFr ? "fr_FR" : "en_US",
      type: "article",
    },
  };
}

const DATA = {
  fr: {
    h1: "Grindr vs Embir : gratuit vs 30 EUR/mois",
    tagline: "Grindr te fait payer 30 EUR/mois. Embir te donne tout, gratuitement, avec un filtre strict par orientation.",
    competitor: "Grindr",
    competitorPros: ["Enorme base d'utilisateurs gays", "Geolocalisation en temps reel", "Bien etabli depuis 2009"],
    competitorCons: ["Payant (30 EUR/mois pour Grindr Unlimited)", "Beaucoup de pubs intrusives en version gratuite", "Problemes recurrents de confidentialite", "Focus quasi exclusif sur le plan cul", "Pas de filtre multi-orientation"],
    embirPros: ["gratuit pour les connexions essentielles — zero pub, zero paywall", "Filtre strict par orientation (gay, bi, queer, etc.)", "Multi-intentions (amour, amis, fun, sport, evenements, plan cul)", "Profils verifies par selfie", "Confidentialite respectee"],
    embirCons: ["Base d'utilisateurs plus petite", "Moins de notoriete dans la communaute gay"],
    faq: [["Embir est-il vraiment gratuit alors que Grindr fait payer 30 EUR/mois?", "Oui. Embir est gratuit pour les connexions essentielles : messages entre connexions réciproques, sélection compatible courte, tous les filtres. Grindr limite la version gratuite avec des pubs et fait payer 30 EUR/mois pour Grindr Unlimited."], ["Embir est-il seulement pour les gays?", "Non. Embir est pour toutes les orientations : heteros, gays, lesbiennes, bi, queer, pan. Le filtre strict garantit que chaque communaute a son espace sans empieter sur les autres."], ["Embir est-il plus sur que Grindr?", "Embir met l'accent sur la securite avec verification par selfie, signalement et blocage et filtre strict par orientation. Grindr a eu plusieurs scandales de confidentialite."]],
  },
  en: {
    h1: "Grindr vs Embir: free vs $30/month",
    tagline: "Grindr charges you $30/month. Embir gives you everything, for free, with a strict orientation filter.",
    competitor: "Grindr",
    competitorPros: ["Enorme base d'utilisateurs gays", "Geolocalisation en temps reel", "Bien etabli depuis 2009"],
    competitorCons: ["Payant (30 EUR/mois pour Grindr Unlimited)", "Beaucoup de pubs intrusives en version gratuite", "Problemes recurrents de confidentialite", "Focus quasi exclusif sur le plan cul", "Pas de filtre multi-orientation"],
    embirPros: ["gratuit pour les connexions essentielles — zero pub, zero paywall", "Filtre strict par orientation (gay, bi, queer, etc.)", "Multi-intentions (amour, amis, fun, sport, evenements, plan cul)", "Profils verifies par selfie", "Confidentialite respectee"],
    embirCons: ["Base d'utilisateurs plus petite", "Moins de notoriete dans la communaute gay"],
    faq: [["Is Embir really free while Grindr charges $30/month?", "Yes. Embir's core connection features are free: messages between reciprocal connections, a short compatible selection, all filters. Grindr limits the free version with ads and charges $30/month for Grindr Unlimited."], ["Is Embir only for gays?", "No. Embir is for all orientations: straight, gay, lesbian, bi, queer, pan. The strict filter ensures each community has its space without encroaching on others."], ["Is Embir safer than Grindr?", "Embir emphasizes safety with selfie verification, reporting and blocking, and strict orientation filter. Grindr has had several privacy scandals."]],
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
                <span className="mt-1 block text-xs font-semibold text-[#d4a574]">gratuit pour les connexions essentielles</span>
              </div>
              <div className="border-l border-white/[0.07] p-5 text-center">
                <span className="font-serif text-xl text-white/70">{c.competitor}</span>
                <span className="mt-1 block text-xs font-semibold text-[#ff5e36]">{isFr ? "Payant" : "Paid"}</span>
              </div>
            </div>
            {[
              { label: isFr ? "Prix" : "Price", embir: "0 EUR", competitor: "20-45 EUR/mois" },
              { label: isFr ? "sélection quotidienne courte" : "a short daily selection", embir: "Oui", competitor: "Non" },
              { label: isFr ? "messages entre connexions réciproques" : "messages between reciprocal connections", embir: "Oui", competitor: "Non" },
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
            {isFr ? "gratuit pour les connexions essentielles. Aucune pub. Aucun abonnement." : "core connection features are free. No ads. No subscription."}
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
