import { slugify } from "./utils";

const topics = [
  "dating app with free core connections",
  "transparent optional services dating model",
  "transparent freemium dating platform",
  "messaging for reciprocal connections is free",
  "founder access dating app",
  "freemium model for safety",
  "freemium model for moderation",
  "freemium model for mobile app",
  "dating app without early paywalls",
  "fair dating app pricing",
];

export const freemiumPages = topics.map((topic) => ({
  slug: slugify(topic),
  title: topic.replace(/\b\w/g, (c) => c.toUpperCase()),
  topic,
}));
