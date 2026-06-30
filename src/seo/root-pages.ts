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
  ["application-rencontre-gratuite", "Application de rencontre gratuite", "Application de rencontre gratuite au lancement, immersive et authentique", "Le lancement gratuit d'Embir donne acces aux univers personnels, a la compatibilite profonde et aux profils verifies sans bloquer les fonctions essentielles.", "Ici, nous explorons pourquoi la gratuité au lancement est fondamentale pour Embir. Contrairement aux applications qui restreignent les messages ou les matchs dès les premières minutes, Embir permet de créer son univers personnel sans barrière financière. L'authenticité ne devrait pas être un luxe. En rejoignant notre communauté fondatrice, vous participez à la construction d'un espace où la sécurité, la vérification par selfie et la compatibilité réelle passent avant le profit immédiat. Notre modèle freemium futur sera transparent et servira à financer l'infrastructure mobile et la modération humaine nécessaire pour garder l'espace sain."],
  ["rencontre-paris", "Application de rencontre a Paris", "Rencontre a Paris : moins de swipe, plus de compatibilite reelle", "Paris concentre beaucoup de profils mais peu d'authenticite. Embir met en avant la creation d'un univers personnel et la decouverte de profils vraiment compatibles.", "À Paris, la densité de profils sur les applications classiques crée souvent une 'fatigue du swipe'. Embir propose une alternative : ralentir pour mieux se rencontrer. En mettant en avant votre univers personnel, vous attirez des personnes qui partagent vos centres d'intérêt, votre style de vie et vos intentions. Que vous soyez dans le Marais, à Montmartre ou sur les quais de Seine, l'objectif est de trouver une connexion qui dépasse la simple proximité géographique. Nos profils vérifiés vous assurent de parler à de vraies personnes, limitant ainsi les déceptions trop fréquentes dans la capitale."],
  ["rencontre-gay-paris", "Rencontre gay a Paris", "Rencontre gay a Paris : un espace personnel, inclusif et verifie", "Paris a deja beaucoup d'options LGBTQ, mais Embir propose de montrer son propre univers et ses vraies intentions plutot qu'une simple grille de photos de proximite.", "Le milieu gay parisien est dynamique mais peut parfois sembler superficiel sur les applications de grille habituelles. Embir offre un espace où l'identité, l'orientation et les préférences sont respectées et mises en avant. Créez un profil qui vous ressemble vraiment, partagez vos passions et trouvez des hommes qui cherchent la même chose que vous, qu'il s'agisse d'une relation sérieuse ou d'une rencontre spontanée mais respectueuse. La sécurité est notre priorité avec la vérification par selfie, garantissant une communauté saine pour tous les Parisiens."],
  ["alternative-tinder", "Alternative a Tinder", "L'alternative a Tinder pour sortir du swipe vide", "Pour celles et ceux qui sont fatigues de Tinder, Embir met en avant les univers personnels, les intentions claires et la compatibilite comportementale.", "Tinder a révolutionné la rencontre, mais a aussi instauré une culture de l'éphémère. Embir se positionne comme l'alternative pour ceux qui veulent plus. Ici, pas de swipe compulsif basé uniquement sur une photo. On prend le temps de parcourir l'univers de l'autre, de comprendre ses attentes et de voir si nos compatibilités s'alignent. C'est une approche plus humaine du dating numérique, où la qualité prime sur la quantité. Nos fonctionnalités gratuites au lancement vous permettent de tester cette différence sans engagement."],
  ["alternative-grindr", "Alternative a Grindr", "L'alternative a Grindr, plus humaine et immersive", "Face a la logique de proximite immediate, Embir propose un espace ou montrer son univers, definir ses preferences et choisir des echanges plus respectueux.", "Grindr est l'outil de la proximité immédiate, mais Embir veut être l'outil de la rencontre choisie. Si vous en avez assez de la brutalité des échanges ou du manque de substance des profils, Embir vous propose de construire un véritable univers personnel. Montrez qui vous êtes au-delà d'une photo de buste. Nos filtres de préférences et notre algorithme de compatibilité vous aident à trouver des hommes qui correspondent vraiment à votre style de vie et à vos envies, le tout dans un environnement sécurisé et vérifié."],
  ["application-rencontre-sans-abonnement", "Application de rencontre sans abonnement", "Une application sans abonnement piege pour decouvrir des univers compatibles", "Le modele ouvert d'Embir permet de creer son monde, tester la plateforme gratuitement et comprendre la valeur avant tout futur premium optionnel.", "Beaucoup d'applications se disent gratuites mais bloquent les messages ou les profils dès que vous commencez à les utiliser. Embir reste fidèle à sa promesse de lancement : pas d'abonnement piège. Toutes les fonctionnalités de base (messages, profils complets, vérification) sont accessibles gratuitement pour notre communauté fondatrice. Nous croyons qu'une plateforme doit d'abord prouver sa valeur et la qualité de ses membres avant de demander une contribution financière via notre futur modèle freemium."],
  ["rencontre-lgbt", "Rencontre LGBT inclusive", "Rencontre LGBT : des univers personnels qui respectent chaque identite", "Un positionnement profond sur l'inclusion : chaque utilisateur definit son monde, ses pronoms, ses preferences, et voit uniquement des personnes compatibles.", "L'inclusion n'est pas une option chez Embir, c'est notre fondation. Que vous soyez trans, non-binaire, queer ou en exploration, votre univers personnel est respecté. Vous définissez vos propres étiquettes et choisissez qui peut voir votre profil. C'est un espace sûr, modéré et vérifié où la diversité est une force. Nous luttons activement contre les discriminations et les fétichisations pour offrir une expérience de rencontre digne et authentique pour toute la communauté LGBTQ+."],
  ["profils-verifies", "Rencontre avec profils verifies", "Des profils verifies pour une communaute saine", "La confiance commence par des profils humains, des badges visibles et une verification qui reduit les faux profils des le depart.", "La confiance est le premier frein aux rencontres en ligne. Pour y remédier, Embir impose ou encourage fortement la vérification par selfie. En voyant le badge de vérification, vous savez que la personne en face a passé notre test d'authenticité. Cela réduit drastiquement les faux profils, les brouteurs et les déceptions lors du premier rendez-vous. Une communauté vérifiée est une communauté plus engagée et plus respectueuse, car chacun assume son identité."],
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
  ["rencontre-gratuite-sans-abonnement", "Rencontre gratuite sans abonnement", "Faire des rencontres gratuites et sans abonnement caché", "Embir est gratuit au lancement: pas de fonctions essentielles bloquees, pas de frustration, une rencontre fluide pour construire la communaute fondatrice.", "Pourquoi payer avant même d'avoir discuté ? Chez Embir, nous croyons au test grandeur nature. Pendant toute la phase de lancement, accédez à 100% des fonctionnalités sans sortir votre carte bleue. Messagerie, recherche par préférences, vérification de profil : tout est ouvert. C'est notre façon de remercier nos membres fondateurs qui nous aident à peupler la plateforme et à définir les standards de demain. Une rencontre gratuite ne veut pas dire une rencontre de moindre qualité ; au contraire, c'est l'assurance d'une communauté dynamique et accessible à tous."],
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

