import { slugify } from "./utils";

const topics = [
  "free at launch dating app",
  "future freemium dating model",
  "transparent freemium dating platform",
  "free messaging during launch",
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
