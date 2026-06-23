import type { MetadataRoute } from "next";
import { seoEntries } from "@/seo/sitemap-data";
import { hreflangPairs } from "@/seo/hreflang";
import { absoluteUrl, buildLanguageAlternates, sitemapUrl } from "@/seo/url";
import { SEO_CITIES, SEO_INTENTS } from "@/seo/seo-cities";

const baseUrl = "https://embir.xyz";

type SitemapFrequency = NonNullable<MetadataRoute.Sitemap[0]["changeFrequency"]>;

function entry(loc: string, freq: SitemapFrequency, priority: number): MetadataRoute.Sitemap[0] {
  const url = sitemapUrl(loc);
  const pair = hreflangPairs.find((item) => absoluteUrl(item.fr) === url || absoluteUrl(item.en) === url);
  const path = url.slice(baseUrl.length) || "/";
  return {
    url,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
    alternates: pair
      ? {
          languages: {
            "fr-FR": absoluteUrl(pair.fr),
            "en-US": absoluteUrl(pair.en),
            "en-GB": absoluteUrl(pair.en),
            fr: absoluteUrl(pair.fr),
            en: absoluteUrl(pair.en),
            "x-default": absoluteUrl(pair.en),
          },
        }
      : { languages: buildLanguageAlternates(path) },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Homepage
  routes.push(entry(baseUrl, "daily", 1.0));

  // Universe of the Day
  routes.push(entry(`${baseUrl}/universe-of-the-day`, "daily", 0.8));

  // Existing SEO entries
  for (const item of seoEntries) {
    routes.push(entry(`${baseUrl}${item.path}`, "weekly", item.priority));
  }

  // ── Programmatic city × intent pages (504 pages) ──
  for (const intent of SEO_INTENTS) {
    // Hub pages (already exist but ensure in sitemap)
    routes.push(entry(`${baseUrl}/${intent.slug}`, "weekly", 0.9));
    routes.push(entry(`${baseUrl}/fr/${intent.slug}`, "weekly", 0.9));

    for (const city of SEO_CITIES) {
      // EN version
      routes.push(entry(
        `${baseUrl}/rencontre/${intent.slug}/${city.slug}`,
        "weekly",
        0.7
      ));
      // FR version
      routes.push(entry(
        `${baseUrl}/fr/rencontre/${intent.slug}/${city.slug}`,
        "weekly",
        0.7
      ));
    }
  }

  // Deduplicate by URL
  return [...new Map(routes.map((route) => [route.url, route])).values()];
}
