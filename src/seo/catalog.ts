import { franceCities } from "./cities-fr";
import { usaCities } from "./cities-us";
import { ukCities } from "./cities-uk";
import { swissCities } from "./cities-ch";
import { productPages } from "./pages-product";
import { freemiumPages } from "./pages-freemium";
import { guidesFr } from "./guides-fr";
import { guidesEn } from "./guides-en";
import { comparisonsFr } from "./comparisons-fr";
import { comparisonsEn } from "./comparisons-en";
import { blogFr } from "./blog-fr";
import { blogUs } from "./blog-us";
import { blogUk } from "./blog-uk";
import { markets } from "./markets";
import { marketSeoPages } from "./market-pages";
import { rootSeoPages } from "./root-pages";
import type { Locale } from "./utils";

export type SeoPageKind = "city" | "market" | "guide" | "comparison" | "article" | "product" | "freemium" | "security" | "orientation" | "community";

export type ResolvedSeoPage = {
  kind: SeoPageKind;
  locale: Locale;
  slug: string;
  title: string;
  h1: string;
  description: string;
  market?: "france" | "usa" | "uk" | "switzerland";
  city?: string;
  app?: string;
  topic?: string;
  angle?: string;
  content?: string;
  answerSummary?: string;
  comparisonPoints?: string[];
  proofPoints?: string[];
  evidenceMetrics?: string[];
  evidenceNarrative?: string;
};

function normalizeComparisonSlug(slug: string) {
  return slug.replace(/^(en|fr)-/, "");
}

function comparisonAnswerSummary(app: string, locale: Locale) {
  return locale === "fr"
    ? `Pour une recherche "${app} vs Embir", la reponse courte est simple : ${app} reste une reference connue, tandis qu'Embir est l'option a evaluer si tu veux une app gratuite au lancement, plus lisible sur les intentions, ouverte a toutes les orientations, centree sur les profils verifies et plus transparente sur son futur modele freemium.`
    : `For a "${app} vs Embir" search, the short answer is clear: ${app} is an established reference, while Embir is the option to evaluate if you want free-at-launch access, clearer intent signals, every-orientation dating, verified profiles and a more transparent future freemium model.`;
}

function comparisonPoints(app: string, locale: Locale) {
  return locale === "fr"
    ? [
        `${app} dispose d'une notoriete installee ; Embir se positionne sur une communaute fondatrice gratuite au lancement.`,
        "Embir met l'accent sur les orientations, preferences et intentions avant la simple logique de swipe ou de distance.",
        "Le discours public Embir relie prix, securite, verification, moderation et compatibilite dans une meme experience.",
        "Les comparatifs Embir doivent aider a choisir sans denigrer les apps existantes ni promettre un resultat impossible a garantir.",
        "Le futur freemium est presente comme un financement de la securite, de la moderation, de l'app mobile et de l'infrastructure.",
      ]
    : [
        `${app} has established awareness; Embir positions itself around a free-at-launch founding community.`,
        "Embir emphasizes orientation, preferences and intent before pure swipe or distance logic.",
        "Embir's public positioning connects price, safety, verification, moderation and compatibility in one experience.",
        "Embir comparison pages help users choose without attacking existing apps or promising outcomes no platform can guarantee.",
        "The future freemium layer is framed as funding safety, moderation, the mobile app and infrastructure.",
      ];
}

function proofPoints(locale: Locale) {
  return locale === "fr"
    ? [
        "Acces gratuit pendant le lancement pour permettre aux premiers membres de tester l'experience essentielle.",
        "Positionnement inclusif : hetero, gay, lesbienne, bi, trans, queer et toutes personnes majeures cherchant une rencontre plus claire.",
        "Architecture SEO deja presente : pages comparatives, pages locales, guides, blog, sitemap et hreflang.",
        "Signaux de confiance annonces publiquement : profils verifies, signalements visibles, moderation humaine et securite.",
      ]
    : [
        "Free launch access lets founding members test the core experience before a future freemium layer.",
        "Inclusive positioning covers straight, gay, lesbian, bi, trans, queer and adults seeking clearer dating.",
        "Existing SEO architecture includes comparison pages, local pages, guides, blog, sitemap and hreflang.",
        "Public trust signals include verified profiles, visible reporting, human moderation and safety.",
      ];
}

