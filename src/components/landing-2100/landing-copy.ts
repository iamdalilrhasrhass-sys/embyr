export type LandingLocale = "fr" | "en";

interface LinkItem {
  label: string;
  href: string;
  description?: string;
}

interface IntentItem extends LinkItem {
  preview: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export interface LandingCopy {
  nav: {
    discover: string;
    compatibility: string;
    safety: string;
    journal: string;
    create: string;
    open: string;
    close: string;
  };
  hero: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    labels: [string, string, string];
    orientationHelp: string;
  };
  reciprocity: {
    title: string;
    titleLines: string[];
    body: string;
    cta: string;
    result: string;
    outbound: string;
    inbound: string;
    axes: [string, string, string];
    demoNotice: string;
  };
  universe: {
    title: string;
    titleLines: string[];
    body: string;
    tabs: [string, string, string, string];
    name: string;
    descriptor: string;
    quote: string;
    intentions: [string, string, string];
    primary: string;
    secondary: string;
    drag: string;
    demoNotice: string;
  };
  intentions: {
    title: string;
    body: string;
    items: IntentItem[];
  };
  journal: {
    title: string;
    items: LinkItem[];
  };
  final: {
    title: string;
    primary: string;
    secondary: string;
  };
  seo: {
    intentionsTitle: string;
    orientationsTitle: string;
    citiesTitle: string;
    safetyTitle: string;
    faqTitle: string;
    intentions: LinkItem[];
    orientations: LinkItem[];
    cities: LinkItem[];
    safety: LinkItem[];
    faq: FaqItem[];
  };
}

