import type { MarketCode } from "./markets";

export type MarketSeoPage = {
  market: Extract<MarketCode, "usa" | "uk">;
  slug: string;
  title: string;
  h1: string;
  topic: string;
  description: string;
  angle: string;
  content?: string;
  priority: number;
};

const topics = [
  ["free-dating-app", "Free dating app"],
  ["freemium-dating-app", "Freemium dating app"],
  ["serious-dating-app", "Serious dating app"],
  ["modern-dating-app", "Modern dating app"],
  ["lgbtq-dating-app", "LGBTQ dating app"],
  ["gay-dating-app", "Gay dating app"],
  ["inclusive-dating-app", "Inclusive dating app"],
  ["verified-dating-app", "Verified dating app"],
  ["dating-app-without-subscription", "Dating app without subscription"],
  ["dating-app-by-orientation", "Dating app by orientation"],
  ["why-embir", "Why Embir"],
  ["free for core connections", "core connection features are free"],
  ["freemium-model", "Freemium model"],
  ["founding-community", "Founding community"],
  ["tinder-alternative", "Tinder alternative"],
  ["grindr-alternative", "Grindr alternative"],
  ["best-free-dating-app", "Best free dating app"],
  ["free-dating-app-no-subscription", "Free dating app without subscription"],
  ["gay-dating-app-us", "Gay dating app for real compatibility"],
  ["lgbtq-dating-uk", "LGBTQ dating app for the UK"],
] as const;

function buildMarketPages(market: Extract<MarketCode, "usa" | "uk">, country: string, shortName: string) {
  return topics.map(([slug, topic]) => ({
    market,
    slug,
    title: `${topic} in the ${shortName}`,
    h1: `${topic} for the ${country}`,
    topic,
    description: `${topic} in the ${country}: Embir's core connection features are free, built for verified profiles, every orientation, compatibility, safety and a transparent optional-services model.`,
    content: slug === "best-free-dating-app" ? `Everything needed to meet someone on Embir is free without a credit card: profile, compatible discovery, reciprocity, messaging and safety tools.` : undefined,
    angle:
      slug.includes("tinder")
        ? "Less empty swiping, more intent. This page exists for people comparing Tinder-like discovery with a platform that gives preferences, compatibility and profile trust more weight."
        : slug.includes("grindr")
          ? "Less instant-only pressure, more safety and compatibility. This page exists for people who want an alternative to distance-first apps without losing LGBTQ visibility."
          : slug.includes("no-subscription")
            ? "Everything needed to meet someone is free. No credit card required. Optional services are clearly separated from the path to a meeting."
            : slug.includes("verified")
              ? "Trust and profile quality are the core angle: selfie verification, reporting, moderation and clearer expectations before people meet."
              : slug.includes("lgbtq") || slug.includes("gay")
                ? "The page focuses on LGBTQ discovery with compatibility and safety, not a one-note hookup promise."
                : "The page explains the market launch, founding community and why Embir is building density city by city before scaling the mobile app.",
    priority: slug === "free-dating-app" || slug === "why-embir" ? 0.92 : 0.86,
  }));
}

export const marketSeoPages: MarketSeoPage[] = [
  ...buildMarketPages("usa", "United States", "US"),
  ...buildMarketPages("uk", "United Kingdom", "UK"),
  {
    market: "usa",
    slug: "dating-app-new-york",
    title: "Dating app in New York",
    h1: "Dating in New York with verified profiles and real intent",
    topic: "New York dating app",
    description: "Embir's core connection features are free in New York, built for a dense city where trust, intent, orientation, preferences and compatibility matter more than another endless swipe queue.",
    angle: "New York needs density and speed, but not another profile carousel. This page focuses on verified local members, borough-level intent, founder community quality and compatibility before distance.",
    priority: 0.9,
  },
  {
    market: "usa",
    slug: "dating-app-los-angeles",
    title: "Dating app in Los Angeles",
    h1: "Dating in Los Angeles without the empty swipe loop",
    topic: "Los Angeles dating app",
    description: "Embir's core connection features are free in Los Angeles, with verified profiles, orientation-aware preferences, safety tools and compatibility signals for a spread-out dating market.",
    angle: "Los Angeles dating is fragmented by distance, lifestyle and intent. This page explains how Embir uses preferences and verified profiles to make discovery less random across a large city.",
    priority: 0.9,
  },
  {
    market: "uk",
    slug: "dating-app-london",
    title: "Dating app in London",
    h1: "Dating in London with compatibility before noise",
    topic: "London dating app",
    description: "Embir's core connection features are free in London, built for verified profiles, inclusive discovery, clearer preferences and a founding community across a dense UK dating market.",
    angle: "London has volume, but volume alone creates fatigue. This page focuses on verified profiles, orientation-aware discovery and matching across neighborhoods without turning dating into a noisy feed.",
    priority: 0.9,
  },
];
