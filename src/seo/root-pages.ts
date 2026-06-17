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
  content?: string;
  priority: number;
};

const frProductPages = [
  ["application-rencontre-gratuite", "Application de rencontre gratuite", "Application de rencontre gratuite au lancement, immersive et authentique", "Cette page clarifie le lancement gratuit d'Embir tout en mettant l'accent sur les univers personnels, la compatibilite profonde et les profils verifies.", "Ici, nous explorons pourquoi la gratuité au lancement est fondamentale pour Embir. Contrairement aux applications qui restreignent les messages ou les matchs dès les premières minutes, Embir permet de créer son univers personnel sans barrière financière. L'authenticité ne devrait pas être un luxe. En rejoignant notre communauté fondatrice, vous participez à la construction d'un espace où la sécurité, la vérification par selfie et la compatibilité réelle passent avant le profit immédiat. Notre modèle freemium futur sera transparent et servira à financer l'infrastructure mobile et la modération humaine nécessaire pour garder l'espace sain."],
  ["rencontre-paris", "Application de rencontre a Paris", "Rencontre a Paris : moins de swipe, plus de compatibilite reelle", "Paris concentre beaucoup de profils mais peu d'authenticite. Cette page met en avant la creation d'un univers personnel et la decouverte de profils vraiment compatibles.", "À Paris, la densité de profils sur les applications classiques crée souvent une 'fatigue du swipe'. Embir propose une alternative : ralentir pour mieux se rencontrer. En mettant en avant votre univers personnel, vous attirez des personnes qui partagent vos centres d'intérêt, votre style de vie et vos intentions. Que vous soyez dans le Marais, à Montmartre ou sur les quais de Seine, l'objectif est de trouver une connexion qui dépasse la simple proximité géographique. Nos profils vérifiés vous assurent de parler à de vraies personnes, limitant ainsi les déceptions trop fréquentes dans la capitale."],
  ["rencontre-gay-paris", "Rencontre gay a Paris", "Rencontre gay a Paris : un espace personnel, inclusif et verifie", "Paris a deja beaucoup d'options LGBTQ, mais Embir propose de montrer son propre univers et ses vraies intentions plutot qu'une simple grille de photos de proximite.", "Le milieu gay parisien est dynamique mais peut parfois sembler superficiel sur les applications de grille habituelles. Embir offre un espace où l'identité, l'orientation et les préférences sont respectées et mises en avant. Créez un profil qui vous ressemble vraiment, partagez vos passions et trouvez des hommes qui cherchent la même chose que vous, qu'il s'agisse d'une relation sérieuse ou d'une rencontre spontanée mais respectueuse. La sécurité est notre priorité avec la vérification par selfie, garantissant une communauté saine pour tous les Parisiens."],
  ["alternative-tinder", "Alternative a Tinder", "L'alternative a Tinder pour sortir du swipe vide", "Cette page cible ceux qui sont fatigues de Tinder. L'angle : creer son univers personnel, declarer ses intentions claires, et matcher par compatibilite comportementale.", "Tinder a révolutionné la rencontre, mais a aussi instauré une culture de l'éphémère. Embir se positionne comme l'alternative pour ceux qui veulent plus. Ici, pas de swipe compulsif basé uniquement sur une photo. On prend le temps de parcourir l'univers de l'autre, de comprendre ses attentes et de voir si nos compatibilités s'alignent. C'est une approche plus humaine du dating numérique, où la qualité prime sur la quantité. Nos fonctionnalités gratuites au lancement vous permettent de tester cette différence sans engagement."],
  ["alternative-grindr", "Alternative a Grindr", "L'alternative a Grindr, plus humaine et immersive", "Cette page explique la difference entre Grindr et Embir : un espace ou l'on prend le temps de montrer son univers et de definir ses preferences, sans la brutalite du temps reel seul.", "Grindr est l'outil de la proximité immédiate, mais Embir veut être l'outil de la rencontre choisie. Si vous en avez assez de la brutalité des échanges ou du manque de substance des profils, Embir vous propose de construire un véritable univers personnel. Montrez qui vous êtes au-delà d'une photo de buste. Nos filtres de préférences et notre algorithme de compatibilité vous aident à trouver des hommes qui correspondent vraiment à votre style de vie et à vos envies, le tout dans un environnement sécurisé et vérifié."],
  ["application-rencontre-sans-abonnement", "Application de rencontre sans abonnement", "Une application sans abonnement piege pour decouvrir des univers compatibles", "Cette page explique le modele ouvert d'Embir, permettant de creer son monde et de tester la plateforme gratuitement.", "Beaucoup d'applications se disent gratuites mais bloquent les messages ou les profils dès que vous commencez à les utiliser. Embir reste fidèle à sa promesse de lancement : pas d'abonnement piège. Toutes les fonctionnalités de base (messages, profils complets, vérification) sont accessibles gratuitement pour notre communauté fondatrice. Nous croyons qu'une plateforme doit d'abord prouver sa valeur et la qualité de ses membres avant de demander une contribution financière via notre futur modèle freemium."],
  ["rencontre-lgbt", "Rencontre LGBT inclusive", "Rencontre LGBT : des univers personnels qui respectent chaque identite", "Un positionnement profond sur l'inclusion : chaque utilisateur definit son monde, ses pronoms, ses preferences, et voit uniquement des personnes compatibles.", "L'inclusion n'est pas une option chez Embir, c'est notre fondation. Que vous soyez trans, non-binaire, queer ou en exploration, votre univers personnel est respecté. Vous définissez vos propres étiquettes et choisissez qui peut voir votre profil. C'est un espace sûr, modéré et vérifié où la diversité est une force. Nous luttons activement contre les discriminations et les fétichisations pour offrir une expérience de rencontre digne et authentique pour toute la communauté LGBTQ+."],
  ["profils-verifies", "Rencontre avec profils verifies", "Des profils verifies pour une communaute saine", "Cette page explique comment Embir construit la confiance des le depart avec des profils humains et certifies.", "La confiance est le premier frein aux rencontres en ligne. Pour y remédier, Embir impose ou encourage fortement la vérification par selfie. En voyant le badge de vérification, vous savez que la personne en face a passé notre test d'authenticité. Cela réduit drastiquement les faux profils, les brouteurs et les déceptions lors du premier rendez-vous. Une communauté vérifiée est une communauté plus engagée et plus respectueuse, car chacun assume son identité."],
  ["application-rencontre-freemium", "Application de rencontre freemium transparente", "Un modèle freemium transparent pour une application durable", "Explication de notre futur modèle économique pour financer la sécurité et l'innovation sans sacrifier l'expérience utilisateur."],
  ["application-rencontre-moderne", "Application de rencontre moderne", "Le dating en 2026 : orientation, compatibilité et sécurité", "Comment Embir réinvente les codes de la rencontre moderne avec une approche centrée sur l'humain et la technologie éthique."],
  ["application-rencontre-lgbtq", "Application de rencontre LGBTQ+", "Une application pensée par et pour la communauté LGBTQ+", "Au-delà du marketing, Embir propose des fonctionnalités concrètes pour le respect des identités et la sécurité des rencontres queer."],
  ["application-rencontre-inclusive", "Application de rencontre inclusive", "L'inclusion au cœur de chaque rencontre", "Pourquoi l'inclusivité radicale est le seul moyen de construire une application de rencontre saine en 2026."],
  ["application-rencontre-avec-profils-verifies", "Application de rencontre avec verification de profil", "Verification de profil : une plateforme sure pour de vraies rencontres", "Focus sur la securite et l'authenticite des univers personnels crees sur la plateforme."],
  ["application-rencontre-sans-pub-intrusive", "Application de rencontre sans publicite intrusive", "Le plaisir de naviguer sans être interrompu par la publicité", "Pourquoi nous avons choisi de bannir les formats publicitaires intrusifs pour préserver l'immersion dans les univers personnels."],
  ["application-rencontre-par-orientation", "Application de rencontre par orientation", "Trouvez des profils qui partagent votre orientation et vos valeurs", "Utilisez nos filtres avancés pour ne rencontrer que des personnes qui correspondent à votre univers personnel."],
  ["application-rencontre-compatible", "Application de rencontre basee sur la compatibilite", "Plus qu'un match, une véritable connexion de valeurs", "Notre algorithme de compatibilité analyse vos préférences et vos intentions pour vous proposer des rencontres qui font sens."],
  ["application-rencontre-avec-algorithme", "Matching par affinite", "L'intelligence au service de l'affinité réelle", "Découvrez comment notre algorithme aide à briser la glace en trouvant des points communs profonds entre les univers personnels."],
  ["application-rencontre-serieuse", "Application de rencontre sérieuse", "Rencontres sérieuses et authentiques : l'approche Embir pour sortir du swipe éphémère", "Ici, nous expliquons pourquoi Embir est l'application de rencontre sérieuse idéale pour ceux qui cherchent la stabilité. Pas de ghosting, des profils vérifiés et une compatibilité basée sur l'orientation et les intentions claires.", "La quête d'une relation sérieuse demande de la clarté et du respect. Chez Embir, nous avons conçu l'application pour favoriser les connexions durables. En déclarant vos intentions dès le départ, vous filtrez naturellement les personnes qui ne cherchent qu'une aventure d'un soir. Nos profils détaillés et nos questions de compatibilité permettent de comprendre les valeurs de l'autre avant même le premier message. C'est l'outil parfait pour ceux qui veulent construire quelque chose de solide dans un monde numérique trop souvent superficiel."],
  ["rencontre-gratuite-sans-abonnement", "Rencontre gratuite sans abonnement", "Faire des rencontres gratuites et sans abonnement caché", "Cette page détaille notre promesse : Embir est gratuit au lancement. Pas de fonctions essentielles bloquées, pas de frustration, juste une rencontre fluide et transparente pour construire notre communauté fondatrice.", "Pourquoi payer avant même d'avoir discuté ? Chez Embir, nous croyons au test grandeur nature. Pendant toute la phase de lancement, accédez à 100% des fonctionnalités sans sortir votre carte bleue. Messagerie, recherche par préférences, vérification de profil : tout est ouvert. C'est notre façon de remercier nos membres fondateurs qui nous aident à peupler la plateforme et à définir les standards de demain. Une rencontre gratuite ne veut pas dire une rencontre de moindre qualité ; au contraire, c'est l'assurance d'une communauté dynamique et accessible à tous."],
  ["pourquoi-embir", "Pourquoi Embir"],
  ["comment-ca-marche", "Comment ca marche"],
  ["securite", "Securite sur Embir"],
  ["confidentialite", "Confidentialite sur Embir"],
].map(([slug, topic, h1, angle, content]) => ({
  slug,
  locale: "fr" as const,
  type: slug.includes("securite") || slug.includes("confidentialite") ? "security" as const : "product" as const,
  title: topic,
  h1: h1 ?? `${topic} avec Embir`,
  topic,
  description: `${topic} sur Embir. Decouvrez une application ou chaque profil est un univers personnel immersif. Compatibilite, preferences et profils verifies.`,
  angle: angle ?? `Explication de ${topic.toLowerCase()} via le prisme des univers personnels et de la compatibilite profonde.`,
  content,
  priority: 0.9,
}));

