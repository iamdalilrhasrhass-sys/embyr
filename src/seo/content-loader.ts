import type {
  ComparisonContent,
  CityContent,
  GuideContent,
} from "./content-types";

const contentCache = new Map<string, ComparisonContent | CityContent | GuideContent>();

async function loadContent<T>(path: string): Promise<T | null> {
  try {
    // Dynamic import from JSON files — works at build time and runtime
    const mod = await import(`@/seo/content/${path}`);
    return mod.default as T;
  } catch {
    console.warn(`[content-loader] Could not load: ${path}`);
    return null;
  }
}

export async function getComparisonContent(
  app: string,
  locale: "en" | "fr"
): Promise<ComparisonContent | null> {
  const cacheKey = `comparison:${app}:${locale}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey) as ComparisonContent;
  }
  const content = await loadContent<ComparisonContent>(
    `comparisons/${locale}/${app}.json`
  );
  if (content) contentCache.set(cacheKey, content);
  return content;
}

export async function getCityContent(
  slug: string,
  locale: "en" | "fr"
): Promise<CityContent | null> {
  const cacheKey = `city:${slug}:${locale}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey) as CityContent;
  }
  const content = await loadContent<CityContent>(`cities/${locale}/${slug}.json`);
  if (content) contentCache.set(cacheKey, content);
  return content;
}

export async function getGuideContent(
  slug: string,
  locale: "en" | "fr"
): Promise<GuideContent | null> {
  const cacheKey = `guide:${slug}:${locale}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey) as GuideContent;
  }
  const content = await loadContent<GuideContent>(`guides/${locale}/${slug}.json`);
  if (content) contentCache.set(cacheKey, content);
  return content;
}

// Map comparison slugs to content file keys
export const COMPARISON_CONTENT_MAP: Record<string, string> = {
  "tinder-alternative": "tinder",
  "alternative-tinder": "tinder",
  "grindr-alternative": "grindr",
  "alternative-grindr": "grindr",
  "bumble-alternative": "bumble",
  "alternative-bumble": "bumble",
  "hinge-alternative": "hinge",
  "alternative-hinge": "hinge",
  "meetic-vs-embir": "meetic",
  "alternative-meetic": "meetic",
  "adopt-vs-embir": "adopte",
  "alternative-adopte": "adopte",
};