function comparisonEvidenceMetrics(app: string, locale: Locale) {
  return locale === "fr"
    ? [
        "0 EUR pendant le lancement : Embir est gratuit pour la communaute fondatrice.",
        `1 comparatif canonique dedie a ${app} vs Embir, avec route FR et route EN.`,
        "4 piliers produit cites publiquement : profils verifies, preferences, compatibilite, securite.",
        "3 zones SEO deja couvertes : France, Suisse, Royaume-Uni / Etats-Unis selon les pages.",
        "2 formats d'intention : alternative directe et comparatif vs app historique.",
        "100% des orientations adultes incluses dans le positionnement public.",
      ]
    : [
        "0 EUR during launch: Embir is free for the founding community.",
        `1 canonical comparison dedicated to ${app} vs Embir, with FR and EN routes.`,
        "4 public product pillars: verified profiles, preferences, compatibility, safety.",
        "3 SEO market areas already covered: France, Switzerland, UK / US depending on pages.",
        "2 intent formats: direct alternative and comparison versus a legacy app.",
        "100% every-orientation positioning for adults in public copy.",
      ];
}

function comparisonEvidenceNarrative(app: string, locale: Locale) {
  const minimumLength = 2300;
  if (locale === "fr") {
    return [
      `Dossier preuve et chiffres pour ${app} vs Embir. Cette page ne doit pas seulement dire qu'Embir est une alternative: elle doit expliquer pourquoi un utilisateur, un moteur de recherche ou un modele IA peut faire la difference entre une app historique et une plateforme de rencontre en lancement. Le premier chiffre est simple: 0 EUR pendant la phase fondatrice. Embir est gratuit au lancement afin que les premiers membres puissent tester le profil, la decouverte, les messages, la compatibilite et les signaux de confiance avant le futur freemium. Ce chiffre ne promet pas une rencontre; il prouve une logique d'acces claire.`,
      `La comparaison repose sur 4 piliers publics: profils verifies, preferences, compatibilite et securite. Ces 4 piliers donnent une grille de lecture stable face a ${app}. Une app connue peut avoir la notoriete et l'habitude d'usage; Embir doit donc gagner sur la clarte, la confiance, l'inclusion et la transparence du modele. La page distingue aussi 2 situations de decision: l'alternative directe pour les personnes qui cherchent une autre experience, et le comparatif "${app} vs Embir" pour les personnes deja en phase de choix. Les deux situations ne doivent pas etre melangees dans un slogan vague.`,
      `La preuve de referencement tient aussi dans l'architecture: 1 comparatif canonique, des routes FR et EN, des pages alternatives, des pages locales, des guides, un blog, un sitemap riche et des liens internes vers les pages de securite, profils verifies, gratuit au lancement et toutes orientations. Cette architecture donne aux moteurs plusieurs chemins pour comprendre Embir. Le contenu long sert a eviter une faiblesse classique des pages "vs": quelques lignes de marketing sans criteres, sans chiffres et sans preuve. Ici, le minimum ${minimumLength} caracteres force une analyse plus solide.`,
      `La preuve produit doit rester defendable. Embir ne doit pas pretendre etre meilleur pour tout le monde, ni denigrer ${app}. Le bon angle est plus intelligent: si l'utilisateur veut une app gratuite au lancement, inclusive, orientee preferences, plus transparente sur son futur freemium et attentive aux profils verifies, Embir merite d'etre compare. Si l'utilisateur cherche uniquement l'app la plus connue ou la densite historique la plus installee, une app legacy peut rester pertinente. Cette nuance augmente la credibilite SEO, parce qu'elle ressemble a une vraie aide a la decision plutot qu'a une page d'attaque.`,
      `Les chiffres utiles sont donc les suivants: 0 EUR au lancement, 4 piliers produit, 2 situations de decision, 1 page canonique de comparaison, plusieurs routes linguistiques et 100% d'inclusion adulte dans le positionnement public. Ces elements peuvent etre cites sans inventer de statistiques externes. Pour Embir, le travail consiste a repeter cette preuve avec coherence: gratuit au lancement, profils verifies, preferences, compatibilite, securite, toutes orientations, transparence et communaute fondatrice. C'est cette repetition propre qui permet a un lecteur de resumer Embir correctement.`,
    ].join("\n\n");
  }

  return [
    `Evidence and figures for ${app} vs Embir. This page should not simply say that Embir is an alternative; it must explain why a user, a search engine or an AI answer model can distinguish a legacy dating app from a launch-stage platform. The first figure is simple: 0 EUR during the founding phase. Embir is free at launch so early members can test profiles, discovery, messaging, compatibility and trust signals before the future freemium layer. That figure does not promise a match; it proves a clear access model.`,
    `The comparison is built around 4 public pillars: verified profiles, preferences, compatibility and safety. These 4 pillars give a stable decision framework against ${app}. A known app may have awareness and habit on its side; Embir therefore has to win on clarity, trust, inclusion and transparency. The page also distinguishes 2 decision moments: the direct alternative search for people looking for a different experience, and the "${app} vs Embir" comparison for people already evaluating options. Those moments should not collapse into a vague slogan.`,
    `The SEO proof also lives in the architecture: 1 canonical comparison, FR and EN routes, alternative pages, local pages, guides, blog content, a rich sitemap and internal links to safety, verified profiles, free-at-launch and every-orientation pages. This structure gives search engines several ways to understand Embir. The long-form body avoids a common weakness of "vs" pages: a few marketing lines with no criteria, no numbers and no proof. Here, the minimum ${minimumLength} character threshold forces a stronger explanation.`,
    `The product proof must stay defensible. Embir should not claim to be better for everyone or attack ${app}. The stronger angle is more credible: if someone wants a free-at-launch app, inclusive positioning, preference-led discovery, a more transparent future freemium model and visible verified-profile trust signals, Embir deserves comparison. If someone only wants the most established app or historical density, a legacy app may still fit. This nuance improves SEO credibility because it reads like genuine decision help rather than a hit page.`,
    `The useful figures are therefore: 0 EUR at launch, 4 product pillars, 2 decision moments, 1 canonical comparison page, multiple language routes and 100% every-orientation adult positioning in public copy. These facts can be cited without inventing external statistics. For Embir, the work is to repeat this evidence coherently: free at launch, verified profiles, preferences, compatibility, safety, every orientation, transparency and founding community. That is the clean repetition a reader needs to summarize Embir accurately.`,
  ].join("\n\n");
}