const fr: LandingCopy = {
  nav: {
    discover: "Découvrir",
    compatibility: "Compatibilité",
    safety: "Sécurité",
    journal: "Le journal",
    create: "Créer mon univers",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
  },
  hero: {
    title: "Rencontrez ceux qui vous cherchent aussi.",
    body: "Embir croise orientations, intentions et affinités dans les deux sens — avant même le premier message.",
    primary: "Explorer mes compatibilités",
    secondary: "Voir comment ça fonctionne",
    labels: ["Vous", "Recherche", "Réciproque"],
    orientationHelp: "Utilisez les flèches pour orienter la boussole",
  },
  reciprocity: {
    title: "La compatibilité n’est pas une case. C’est une réciprocité.",
    titleLines: [
      "La compatibilité",
      "n’est pas une case.",
      "C’est une réciprocité.",
    ],
    body: "Vous choisissez qui vous souhaitez rencontrer. Embir vérifie que cette personne souhaite aussi rencontrer quelqu’un comme vous.",
    cta: "Comprendre le matching",
    result: "Compatibilité réciproque",
    outbound: "Vous la recherchez",
    inbound: "Elle vous recherche aussi",
    axes: ["Orientation", "Intention", "Affinités"],
    demoNotice: "Cette visualisation explique le principe de réciprocité. Elle ne représente pas un score attribué à une personne.",
  },
  universe: {
    title: "Un profil ne devrait pas résumer une personne.",
    titleLines: [
      "Un profil ne devrait",
      "pas résumer une",
      "personne.",
    ],
    body: "Chez Embir, chacun construit un univers : ce qui l’anime, ce qu’il cherche, sa manière d’être au monde.",
    tabs: ["Atmosphère", "Intentions", "Rythme", "Détails"],
    name: "Maya, 29",
    descriptor: "Architecte sonore · Genève",
    quote: "Je préfère une conversation qui dévie à une bio qui se récite.",
    intentions: ["Amour", "Concerts", "Randonnée"],
    primary: "Entrer dans son univers",
    secondary: "Personnaliser le mien",
    drag: "Glisser pour explorer",
    demoNotice: "Profil de démonstration conçu pour présenter l’expérience Embir.",
  },
  intentions: {
    title: "Une même personne peut chercher plusieurs formes de lien.",
    body: "Choisissez aujourd’hui. Faites évoluer demain.",
    items: [
      { label: "Amour", href: "/fr/amour", preview: "Construire une relation qui se choisit dans les deux sens." },
      { label: "Amitié", href: "/fr/amis", preview: "Rencontrer des personnes avec qui partager plus qu’un écran." },
      { label: "Casual", href: "/fr/plan-cul", preview: "Dire clairement ce que l’on souhaite, sans promesse inventée." },
      { label: "Sport", href: "/fr/sport", preview: "Créer des rencontres autour du mouvement et des activités." },
      { label: "Sorties", href: "/fr/evenements", preview: "Trouver des personnes partantes pour vivre quelque chose dehors." },
      { label: "Conversation", href: "/fr/fun", preview: "Commencer par une curiosité partagée et voir où elle mène." },
    ],
  },
  journal: {
    title: "Le journal des liens humains",
    items: [
      { label: "Dire clairement ce que l’on cherche", href: "/fr/blog/premier-message-application-rencontre" },
      { label: "Construire un profil qui ressemble vraiment", href: "/fr/blog" },
      { label: "Quand une conversation mérite de sortir de l’écran", href: "/fr/blog/premier-rendez-vous-conseils-2026" },
    ],
  },
  final: {
    title: "Votre univers commence par une intention honnête.",
    primary: "Créer mon univers",
    secondary: "Découvrir Embir",
  },
  seo: {
    intentionsTitle: "Toutes les intentions ont leur espace",
    orientationsTitle: "Une plateforme pensée pour toutes les orientations",
    citiesTitle: "Rencontrer dans votre ville",
    safetyTitle: "Des limites claires, dès le départ",
    faqTitle: "Questions fréquentes",
    intentions: [
      { label: "Trouver l’amour", href: "/fr/amour" },
      { label: "Rencontrer des amis", href: "/fr/amis" },
      { label: "Partager des activités", href: "/fr/fun" },
      { label: "Rencontre casual", href: "/fr/plan-cul" },
      { label: "Rencontres sportives", href: "/fr/sport" },
      { label: "Événements et sorties", href: "/fr/evenements" },
    ],
    orientations: [
      { label: "Rencontre gay", href: "/fr/site-rencontre-gay" },
      { label: "Rencontre lesbienne", href: "/fr/lgbtq-dating-app" },
      { label: "Rencontre bi", href: "/fr/lgbtq-dating-app" },
      { label: "Rencontre queer", href: "/fr/lgbtq-dating-app" },
      { label: "Rencontre trans", href: "/fr/lgbtq-dating-app" },
    ],
    cities: [
      { label: "Paris", href: "/fr/rencontre-paris" },
      { label: "Lyon", href: "/fr/rencontre-lyon" },
      { label: "Marseille", href: "/fr/rencontre-marseille" },
      { label: "Toulouse", href: "/fr/rencontre-toulouse" },
      { label: "Bordeaux", href: "/fr/rencontre-bordeaux" },
      { label: "Lille", href: "/fr/rencontre-lille" },
      { label: "Nice", href: "/fr/rencontre-nice" },
      { label: "Nantes", href: "/fr/rencontre-nantes" },
    ],
    safety: [
      { label: "Sécurité", href: "/fr/verified-dating-app" },
      { label: "Modération", href: "/fr/moderation" },
      { label: "Confidentialité", href: "/fr/privacy" },
      { label: "À propos", href: "/fr/about" },
    ],
    faq: [
      {
        question: "Comment fonctionne la compatibilité réciproque ?",
        answer: "Vous indiquez qui vous souhaitez rencontrer et vos intentions. Embir vérifie aussi les préférences de l’autre personne avant de proposer une rencontre.",
      },
      {
        question: "Puis-je rechercher plusieurs formes de lien ?",
        answer: "Oui. Vos intentions peuvent évoluer et coexister. Elles servent à clarifier le contexte de chaque découverte.",
      },
      {
        question: "Embir est-il réservé à une orientation ?",
        answer: "Non. Le produit est conçu pour accueillir plusieurs orientations et identités avec des préférences de découverte explicites.",
      },
    ],
  },
};

