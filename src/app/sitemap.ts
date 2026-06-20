import type { MetadataRoute } from "next";
import { seoEntries } from "@/seo/sitemap-data";
import { hreflangPairs } from "@/seo/hreflang";
import { absoluteUrl, buildLanguageAlternates, sitemapUrl } from "@/seo/url";

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

  // Universe of the Day — daily fresh content, indexable
  routes.push(entry(`${baseUrl}/universe-of-the-day`, "daily", 0.8));

  for (const item of seoEntries) {
    routes.push(entry(`${baseUrl}${item.path}`, "weekly", item.priority));
  }

  return [...new Map(routes.map((route) => [route.url, route])).values()];
}
