import { slugify } from "./utils";

const topics = [
  "free dating platform",
  "dating platform for everyone",
  "verified dating profiles",
  "compatibility dating app",
  "orientation based dating",
  "dating app for preferences",
  "safe dating app",
  "founding dating community",
  "mobile dating app coming",
  "dating app without swipe fatigue",
  "inclusive dating app",
  "dating app with clear intentions",
];

export const productPages = topics.map((topic) => ({
  slug: slugify(topic),
  title: topic.replace(/\b\w/g, (c) => c.toUpperCase()),
  topic,
}));
