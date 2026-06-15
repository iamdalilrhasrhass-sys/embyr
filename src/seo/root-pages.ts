import type { Locale } from "./utils";

export type RootSeoPage = {
  slug: string;
  locale: Locale;
  type: "product" | "freemium" | "security" | "orientation" | "community";
  title: string;
  h1: string;
  topic: string;
  description: string;
  angle: string;
  priority: number;
};

const frProductPages = [
  ["application-rencontre-gratuite", "Application de rencontre gratuite", "Application de rencontre gratuite au lancement, sans piege", "Cette page clarifie la promesse gratuite d'Embir : acces ouvert pendant le lancement, communaute fondatrice, profils verifies, compatibilite et futur freemium explique sans fausse gratuité."],
  ["rencontre-paris", "Application de rencontre a Paris", "Rencontre a Paris avec une communaute fondatrice verifiee", "Paris concentre beaucoup de profils mais peu de confiance. Cette page existe pour expliquer le lancement local, la densite initiale, les premiers membres et la difference entre une vraie communaute et une simple liste de profils."],
  ["rencontre-gay-paris", "Rencontre gay a Paris", "Rencontre gay a Paris avec plus de verification et de compatibilite", "Paris a deja beaucoup d'options LGBTQ, mais Embir se positionne sur la confiance, la moderation, les profils verifies et des intentions plus claires que la recherche instantanee seule."],
  ["alternative-tinder", "Alternative a Tinder", "Une alternative a Tinder pour sortir du swipe vide", "Cette page s'adresse aux personnes qui veulent moins de swipe reflexe, plus d'intention, de preferences et de compatibilite avant de lancer une conversation."],
  ["alternative-grindr", "Alternative a Grindr", "Une alternative a Grindr plus ouverte, plus sure et moins instantanee", "Cette page explique la difference entre une app centree sur la proximite immediate et une plateforme de rencontre plus large, avec profils verifies, preferences, LGBTQ et compatibilite."],
  ["application-rencontre-sans-abonnement", "Application de rencontre sans abonnement", "Une application de rencontre gratuite au lancement, sans abonnement piege", "Cette page clarifie le modele : gratuit au lancement, futur freemium transparent, pas de paiement cache pour comprendre si Embir correspond a l'utilisateur."],
  ["rencontre-lgbt", "Rencontre LGBT inclusive", "Rencontre LGBT avec profils verifies, preferences et respect", "Cette page existe pour les recherches LGBT et LGBTQ en France, avec un angle inclusif : orientations, identites, securite, moderation et compatibilite."],
  ["profils-verifies", "Application de rencontre avec profils verifies", "Des profils verifies pour reduire les faux comptes", "Cette page cible la confiance : verification, signalement, moderation, confidentialite et qualite des profils avant la croissance brute."],
  ["application-rencontre-freemium", "Application de rencontre freemium transparente"],
  ["application-rencontre-moderne", "Application de rencontre moderne"],
  ["application-rencontre-lgbtq", "Application de rencontre LGBTQ+"],
  ["application-rencontre-inclusive", "Application de rencontre inclusive"],
  [
    "application-rencontre-avec-profils-verifies",
    "Application de rencontre avec verification de profil",
    "Une application de rencontre avec verification de profil progressive",
    "Cette page se concentre sur le parcours produit de verification : signaux de confiance, moderation, signalement, protection des membres et difference entre un badge utile et une promesse vide.",
  ],
  ["application-rencontre-sans-pub-intrusive", "Application de rencontre sans publicite intrusive"],
  ["application-rencontre-par-orientation", "Application de rencontre par orientation"],
  ["application-rencontre-compatible", "Application de rencontre compatible"],
  ["application-rencontre-avec-algorithme", "Application de rencontre avec algorithme"],
  ["pourquoi-embir", "Pourquoi Embir"],
  ["comment-ca-marche", "Comment ca marche"],
  ["securite", "Securite sur Embir"],
  ["confidentialite", "Confidentialite sur Embir"],
].map(([slug, topic, h1, angle]) => ({
  slug,
  locale: "fr" as const,
  type: slug.includes("securite") || slug.includes("confidentialite") ? "security" as const : "product" as const,
  title: topic,
  h1: h1 ?? `${topic} avec Embir`,
  topic,
  description: `${topic} avec Embir : lancement gratuit, profils verifies, preferences, compatibilite, securite et contenu dedie pour comprendre cette page.`,
  angle: angle ?? `Cette page existe pour expliquer ${topic.toLowerCase()} sans contenu generique : lancement gratuit, profils verifies, preferences, compatibilite, securite et future app mobile.`,
  priority: 0.9,
}));

const frFreemiumPages = [
  ["gratuit-au-lancement", "Gratuit au lancement"],
  ["modele-freemium", "Modele freemium transparent"],
  ["pourquoi-embir-est-gratuit", "Pourquoi Embir est gratuit"],
  ["pourquoi-embir-deviendra-freemium", "Pourquoi Embir deviendra freemium"],
  ["fonctionnalites-premium", "Fonctionnalites premium futures"],
  ["communaute-fondatrice", "Communaute fondatrice"],
  ["application-mobile-a-venir", "Application mobile a venir"],
].map(([slug, topic]) => ({
  slug,
  locale: "fr" as const,
  type: "freemium" as const,
  title: topic,
  h1: topic,
  topic,
  description: `${topic} sur Embir : gratuit au lancement, futur freemium transparent, moderation, securite, profils verifies et financement clair de l'application mobile.`,
  angle: `Cette page detaille le modele ${topic.toLowerCase()} avec une promesse claire : gratuit au lancement, freemium futur transparent, aucun piege d'abonnement dans la phase fondatrice.`,
  priority: 0.88,
}));

const enFreemiumPages = [
  ["freemium-model", "Freemium model"],
  ["free-at-launch", "Free at launch"],
  ["why-embir-is-free", "Why Embir is free"],
  ["why-embir-will-become-freemium", "Why Embir will become freemium"],
  ["premium-features", "Future premium features"],
  ["founding-community", "Founding community"],
  ["mobile-app-coming", "Mobile app coming"],
].map(([slug, topic]) => ({
  slug,
  locale: "en" as const,
  type: "freemium" as const,
  title: topic,
  h1: topic,
  topic,
  description: `${topic} on Embir: free at launch, transparent future freemium, moderation, safety, verified profiles and mobile app funding explained clearly.`,
  angle: `This page explains ${topic.toLowerCase()} with a clear launch promise: free core access now, transparent optional premium later, and no early subscription trap.`,
  priority: 0.88,
}));

const enProductPages = [
  ["why-embir", "Why Embir"],
  ["how-it-works", "How Embir works"],
  ["security", "Dating safety"],
  ["privacy", "Privacy-first dating"],
  ["orientation-dating", "Dating by orientation"],
  ["compatibility-dating", "Compatibility-first dating"],
].map(([slug, topic]) => ({
  slug,
  locale: "en" as const,
  type: slug.includes("security") || slug.includes("privacy") ? "security" as const : "product" as const,
  title: topic,
  h1: topic,
  topic,
  description: `${topic} with Embir: a free-at-launch dating platform for every orientation, built around preferences, compatibility, verified profiles and safety.`,
  angle: `This page explains ${topic.toLowerCase()} through Embir's product choices: verified profiles, compatibility, preferences, safety and a founding community before mobile scale.`,
  priority: 0.86,
}));

export const rootSeoPages: RootSeoPage[] = [
  ...frProductPages,
  ...frFreemiumPages,
  ...enProductPages,
  ...enFreemiumPages,
];