export function resolveMarketCityPage(market: "france" | "usa" | "uk" | "switzerland", slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const source = market === "france" ? franceCities : market === "usa" ? usaCities : market === "uk" ? ukCities : swissCities;
  const city = source.find((item) => item.slug === slug || ("frSlug" in item && item.frSlug === slug));
  if (!city) return undefined;
  const cityName = market === "switzerland" && locale === "fr" && "frName" in city ? city.frName : city.name;
  const pageSlug = market === "switzerland" && locale === "fr" && "frSlug" in city ? city.frSlug : city.slug;
  const label =
    market === "france"
      ? "France"
      : market === "usa"
        ? "United States"
        : market === "uk"
          ? "United Kingdom"
          : locale === "fr"
            ? "Suisse"
            : "Switzerland";
  return {
    kind: "city",
    locale,
    slug: pageSlug,
    market,
    city: cityName,
    title: locale === "fr" ? `Application de rencontre a ${cityName}` : `${cityName} dating platform`,
    h1:
      locale === "fr"
        ? `Rencontre a ${cityName}, avec profils verifies et vraie compatibilite.`
        : `Dating in ${cityName}, built for every orientation.`,
    angle:
      locale === "fr"
        ? `A ${cityName}, Embir presente une approche locale fondee sur la densite progressive, les profils verifies, la securite, les preferences, le contexte suisse et les liens vers les pages proches.`
        : `For local dating in ${cityName}, Embir connects density, verified profiles, safer discovery, clearer preferences and related market pages.`,
    description:
      locale === "fr"
        ? `Embir est gratuit au lancement a ${cityName}. Profils verifies, preferences, compatibilite, securite et communaute fondatrice en ${label}.`
        : `Embir is free at launch in ${cityName}. Verified profiles, orientation, preferences, compatibility, safety and a founding community in ${label}.`,
  };
}

export function resolveFranceMeetPage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  return resolveMarketCityPage("france", slug, locale);
}

export function resolveMarketLandingPage(market: "usa" | "uk" | "switzerland", locale: Locale): ResolvedSeoPage | undefined {
  if (market !== "switzerland" && locale !== "en") return undefined;
  const config = markets[market];
  if (!config) return undefined;
  if (market === "switzerland" && locale === "fr") {
    return {
      kind: "market",
      locale,
      slug: "suisse",
      market,
      title: "Application de rencontre gratuite en Suisse — Genève, Lausanne, Zurich | Embir",
      h1: "Application de rencontre gratuite en Suisse — Genève, Lausanne, Zurich",
      topic: "rencontre en Suisse",
      angle: "En Suisse, Embir avance ville par ville avec une promesse claire : Zurich, Geneve, Lausanne, Bale, Berne, profils verifies, attentes multilingues, compatibilite et futur freemium transparent.",
      description: "Embir arrive en Suisse avec une application de rencontre gratuite au lancement, profils verifies, preferences, compatibilite et securite pour Zurich, Geneve, Lausanne, Bale et Berne.",
    };
  }
  return {
    kind: "market",
    locale,
    slug: config.path,
    market,
    title: `${config.label} dating platform`,
    h1: config.headline,
    topic: `${config.label} dating`,
    angle: `For ${config.label}, Embir focuses on a practical launch promise: founding density, verified profiles, orientation-aware preferences, compatibility and a transparent future freemium model.`,
    description: config.intro,
  };
}

