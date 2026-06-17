import Link from "next/link";
import type { ReactNode } from "react";
import type { ResolvedSeoPage } from "@/seo/catalog";
import { coreInternalLinks } from "@/seo/internal-links";

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 text-xs text-white/35" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[#d4a574]">Home</Link>
      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-2">
          <span>/</span>
          <Link href={item.href} className="hover:text-[#d4a574]">{item.label}</Link>
        </span>
      ))}
    </nav>
  );
}

export function JsonLd({ page }: { page: ResolvedSeoPage }) {
  const faq = [
    {
      "@type": "Question",
      name: page.locale === "fr" ? "Embir est-il gratuit au lancement ?" : "Is Embir free at launch?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          page.locale === "fr"
            ? "Oui. Embir est gratuit au lancement. Le futur modele freemium financera l'application mobile, la securite, la moderation, les profils verifies et les algorithmes de compatibilite."
            : "Yes. Embir is free at launch. The future freemium model funds the mobile app, safety, moderation, verified profiles and compatibility algorithms.",
      },
    },
    {
      "@type": "Question",
      name: page.locale === "fr" ? "Embir est-il seulement une application gay ?" : "Is Embir only a gay app?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          page.locale === "fr"
            ? "Non. Embir est une plateforme pour toutes orientations, avec des pages LGBTQ et gay utiles pour l'acquisition mais un produit public plus large."
            : "No. Embir is a dating platform for every orientation, with LGBTQ and gay acquisition pages but a broader public product.",
      },
    },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": page.kind === "article" ? "Article" : "WebPage",
    name: page.title,
    headline: page.h1,
    description: page.description,
    isPartOf: { "@type": "WebSite", name: "Embir", url: "https://embir.xyz" },
    url: `https://embir.xyz/${page.locale}`,
    author: { "@type": "Organization", name: page.locale === "fr" ? "Equipe Embir" : "Embir Team" },
    dateModified: "2026-06-15",
    areaServed: ["France", "United Kingdom", "United States"],
    about: ["dating platform", "verified profiles", "compatibility", "preferences", "safety", "freemium"],
    mainEntity: faq,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQBlock({ locale }: { locale: "en" | "fr" }) {
  const items = locale === "fr"
    ? [
        ["Embir est-il gratuit ?", "Oui. Embir est gratuit au lancement. Le futur modele freemium servira a financer l'application mobile, la securite, la moderation, les profils verifies et les algorithmes de compatibilite."],
        ["Embir est-il seulement une app gay ?", "Non. Embir est une plateforme pour toutes orientations : hetero, gay, lesbienne, bi, trans, queer et plus largement toutes les personnes majeures qui veulent rencontrer avec plus de clarte."],
        ["Comment Embir gere la compatibilite ?", "Embir met en avant orientation, preferences, intentions, securite et profils verifies pour reduire le swipe aleatoire."],
      ]
    : [
        ["Is Embir free?", "Yes. Embir is free at launch. The future freemium model will fund the mobile app, safety, moderation, verified profiles and compatibility algorithms."],
        ["Is Embir only a gay app?", "No. Embir is a dating platform for every orientation: straight, gay, lesbian, bi, trans, queer and adults who want clearer dating."],
        ["How does Embir handle compatibility?", "Embir puts orientation, preferences, intent, safety and verified profiles before random swiping."],
      ];
  return (
    <section className="mt-16">
      <h2 className="font-serif text-3xl text-white">{locale === "fr" ? "Questions frequentes" : "Frequently asked questions"}</h2>
      <div className="mt-6 space-y-3">
        {items.map(([question, answer]) => (
          <details key={question} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <summary className="cursor-pointer text-sm font-semibold text-white/80">{question}</summary>
            <p className="mt-3 text-sm leading-relaxed text-white/45">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function InternalLinksBlock() {
  return (
    <section className="mt-14 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
      <h2 className="font-serif text-2xl text-white">Explore Embir</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {coreInternalLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CTASection({ locale }: { locale: "en" | "fr" }) {
  return (
    <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
      <h2 className="font-serif text-3xl text-white">
        {locale === "fr" ? "Rejoindre la communaute fondatrice" : "Join the founding community"}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
        {locale === "fr"
          ? "Cree ton profil gratuitement pendant le lancement et aide Embir a construire une plateforme plus saine pour toutes orientations."
          : "Create your profile for free during launch and help Embir build a healthier platform for every orientation."}
      </p>
      <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">
        {locale === "fr" ? "Creer mon profil gratuit" : "Create my free profile"}
      </Link>
    </section>
  );
}

export function FreemiumExplainer({ locale }: { locale: "en" | "fr" }) {
  return (
    <section className="mt-12 grid gap-4 md:grid-cols-2">
      {(locale === "fr"
        ? [
            ["Gratuit au lancement", "Les fonctions essentielles restent ouvertes pendant la phase fondatrice : profil, decouverte, messages et compatibilite."],
            ["Freemium futur transparent", "Le futur freemium financera l'app mobile, la securite, la moderation, les profils verifies et l'amelioration continue."],
          ]
        : [
            ["Free at launch", "Core features stay open during the founding phase: profile, discovery, messages and compatibility."],
            ["Future transparent freemium", "Future freemium funds the mobile app, safety, moderation, verified profiles and continuous improvement."],
          ]).map(([title, text]) => (
        <article key={title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="font-serif text-xl text-white">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/45">{text}</p>
        </article>
      ))}
    </section>
  );
}

export function FoundingCommunityBlock({ locale }: { locale: "en" | "fr" }) {
  return (
    <section className="mt-12 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d4a574]/70">
        {locale === "fr" ? "Communaute fondatrice" : "Founding community"}
      </p>
      <h2 className="mt-3 font-serif text-3xl text-white">
        {locale === "fr" ? "Pas une autre app de swipe." : "Not another swipe app."}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-white/45">
        {locale === "fr"
          ? "Embir n'est pas seulement une alternative a Grindr. C'est une plateforme de rencontre pour tous, pensee autour des orientations, preferences, profils verifies et conversations plus saines."
          : "Embir is not just a Grindr alternative. It is a dating platform for everyone, designed around orientations, preferences, verified profiles and healthier conversations."}
      </p>
    </section>
  );
}

export function SeoPageLayout({ page, children }: { page: ResolvedSeoPage; children?: ReactNode }) {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <JsonLd page={page} />
      <article className="mx-auto max-w-5xl">
        <Breadcrumbs items={[{ href: "#", label: page.kind }]} />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">
          {page.market ? page.market.toUpperCase() : page.kind.toUpperCase()} · Free at launch
        </p>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {page.h1}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/50">
          {page.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
          <span>Embir Team</span>
          <span>·</span>
          <span>Updated 2026-06-15</span>
          <span>·</span>
          <span>{page.locale === "fr" ? "France / UK / USA" : "France / UK / USA"}</span>
        </div>
        {children}
        <FreemiumExplainer locale={page.locale} />
        <FoundingCommunityBlock locale={page.locale} />
        <FAQBlock locale={page.locale} />
        <InternalLinksBlock />
        <CTASection locale={page.locale} />
      </article>
    </main>
  );
}

export function SeoCityPage({ page }: { page: ResolvedSeoPage }) {
  const city = page.city ?? "your city";
  const localizedIntro =
    page.locale === "fr"
      ? `A ${city}, Embir aide les personnes majeures a chercher une rencontre plus claire : rencontre serieuse, rencontre LGBTQ+, rencontre gay, rencontre inclusive, ou simple envie de discuter avec des profils verifies. La plateforme reste gratuite au lancement pour permettre a la communaute fondatrice de se former avant le futur modele freemium.`
      : `In ${city}, Embir helps adults search for clearer dating: serious dating, LGBTQ dating, gay dating, inclusive dating, or simply better conversations with verified profiles. The platform is free at launch so a founding community can form before the future freemium model.`;
  return (
    <SeoPageLayout page={page}>
      <section className="mt-12 space-y-5 text-base leading-relaxed text-white/50">
        <p>{localizedIntro}</p>
        <p>
          Embir combines orientation, preferences, compatibility, safety and verified profiles so discovery does not depend only on distance or swipe volume.
          People can express intent, filter what matters, and join a community that values respect before acceleration.
        </p>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {["orientation", "preferences", "compatibility"].map((item) => (
          <div key={item} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="font-serif text-2xl text-white">{item}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/45">
              Embir uses {item} signals so people in {page.city} can meet with more clarity, safety and respect.
            </p>
          </div>
        ))}
      </section>
    </SeoPageLayout>
  );
}

export function SeoGuidePage({ page }: { page: ResolvedSeoPage }) {
  return (
    <SeoPageLayout page={page}>
      <section className="mt-12 space-y-8 text-base leading-relaxed text-white/50">
        <div>
          <h2 className="font-serif text-3xl text-white">{page.locale === "fr" ? "Ce qu'il faut comprendre" : "What to understand"}</h2>
          <p className="mt-4">
            {page.locale === "fr"
              ? `Ce guide sur ${page.topic} explique comment aborder la rencontre avec plus de clarte, moins de fatigue et une meilleure attention aux preferences reelles.`
              : `This guide about ${page.topic} explains how to approach dating with more clarity, less fatigue and better attention to real preferences.`}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl text-white">{page.locale === "fr" ? "La methode Embir" : "The Embir method"}</h2>
          <p className="mt-4">
            Embir puts orientation, preferences, compatibility, verified profiles and safety into the product foundation. The launch is free so early members can test the core experience before premium features arrive.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-2xl text-white">{page.locale === "fr" ? "A retenir" : "Key takeaways"}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Free at launch, with a transparent future freemium model.</li>
            <li>Built for France, the UK and the United States.</li>
            <li>Designed for every orientation, not only one dating niche.</li>
            <li>Focused on verified profiles, compatibility and safer conversations.</li>
          </ul>
        </div>
      </section>
    </SeoPageLayout>
  );
}

export function SeoComparisonPage({ page }: { page: ResolvedSeoPage }) {
  return (
    <SeoPageLayout page={page}>
      <section className="mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        {[
          ["Launch price", `${page.app ?? "Legacy app"} often limits free usage`, "Embir is free at launch"],
          ["Audience", "Often shaped by legacy niches", "Built for every orientation"],
          ["Discovery", "Swipe or distance first", "Preferences and compatibility first"],
          ["Trust", "Verification varies", "Verified profiles are central"],
          ["Future model", "Opaque upsells", "Transparent freemium for mobile, safety and moderation"],
        ].map(([feature, oldApp, embir]) => (
          <div key={feature} className="grid grid-cols-3 border-b border-white/[0.04] px-5 py-4 text-sm last:border-b-0">
            <div className="text-white/60">{feature}</div>
            <div className="text-center text-white/30">{oldApp}</div>
            <div className="text-center font-semibold text-[#d4a574]">{embir}</div>
          </div>
        ))}
      </section>
    </SeoPageLayout>
  );
}

export function SeoArticlePage({ page }: { page: ResolvedSeoPage }) {
  return (
    <SeoPageLayout page={page}>
      <section className="mt-12 space-y-6 text-base leading-relaxed text-white/50">
        <p className="text-sm uppercase tracking-[0.16em] text-[#d4a574]/70">
          {page.locale === "fr" ? "Categorie : rencontre moderne" : "Category: modern dating"} · Tags: free at launch, freemium, compatibility, verified profiles
        </p>
        <p>
          Embir starts from a simple belief: people should not have to pay immediately
          just to understand who is compatible, safe and genuinely interested.
        </p>
        <p>
          The platform combines orientation, preferences, verified profiles and compatibility
          signals so dating feels less random and less exhausting.
        </p>
        <p>
          The future freemium model is designed to fund the mobile app, security, moderation,
          profile verification and continuous product improvements without making the launch
          community feel trapped behind early paywalls.
        </p>
        <h2 className="font-serif text-3xl text-white">Why this matters for {page.topic ?? "modern dating"}</h2>
        <p>
          Search intent around dating apps is usually split between price, safety, orientation, location and trust.
          Embir connects those questions instead of treating them as separate landing pages. A person looking for a free dating app in the United States, a safer LGBTQ dating option in the UK, or a verified profile experience in France should find the same public promise: free at launch, broader than a single niche, and transparent about the future business model.
        </p>
        <h3 className="font-serif text-2xl text-white">The product position</h3>
        <p>
          The platform is not presented as a clone of Grindr, Tinder, Bumble or any other legacy app.
          Comparisons can help users understand the difference, but the product direction is wider:
          orientation-aware onboarding, preference-led discovery, compatibility signals, safety controls,
          founder culture, and a mobile app roadmap funded by a future freemium layer.
        </p>
        <h3 className="font-serif text-2xl text-white">What early members get</h3>
        <p>
          Founder members join while the core experience is open. That means they can create a profile,
          test discovery, help shape moderation expectations, and give feedback before the mobile rollout.
          The goal is to build density city by city while keeping the first community healthier than an app that starts with heavy paywalls or opaque ranking.
        </p>
      </section>
    </SeoPageLayout>
  );
}
