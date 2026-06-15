const comparisons = [
  ["grindr-vs-embir", "Grindr"],
  ["tinder-vs-embir", "Tinder"],
  ["hinge-vs-embir", "Hinge"],
  ["bumble-vs-embir", "Bumble"],
  ["happn-vs-embir", "Happn"],
  ["badoo-vs-embir", "Badoo"],
  ["okcupid-vs-embir", "OkCupid"],
  ["feeld-vs-embir", "Feeld"],
  ["scruff-vs-embir", "Scruff"],
  ["romeo-vs-embir", "Romeo"],
  ["her-vs-embir", "HER"],
  ["lex-vs-embir", "Lex"],
  ["taimi-vs-embir", "Taimi"],
  ["zoe-vs-embir", "Zoe"],
  ["coffee-meets-bagel-vs-embir", "Coffee Meets Bagel"],
  ["once-vs-embir", "Once"],
  ["best-grindr-alternatives", "Best Grindr alternatives"],
  ["best-tinder-alternatives", "Best Tinder alternatives"],
  ["free-vs-paid-dating-apps", "Free vs paid dating apps"],
  ["best-lgbtq-dating-apps", "Best LGBTQ dating apps"],
] as const;

export const comparisonsEn = comparisons.map(([slug, app]) => ({
  slug,
  locale: "en" as const,
  app,
  title: `${app} vs Embir: dating app comparison`,
}));