const frTrustClusterPages: RootSeoPage[] = [
  {
    slug: "application-rencontre-sans-faux-profils",
    locale: "fr",
    type: "security",
    title: "Application de rencontre sans faux profils",
    h1: "Application de rencontre sans faux profils : confiance, selfie et moderation",
    topic: "application de rencontre sans faux profils",
    description: "Embir met la confiance au centre avec profils verifies, verification selfie, moderation humaine, signalements visibles et lancement gratuit pour reduire faux profils, bots et catfish.",
    angle: "Embir traite les faux profils comme un probleme produit, pas comme une fatalite du dating: verification visible, moderation humaine, signaux de confiance et experience gratuite au lancement.",
    content: `Une application de rencontre sans faux profils ne peut pas seulement promettre une communaute plus saine. Elle doit rendre les signaux de confiance visibles avant la conversation: photo coherente, profil verifie, intention lisible, preferences assumées et possibilite de signaler un comportement douteux sans se sentir seul.

Embir construit ce cadre autour de la verification selfie, des badges visibles et d'une moderation humaine. Le but n'est pas de faire croire qu'aucune plateforme ne rencontrera jamais de compte suspect; le but est de reduire fortement le bruit, d'accelerer la detection des catfish et de donner aux membres des reperes simples pour choisir avec qui parler.

La promesse gratuite au lancement compte aussi pour la confiance. Quand une app bloque trop tot les messages ou les informations utiles, l'utilisateur prend des decisions dans le flou. Embir prefere ouvrir les fonctions essentielles pendant la phase fondatrice afin de laisser la communaute tester la qualite des profils, la verification et la securite avant l'arrivee du futur freemium.`,
    priority: 0.92,
  },
  {
    slug: "verification-selfie-rencontre",
    locale: "fr",
    type: "security",
    title: "Verification selfie sur application de rencontre",
    h1: "Verification selfie rencontre : le signal simple qui change la confiance",
    topic: "verification selfie rencontre",
    description: "La verification selfie Embir aide a confirmer les profils reels, limiter les catfish, rassurer avant le premier message et soutenir une moderation plus efficace.",
    angle: "La verification selfie devient un repere concret: elle ne remplace pas le jugement, mais elle donne un signal visible pour eviter les profils flous, les images volees et les conversations a risque.",
    content: `La verification selfie sert un objectif tres simple: savoir que la personne derriere le profil ressemble bien a ce qu'elle presente. Dans la rencontre en ligne, ce detail change tout. Il reduit les photos volees, les faux comptes, les profils sans visage et les tentatives de manipulation qui epuisent les utilisateurs.

Sur Embir, la verification est pensee comme un signal de confiance lisible, pas comme un obstacle. Un badge clair, des signalements accessibles et une moderation humaine donnent une meilleure lecture de la communaute. L'utilisateur ne devrait pas devoir devenir enqueteur avant chaque discussion; l'interface doit aider a distinguer les profils serieux des profils douteux.

Ce choix soutient aussi les rencontres inclusives. Les personnes LGBTQ, trans, queer ou simplement prudentes ont souvent besoin d'un cadre plus protecteur pour engager une conversation. La verification selfie aide a poser ce cadre sans transformer l'experience en controle permanent.`,
    priority: 0.91,
  },
  {
    slug: "application-rencontre-lgbt-securisee",
    locale: "fr",
    type: "orientation",
    title: "Application de rencontre LGBT securisee",
    h1: "Application de rencontre LGBT securisee, inclusive et verifiee",
    topic: "application de rencontre LGBT securisee",
    description: "Embir aide les personnes LGBT et LGBTQ+ a rencontrer avec plus de securite: orientations lisibles, preferences claires, profils verifies, moderation humaine et gratuite au lancement.",
    angle: "La securite LGBTQ ne se limite pas a une etiquette marketing: elle demande des preferences respectees, une visibilite controlee, des profils verifies et une moderation capable de comprendre le contexte.",
    content: `Une application de rencontre LGBT securisee doit proteger plusieurs choses en meme temps: l'identite, l'orientation, les preferences, la confidentialite et la qualite des conversations. Pour beaucoup de personnes queer, trans, bi, gay ou lesbiennes, le risque ne se limite pas aux faux profils; il inclut aussi la fetishisation, les questions intrusives, les messages agressifs et les recommandations incompatibles.

Embir travaille ce sujet avec des orientations lisibles, des preferences explicites et des profils verifies. Le but est de donner plus de controle sans isoler les communautes. Chaque membre doit pouvoir dire ce qu'il cherche, choisir comment il apparait et avancer dans un espace ou les comportements toxiques ne deviennent pas la norme.

La gratuite au lancement renforce cette approche. Les premiers membres peuvent tester la qualite de la communaute, les signaux de securite et les outils de compatibilite sans carte bancaire. Le futur freemium devra financer l'app mobile, l'infrastructure, la verification et la moderation, pas casser l'acces aux fonctions qui rendent la rencontre plus saine.`,
    priority: 0.92,
  },
];

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
  angle: `Le modele ${topic.toLowerCase()} repose sur une promesse claire : gratuit au lancement, freemium futur transparent, aucun piege d'abonnement dans la phase fondatrice.`,
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
  angle: `${topic} carries a clear launch promise: free core access now, transparent optional premium later, and no early subscription trap.`,
  priority: 0.88,
}));

