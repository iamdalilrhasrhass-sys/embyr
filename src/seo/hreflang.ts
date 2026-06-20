import { franceCities } from "./cities-fr";
import { productPages } from "./pages-product";
import { freemiumPages } from "./pages-freemium";

export const hreflangPairs = [
  // Core product pages — FR ↔ EN equivalents
  { fr: "/fr/application-rencontre-gratuite", en: "/free-dating-app" },
  { fr: "/fr/alternative-tinder", en: "/tinder-alternative" },
  { fr: "/fr/alternative-grindr", en: "/grindr-alternative" },
  { fr: "/fr/rencontre-lgbt", en: "/lgbtq-dating-app" },
  { fr: "/fr/profils-verifies", en: "/verified-dating-app" },
  { fr: "/fr/application-rencontre-sans-abonnement", en: "/free-dating-app" },
  { fr: "/fr/modele-freemium", en: "/freemium" },
  { fr: "/fr/securite", en: "/safety" },
  { fr: "/fr/moderation", en: "/moderation" },
  { fr: "/fr/age-verification", en: "/age-verification" },
  { fr: "/fr/terms", en: "/terms" },
  { fr: "/fr/confidentialite", en: "/privacy" },
  { fr: "/fr/about", en: "/about" },
  { fr: "/fr/support", en: "/support" },
  { fr: "/fr/site-rencontre-gay", en: "/site-rencontre-gay" },
  { fr: "/fr/rencontre-serieuse", en: "/serious-dating-app" },
  // Market pages
  { fr: "/fr/suisse", en: "/switzerland" },
  { fr: "/fr/etats-unis", en: "/us" },
  { fr: "/fr/royaume-uni", en: "/uk" },
  // Blog cross-references
  { fr: "/fr/blog/comment-faire-un-bon-profil-sur-une-application-de-rencontre", en: "/blog/how-to-write-a-good-dating-profile" },
  { fr: "/fr/blog/application-rencontre-gratuite-sans-abonnement", en: "/blog/free-dating-app-no-subscription" },
  { fr: "/fr/blog/alternative-a-tinder-en-france", en: "/blog/grindr-alternative-for-real-connections" },
  // City pages — FR France cities ↔ EN France cities
  ...franceCities.slice(0, 80).map((city) => ({
    fr: `/fr/rencontre/${city.slug}`,
    en: `/en/france/${city.slug}`,
  })),
  // Product pages (generic)
  ...productPages.map((page) => ({
    fr: `/fr/product/${page.slug}`,
    en: `/en/product/${page.slug}`,
  })),
  // Freemium pages (generic)
  ...freemiumPages.map((page) => ({
    fr: `/fr/freemium/${page.slug}`,
    en: `/en/freemium/${page.slug}`,
  })),
];