const frFreemiumPages = [
  ["gratuit-au-lancement", "Gratuit au lancement", "Application de rencontre gratuite au lancement, pour toutes les orientations"],
  ["modele-freemium", "Modele freemium transparent"],
  ["pourquoi-embir-est-gratuit", "Pourquoi Embir est gratuit"],
  ["pourquoi-embir-deviendra-freemium", "Pourquoi Embir deviendra freemium"],
  ["fonctionnalites-premium", "Fonctionnalites premium futures"],
  ["communaute-fondatrice", "Communaute fondatrice"],
  ["application-mobile-a-venir", "Application mobile a venir"],
].map(([slug, topic, h1Override]) => ({
  slug,
  locale: "fr" as const,
  type: "freemium" as const,
  title: topic,
  h1: h1Override ?? topic,
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
  ["compatibility-dating", "Compatibility-first dating", "Deep compatibility over volume", "Explains the matching algorithm that prioritizes shared intent, lifestyle, and behavioral signals over endless swiping.", "Embir’s compatibility matching is about more than just common interests; it’s about shared values and relationship goals. By analyzing how you build your personal universe and what you prioritize in others, we help you find connections that have a real chance of lasting."],
  ["best-free-dating-app", "Best free dating app", "The best free dating app for France, UK and USA", "Embir is the best choice for those seeking a free dating app with verified profiles, deep compatibility, and a focus on safety and respectful connections without early paywalls.", "Why is Embir the best free dating app at launch? Because we don't hold back the features you actually need to meet people. Messaging, verified profiles, and detailed preference filtering are all included for our US, UK and French founding members."],
  ["serious-dating-app", "Serious dating app", "Find real connections on a serious dating app", "Looking for a serious relationship? Embir is built for authenticity, with verified profiles and deep compatibility to help you find more than just a match.", "If you're tired of the casual nature of most dating apps, Embir offers a dedicated space for serious relationships. Our platform encourages users to express their long-term intentions and build detailed personal universes. This transparency helps filter out those who aren't on the same page, saving you time and emotional energy."],
].map(([slug, topic, h1, angle, content]) => ({
  slug,
  locale: "en" as const,
  type: slug.includes("security") || slug.includes("privacy") ? "security" as const : "product" as const,
  title: topic,
  h1: h1 ?? topic,
  topic,
  description: `${topic} with Embir. Step into a dating platform where every profile is an immersive personal universe. Deep compatibility, verified profiles, and safer discovery.`,
  angle: angle ?? `This page explains ${topic.toLowerCase()} through Embir's vision: personal universes, verified profiles, and deep compatibility instead of superficial swiping.`,
  content,
  priority: 0.86,
}));

export const rootSeoPages: RootSeoPage[] = [
  ...frProductPages,
  ...frFreemiumPages,
  ...enProductPages,
  ...enFreemiumPages,
];
