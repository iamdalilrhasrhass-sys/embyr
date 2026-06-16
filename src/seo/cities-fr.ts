import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
Paris
Marseille
Lyon
Toulouse
Nice
Nantes
Montpellier
Strasbourg
Bordeaux
Lille
`);

export const franceCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "france" as const,
})));
