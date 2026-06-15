import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
Zurich|Zurich
Geneva|Geneve
Lausanne|Lausanne
Basel|Bale
Bern|Berne
Lucerne|Lucerne
Winterthur|Winterthur
St Gallen|Saint-Gall
Lugano|Lugano
Fribourg|Fribourg
Neuchatel|Neuchatel
Sion|Sion
Montreux|Montreux
Vevey|Vevey
Nyon|Nyon
Yverdon-les-Bains|Yverdon-les-Bains
Biel|Bienne
Thun|Thoune
Chur|Coire
Zug|Zoug
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
