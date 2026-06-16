import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
London
Birmingham
Manchester
Leeds
Glasgow
Liverpool
Newcastle
Sheffield
Bristol
Edinburgh
`);

export const ukCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "uk" as const,
})));