const en: LandingCopy = {
  nav: {
    discover: "Discover",
    compatibility: "Compatibility",
    safety: "Safety",
    journal: "Journal",
    create: "Create my universe",
    open: "Open menu",
    close: "Close menu",
  },
  hero: {
    title: "Meet the people who are looking for you too.",
    body: "Embir combines orientation, intention and affinity in both directions — before the first message.",
    primary: "Explore my compatibility",
    secondary: "See how it works",
    labels: ["You", "Looking for", "Reciprocal"],
    orientationHelp: "Use the arrow keys to orient the compass",
  },
  reciprocity: {
    title: "Compatibility is not a box. It is reciprocal.",
    titleLines: [
      "Compatibility is not",
      "a box. It is reciprocal.",
    ],
    body: "You choose who you want to meet. Embir also checks whether that person wants to meet someone like you.",
    cta: "Understand matching",
    result: "Reciprocal compatibility",
    outbound: "You are looking for them",
    inbound: "They are looking for you too",
    axes: ["Orientation", "Intention", "Affinities"],
    demoNotice: "This visualization explains reciprocity. It is not a score assigned to a person.",
  },
  universe: {
    title: "A profile should not reduce a person to a summary.",
    titleLines: [
      "A profile should not",
      "reduce a person",
      "to a summary.",
    ],
    body: "On Embir, everyone builds a universe: what moves them, what they seek and how they move through the world.",
    tabs: ["Atmosphere", "Intentions", "Rhythm", "Details"],
    name: "Maya, 29",
    descriptor: "Sound architect · Geneva",
    quote: "I prefer a conversation that wanders to a bio that recites itself.",
    intentions: ["Love", "Concerts", "Hiking"],
    primary: "Enter her universe",
    secondary: "Personalize mine",
    drag: "Drag to explore",
    demoNotice: "Demonstration profile designed to present the Embir experience.",
  },
  intentions: {
    title: "The same person can seek more than one kind of connection.",
    body: "Choose today. Let it evolve tomorrow.",
    items: [
      { label: "Love", href: "/amour", preview: "Build a relationship chosen in both directions." },
      { label: "Friendship", href: "/amis", preview: "Meet people with whom to share more than a screen." },
      { label: "Casual", href: "/plan-cul", preview: "Say what you want clearly, without invented promises." },
      { label: "Sport", href: "/sport", preview: "Create connections through movement and shared activities." },
      { label: "Going out", href: "/evenements", preview: "Find people who want to experience something outside." },
      { label: "Conversation", href: "/fun", preview: "Begin with shared curiosity and see where it leads." },
    ],
  },
  journal: {
    title: "The journal of human connection",
    items: [
      { label: "Say clearly what you are looking for", href: "/blog" },
      { label: "Build a profile that actually feels like you", href: "/blog" },
      { label: "When a conversation deserves to leave the screen", href: "/blog" },
    ],
  },
  final: {
    title: "Your universe begins with an honest intention.",
    primary: "Create my universe",
    secondary: "Discover Embir",
  },
  seo: {
    intentionsTitle: "Every intention has its own space",
    orientationsTitle: "Designed for every orientation",
    citiesTitle: "Meet in your city",
    safetyTitle: "Clear boundaries from the beginning",
    faqTitle: "Frequently asked questions",
    intentions: [
      { label: "Find love", href: "/amour" },
      { label: "Meet friends", href: "/amis" },
      { label: "Share activities", href: "/fun" },
      { label: "Casual dating", href: "/plan-cul" },
      { label: "Active dating", href: "/sport" },
      { label: "Events and nights out", href: "/evenements" },
    ],
    orientations: [
      { label: "Gay dating", href: "/site-rencontre-gay" },
      { label: "Lesbian dating", href: "/lgbtq-dating-app" },
      { label: "Bisexual dating", href: "/lgbtq-dating-app" },
      { label: "Queer dating", href: "/lgbtq-dating-app" },
      { label: "Trans dating", href: "/lgbtq-dating-app" },
    ],
    cities: [
      { label: "London", href: "/uk/dating/london" },
      { label: "Manchester", href: "/uk/dating/manchester" },
      { label: "New York", href: "/us/dating/new-york" },
      { label: "Los Angeles", href: "/us/dating/los-angeles" },
      { label: "Geneva", href: "/switzerland/geneva" },
      { label: "Zurich", href: "/switzerland/zurich" },
    ],
    safety: [
      { label: "Safety", href: "/verified-dating-app" },
      { label: "Moderation", href: "/moderation" },
      { label: "Privacy", href: "/privacy" },
      { label: "About", href: "/about" },
    ],
    faq: [
      {
        question: "How does reciprocal compatibility work?",
        answer: "You define who you want to meet and your intentions. Embir also checks the other person’s preferences before suggesting a connection.",
      },
      {
        question: "Can I look for more than one kind of connection?",
        answer: "Yes. Your intentions can evolve and coexist. They provide clear context for every discovery.",
      },
      {
        question: "Is Embir limited to one orientation?",
        answer: "No. The product is designed for multiple orientations and identities with explicit discovery preferences.",
      },
    ],
  },
};

export const landingCopy: Record<LandingLocale, LandingCopy> = { fr, en };
