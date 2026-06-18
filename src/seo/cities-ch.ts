import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
Zurich|Zurich
Geneva|Geneve
Lausanne|Lausanne
Basel|Bale
Bern|Berne
Lugano|Lugano
Winterthur|Winterthour
Lucerne|Lucerne
St. Gallen|Saint-Gall
Biel|Bienne
Thun|Thoune
Schaffhausen|Schaffhouse
Fribourg|Fribourg
Neuchatel|Neuchatel
Chur|Coire
Sion|Sion
Zug|Zoug
Solothurn|Soleure
Aarau|Aarau
Baden|Baden
Brugg|Brugg
Olten|Olten
Solothurn|Soleure
Schwyz|Schwyz
Altdorf|Altdorf
Stans|Stans
Sarnen|Sarnen
Glarus|Glaris
Appenzell|Appenzell
Herisau|Herisau
Frauenfeld|Frauenfeld
Wil|Wil
Rapperswil|Rapperswil
Uster|Uster
Dietikon|Dietikon
Wadenswil|Wadenswil
Horgen|Horgen
Meilen|Meilen
Kusnacht|Kusnacht
Zollikon|Zollikon
Kilchberg|Kilchberg
Ruschlikon|Ruschlikon
Thalwil|Thalwil
Langnau|Langnau
Adliswil|Adliswil
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
