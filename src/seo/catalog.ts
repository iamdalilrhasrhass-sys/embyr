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
};

function normalizeComparisonSlug(slug: string) {
  return slug.replace(/^(en|fr)-/, "");
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
        ? `Cette page existe pour traiter la demande locale a ${cityName} avec un contenu utile : densite, profils verifies, securite, preferences, contexte suisse et liens vers les pages proches.`
        : `This page exists for local dating intent in ${cityName}: density, verified profiles, safer discovery, clearer preferences and links to related market pages.`,
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
      title: "Application de rencontre en Suisse",
      h1: "Une application de rencontre gratuite au lancement en Suisse",
      topic: "rencontre en Suisse",
      angle: "Cette page explique la strategie de lancement Embir en Suisse : Zurich, Geneve, Lausanne, Bale, Berne, profils verifies, attentes multilingues, compatibilite et futur freemium transparent.",
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
    angle: `This market page explains the ${config.label} launch strategy: founding density, verified profiles, orientation-aware preferences, compatibility and a transparent future freemium model.`,
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
        ? `Ce guide repond a une intention informationnelle precise autour de ${guide.topic}, puis relie naturellement vers les pages Embir les plus pertinentes.`
        : `This guide answers informational search intent around ${guide.topic}, then naturally links to the most relevant Embir product and market pages.`,
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
    description:
      locale === "fr"
        ? `${comparison.app} vs Embir : prix, profils verifies, orientations, preferences, compatibilite, securite et modele freemium transparent.`
        : `${comparison.app} vs Embir: pricing, verified profiles, orientations, preferences, compatibility, safety and a transparent freemium model.`,
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
        ? `Cet article vise une requete longue traine informationnelle et ramene vers les pages money Embir sans forcer le discours commercial.`
        : `This article targets long-tail informational search intent and links back to Embir money pages without turning the guide into a sales page.`,
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
        ? `Cette page produit detaille ${page.topic} avec des sections utiles sur le fonctionnement, la cible, les differences avec les apps classiques et les liens internes.`
        : `This product page explains ${page.topic} with useful sections about how it works, who it serves, differences from classic apps and internal links.`,
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
        ? `Cette page detaille le modele ${page.topic} pour clarifier ce qui est gratuit, ce qui finance la securite et comment le freemium restera transparent.`
        : `This page explains the ${page.topic} model so users understand what is free, what funds safety and how freemium stays transparent.`,
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