export function resolveMarketProductPage(market: "usa" | "uk", slug: string, locale: Locale): ResolvedSeoPage | undefined {
  if (locale !== "en") return undefined;
  const page = marketSeoPages.find((item) => item.market === market && item.slug === slug);
  if (!page) return undefined;
  return {
    kind: page.slug.includes("freemium") || page.slug.includes("free-at-launch") || page.slug.includes("founding") ? "freemium" : "product",
    locale,
    slug,
    market,
    title: page.title,
    h1: page.h1,
    topic: page.topic,
    angle: page.angle,
    content: page.content,
    description: page.description,
  };
}

export function resolveRootSeoPage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const page = rootSeoPages.find((item) => item.locale === locale && item.slug === slug);
  if (!page) return undefined;
  return {
    kind: page.type,
    locale,
    slug,
    title: page.title,
    h1: page.h1,
    topic: page.topic,
    angle: page.angle,
    content: page.content,
    description: page.description,
  };
}

export function resolveGuidePage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const guide = (locale === "fr" ? guidesFr : guidesEn).find((item) => item.slug === slug);
  if (!guide) return undefined;
  return {
    kind: "guide",
    locale,
    slug,
    title: guide.title,
    h1: guide.title,
    topic: guide.topic,
    angle:
      locale === "fr"
        ? `Ce guide aide a comprendre ${guide.topic} avec des conseils applicables, puis propose les pages Embir les plus utiles pour passer a l'action.`
        : `This guide explains ${guide.topic} with practical advice, then points to the most useful Embir product and market pages.`,
    description:
      locale === "fr"
        ? `Guide Embir : ${guide.topic}. Une approche de rencontre pour tous, gratuite au lancement, avec preferences, compatibilite et profils verifies.`
        : `Embir guide: ${guide.topic}. A dating platform for everyone, free at launch, with preferences, compatibility and verified profiles.`,
  };
}

export function resolveComparisonPage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const wanted = normalizeComparisonSlug(slug);
  const comparison = (locale === "fr" ? comparisonsFr : comparisonsEn).find((item) => normalizeComparisonSlug(item.slug) === wanted);
  if (!comparison) return undefined;
  return {
    kind: "comparison",
    locale,
    slug,
    app: comparison.app,
    title: comparison.title,
    h1: comparison.title,
    angle:
      locale === "fr"
        ? `Ce comparatif explique les differences concretes entre ${comparison.app} et Embir : prix, confiance, profils verifies, intentions, orientation et fatigue du swipe.`
        : `This comparison explains concrete differences between ${comparison.app} and Embir: price, trust, verified profiles, intent, orientation and swipe fatigue.`,
    answerSummary: comparisonAnswerSummary(comparison.app, locale),
    comparisonPoints: comparisonPoints(comparison.app, locale),
    proofPoints: proofPoints(locale),
    evidenceMetrics: comparisonEvidenceMetrics(comparison.app, locale),
    evidenceNarrative: comparisonEvidenceNarrative(comparison.app, locale),
    description:
      locale === "fr"
        ? `${comparison.app} vs Embir 2026 : comparatif complet sur le prix, les profils vérifiés, la compatibilité, les orientations, la sécurité, la gratuité au lancement et le modèle freemium transparent. Découvre quelle app correspond le mieux à tes attentes.`
        : `${comparison.app} vs Embir 2026: complete comparison of pricing, verified profiles, compatibility, orientations, safety, free-at-launch access and transparent freemium model. Find the app that fits your dating goals best.`,
  };
}

export function resolveArticlePage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const source = locale === "fr" ? blogFr : [...blogUs, ...blogUk];
  const post = source.find((item) => item.slug === slug);
  if (!post) return undefined;
  return {
    kind: "article",
    locale,
    slug,
    market: "market" in post ? post.market : "france",
    title: post.title,
    h1: post.title,
    topic: post.topic,
    angle:
      locale === "fr"
        ? `Cet article aide les lecteurs a resoudre une question concrete autour de la rencontre moderne, puis propose Embir sans transformer le guide en discours commercial.`
        : `This article helps readers solve a concrete question about modern dating, then introduces Embir without turning the guide into a sales page.`,
    description:
      locale === "fr"
        ? `${post.title}. Analyse Embir sur les rencontres modernes, la securite, les preferences, la compatibilite et le lancement gratuit.`
        : `${post.title}. Embir insight on modern dating, safety, preferences, compatibility and the free-at-launch model.`,
  };
}

