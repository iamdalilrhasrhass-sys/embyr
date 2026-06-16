import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
Zurich|Zurich
Geneva|Geneve
Lausanne|Lausanne
Basel|Bale
Bern|Berne
Lugano|Lugano
`);

export const swissCities = uniqueBySlug(
  names.map((line) => {
    const [name, frName] = line.split("|");
    return {
      name,
      frName,
      slug: slugify(name),
      frSlug: slugify(frName),
      market: "switzerland" as const,
    };
  }),
);
