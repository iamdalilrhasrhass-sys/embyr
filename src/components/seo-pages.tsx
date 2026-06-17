import Link from "next/link";
import type { ReactNode } from "react";
import type { ResolvedSeoPage } from "@/seo/catalog";
import { absoluteUrl } from "@/seo/url";

type FaqItem = { q: string; a: string };

function publicPathForPage(page: ResolvedSeoPage) {
  if (page.kind === "article") return page.locale === "fr" ? `/fr/blog/${page.slug}` : `/blog/${page.slug}`;
  if (page.kind === "comparison") return page.locale === "fr" ? `/fr/comparaison/${page.slug}` : `/comparison/${page.slug}`;
  if (page.kind === "city" && page.market === "france") return `/fr/rencontre/${page.slug}`;
  if (page.kind === "city" && page.market === "usa") return `/us/dating/${page.slug}`;
  if (page.kind === "city" && page.market === "uk") return `/uk/dating/${page.slug}`;
  if (page.kind === "city" && page.market === "switzerland") return page.locale === "fr" ? `/fr/suisse/${page.slug}` : `/switzerland/${page.slug}`;
  if (page.market === "usa") return `/us/${page.slug}`;
  if (page.market === "uk") return `/uk/${page.slug}`;
  if (page.market === "switzerland") return page.locale === "fr" ? `/fr/${page.slug}` : `/${page.slug}`;
  return page.locale === "fr" ? `/fr/${page.slug}` : `/${page.slug}`;
}

function sectionLabel(page: ResolvedSeoPage) {
  if (page.kind === "article") return page.locale === "fr" ? "Blog" : "Blog";
  if (page.kind === "comparison") return page.locale === "fr" ? "Comparatif" : "Comparison";
  if (page.kind === "city") return page.locale === "fr" ? "Ville" : "City";
  if (page.kind === "freemium") return page.locale === "fr" ? "Freemium" : "Freemium";
  return page.locale === "fr" ? "Guide" : "Guide";
}

function breadcrumbItems(page: ResolvedSeoPage) {
  const path = publicPathForPage(page);
  const section =
    page.kind === "article"
      ? { href: page.locale === "fr" ? "/fr/blog" : "/blog", label: "Blog" }
      : page.kind === "comparison"
        ? { href: page.locale === "fr" ? "/fr/comparaison/grindr-vs-embir" : "/comparison/grindr-vs-embir", label: sectionLabel(page) }
        : page.market === "usa"
          ? { href: "/us", label: "United States" }
          : page.market === "uk"
            ? { href: "/uk", label: "United Kingdom" }
            : page.market === "switzerland"
              ? { href: page.locale === "fr" ? "/fr/suisse" : "/switzerland", label: page.locale === "fr" ? "Suisse" : "Switzerland" }
              : { href: page.locale === "fr" ? "/fr" : "/", label: page.locale === "fr" ? "France" : "Embir" };

  return [section, { href: path, label: page.h1 }];
}