const enProductPages = [
  ["why-embir", "Why Embir", "Why Embir: Beyond the swipe", "Embir moves dating away from superficial swipes toward immersive personal universes built on real compatibility."],
  ["how-it-works", "How Embir works", "How it works: Build your universe", "The onboarding flow helps you set up your world, define deep preferences, and match through behavioral compatibility."],
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
  angle: angle ?? `${topic} is grounded in Embir's vision: personal universes, verified profiles, and deep compatibility instead of superficial swiping.`,
  content,
  priority: 0.86,
}));

const enTrustClusterPages: RootSeoPage[] = [
  {
    slug: "no-fake-profiles-dating-app",
    locale: "en",
    type: "security",
    title: "No fake profiles dating app",
    h1: "No fake profiles dating app: verified profiles, selfie checks and human moderation",
    topic: "no fake profiles dating app",
    description: "Embir is built around trust signals: verified profiles, selfie verification, visible reporting, human moderation and free-at-launch access to reduce bots, fake profiles and catfish.",
    angle: "Embir treats fake profiles as a product problem: visible verification, human moderation, clear intent and free launch access help users judge trust before a conversation starts.",
    content: `A no fake profiles dating app cannot rely on a slogan. It has to make trust visible before people invest time: coherent photos, verified profiles, clear intent, readable preferences and reporting tools that feel usable when something looks wrong.

Embir builds that frame through selfie verification, visible badges and human moderation. No serious platform can promise that suspicious accounts will never appear; the stronger promise is to reduce the noise, detect catfish faster and give members practical signals before they message.

Free-at-launch access also matters for safety. When a dating app hides core information behind an early paywall, people make trust decisions with less context. Embir keeps essential discovery, messaging and verification accessible during launch so the founding community can test whether the trust model actually feels different.`,
    priority: 0.92,
  },
  {
    slug: "selfie-verification-dating",
    locale: "en",
    type: "security",
    title: "Selfie verification dating",
    h1: "Selfie verification dating: a simple signal for safer first messages",
    topic: "selfie verification dating",
    description: "Selfie verification on Embir helps confirm real profiles, reduce catfish, support human moderation and give users a clearer trust signal before the first message.",
    angle: "Selfie verification does not replace judgment, but it gives users a visible signal against stolen photos, anonymous profiles and risky conversations.",
    content: `Selfie verification has one clear job: help confirm that the person behind a dating profile matches what they present. In online dating, that signal changes the first message. It reduces stolen photos, fake accounts, faceless profiles and manipulative behavior that makes people leave dating apps exhausted.

On Embir, verification is designed as a readable trust marker, not as friction for its own sake. A visible badge, accessible reporting and human moderation help people understand the community faster. Users should not have to investigate every profile manually; the interface should help separate serious profiles from doubtful ones.

The signal is especially important for inclusive dating. LGBTQ, trans, queer and privacy-conscious users often need a safer frame before starting a conversation. Selfie verification helps set that frame without turning the experience into constant surveillance.`,
    priority: 0.91,
  },
  {
    slug: "safe-lgbtq-dating-app",
    locale: "en",
    type: "orientation",
    title: "Safe LGBTQ dating app",
    h1: "Safe LGBTQ dating app with verified profiles and clearer preferences",
    topic: "safe LGBTQ dating app",
    description: "Embir supports safer LGBTQ dating with clear orientations, explicit preferences, verified profiles, human moderation, privacy-aware discovery and free-at-launch access.",
    angle: "LGBTQ safety is not a marketing label: it requires respected preferences, controlled visibility, verified profiles and moderation that understands context.",
    content: `A safe LGBTQ dating app has to protect several things at once: identity, orientation, preferences, privacy and the quality of conversations. For many queer, trans, bi, gay and lesbian users, risk does not stop at fake profiles. It also includes fetishization, invasive questions, aggressive messages and incompatible recommendations.

Embir approaches that problem with readable orientations, explicit preferences and verified profiles. The goal is more control without isolating communities. Every member should be able to say what they want, choose how they appear and move through a space where toxic behavior is not treated as normal.

Free-at-launch access reinforces that promise. Founding members can test the quality of the community, safety signals and compatibility tools without a credit card. The future freemium layer should fund the mobile app, infrastructure, verification and moderation, not break access to the features that make dating healthier.`,
    priority: 0.92,
  },
];

export const rootSeoPages: RootSeoPage[] = [
  ...frProductPages,
  ...frTrustClusterPages,
  ...frFreemiumPages,
  ...enProductPages,
  ...enTrustClusterPages,
  ...enFreemiumPages,
];
