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
  ["application-rencontre-gratuite", "Application de rencontre gratuite", "Application de rencontre gratuite au lancement, immersive et authentique", "Cette page clarifie le lancement gratuit d'Embir tout en mettant l'accent sur les univers personnels, la compatibilite profonde et les profils verifies."],
  ["rencontre-paris", "Application de rencontre a Paris", "Rencontre a Paris : moins de swipe, plus de compatibilite reelle", "Paris concentre beaucoup de profils mais peu d'authenticite. Cette page met en avant la creation d'un univers personnel et la decouverte de profils vraiment compatibles."],
  ["rencontre-gay-paris", "Rencontre gay a Paris", "Rencontre gay a Paris : un espace personnel, inclusif et verifie", "Paris a deja beaucoup d'options LGBTQ, mais Embir propose de montrer son propre univers et ses vraies intentions plutot qu'une simple grille de photos de proximite."],
  ["alternative-tinder", "Alternative a Tinder", "L'alternative a Tinder pour sortir du swipe vide", "Cette page cible ceux qui sont fatigues de Tinder. L'angle : creer son univers personnel, declarer ses intentions claires, et matcher par compatibilite comportementale."],
  ["alternative-grindr", "Alternative a Grindr", "L'alternative a Grindr, plus humaine et immersive", "Cette page explique la difference entre Grindr et Embir : un espace ou l'on prend le temps de montrer son univers et de definir ses preferences, sans la brutalite du temps reel seul."],
  ["application-rencontre-sans-abonnement", "Application de rencontre sans abonnement", "Une application sans abonnement piege pour decouvrir des univers compatibles", "Cette page explique le modele ouvert d'Embir, permettant de creer son monde et de tester la plateforme gratuitement."],
  ["rencontre-lgbt", "Rencontre LGBT inclusive", "Rencontre LGBT : des univers personnels qui respectent chaque identite", "Un positionnement profond sur l'inclusion : chaque utilisateur definit son monde, ses pronoms, ses preferences, et voit uniquement des personnes compatibles."],
  ["profils-verifies", "Rencontre avec profils verifies", "Des profils verifies pour une communaute saine", "Cette page explique comment Embir construit la confiance des le depart avec des profils humains et certifies."],
  ["application-rencontre-freemium", "Application de rencontre freemium transparente"],
  ["application-rencontre-moderne", "Application de rencontre moderne"],
  ["application-rencontre-lgbtq", "Application de rencontre LGBTQ+"],
  ["application-rencontre-inclusive", "Application de rencontre inclusive"],
  [
    "application-rencontre-avec-profils-verifies",
    "Application de rencontre avec verification de profil",
    "Verification de profil : une plateforme sure pour de vraies rencontres",
    "Focus sur la securite et l'authenticite des univers personnels crees sur la plateforme.",
  ],
  ["application-rencontre-sans-pub-intrusive", "Application de rencontre sans publicite intrusive"],
  ["application-rencontre-par-orientation", "Application de rencontre par orientation"],
  ["application-rencontre-compatible", "Application de rencontre basee sur la compatibilite"],
  ["application-rencontre-avec-algorithme", "Matching par affinite"],
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
  description: `${topic} sur Embir. Decouvrez une application ou chaque profil est un univers personnel immersif. Compatibilite, preferences et profils verifies.`,
  angle: angle ?? `Explication de ${topic.toLowerCase()} via le prisme des univers personnels et de la compatibilite profonde.`,
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
  ["why-embir", "Why Embir", "Why Embir: Beyond the swipe", "This page explains why Embir exists: to move dating from superficial swipes to immersive personal universes built on real compatibility."],
  ["how-it-works", "How Embir works", "How it works: Build your universe", "This page details the onboarding process: setting up your world, defining deep preferences, and matching through behavioral compatibility."],
  ["security", "Dating safety", "Safety built into every universe", "Explains Embir's commitment to verified profiles, proactive moderation, and protecting user spaces."],
  ["privacy", "Privacy-first dating", "Privacy: Control who sees your world", "Focuses on how users can control their visibility based on orientation and preferences."],
  ["orientation-dating", "Dating by orientation", "Dating that respects every identity", "Highlights how Embir uses orientation and deep preferences to ensure you only meet people compatible with your world."],
  ["compatibility-dating", "Compatibility-first dating", "Deep compatibility over volume", "Explains the matching algorithm that prioritizes shared intent, lifestyle, and behavioral signals over endless swiping."],
].map(([slug, topic, h1, angle]) => ({
  slug,
  locale: "en" as const,
  type: slug.includes("security") || slug.includes("privacy") ? "security" as const : "product" as const,
  title: topic,
  h1: h1 ?? topic,
  topic,
  description: `${topic} with Embir. Step into a dating platform where every profile is an immersive personal universe. Deep compatibility, verified profiles, and safer discovery.`,
  angle: angle ?? `This page explains ${topic.toLowerCase()} through Embir's vision: personal universes, verified profiles, and deep compatibility instead of superficial swiping.`,
  priority: 0.86,
}));

export const rootSeoPages: RootSeoPage[] = [
  ...frProductPages,
  ...frFreemiumPages,
  ...enProductPages,
  ...enFreemiumPages,
];