function faqItems(page: ResolvedSeoPage): FaqItem[] {
  if (page.locale === "fr") {
    return [
      {
        q: "Pourquoi cette page existe-t-elle ?",
        a: page.angle ?? "Cette page repond a une intention de recherche precise avec un contenu utile, localise et relie aux autres pages Embir.",
      },
      {
        q: "Embir est-il gratuit au lancement ?",
        a: "Oui. Embir est gratuit pendant la phase de lancement afin que la communaute fondatrice puisse tester les profils, la decouverte, les messages et la compatibilite avant l'arrivee du futur freemium.",
      },
      {
        q: "Embir est-il fait seulement pour une orientation ?",
        a: "Non. Embir est construit pour les personnes majeures de toutes orientations : hetero, gay, lesbienne, bi, trans, queer et toute personne qui veut une rencontre plus claire et plus respectueuse.",
      },
      {
        q: "Comment Embir limite les faux profils ?",
        a: "La confiance repose sur des profils verifies, des signalements visibles, une moderation humaine et des choix produit qui privilegient la qualite de la communaute plutot que le volume artificiel.",
      },
      {
        q: "Quelle est la difference avec les apps classiques ?",
        a: "Embir met l'accent sur les preferences, l'intention, la compatibilite et la securite, plutot que sur un flux de swipe infini ou des options essentielles bloquees trop tot derriere un abonnement.",
      },
    ];
  }

  return [
    {
      q: "Why does this page exist?",
      a: page.angle ?? "This page answers a specific search intent with useful, localized content and links to related Embir pages.",
    },
    {
      q: "Is Embir free at launch?",
      a: "Yes. Embir is free during the launch phase so founding members can test profiles, discovery, messaging and compatibility before the future freemium model arrives.",
    },
    {
      q: "Is Embir only for one orientation?",
      a: "No. Embir is built for adults across orientations: straight, gay, lesbian, bi, trans, queer and anyone who wants clearer, more respectful dating.",
    },
    {
      q: "How does Embir reduce fake profiles?",
      a: "Trust is built through verified profiles, visible reporting, human moderation and product decisions that prioritize community quality over artificial volume.",
    },
    {
      q: "How is Embir different from classic dating apps?",
      a: "Embir puts preferences, intent, compatibility and safety ahead of endless swiping or essential features being locked too early behind a subscription.",
    },
  ];
}

function internalLinks(locale: "en" | "fr") {
  return locale === "fr"
    ? [
        { href: "/fr/application-rencontre-gratuite", label: "Application gratuite" },
        { href: "/fr/rencontre-paris", label: "Rencontre Paris" },
        { href: "/fr/alternative-tinder", label: "Alternative Tinder" },
        { href: "/fr/alternative-grindr", label: "Alternative Grindr" },
        { href: "/fr/rencontre-lgbt", label: "Rencontre LGBT" },
        { href: "/fr/profils-verifies", label: "Profils verifies" },
        { href: "/fr/suisse", label: "Rencontre Suisse" },
        { href: "/fr/blog/comment-faire-un-bon-profil-sur-une-application-de-rencontre", label: "Guide profil" },
        { href: "/auth/register", label: "Rejoindre la communaute" },
      ]
    : [
        { href: "/us/free-dating-app", label: "Free dating app US" },
        { href: "/uk/free-dating-app", label: "Free dating app UK" },
        { href: "/us/tinder-alternative", label: "Tinder alternative" },
        { href: "/us/grindr-alternative", label: "Grindr alternative" },
        { href: "/us/lgbtq-dating-app", label: "LGBTQ dating" },
        { href: "/us/verified-dating-app", label: "Verified profiles" },
        { href: "/switzerland", label: "Switzerland dating" },
        { href: "/blog/how-to-write-a-good-dating-profile", label: "Profile guide" },
        { href: "/auth/register", label: "Join the founding community" },
      ];
}

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 text-xs text-white/35" aria-label="Breadcrumb">
      <Link href="/" prefetch={false} className="hover:text-[#d4a574]">Home</Link>
      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-2">
          <span>/</span>
          <Link href={item.href} prefetch={false} className="hover:text-[#d4a574]">{item.label}</Link>
        </span>
      ))}
    </nav>
  );
}

export function JsonLd({ page }: { page: ResolvedSeoPage }) {
  const url = absoluteUrl(publicPathForPage(page));
  const crumbs = [{ href: "/", label: "Home" }, ...breadcrumbItems(page)];
  const faq = faqItems(page).map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }));
  const schemas = [{
    "@context": "https://schema.org",
    "@type": page.kind === "article" ? "Article" : "WebPage",
    name: page.title,
    headline: page.h1,
    description: page.description,
    isPartOf: { "@type": "WebSite", name: "Embir", url: "https://embir.xyz" },
    url,
    author: { "@type": "Organization", name: page.locale === "fr" ? "Equipe Embir" : "Embir Team" },
    dateModified: "2026-06-15",
    areaServed: ["France", "United Kingdom", "United States"],
    about: ["dating platform", "verified profiles", "compatibility", "preferences", "safety", "freemium"],
  }, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq,
  }, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  }];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />;
}

