import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Rencontres fun et sorties — sans carte bancaire | Embir" : "Fun dating and outings — free for core connections | Embir",
    description: isFr ? "Du fun sans drame. Soirées, sorties, légèreté. Embir filtre par orientation et par intention. Gratuit, sans jugement, sans confusion." : "Fun without drama. Parties, outings, lightness. Embir filters by orientation and intention. Free, no judgment, no confusion.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}fun`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/fun`,
        "en-US": `https://embir.xyz/fun`,
        "en-GB": `https://embir.xyz/fun`,
      },
    },
    openGraph: {
      title: isFr ? "Rencontres fun et sorties — sans carte bancaire | Embir" : "Fun dating and outings — free for core connections | Embir",
      description: isFr ? "Du fun sans drame. Soirées, sorties, légèreté. Embir filtre par orientation et par intention. Gratuit, sans jugement, sans confusion." : "Fun without drama. Parties, outings, lightness. Embir filters by orientation and intention. Free, no judgment, no confusion.",
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
            {isFr ? "Embir · sans carte bancaire" : "Embir · free for core connections"}
          </p>
          <div className="mt-8 text-6xl">⚡</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Soirées, sorties, légèreté. Sans complications. Embir filtre pour que tu trouves des gens qui veulent la même chose : s'amuser, point." : "Parties, outings, lightness. No complications. Embir filters so you find people who want the same: have fun, period."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=FUN"
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
            {isFr ? "sans carte bancaire. Aucune pub. Aucun abonnement." : "free for core connections. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register?intent=FUN"
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
    h1: "Du fun sans drame, avec les bonnes personnes.",
    sections: [{"title": "Le fun sans complications", "text": "Le fun, c'est sortir, faire la fête, vivre l'instant. Pas de prise de tête, pas de promesse en l'air. Embir te connecte à des gens qui veulent la même légèreté que toi. Le filtre par intention aide à aligner les attentes sans les garantir."}, {"title": "Soirées et événements près de chez toi", "text": "La disponibilité d'événements dépend des annonces réellement publiées. Embir ne promet pas de couverture locale sans données opérationnelles."}, {"title": "Zéro jugement", "text": "Chercher du fun n'est pas honteux. Embir ne juge pas tes intentions. Que tu cherches des soirées, des concerts, des sorties improvisées — chaque intention a sa place, sans morale imposée."}, {"title": "Le filtre qui évite les malentendus", "text": "Quelqu'un qui cherche l'amour ne verra pas ton profil 'fun'. Quelqu'un qui cherche un plan cul non plus. Chacun son univers, chacun son intention. Le fun reste le fun, sans confusion."}],
    faq: [{"q": "Le fun signifie-t-il automatiquement plan cul ?", "a": "Non. Fun et plan cul sont deux intentions séparées sur Embir. Fun = sortir, faire la fête, s'amuser en groupe. Plan cul = rencontre sexuelle. Tu choisis ce que tu veux, sans confusion."}, {"q": "Comment trouver des soirées près de chez moi ?", "a": "Les ambassadeurs organisent des événements dans les grandes villes. Tu peux filtrer le feed par intention 'fun' et voir les profils qui proposent ou cherchent des sorties."}, {"q": "C'est sûr de rencontrer des gens pour faire la fête ?", "a": "Les profils vérifiés ont un badge. Embir ne certifie ni ne supervise les rassemblements organisés hors plateforme. Comme partout, reste prudent : rencontre en public la première fois."}, {"q": "Le fun est-il vraiment gratuit ?", "a": "Oui, sans carte bancaire. Messagerie, événements, matching — Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Pas d'abonnement, pas de pub."}, {"q": "Puis-je chercher fun ET amour ?", "a": "Oui. Tu peux sélectionner plusieurs intentions. Embir te montrera les profils qui partagent au moins une de tes intentions."}],
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
    h1: "Fun without drama, with the right people.",
    sections: [{"title": "Fun without complications", "text": "Fun is going out, partying, living the moment. No overthinking, no empty promises. Embir connects you with people who want the same lightness. The intention filter helps align expectations without guaranteeing them."}, {"title": "Parties and events near you", "text": "Event availability depends on actual published listings. Embir does not promise local coverage without operational data."}, {"title": "Zero judgment", "text": "Looking for fun is not shameful. Embir doesn't judge your intentions. Whether you're looking for parties, concerts, spontaneous outings — every intention has its place, no imposed morality."}, {"title": "The filter that prevents misunderstandings", "text": "Someone looking for love won't see your 'fun' profile. Someone looking for casual sex won't either. Each person their own world, each person their own intention. Fun stays fun, no confusion."}],
    faq: [{"q": "Does fun automatically mean casual sex?", "a": "No. Fun and casual sex are two separate intentions on Embir. Fun = going out, partying, having fun in a group. Casual sex = sexual encounter. You choose what you want, no confusion."}, {"q": "How do I find parties near me?", "a": "Ambassadors organize events in major cities. You can filter the feed by 'fun' intention and see profiles offering or looking for outings."}, {"q": "Is it safe to meet people for partying?", "a": "Verified profiles have a badge. Embir does not certify or supervise gatherings organized outside the platform. As anywhere, be cautious: meet in public the first time."}, {"q": "Is fun really free?", "a": "Yes, free for core connections. Messaging, events, matching — Everything needed to meet someone is free. No credit card required. No subscription, no ads."}, {"q": "Can I look for fun AND love?", "a": "Yes. You can select multiple intentions. Embir will show you profiles that share at least one of your intentions."}],
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