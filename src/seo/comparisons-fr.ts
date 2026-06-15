const comparisons = [
  ["grindr-vs-embir", "Grindr"],
  ["tinder-vs-embir", "Tinder"],
  ["hinge-vs-embir", "Hinge"],
  ["bumble-vs-embir", "Bumble"],
  ["happn-vs-embir", "Happn"],
  ["fruitz-vs-embir", "Fruitz"],
  ["meetic-vs-embir", "Meetic"],
  ["badoo-vs-embir", "Badoo"],
  ["okcupid-vs-embir", "OkCupid"],
  ["feeld-vs-embir", "Feeld"],
  ["romeo-vs-embir", "Romeo"],
  ["scruff-vs-embir", "Scruff"],
  ["hornet-vs-embir", "Hornet"],
  ["her-vs-embir", "HER"],
  ["lex-vs-embir", "Lex"],
  ["taimi-vs-embir", "Taimi"],
  ["zoe-vs-embir", "Zoe"],
  ["coffee-meets-bagel-vs-embir", "Coffee Meets Bagel"],
  ["once-vs-embir", "Once"],
  ["meilleures-apps-rencontre", "Meilleures apps rencontre"],
] as const;

export const comparisonsFr = comparisons.map(([slug, app]) => ({
  slug,
  locale: "fr" as const,
  app,
  title: `${app} vs Embir : comparatif rencontre`,
}));