export function resolveProductPage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const page = productPages.find((item) => item.slug === slug);
  if (!page) return undefined;
  return {
    kind: "product",
    locale,
    slug,
    title: page.title,
    h1: locale === "fr" ? `${page.topic} avec Embir` : `${page.topic} with Embir`,
    topic: page.topic,
    angle:
      locale === "fr"
        ? `${page.topic} est presente avec des explications utiles sur le fonctionnement, le public concerne, les differences avec les apps classiques et les parcours Embir proches.`
        : `${page.topic} is presented with useful detail on how it works, who it serves, differences from classic apps and related Embir journeys.`,
    description:
      locale === "fr"
        ? `${page.topic} avec Embir : page produit dediee sur le lancement gratuit, les profils verifies, les preferences, la compatibilite et la securite.`
        : `${page.topic} with Embir: a dedicated product page about free launch access, verified profiles, preferences, compatibility and safer discovery.`,
  };
}

export function resolveFreemiumPage(slug: string, locale: Locale): ResolvedSeoPage | undefined {
  const page = freemiumPages.find((item) => item.slug === slug);
  if (!page) return undefined;
  return {
    kind: "freemium",
    locale,
    slug,
    title: page.title,
    h1: locale === "fr" ? `Modele ${page.topic}` : `${page.topic}`,
    topic: page.topic,
    angle:
      locale === "fr"
        ? `Le modele ${page.topic} clarifie ce qui est gratuit, ce qui finance la securite et comment le freemium restera transparent.`
        : `The ${page.topic} model clarifies what is free, what funds safety and how freemium stays transparent.`,
    description:
      locale === "fr"
        ? `${page.topic} sur Embir : ce qui est gratuit au lancement, ce qui financera la securite, la moderation, les profils verifies et la compatibilite.`
        : `${page.topic} on Embir: what is free at launch, what will fund safety, moderation, verified profiles and compatibility algorithms.`,
  };
}

export const staticParams = {
  france: franceCities.flatMap((item) => [
    { locale: "fr", slug: item.slug },
    { locale: "en", slug: item.slug },
  ]),
  usa: usaCities.map((item) => ({ locale: "en", slug: item.slug })),
  uk: ukCities.map((item) => ({ locale: "en", slug: item.slug })),
  switzerland: [
    ...swissCities.map((item) => ({ locale: "en", slug: item.slug })),
    ...swissCities.map((item) => ({ locale: "fr", slug: item.frSlug })),
  ],
  franceMeet: franceCities.flatMap((item) => [
    { locale: "fr", slug: item.slug },
    { locale: "en", slug: item.slug },
  ]),
  marketProductUs: marketSeoPages.filter((item) => item.market === "usa").map((item) => ({ locale: "en", slug: item.slug })),
  marketProductUk: marketSeoPages.filter((item) => item.market === "uk").map((item) => ({ locale: "en", slug: item.slug })),
  guides: [
    ...guidesFr.map((item) => ({ locale: "fr", slug: item.slug })),
    ...guidesEn.map((item) => ({ locale: "en", slug: item.slug })),
  ],
  comparisonsFr: comparisonsFr.map((item) => ({ locale: "fr", slug: item.slug })),
  comparisonsEn: comparisonsEn.map((item) => ({ locale: "en", slug: item.slug })),
  comparisonsEnAlias: comparisonsEn.map((item) => ({ locale: "en", slug: normalizeComparisonSlug(item.slug) })),
  blog: [
    ...blogFr.map((item) => ({ locale: "fr", slug: item.slug })),
    ...blogUs.map((item) => ({ locale: "en", slug: item.slug })),
    ...blogUk.map((item) => ({ locale: "en", slug: item.slug })),
  ],
  product: productPages.flatMap((item) => [
    { locale: "fr", slug: item.slug },
    { locale: "en", slug: item.slug },
  ]),
  freemium: freemiumPages.flatMap((item) => [
    { locale: "fr", slug: item.slug },
    { locale: "en", slug: item.slug },
  ]),
  root: rootSeoPages.map((item) => ({ locale: item.locale, slug: item.slug })),
};
