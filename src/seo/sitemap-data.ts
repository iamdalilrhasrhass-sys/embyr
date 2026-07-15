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
import { marketSeoPages } from "./market-pages";
import { rootSeoPages } from "./root-pages";

export type SeoCategory =
  | "product"
  | "freemium"
  | "france"
  | "usa"
  | "uk"
  | "switzerland"
  | "guide"
  | "blog"
  | "comparison";

export type SeoEntry = {
  path: string;
  category: SeoCategory;
  locale: "en" | "fr";
  priority: number;
};

export const seoEntries: SeoEntry[] = [
  // Core legal & safety pages (newly created)
  { path: "/en/terms", category: "product" as const, locale: "en" as const, priority: 0.7 },
  { path: "/fr/terms", category: "product" as const, locale: "fr" as const, priority: 0.7 },
  { path: "/en/privacy", category: "product" as const, locale: "en" as const, priority: 0.7 },
  { path: "/fr/confidentialite", category: "product" as const, locale: "fr" as const, priority: 0.7 },
  { path: "/en/safety", category: "product" as const, locale: "en" as const, priority: 0.75 },
  { path: "/fr/securite", category: "product" as const, locale: "fr" as const, priority: 0.75 },
  { path: "/en/age-verification", category: "product" as const, locale: "en" as const, priority: 0.65 },
  { path: "/fr/age-verification", category: "product" as const, locale: "fr" as const, priority: 0.65 },
  { path: "/en/moderation", category: "product" as const, locale: "en" as const, priority: 0.7 },
  { path: "/fr/moderation", category: "product" as const, locale: "fr" as const, priority: 0.7 },
  { path: "/en/about", category: "product" as const, locale: "en" as const, priority: 0.8 },
  { path: "/fr/about", category: "product" as const, locale: "fr" as const, priority: 0.8 },
  { path: "/en/support", category: "product" as const, locale: "en" as const, priority: 0.65 },
  { path: "/fr/support", category: "product" as const, locale: "fr" as const, priority: 0.65 },
  // Static dedicated SEO pages
  { path: "/en/verified-dating-app", category: "product" as const, locale: "en" as const, priority: 0.88 },
  { path: "/en/site-rencontre-gay", category: "product" as const, locale: "en" as const, priority: 0.85 },
  { path: "/en/serious-dating-app", category: "product" as const, locale: "en" as const, priority: 0.85 },
  { path: "/en/paris", category: "france" as const, locale: "en" as const, priority: 0.9 },
  { path: "/fr/paris", category: "france" as const, locale: "fr" as const, priority: 0.92 },
  { path: "/en/freemium", category: "freemium" as const, locale: "en" as const, priority: 0.88 },
  { path: "/fr/freemium", category: "freemium" as const, locale: "fr" as const, priority: 0.88 },
  { path: "/en/free-dating-app", category: "product" as const, locale: "en" as const, priority: 0.92 },
  { path: "/fr/free-dating-app", category: "product" as const, locale: "fr" as const, priority: 0.92 },
  { path: "/en/grindr-alternative", category: "product" as const, locale: "en" as const, priority: 0.9 },
  { path: "/fr/grindr-alternative", category: "product" as const, locale: "fr" as const, priority: 0.9 },
  { path: "/en/tinder-alternative", category: "product" as const, locale: "en" as const, priority: 0.9 },
  { path: "/fr/tinder-alternative", category: "product" as const, locale: "fr" as const, priority: 0.9 },
  { path: "/en/lgbtq-dating-app", category: "product" as const, locale: "en" as const, priority: 0.9 },
  { path: "/fr/lgbtq-dating-app", category: "product" as const, locale: "fr" as const, priority: 0.9 },
  // Original entries
  ...productPages.flatMap((page) => [
    { path: `/en/product/${page.slug}`, category: "product" as const, locale: "en" as const, priority: 0.9 },
    { path: `/fr/product/${page.slug}`, category: "product" as const, locale: "fr" as const, priority: 0.9 },
  ]),
  ...rootSeoPages.map((page) => ({
    path: `/${page.locale}/${page.slug}`,
    category: page.type === "freemium" ? "freemium" as const : "product" as const,
    locale: page.locale,
    priority: page.priority,
  })),
  ...freemiumPages.flatMap((page) => [
    { path: `/en/freemium/${page.slug}`, category: "freemium" as const, locale: "en" as const, priority: 0.9 },
    { path: `/fr/freemium/${page.slug}`, category: "freemium" as const, locale: "fr" as const, priority: 0.9 },
  ]),
  { path: "/en/us", category: "usa" as const, locale: "en" as const, priority: 0.94 },
  { path: "/en/uk", category: "uk" as const, locale: "en" as const, priority: 0.94 },
  { path: "/en/switzerland", category: "switzerland" as const, locale: "en" as const, priority: 0.92 },
  { path: "/fr/suisse", category: "switzerland" as const, locale: "fr" as const, priority: 0.91 },
  { path: "/en/lausanne", category: "switzerland" as const, locale: "en" as const, priority: 0.96 },
  { path: "/fr/lausanne", category: "switzerland" as const, locale: "fr" as const, priority: 0.97 },
  ...marketSeoPages.map((page) => ({
    path: page.market === "usa" ? `/en/us/${page.slug}` : `/en/uk/${page.slug}`,
    category: page.market === "usa" ? "usa" as const : "uk" as const,
    locale: "en" as const,
    priority: page.priority,
  })),
  ...franceCities.map((city) => ({ path: `/fr/france/${city.slug}`, category: "france" as const, locale: "fr" as const, priority: 0.86 })),
  ...franceCities.map((city) => ({ path: `/en/france/${city.slug}`, category: "france" as const, locale: "en" as const, priority: 0.82 })),
  ...franceCities.map((city) => ({ path: `/fr/rencontre/${city.slug}`, category: "france" as const, locale: "fr" as const, priority: 0.87 })),
  ...franceCities.map((city) => ({ path: `/en/rencontre/${city.slug}`, category: "france" as const, locale: "en" as const, priority: 0.78 })),
  ...usaCities.map((city) => ({ path: `/en/usa/${city.slug}`, category: "usa" as const, locale: "en" as const, priority: 0.84 })),
  ...usaCities.map((city) => ({ path: `/en/us/dating/${city.slug}`, category: "usa" as const, locale: "en" as const, priority: 0.86 })),
  ...ukCities.map((city) => ({ path: `/en/uk/${city.slug}`, category: "uk" as const, locale: "en" as const, priority: 0.84 })),
  ...ukCities.map((city) => ({ path: `/en/uk/dating/${city.slug}`, category: "uk" as const, locale: "en" as const, priority: 0.86 })),
  ...swissCities.map((city) => ({ path: `/en/switzerland/${city.slug}`, category: "switzerland" as const, locale: "en" as const, priority: 0.84 })),
  ...swissCities.map((city) => ({ path: `/fr/suisse/${city.frSlug}`, category: "switzerland" as const, locale: "fr" as const, priority: 0.84 })),
  ...guidesFr.map((guide) => ({ path: `/fr/guides/${guide.slug}`, category: "guide" as const, locale: "fr" as const, priority: 0.78 })),
  ...guidesEn.map((guide) => ({ path: `/en/guides/${guide.slug}`, category: "guide" as const, locale: "en" as const, priority: 0.78 })),
  ...comparisonsFr.map((comparison) => ({ path: `/fr/comparaison/${comparison.slug}`, category: "comparison" as const, locale: "fr" as const, priority: 0.76 })),
  ...comparisonsEn.map((comparison) => ({ path: `/en/comparisons/${comparison.slug}`, category: "comparison" as const, locale: "en" as const, priority: 0.76 })),
  ...comparisonsEn.map((comparison) => ({ path: `/en/comparison/${comparison.slug}`, category: "comparison" as const, locale: "en" as const, priority: 0.78 })),
  ...blogFr.map((post) => ({ path: `/fr/blog/${post.slug}`, category: "blog" as const, locale: "fr" as const, priority: 0.72 })),
  ...blogUs.map((post) => ({ path: `/en/blog/${post.slug}`, category: "blog" as const, locale: "en" as const, priority: 0.72 })),
  ...blogUk.map((post) => ({ path: `/en/blog/${post.slug}`, category: "blog" as const, locale: "en" as const, priority: 0.72 })),
];

export function seoStats() {
  return seoEntries.reduce<Record<SeoCategory | "total", number>>(
    (acc, entry) => {
      acc.total += 1;
      acc[entry.category] += 1;
      return acc;
    },
    { total: 0, product: 0, freemium: 0, france: 0, usa: 0, uk: 0, switzerland: 0, guide: 0, blog: 0, comparison: 0 },
  );
}
