import { franceCities } from "./cities-fr";
import { productPages } from "./pages-product";
import { freemiumPages } from "./pages-freemium";

export const hreflangPairs = [
  { fr: "/fr/application-rencontre-gratuite", en: "/us/free-dating-app" },
  { fr: "/fr/alternative-tinder", en: "/us/tinder-alternative" },
  { fr: "/fr/alternative-grindr", en: "/us/grindr-alternative" },
  { fr: "/fr/rencontre-lgbt", en: "/us/lgbtq-dating-app" },
  { fr: "/fr/profils-verifies", en: "/us/verified-dating-app" },
  { fr: "/fr/application-rencontre-sans-abonnement", en: "/us/free-dating-app-no-subscription" },
  { fr: "/fr/rencontre-paris", en: "/us/dating-app-new-york" },
  { fr: "/fr/rencontre-gay-paris", en: "/us/gay-dating-app-us" },
  { fr: "/fr/blog/comment-faire-un-bon-profil-sur-une-application-de-rencontre", en: "/blog/how-to-write-a-good-dating-profile" },
  { fr: "/fr/blog/application-rencontre-gratuite-sans-abonnement", en: "/blog/free-dating-app-no-subscription" },
  { fr: "/fr/blog/alternative-a-tinder-en-france", en: "/blog/grindr-alternative-for-real-connections" },
  ...franceCities.slice(0, 80).map((city) => ({
    fr: `/fr/rencontre/${city.slug}`,
    en: `/en/france/${city.slug}`,
  })),
  ...productPages.map((page) => ({
    fr: `/fr/product/${page.slug}`,
    en: `/en/product/${page.slug}`,
  })),
  ...freemiumPages.map((page) => ({
    fr: `/fr/freemium/${page.slug}`,
    en: `/en/freemium/${page.slug}`,
  })),
];
