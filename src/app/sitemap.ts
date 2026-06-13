import type { MetadataRoute } from "next";

const baseUrl = "https://embir.xyz";
const locales = ["en", "fr", "es", "de", "pt", "it", "nl", "ru", "zh", "ja", "ko", "ar", "hi", "tr", "pl", "sv", "da", "fi", "no", "th", "vi", "id", "ms", "ro", "uk"];

// Blog articles updated with EN slugs
const blogSlugs = [
  "10-gay-dating-commandments", "free-grindr-alternatives-2026", "ad-free-gay-dating-apps",
  "coming-out-dating-advice", "late-coming-out-stories", "how-to-flirt-with-guys",
  "how-to-tell-if-guy-is-gay", "create-gay-dating-profile", "flirting-on-dating-apps",
  "being-gay-and-lonely", "pride-month-history", "best-free-gay-dating-apps-2026",
  "best-gay-neighborhoods-france", "first-gay-date-tips", "successful-first-gay-date",
  "serious-relationship-vs-hookup", "gay-dating-safety", "gay-dating-safety-rules",
  // Phase 3 articles
  "dating-tips/authentic-gay-dating-profile-2026", "safety/online-dating-safety-guide",
  "dating-tips/first-date-ideas-gay-men", "dating-tips/long-distance-gay-relationships",
  "culture/coming-out-at-your-own-pace", "dating-tips/psychology-of-attraction-gay-men",
  "culture/gay-dating-trends-2026", "safety/spot-catfish-scammers-dating-apps",
  "dating-tips/building-confidence-shy-gay-men", "city-guides/best-lgbtq-friendly-cities-europe",
  "culture/hookup-culture-vs-meaningful-connections", "dating-tips/difficult-conversations-gay-relationships",
];

const cities = ["paris", "lyon", "marseille", "lille", "bordeaux", "toulouse", "nantes", "strasbourg", "montpellier", "nice", "london", "berlin", "new-york", "madrid", "barcelona", "amsterdam", "brussels", "tokyo", "sao-paulo", "bangkok"];

const mainPages = ["membres", "inviter", "premium", "about", "legal", "test-gay", "grindr-vs-alternatives", "grindr-cost-calculator"];

function entry(url: string, priority = 0.8, changeFreq: "daily" | "weekly" | "monthly" | "yearly" = "weekly"): MetadataRoute.Sitemap[number] {
  return { url, lastModified: new Date(), changeFrequency: changeFreq, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Root homepage
  routes.push(entry(baseUrl, 1.0, "daily"));

  // Locale homepages
  for (const loc of locales) {
    routes.push(entry(`${baseUrl}/${loc}`, 1.0, "daily"));
  }

  // Blog index
  routes.push(entry(`${baseUrl}/blog`, 0.9, "weekly"));
  for (const loc of locales.slice(0, 5)) {
    routes.push(entry(`${baseUrl}/${loc}/blog`, 0.9, "weekly"));
  }

  // Blog articles
  for (const slug of blogSlugs) {
    routes.push(entry(`${baseUrl}/blog/${slug}`, 0.7, "monthly"));
    for (const loc of locales.slice(0, 5)) {
      routes.push(entry(`${baseUrl}/${loc}/blog/${slug}`, 0.7, "monthly"));
    }
  }

  // Main pages
  for (const page of mainPages) {
    routes.push(entry(`${baseUrl}/${page}`, 0.8, "weekly"));
    for (const loc of locales.slice(0, 5)) {
      routes.push(entry(`${baseUrl}/${loc}/${page}`, 0.8, "weekly"));
    }
  }

  // City pages
  for (const city of cities) {
    routes.push(entry(`${baseUrl}/rencontre-gay/${city}`, 0.6, "monthly"));
    for (const loc of locales.slice(0, 10)) {
      routes.push(entry(`${baseUrl}/${loc}/rencontre-gay/${city}`, 0.6, "monthly"));
    }
  }

  // Legal pages
  const legalPages = ["cgu", "confidentialite", "18-plus", "mentions-legales", "moderation", "paiements", "securite", "cookies"];
  for (const lp of legalPages) {
    routes.push(entry(`${baseUrl}/legal/${lp}`, 0.5, "yearly"));
  }

  return routes;
}
