import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Hinge vs Embir — Quelle app de rencontre gratuite choisir ?" : "Hinge vs Embir — Which free dating app to choose?",
    description: isFr ? "Comparatif complet Hinge vs Embir. Prix, fonctionnalites, securite, profils. Embir est gratuit pour les connexions essentielles, Hinge est payant. Decouvre pourquoi Embir gagne." : "Full Hinge vs Embir comparison. Price, features, security, profiles. Embir's core connection features are free, Hinge is paid. Discover why Embir wins.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}hinge-vs-embir`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/hinge-vs-embir`,
        "en-US": `https://embir.xyz/hinge-vs-embir`,
        "en-GB": `https://embir.xyz/hinge-vs-embir`,
      },
    },
    openGraph: {
      title: isFr ? "Hinge vs Embir — Quelle app de rencontre gratuite choisir ?" : "Hinge vs Embir — Which free dating app to choose?",
      description: isFr ? "Comparatif complet Hinge vs Embir. Prix, fonctionnalites, securite, profils. Embir est gratuit pour les connexions essentielles, Hinge est payant. Decouvre pourquoi Embir gagne." : "Full Hinge vs Embir comparison. Price, features, security, profiles. Embir's core connection features are free, Hinge is paid. Discover why Embir wins.",
      locale: isFr ? "fr_FR" : "en_US",
      type: "article",
    },
  };
}

const DATA = {
  fr: {
    h1: "Hinge vs Embir : le match gratuit vs payant",
    tagline: "Hinge te fait payer pour voir qui t'aime. Embir te donne tout, gratuitement.",
    competitor: "Hinge",
    competitorPros: ["Interface elegante", "Concept designed to be deleted", "Prompts de conversation"],
    competitorCons: ["Payant (35 EUR/mois pour les sélection quotidienne courte)", "Filtres limites en version gratuite", "Pas de filtre par orientation LGBT+", "Publicite intrusive des abonnements"],
    embirPros: ["gratuit pour les connexions essentielles — sans carte bancaire", "Filtre strict par orientation (hetero/gay/bi/queer)", "Multi-intentions: amour, amis, fun, sport, evenements", "Profils verifies par selfie", "Aucune pub, aucun paywall"],
    embirCons: ["Plus recent sur le marche", "Moins d'utilisateurs pour l'instant"],
    faq: [["Embir est-il vraiment gratuit alors que Hinge est payant?", "Oui. Embir est gratuit pour les connexions essentielles : messages entre connexions réciproques, sélection quotidienne courte, tous les filtres, tout. Hinge limite tes likes a 8/jour gratuitement et fait payer 35 EUR/mois pour les sélection quotidienne courte."], ["Le filtre par orientation d'Embir est-il meilleur que Hinge?", "Oui. Hinge n'a pas de filtre strict par orientation. Embir filtre bidirectionnellement : un hetero ne voit jamais un profil gay, et vice-versa, sauf si tu choisis explicitement de chercher plusieurs genres."], ["Puis-je chercher des amis sur Embir comme sur Hinge?", "Oui. Embir va plus loin que Hinge avec 6 intentions distinctes : amour, amis, fun, plan cul, sport, evenements. Hinge se concentre uniquement sur les relations amoureuses."]],
  },
  en: {
    h1: "Hinge vs Embir: free vs paid",
    tagline: "Hinge charges you to see who likes you. Embir gives you everything, for free.",
    competitor: "Hinge",
    competitorPros: ["Interface elegante", "Concept designed to be deleted", "Prompts de conversation"],
    competitorCons: ["Payant (35 EUR/mois pour les sélection quotidienne courte)", "Filtres limites en version gratuite", "Pas de filtre par orientation LGBT+", "Publicite intrusive des abonnements"],
    embirPros: ["gratuit pour les connexions essentielles — sans carte bancaire", "Filtre strict par orientation (hetero/gay/bi/queer)", "Multi-intentions: amour, amis, fun, sport, evenements", "Profils verifies par selfie", "Aucune pub, aucun paywall"],
    embirCons: ["Plus recent sur le marche", "Moins d'utilisateurs pour l'instant"],
    faq: [["Is Embir really free while Hinge is paid?", "Yes. Embir's core connection features are free: messages between reciprocal connections, a short daily selection, all filters, everything. Hinge limits you to 8 likes/day for free and charges $35/month for a short daily selection."], ["Is Embir's orientation filter better than Hinge's?", "Yes. Hinge has no strict orientation filter. Embir filters bidirectionally: a straight person never sees a gay profile, and vice versa, unless you explicitly choose to look for multiple genders."], ["Can I look for friends on Embir like on Hinge?", "Yes. Embir goes further than Hinge with 6 distinct intentions: love, friends, fun, casual, sports, events. Hinge focuses only on romantic relationships."]],
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
