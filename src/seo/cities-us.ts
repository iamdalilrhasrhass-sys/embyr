import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
New York
Los Angeles
Chicago
Houston
Phoenix
Philadelphia
San Antonio
San Diego
Dallas
San Jose
Austin
San Francisco
Seattle
Denver
Washington DC
Boston
Miami
Atlanta
`);

export const usaCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "usa" as const,
})));
