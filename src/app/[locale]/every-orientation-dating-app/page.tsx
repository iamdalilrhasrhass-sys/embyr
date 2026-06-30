import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  const url = isFr ? "https://embir.xyz/fr/every-orientation-dating-app" : "https://embir.xyz/every-orientation-dating-app";
  const title = isFr ? "Application de rencontre pour toutes les orientations | Embir" : "Dating app for every orientation | Embir";
  const description = isFr
    ? "Embir rassemble toutes les orientations dans une seule plateforme, avec visibilite reciproque, profils verifies et intentions explicites."
    : "Embir brings every orientation into one platform, with reciprocal visibility, verified profiles and explicit intentions.";
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "fr-FR": "https://embir.xyz/fr/every-orientation-dating-app",
        "en-US": "https://embir.xyz/every-orientation-dating-app",
        "x-default": "https://embir.xyz/every-orientation-dating-app",
      },
    },
    openGraph: { title, description, url, siteName: "Embir", locale: isFr ? "fr_FR" : "en_US", type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function EveryOrientationDatingAppPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const canonical = isFr ? "https://embir.xyz/fr/every-orientation-dating-app" : "https://embir.xyz/every-orientation-dating-app";
  const faq = isFr
    ? [
        { q: "Quelles orientations sont accueillies sur Embir ?", a: "Embir est conçu pour les personnes hétéro, gay, lesbiennes, bi, trans, queer, en exploration et pour les identités non réductibles à une case unique." },
        { q: "Pourquoi distinguer global et LGBTQ+ ?", a: "La page LGBTQ+ traite une communauté et ses besoins. Ici, Embir présente l'architecture globale d'une plateforme réellement multi-orientation." },
        { q: "Comment fonctionne la visibilité réciproque ?", a: "Un profil est proposé lorsque les préférences déclarées sont compatibles dans les deux sens." },
      ]
    : [
        { q: "Which orientations are welcome on Embir?", a: "Embir is designed for straight, gay, lesbian, bi, trans, queer and questioning people, including identities that do not fit one fixed label." },
        { q: "Why separate global and LGBTQ+ positioning?", a: "The LGBTQ+ page addresses a community and its needs. Here, Embir presents the global architecture of a genuinely multi-orientation platform." },
        { q: "How does reciprocal visibility work?", a: "A profile is suggested when declared preferences are compatible in both directions." },
      ];
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Embir", item: "https://embir.xyz" },
    { "@type": "ListItem", position: 2, name: isFr ? "Toutes les orientations" : "Every orientation", item: canonical },
  ] };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{isFr ? "Marque" : "Brand"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {isFr ? "Une app de rencontre pour toutes les orientations" : "A dating app for every orientation"}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          {isFr
            ? "Embir n'est pas une duplication de niche: c'est une plateforme globale ou chaque orientation a la meme place dans l'architecture produit."
            : "Embir is not a niche duplicate: it is a global platform where every orientation has equal standing in the product architecture."}
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-3xl text-white">{isFr ? "Ce que cela change" : "What this changes"}</h2>
            <p className="mt-4">
              {isFr
                ? "Les personnes hetero, gay, lesbienne, bi, trans, queer et en exploration utilisent la meme base produit, avec des filtres de compatibilite reciproques et des intentions explicites."
                : "Straight, gay, lesbian, bi, trans, queer and questioning people use the same product base, with reciprocal compatibility filters and explicit intents."}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Les principes" : "The principles"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                [isFr ? "Meme produit" : "Same product", isFr ? "Pas de traitement secondaire selon l'orientation." : "No second-class treatment by orientation."],
                [isFr ? "Visibilite reciproque" : "Reciprocal visibility", isFr ? "Tu apparais seulement aux bonnes personnes." : "You appear only to the right people."],
                [isFr ? "Intentions explicites" : "Explicit intentions", isFr ? "Amour, amis, fun, casual, sport, evenements." : "Love, friends, fun, casual, sports, events."],
                [isFr ? "Confiance d'abord" : "Trust first", isFr ? "Profils verifies et moderation humaine." : "Verified profiles and human moderation."],
              ].map(([title, text]) => (
                <div key={title as string} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Questions fréquentes" : "Frequently asked questions"}</h2>
            <div className="mt-5 space-y-3">
              {faq.map((item) => (
                <details key={item.q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer font-semibold text-white/85">{item.q}</summary>
                  <p className="mt-3 text-sm text-white/50">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Découvrir Embir" : "Discover Embir"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr
              ? "Une seule plateforme, plusieurs orientations, plusieurs intentions, et un cadre plus clair pour tout le monde."
              : "One platform, multiple orientations, multiple intentions, and a clearer frame for everyone."}
          </p>
          <Link href="/auth/register?source=every-orientation-dating-app" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">
            {isFr ? "Créer mon profil" : "Create my profile"}
          </Link>
        </section>
      </article>
    </main>
  );
}