export function FAQBlock({ page }: { page: ResolvedSeoPage }) {
  const items = faqItems(page);
  return (
    <section className="mt-16">
      <h2 className="font-serif text-3xl text-white">{page.locale === "fr" ? "Questions frequentes" : "Frequently asked questions"}</h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <summary className="cursor-pointer text-sm font-semibold text-white/80">{item.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-white/45">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function InternalLinksBlock({ locale }: { locale: "en" | "fr" }) {
  return (
    <section className="mt-14 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
      <h2 className="font-serif text-2xl text-white">Explore Embir</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {internalLinks(locale).map((link) => (
          <Link key={link.href} href={link.href} prefetch={false} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">
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
      <Link href="/auth/register" prefetch={false} className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">
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
  const breadcrumbs = breadcrumbItems(page);
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <JsonLd page={page} />
      <article className="mx-auto max-w-5xl">
        <Breadcrumbs items={breadcrumbs} />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">
          {page.market ? page.market.toUpperCase() : sectionLabel(page).toUpperCase()} · {page.locale === "fr" ? "Gratuit au lancement" : "Free at launch"}
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
          <span>{page.locale === "fr" ? "France / Royaume-Uni / Etats-Unis" : "France / UK / US"}</span>
        </div>
        <EditorialSections page={page} />
        {children}
        <FreemiumExplainer locale={page.locale} />
        <FoundingCommunityBlock locale={page.locale} />
        <FAQBlock page={page} />
        <InternalLinksBlock locale={page.locale} />
        <CTASection locale={page.locale} />
      </article>
    </main>
  );
}

function EditorialSections({ page }: { page: ResolvedSeoPage }) {
  const topic = page.topic ?? page.h1;
  const place = page.city ?? (page.market === "usa" ? "the United States" : page.market === "uk" ? "the United Kingdom" : page.market === "switzerland" ? (page.locale === "fr" ? "la Suisse" : "Switzerland") : page.locale === "fr" ? "la France" : "the regions Embir serves");

  if (page.locale === "fr") {
    return (
      <section className="mt-12 space-y-10 text-base leading-relaxed text-white/52">
        <div>
          <h2 className="font-serif text-3xl text-white">Pourquoi cette page existe</h2>
          <p className="mt-4">{page.angle}</p>
          <p className="mt-4">
            Le marche de la rencontre est sature par des pages qui repètent les memes promesses : plus de matchs, plus vite, plus proche. Cette page prend le probleme autrement. Elle explique ce que l&apos;utilisateur cherche vraiment autour de {topic} : de la confiance, une communaute reelle, des profils verifies, des preferences lisibles et une experience qui ne force pas l&apos;abonnement avant meme d&apos;avoir compris le produit.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl text-white">Comment Embir fonctionne</h2>
          <p className="mt-4">
            Embir part de quatre signaux simples : orientation, preferences, intention et compatibilite. Le but n&apos;est pas de remplacer le jugement humain par un score opaque, mais de donner assez de contexte pour eviter les conversations sans rapport. Les profils verifies, les signalements et la moderation rendent la decouverte plus saine, surtout pendant le lancement ou chaque membre compte pour creer la bonne densite locale.
          </p>
          <p className="mt-4">
            La plateforme reste gratuite au lancement. Le futur freemium servira a financer l&apos;application mobile, l&apos;infrastructure, la securite, la verification et la moderation. Cette transparence est importante : une app de rencontre ne devrait pas cacher son modele economique derriere des limites artificielles qui arrivent trop tot.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl text-white">Pour qui c&apos;est fait</h2>
          <p className="mt-4">
            Embir s&apos;adresse aux personnes majeures qui veulent rencontrer avec plus de clarte, que la recherche soit hetero, gay, lesbienne, bi, trans, queer, serieuse, ouverte ou encore en exploration. A {place}, l&apos;objectif n&apos;est pas d&apos;afficher une masse artificielle de profils, mais de construire progressivement une communaute fondatrice qui donne envie de revenir parce que les profils sont reels et les intentions plus lisibles.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl text-white">Difference avec les apps classiques</h2>
          <p className="mt-4">
            Les apps classiques optimisent souvent le temps passe dans le flux : swipe infini, distance immediate, options essentielles bloquees, notifications de relance. Embir cherche plutot a reduire le bruit. La difference se voit dans les pages locales, les comparatifs, les guides et les pages produit : chaque contenu doit aider l&apos;utilisateur a comprendre le fonctionnement, le niveau de confiance et le modele gratuit au lancement avant de creer un profil.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 space-y-10 text-base leading-relaxed text-white/52">
      {page.content && (
        <div className="rounded-3xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-8">
          <h2 className="font-serif text-3xl text-white">A word from the team</h2>
          <p className="mt-4 italic text-white/70">{page.content}</p>
        </div>
      )}
      <div>
        <h2 className="font-serif text-3xl text-white">Why this page exists</h2>
        <p className="mt-4">{page.angle}</p>
        <p className="mt-4">
          Dating search results are crowded with pages that repeat the same promise: more matches, faster, nearby. This page takes a clearer angle around {topic}. It explains what people actually need before joining a new dating platform: trust, real profiles, verified safety signals, readable preferences and a launch model that does not force a subscription before the product has earned attention.
        </p>
      </div>
      <div>
        <h2 className="font-serif text-3xl text-white">How Embir works</h2>
        <p className="mt-4">
          Embir starts from four signals: orientation, preferences, intent and compatibility. The goal is not to replace human judgment with an opaque score, but to provide enough context to avoid irrelevant conversations. Verified profiles, reporting and moderation make discovery healthier, especially during launch when every founding member shapes the culture of the platform.
        </p>
        <p className="mt-4">
          The platform is free at launch. The future freemium model will fund the mobile app, infrastructure, safety, verification and moderation. That transparency matters because a dating app should not hide its business model behind artificial limits that appear before users understand the community.
        </p>
      </div>
      <div>
        <h2 className="font-serif text-3xl text-white">Who it is for</h2>
        <p className="mt-4">
          Embir is for adults who want clearer dating, whether the search is straight, gay, lesbian, bi, trans, queer, serious, open-ended or still being explored. In {place}, the goal is not to inflate profile volume artificially, but to build a founding community where profiles are real, intent is easier to read and safety is visible from the beginning.
        </p>
      </div>
      <div>
        <h2 className="font-serif text-3xl text-white">Difference from classic apps</h2>
        <p className="mt-4">
          Classic dating apps often optimize time in the feed: endless swiping, distance-first ranking, essential features locked away and constant reactivation prompts. Embir is designed to reduce that noise. The difference appears across local pages, comparison pages, guides and product pages: each page should help a user understand the product, the trust model and the free-at-launch promise before creating a profile.
        </p>
      </div>
    </section>
  );
}

export function SeoCityPage({ page }: { page: ResolvedSeoPage }) {
  const city = page.city ?? "this city";
  const localizedIntro =
    page.locale === "fr"
      ? `A ${city}, Embir aide les personnes majeures a chercher une rencontre plus claire : rencontre serieuse, rencontre LGBTQ+, rencontre gay, rencontre inclusive, ou simple envie de discuter avec des profils verifies. La plateforme reste gratuite au lancement pour permettre a la communaute fondatrice de se former avant le futur modele freemium.`
      : `In ${city}, Embir helps adults search for clearer dating: serious dating, LGBTQ dating, gay dating, inclusive dating, or simply better conversations with verified profiles. The platform is free at launch so a founding community can form before the future freemium model.`;
  return (
    <SeoPageLayout page={page}>
      <section className="mt-12 space-y-5 text-base leading-relaxed text-white/50">
        <p>{localizedIntro}</p>
        <p>
          {page.locale === "fr"
            ? "Embir combine orientation, preferences, compatibilite, securite et profils verifies afin que la decouverte ne depende pas seulement de la distance ou du volume de swipe. Chaque personne peut exprimer son intention, filtrer ce qui compte vraiment et rejoindre une communaute qui place le respect avant l'acceleration."
            : "Embir combines orientation, preferences, compatibility, safety and verified profiles so discovery does not depend only on distance or swipe volume. People can express intent, filter what matters, and join a community that values respect before acceleration."}
        </p>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {(page.locale === "fr"
          ? [
              ["Orientation", `Les orientations et attentes sont explicites pour aider les personnes a ${page.city} a eviter les malentendus des le depart.`],
              ["Preferences", `Les preferences relationnelles, de rythme et de style de vie guident la decouverte locale sans transformer la page en simple annuaire.`],
              ["Compatibilite", `La compatibilite donne plus de poids aux signaux utiles qu'a la seule proximite geographique.`],
            ]
          : [
              ["Orientation", `Orientation signals help people in ${page.city} avoid basic mismatches before a conversation starts.`],
              ["Preferences", `Relationship, pace and lifestyle preferences guide local discovery without turning the page into a plain directory.`],
              ["Compatibility", `Compatibility gives more weight to useful signals than distance alone.`],
            ]).map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="font-serif text-2xl text-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/45">
              {text}
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
            {page.locale === "fr"
              ? "Embir place l'orientation, les preferences, la compatibilite, les profils verifies et la securite au coeur du produit. Le lancement est gratuit pour permettre aux premiers membres de tester l'experience essentielle avant l'arrivee des futures options premium."
              : "Embir puts orientation, preferences, compatibility, verified profiles and safety into the product foundation. The launch is free so early members can test the core experience before premium features arrive."}
          </p>
        </div>
        <div>
          <h3 className="font-serif text-2xl text-white">{page.locale === "fr" ? "A retenir" : "Key takeaways"}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {(page.locale === "fr"
              ? [
                  "Gratuit au lancement, avec un futur modele freemium transparent.",
                  "Construit pour la France, la Suisse, le Royaume-Uni et les Etats-Unis.",
                  "Pense pour toutes les orientations, pas seulement une niche.",
                  "Centre sur les profils verifies, la compatibilite et des conversations plus sures.",
                ]
              : [
                  "Free at launch, with a transparent future freemium model.",
                  "Built for France, Switzerland, the UK and the United States.",
                  "Designed for every orientation, not only one dating niche.",
                  "Focused on verified profiles, compatibility and safer conversations.",
                ]).map((item) => <li key={item}>{item}</li>)}
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
        {(page.locale === "fr"
          ? [
              ["Prix au lancement", `${page.app ?? "App classique"} limite souvent l'usage gratuit`, "Embir est gratuit au lancement"],
              ["Audience", "Souvent definie par une niche historique", "Pense pour toutes orientations"],
              ["Decouverte", "Swipe ou distance d'abord", "Preferences et compatibilite d'abord"],
              ["Confiance", "Verification variable", "Profils verifies au centre"],
              ["Modele futur", "Upsells opaques", "Freemium transparent pour mobile, securite et moderation"],
            ]
          : [
              ["Launch price", `${page.app ?? "Legacy app"} often limits free usage`, "Embir is free at launch"],
              ["Audience", "Often shaped by legacy niches", "Built for every orientation"],
              ["Discovery", "Swipe or distance first", "Preferences and compatibility first"],
              ["Trust", "Verification varies", "Verified profiles are central"],
              ["Future model", "Opaque upsells", "Transparent freemium for mobile, safety and moderation"],
            ]).map(([feature, oldApp, embir]) => (
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
          {page.locale === "fr" ? "Categorie : rencontre moderne · Tags : gratuit au lancement, freemium, compatibilite, profils verifies" : "Category: modern dating · Tags: free at launch, freemium, compatibility, verified profiles"}
        </p>
        <p>
          {page.locale === "fr"
            ? "Embir part d'une conviction simple : une personne ne devrait pas payer immediatement pour comprendre qui est compatible, fiable et vraiment interessee. Le contenu editorial sert donc a expliquer le probleme avant de pousser une inscription."
            : "Embir starts from a simple belief: people should not have to pay immediately just to understand who is compatible, safe and genuinely interested. Editorial content exists to explain the problem before pushing a sign-up."}
        </p>
        <p>
          {page.locale === "fr"
            ? "La plateforme combine orientation, preferences, profils verifies et signaux de compatibilite pour rendre la rencontre moins aleatoire, moins epuisante et plus lisible."
            : "The platform combines orientation, preferences, verified profiles and compatibility signals so dating feels less random, less exhausting and easier to understand."}
        </p>
        <p>
          {page.locale === "fr"
            ? "Le futur modele freemium doit financer l'application mobile, la securite, la moderation, la verification des profils et les ameliorations continues sans enfermer la communaute de lancement derriere des paywalls prematurees."
            : "The future freemium model is designed to fund the mobile app, security, moderation, profile verification and continuous product improvements without making the launch community feel trapped behind early paywalls."}
        </p>
        <h2 className="font-serif text-3xl text-white">
          {page.locale === "fr" ? `Pourquoi c'est important pour ${page.topic ?? "la rencontre moderne"}` : `Why this matters for ${page.topic ?? "modern dating"}`}
        </h2>
        <p>
          {page.locale === "fr"
            ? "Les recherches autour des applications de rencontre melangent souvent le prix, la securite, l'orientation, la localisation et la confiance. Embir relie ces questions au lieu de les traiter comme des pages isolees. Une personne qui cherche une application gratuite, une option LGBTQ plus rassurante ou une experience avec profils verifies doit retrouver la meme promesse publique : gratuit au lancement, plus large qu'une seule niche, et transparent sur le futur modele economique."
            : "Search intent around dating apps is usually split between price, safety, orientation, location and trust. Embir connects those questions instead of treating them as separate landing pages. A person looking for a free dating app in the United States, a safer LGBTQ dating option in the UK, or a verified profile experience in France should find the same public promise: free at launch, broader than a single niche, and transparent about the future business model."}
        </p>
        <h3 className="font-serif text-2xl text-white">{page.locale === "fr" ? "Le positionnement produit" : "The product position"}</h3>
        <p>
          {page.locale === "fr"
            ? "La plateforme n'est pas presentee comme un clone de Grindr, Tinder, Bumble ou une autre app historique. Les comparatifs aident a comprendre les differences, mais la direction produit est plus large : onboarding attentif a l'orientation, decouverte par preferences, signaux de compatibilite, controles de securite, culture fondatrice et feuille de route mobile financee par un futur freemium."
            : "The platform is not presented as a clone of Grindr, Tinder, Bumble or any other legacy app. Comparisons can help users understand the difference, but the product direction is wider: orientation-aware onboarding, preference-led discovery, compatibility signals, safety controls, founder culture, and a mobile app roadmap funded by a future freemium layer."}
        </p>
        <h3 className="font-serif text-2xl text-white">{page.locale === "fr" ? "Ce que les premiers membres obtiennent" : "What early members get"}</h3>
        <p>
          {page.locale === "fr"
            ? "Les membres fondateurs rejoignent Embir pendant que l'experience essentielle est ouverte. Ils peuvent creer un profil, tester la decouverte, contribuer aux attentes de moderation et donner du feedback avant le deploiement mobile. L'objectif est de construire la densite ville par ville tout en gardant une premiere communaute plus saine qu'une app qui commence par des paywalls lourds ou un classement opaque."
            : "Founder members join while the core experience is open. That means they can create a profile, test discovery, help shape moderation expectations, and give feedback before the mobile rollout. The goal is to build density city by city while keeping the first community healthier than an app that starts with heavy paywalls or opaque ranking."}
        </p>
        {page.locale !== "fr" ? (
          <p>
            Use this guide as a decision filter before creating another profile: check whether the app explains its free access, whether verification is visible, whether orientation and intent are treated with care, and whether the business model feels transparent enough to trust over time.
          </p>
        ) : null}
      </section>
    </SeoPageLayout>
  );
}
