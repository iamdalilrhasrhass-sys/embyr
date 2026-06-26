import { SEO_CITIES, SEO_INTENTS, type CityData } from "./seo-cities.ts";

export const INDEXABLE_PROGRAMMATIC_CITIES = [
  "paris",
  "lyon",
  "marseille",
  "toulouse",
  "bordeaux",
  "lille",
  "nantes",
  "nice",
  "strasbourg",
  "montpellier",
  "rennes",
  "grenoble",
] as const;

export type IndexableProgrammaticCity = (typeof INDEXABLE_PROGRAMMATIC_CITIES)[number];

const indexableCitySet = new Set<string>(INDEXABLE_PROGRAMMATIC_CITIES);
const intentSet = new Set<string>(SEO_INTENTS.map((intent) => intent.slug));
const citySet = new Set<string>(SEO_CITIES.map((city) => city.slug));

export function isProgrammaticIndexable(locale: string, intentSlug: string, citySlug: string): boolean {
  return locale === "fr" && intentSet.has(intentSlug) && citySet.has(citySlug) && indexableCitySet.has(citySlug);
}

export function qualifiedProgrammaticCities(): CityData[] {
  return INDEXABLE_PROGRAMMATIC_CITIES.map((slug) => {
    const city = SEO_CITIES.find((candidate) => candidate.slug === slug);
    if (!city) {
      throw new Error(`Missing SEO city for qualified programmatic slug: ${slug}`);
    }
    return city;
  });
}

export function qualifiedProgrammaticParams(): { locale: "fr"; slug: string; city: string }[] {
  const cities = qualifiedProgrammaticCities();
  return SEO_INTENTS.flatMap((intent) =>
    cities.map((city) => ({
      locale: "fr" as const,
      slug: intent.slug,
      city: city.slug,
    })),
  );
}
