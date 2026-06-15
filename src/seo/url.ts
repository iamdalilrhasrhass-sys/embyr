const baseUrl = "https://embir.xyz";

export type HreflangGroup = {
  fr?: string;
  us?: string;
  uk?: string;
  ch?: string;
  chFr?: string;
  defaultPath: string;
};

export function normalizePublicPath(path: string) {
  if (path === "/en") return "/";
  if (path.startsWith("/en/us")) return path.replace(/^\/en\/us/, "/us");
  if (path.startsWith("/en/uk")) return path.replace(/^\/en\/uk/, "/uk");
  if (path.startsWith("/en/blog")) return path.replace(/^\/en\/blog/, "/blog");
  if (path.startsWith("/en/")) return path.replace(/^\/en/, "");
  return path;
}

export function absoluteUrl(path: string) {
  const publicPath = normalizePublicPath(path);
  return `${baseUrl}${publicPath === "/" ? "" : publicPath}`;
}

const priorityGroups: HreflangGroup[] = [
  {
    fr: "/fr/application-rencontre-gratuite",
    us: "/us/free-dating-app",
    uk: "/uk/free-dating-app",
    defaultPath: "/us/free-dating-app",
  },
  {
    fr: "/fr/alternative-tinder",
    us: "/us/tinder-alternative",
    uk: "/uk/tinder-alternative",
    defaultPath: "/us/tinder-alternative",
  },
  {
    fr: "/fr/alternative-grindr",
    us: "/us/grindr-alternative",
    uk: "/uk/grindr-alternative",
    defaultPath: "/us/grindr-alternative",
  },
  {
    fr: "/fr/rencontre-lgbt",
    us: "/us/lgbtq-dating-app",
    uk: "/uk/lgbtq-dating-app",
    defaultPath: "/us/lgbtq-dating-app",
  },
  {
    fr: "/fr/profils-verifies",
    us: "/us/verified-dating-app",
    uk: "/uk/verified-dating-app",
    defaultPath: "/us/verified-dating-app",
  },
  {
    fr: "/fr/application-rencontre-sans-abonnement",
    us: "/us/free-dating-app-no-subscription",
    uk: "/uk/free-dating-app",
    defaultPath: "/us/free-dating-app-no-subscription",
  },
  {
    fr: "/fr/rencontre-paris",
    us: "/us/dating-app-new-york",
    uk: "/uk/dating-app-london",
    defaultPath: "/us/dating-app-new-york",
  },
  {
    fr: "/fr/rencontre-gay-paris",
    us: "/us/gay-dating-app-us",
    uk: "/uk/lgbtq-dating-uk",
    defaultPath: "/us/gay-dating-app-us",
  },
  {
    fr: "/fr/blog/comment-faire-un-bon-profil-sur-une-application-de-rencontre",
    us: "/blog/how-to-write-a-good-dating-profile",
    uk: "/blog/how-to-write-a-good-dating-profile",
    defaultPath: "/blog/how-to-write-a-good-dating-profile",
  },
  {
    fr: "/fr/blog/application-rencontre-gratuite-sans-abonnement",
    us: "/blog/free-dating-app-no-subscription",
    uk: "/blog/free-dating-app-no-subscription",
    defaultPath: "/blog/free-dating-app-no-subscription",
  },
  {
    fr: "/fr/blog/alternative-a-tinder-en-france",
    us: "/blog/grindr-alternative-for-real-connections",
    uk: "/blog/grindr-alternative-for-real-connections",
    defaultPath: "/blog/grindr-alternative-for-real-connections",
  },
  {
    ch: "/switzerland",
    chFr: "/fr/suisse",
    defaultPath: "/switzerland",
  },
  ...[
    ["zurich", "zurich"],
    ["geneva", "geneve"],
    ["lausanne", "lausanne"],
    ["basel", "bale"],
    ["bern", "berne"],
    ["lucerne", "lucerne"],
    ["winterthur", "winterthur"],
    ["st-gallen", "saint-gall"],
    ["lugano", "lugano"],
    ["fribourg", "fribourg"],
    ["neuchatel", "neuchatel"],
    ["sion", "sion"],
    ["montreux", "montreux"],
    ["vevey", "vevey"],
    ["nyon", "nyon"],
    ["yverdon-les-bains", "yverdon-les-bains"],
    ["biel", "bienne"],
    ["thun", "thoune"],
    ["chur", "coire"],
    ["zug", "zoug"],
  ].map(([slug, frSlug]) => ({
    ch: `/switzerland/${slug}`,
    chFr: `/fr/suisse/${frSlug}`,
    defaultPath: `/switzerland/${slug}`,
  })),
];

function samePath(a: string, b: string) {
  return normalizePublicPath(a) === normalizePublicPath(b);
}

export function getHreflangGroup(path: string): HreflangGroup | undefined {
  const publicPath = normalizePublicPath(path);
  return priorityGroups.find((group) =>
    [group.fr, group.us, group.uk, group.defaultPath].some((candidate) => candidate && samePath(candidate, publicPath)),
  );
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const group = getHreflangGroup(path);
  if (!group) {
    const publicPath = normalizePublicPath(path);
    if (publicPath.startsWith("/fr/")) {
      return {
        fr: absoluteUrl(publicPath),
        "x-default": absoluteUrl("/"),
      };
    }
    return {
      en: absoluteUrl(publicPath),
      "x-default": absoluteUrl(publicPath),
    };
  }

  return {
    ...(group.fr ? { fr: absoluteUrl(group.fr), "fr-FR": absoluteUrl(group.fr) } : {}),
    ...(group.us ? { "en-US": absoluteUrl(group.us) } : {}),
    ...(group.uk ? { "en-GB": absoluteUrl(group.uk) } : {}),
    ...(group.ch ? { "en-CH": absoluteUrl(group.ch) } : {}),
    ...(group.chFr ? { "fr-CH": absoluteUrl(group.chFr), fr: absoluteUrl(group.chFr) } : {}),
    en: absoluteUrl(group.defaultPath),
    "x-default": absoluteUrl(group.defaultPath),
  };
}

export function sitemapUrl(pathOrUrl: string) {
  if (!pathOrUrl.startsWith(baseUrl)) return absoluteUrl(pathOrUrl);
  const path = pathOrUrl.slice(baseUrl.length) || "/";
  return absoluteUrl(path);
}

export function uniqueUrls(urls: string[]) {
  return [...new Set(urls.map(sitemapUrl))];
}
