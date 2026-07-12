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
      "Embir's core connection features are free in France and built for every orientation, with preferences, compatibility, safety and a future transparent freemium model.",
  },
  usa: {
    label: "United States",
    path: "us",
    language: "en",
    country: "United States",
    currency: "USD",
    headline: "Dating in the US — core connections without a credit card",
    intro:
      "Embir helps people in the United States meet through orientation, preferences, compatibility, verified profiles and a founding community before the mobile app rollout.",
  },
  uk: {
    label: "United Kingdom",
    path: "uk",
    language: "en",
    country: "United Kingdom",
    currency: "GBP",
    headline: "Dating in the UK — core connections without a credit card",
    intro:
      "Embir is built for UK dating with reciprocal preferences, compatibility-led discovery, clear intent and core connections without a credit card.",
  },
  switzerland: {
    label: "Switzerland",
    path: "switzerland",
    language: "en",
    country: "Switzerland",
    currency: "CHF",
    headline: "Dating in Switzerland — core connections without a credit card",
    intro:
      "Embir is built for Swiss dating across Zurich, Geneva, Lausanne, Basel and Bern, with verified profiles, multilingual expectations, compatibility and a transparent optional-services model.",
  },
} as const;
