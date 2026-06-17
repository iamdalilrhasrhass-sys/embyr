export type MarketCode = "france" | "usa" | "uk" | "switzerland";

export const markets = {
  france: {
    label: "France",
    path: "france",
    language: "fr",
    country: "France",
    currency: "EUR",
    headline: "Dating in France with verified profiles and real compatibility",
    intro:
      "Embir is free at launch in France and built for every orientation, with preferences, compatibility, safety and a future transparent freemium model.",
  },
  usa: {
    label: "United States",
    path: "us",
    language: "en",
    country: "United States",
    currency: "USD",
    headline: "Free dating app in the US — New York, Los Angeles & Miami",
    intro:
      "Embir helps people in the United States meet through orientation, preferences, compatibility, verified profiles and a founding community before the mobile app rollout.",
  },
  uk: {
    label: "United Kingdom",
    path: "uk",
    language: "en",
    country: "United Kingdom",
    currency: "GBP",
    headline: "Free dating app for the UK — London, Manchester & Birmingham",
    intro:
      "Embir is built for UK dating with verified profiles, compatibility-led discovery, clear intent and a fair freemium model coming after launch.",
  },
  switzerland: {
    label: "Switzerland",
    path: "switzerland",
    language: "en",
    country: "Switzerland",
    currency: "CHF",
    headline: "Free dating app for Switzerland — Geneva, Lausanne & Zurich",
    intro:
      "Embir is built for Swiss dating across Zurich, Geneva, Lausanne, Basel and Bern, with verified profiles, multilingual expectations, compatibility and a transparent future freemium model.",
  },
} as const;
