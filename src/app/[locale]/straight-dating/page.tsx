import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  const url = isFr ? "https://embir.xyz/fr/straight-dating" : "https://embir.xyz/straight-dating";
  const title = isFr ? "Rencontre hetero claire et respectueuse — Embir" : "Straight dating that feels clear and respectful — Embir";
  const description = isFr
    ? "Embir offre aussi une experience hetero: orientation claire, intentions explicites, profils verifies et compatibilite reciproque, sans reducer la marque a une seule niche."
    : "Embir also offers a straight-dating experience: clear orientation, explicit intent, verified profiles and reciprocal compatibility, without reducing the brand to one niche.";
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "fr-FR": "https://embir.xyz/fr/straight-dating",
        "en-US": "https://embir.xyz/straight-dating",
        "x-default": "https://embir.xyz/straight-dating",
      },
    },
    openGraph: { title, description, url, siteName: "Embir", locale: isFr ? "fr_FR" : "en_US", type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function StraightDatingPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const canonical = isFr ? "https://embir.xyz/fr/straight-dating" : "https://embir.xyz/straight-dating";
  const faq = isFr
    ? [
        { q: "Embir est-il aussi destiné aux personnes hétéro ?", a: "Oui. Embir accueille toutes les orientations dans la même plateforme, avec une visibilité réciproque." },
        { q: "Comment Embir évite-t-il les recommandations incompatibles ?", a: "Les préférences et orientations déclarées sont croisées afin que la visibilité soit pertinente dans les deux sens." },
        { q: "Puis-je indiquer une intention sérieuse ou casual ?", a: "Oui. Les intentions sont explicites et peuvent évoluer avec tes préférences." },
      ]
    : [
        { q: "Is Embir also for straight people?", a: "Yes. Embir welcomes every orientation in the same platform with reciprocal visibility." },
        { q: "How does Embir avoid incompatible recommendations?", a: "Declared preferences and orientations are matched so visibility remains relevant in both directions." },
        { q: "Can I choose serious or casual intent?", a: "Yes. Intentions are explicit and can evolve with your preferences." },
      ];
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Embir", item: "https://embir.xyz" },
    { "@type": "ListItem", position: 2, name: isFr ? "Rencontre hétéro" : "Straight dating", item: canonical },
  ] };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{isFr ? "Intention" : "Intention"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {isFr ? "Rencontre hetero plus claire que le swipe classique" : "Straight dating with more clarity than swipe-first apps"}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          {isFr
            ? "Embir n'est pas uniquement une marque LGBTQ+: les personnes hetero ont aussi besoin d'une experience plus lisible, plus sure et plus respectueuse."
            : "Embir is not just an LGBTQ+ brand: straight users also need a clearer, safer and more respectful dating experience."}
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-3xl text-white">{isFr ? "Pourquoi cette page compte" : "Why this page matters"}</h2>
            <p className="mt-4">
              {isFr
                ? "Si la marque ne montre que des pages LGBTQ+, une partie du public peut croire que Embir ne lui parle pas. Cette route corrige le signal: Embir s'adresse aussi aux personnes hetero qui veulent moins de bruit et plus de compatibilite."
                : "If the brand only shows LGBTQ+ pages, part of the audience may assume Embir isn't for them. This route corrects that signal: Embir also serves straight users who want less noise and more compatibility."}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Les bons signaux" : "The right signals"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                [isFr ? "Orientation claire" : "Clear orientation", isFr ? "Le cadre est explicite dès le depart." : "The frame is explicit from the start."],
                [isFr ? "Intentions explicites" : "Explicit intentions", isFr ? "Tu sais si quelqu'un veut du serious, du casual ou des rencontres sociales." : "You know whether someone wants serious, casual or social connections."],
                [isFr ? "Profils verifies" : "Verified profiles", isFr ? "La verification soutient la confiance avant le premier message." : "Verification builds trust before the first message."],
                [isFr ? "Moins de swipe" : "Less swiping", isFr ? "Le contexte et la compatibilite remplacent le jugement instantane." : "Context and compatibility replace instant judgment."],
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
          <h2 className="font-serif text-3xl text-white">{isFr ? "Rejoindre la communauté" : "Join the community"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr
              ? "Crée ton profil gratuit et teste une alternative plus lisible aux apps de swipe."
              : "Create your free profile and test a clearer alternative to swipe-first apps."}
          </p>
          <Link href="/auth/register?source=straight-dating" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">
            {isFr ? "Créer mon profil" : "Create my profile"}
          </Link>
        </section>
      </article>
    </main>
  );
}
