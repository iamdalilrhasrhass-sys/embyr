export type LandingLocale = "fr" | "en" | "es" | "de" | "it";

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
    intentions: string;
    universe: string;
    create: string;
    open: string;
    close: string;
  };
  hero: {
    title: string;
    body: string;
    primary: string;
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

const sharedSeo = {
  fr: {
    intentionsTitle: "Toutes les intentions ont leur espace",
    orientationsTitle: "Toutes les orientations sont accueillies",
    citiesTitle: "Rencontrer dans votre ville",
    safetyTitle: "Limites claires dès le départ",
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
        answer: "Vous choisissez vos intentions. Embir vérifie aussi que l’autre personne cherche quelqu’un comme vous.",
      },
      {
        question: "Puis-je chercher plusieurs formes de lien ?",
        answer: "Oui. Vous pouvez faire coexister amour, amitié, sorties, sport ou conversation.",
      },
      {
        question: "Embir est-il réservé à une orientation ?",
        answer: "Non. La découverte est conçue pour plusieurs orientations, identités et préférences explicites.",
      },
    ],
  },
  en: {
    intentionsTitle: "Every intention has its space",
    orientationsTitle: "Designed for every orientation",
    citiesTitle: "Meet in your city",
    safetyTitle: "Clear boundaries from the start",
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
        answer: "You define your intentions. Embir also checks whether the other person is looking for someone like you.",
      },
      {
        question: "Can I seek more than one connection?",
        answer: "Yes. Love, friendship, nights out, sport and conversation can coexist.",
      },
      {
        question: "Is Embir limited to one orientation?",
        answer: "No. Discovery is built for multiple orientations, identities and explicit preferences.",
      },
    ],
  },
};

const makeSeo = (prefix: "/es" | "/de" | "/it", labels: {
  intentionsTitle: string;
  orientationsTitle: string;
  citiesTitle: string;
  safetyTitle: string;
  faqTitle: string;
  love: string;
  friends: string;
  activities: string;
  casual: string;
  sport: string;
  events: string;
  gay: string;
  lesbian: string;
  bi: string;
  queer: string;
  trans: string;
  safety: string;
  moderation: string;
  privacy: string;
  about: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
}): LandingCopy["seo"] => ({
  intentionsTitle: labels.intentionsTitle,
  orientationsTitle: labels.orientationsTitle,
  citiesTitle: labels.citiesTitle,
  safetyTitle: labels.safetyTitle,
  faqTitle: labels.faqTitle,
  intentions: [
    { label: labels.love, href: `${prefix}/amour` },
    { label: labels.friends, href: `${prefix}/amis` },
    { label: labels.activities, href: `${prefix}/fun` },
    { label: labels.casual, href: `${prefix}/plan-cul` },
    { label: labels.sport, href: `${prefix}/sport` },
    { label: labels.events, href: `${prefix}/evenements` },
  ],
  orientations: [
    { label: labels.gay, href: `${prefix}/site-rencontre-gay` },
    { label: labels.lesbian, href: `${prefix}/lgbtq-dating-app` },
    { label: labels.bi, href: `${prefix}/lgbtq-dating-app` },
    { label: labels.queer, href: `${prefix}/lgbtq-dating-app` },
    { label: labels.trans, href: `${prefix}/lgbtq-dating-app` },
  ],
  cities: [
    { label: "Paris", href: `${prefix}/rencontre-paris` },
    { label: "Lyon", href: `${prefix}/rencontre-lyon` },
    { label: "Marseille", href: `${prefix}/rencontre-marseille` },
    { label: "Toulouse", href: `${prefix}/rencontre-toulouse` },
    { label: "Bordeaux", href: `${prefix}/rencontre-bordeaux` },
    { label: "Lille", href: `${prefix}/rencontre-lille` },
  ],
  safety: [
    { label: labels.safety, href: `${prefix}/verified-dating-app` },
    { label: labels.moderation, href: `${prefix}/moderation` },
    { label: labels.privacy, href: `${prefix}/privacy` },
    { label: labels.about, href: `${prefix}/about` },
  ],
  faq: [
    { question: labels.q1, answer: labels.a1 },
    { question: labels.q2, answer: labels.a2 },
    { question: labels.q3, answer: labels.a3 },
  ],
});

const fr: LandingCopy = {
  nav: {
    discover: "Découvrir",
    compatibility: "Compatibilité",
    intentions: "Intentions",
    universe: "Univers",
    create: "Créer mon univers",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
  },
  hero: {
    title: "Rencontrez ceux qui vous cherchent aussi.",
    body: "Dans les deux sens. Avant le premier message.",
    primary: "Explorer mes compatibilités",
    labels: ["Vous", "Recherche", "Réciproque"],
    orientationHelp: "Orientez la boussole",
  },
  reciprocity: {
    title: "Vous les cherchez. Ils vous cherchent aussi.",
    titleLines: ["Vous les cherchez.", "Ils vous cherchent aussi."],
    body: "Embir vérifie la réciprocité avant de pousser une rencontre.",
    cta: "Choisir une intention",
    result: "Compatibilité réciproque",
    outbound: "Vous la recherchez",
    inbound: "Elle vous recherche aussi",
    axes: ["Orientation", "Intention", "Affinités"],
    demoNotice: "Visualisation pédagogique, pas un score attribué à une personne.",
  },
  intentions: {
    title: "Dites ce que vous cherchez aujourd’hui.",
    body: "Changez demain. Le lien reste clair.",
    items: [
      { label: "Amour", href: "/fr/amour", preview: "Pour ceux qui cherchent plus qu’un match." },
      { label: "Amitié", href: "/fr/amis", preview: "Parce qu’on peut avoir besoin de nouveaux amis." },
      { label: "Casual", href: "/fr/plan-cul", preview: "Sans attentes, avec respect." },
      { label: "Sport", href: "/fr/sport", preview: "Trouvez un partenaire de raquette ou de trail." },
      { label: "Sorties", href: "/fr/evenements", preview: "Quelqu’un pour les concerts, expos et soirées." },
      { label: "Conversation", href: "/fr/fun", preview: "Juste parler, vraiment." },
    ],
  },
  universe: {
    title: "Un profil qui vous ressemble.",
    titleLines: ["Un profil", "qui vous ressemble."],
    body: "Votre univers montre l’atmosphère, le rythme et les détails qui comptent.",
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
  final: {
    title: "Votre univers commence par une intention sincère.",
    primary: "Créer mon univers",
    secondary: "Revenir à la boussole",
  },
  seo: sharedSeo.fr,
};

const en: LandingCopy = {
  nav: {
    discover: "Discover",
    compatibility: "Compatibility",
    intentions: "Intentions",
    universe: "Universe",
    create: "Create my universe",
    open: "Open menu",
    close: "Close menu",
  },
  hero: {
    title: "Meet the people who are looking for you too.",
    body: "Both ways. Before the first message.",
    primary: "Explore my compatibility",
    labels: ["You", "Looking for", "Reciprocal"],
    orientationHelp: "Orient the compass",
  },
  reciprocity: {
    title: "You seek them. They seek you too.",
    titleLines: ["You seek them.", "They seek you too."],
    body: "Embir checks reciprocity before pushing a connection.",
    cta: "Choose an intention",
    result: "Reciprocal compatibility",
    outbound: "You are looking for them",
    inbound: "They are looking for you too",
    axes: ["Orientation", "Intention", "Affinities"],
    demoNotice: "Educational visualization, not a score assigned to a person.",
  },
  intentions: {
    title: "Say what you want today.",
    body: "Change tomorrow. The context stays clear.",
    items: [
      { label: "Love", href: "/amour", preview: "For those looking for more than a match." },
      { label: "Friendship", href: "/amis", preview: "Because new friends matter too." },
      { label: "Casual", href: "/plan-cul", preview: "No strings. No pressure." },
      { label: "Sport", href: "/sport", preview: "Find your tennis partner or running buddy." },
      { label: "Going out", href: "/evenements", preview: "Someone for concerts, galleries, nights out." },
      { label: "Conversation", href: "/fun", preview: "Just talk. Really." },
    ],
  },
  universe: {
    title: "A profile that feels like you.",
    titleLines: ["A profile", "that feels like you."],
    body: "Your universe shows the atmosphere, rhythm and details that matter.",
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
  final: {
    title: "Your universe begins with a sincere intention.",
    primary: "Create my universe",
    secondary: "Back to the compass",
  },
  seo: sharedSeo.en,
};

const es: LandingCopy = {
  nav: {
    discover: "Descubrir",
    compatibility: "Compatibilidad",
    intentions: "Intenciones",
    universe: "Universo",
    create: "Crear mi universo",
    open: "Abrir menú",
    close: "Cerrar menú",
  },
  hero: {
    title: "Conoce a quienes también te buscan.",
    body: "En ambos sentidos. Antes del primer mensaje.",
    primary: "Explorar mi compatibilidad",
    labels: ["Tú", "Buscas", "Recíproco"],
    orientationHelp: "Orienta la brújula",
  },
  reciprocity: {
    title: "Tú les buscas. Ellos también te buscan.",
    titleLines: ["Tú les buscas.", "Ellos también te buscan."],
    body: "Embir comprueba la reciprocidad antes de proponer una conexión.",
    cta: "Elegir una intención",
    result: "Compatibilidad recíproca",
    outbound: "Tú la buscas",
    inbound: "Ella también te busca",
    axes: ["Orientación", "Intención", "Afinidades"],
    demoNotice: "Visualización educativa, no una puntuación personal.",
  },
  intentions: {
    title: "Di qué buscas hoy.",
    body: "Cambia mañana. El contexto sigue claro.",
    items: [
      { label: "Amor", href: "/es/amour", preview: "Para quienes buscan más que un match." },
      { label: "Amistad", href: "/es/amis", preview: "Porque nuevos amigos también importan." },
      { label: "Casual", href: "/es/plan-cul", preview: "Sin presión, con respeto." },
      { label: "Deporte", href: "/es/sport", preview: "Encuentra pareja de tenis o de trail." },
      { label: "Planes", href: "/es/evenements", preview: "Alguien para conciertos, galerías y noches." },
      { label: "Conversación", href: "/es/fun", preview: "Solo hablar, de verdad." },
    ],
  },
  universe: {
    title: "Un perfil que se parece a ti.",
    titleLines: ["Un perfil", "que se parece a ti."],
    body: "Tu universo muestra la atmósfera, el ritmo y los detalles importantes.",
    tabs: ["Atmósfera", "Intenciones", "Ritmo", "Detalles"],
    name: "Maya, 29",
    descriptor: "Arquitecta sonora · Ginebra",
    quote: "Prefiero una conversación que se desvía a una bio recitada.",
    intentions: ["Amor", "Conciertos", "Senderismo"],
    primary: "Entrar en su universo",
    secondary: "Personalizar el mío",
    drag: "Desliza para explorar",
    demoNotice: "Perfil de demostración para presentar la experiencia Embir.",
  },
  final: {
    title: "Tu universo empieza con una intención sincera.",
    primary: "Crear mi universo",
    secondary: "Volver a la brújula",
  },
  seo: makeSeo("/es", {
    intentionsTitle: "Cada intención tiene su espacio",
    orientationsTitle: "Diseñado para cada orientación",
    citiesTitle: "Conocer gente en tu ciudad",
    safetyTitle: "Límites claros desde el inicio",
    faqTitle: "Preguntas frecuentes",
    love: "Encontrar amor",
    friends: "Conocer amigos",
    activities: "Compartir actividades",
    casual: "Encuentros casuales",
    sport: "Encuentros deportivos",
    events: "Eventos y salidas",
    gay: "Citas gay",
    lesbian: "Citas lesbianas",
    bi: "Citas bi",
    queer: "Citas queer",
    trans: "Citas trans",
    safety: "Seguridad",
    moderation: "Moderación",
    privacy: "Privacidad",
    about: "Acerca de",
    q1: "¿Cómo funciona la compatibilidad recíproca?",
    a1: "Defines tus intenciones. Embir también comprueba si la otra persona busca a alguien como tú.",
    q2: "¿Puedo buscar más de un tipo de vínculo?",
    a2: "Sí. Amor, amistad, salidas, deporte y conversación pueden coexistir.",
    q3: "¿Embir está limitado a una orientación?",
    a3: "No. La experiencia está pensada para múltiples orientaciones, identidades y preferencias explícitas.",
  }),
};

const de: LandingCopy = {
  nav: {
    discover: "Entdecken",
    compatibility: "Kompatibilität",
    intentions: "Absichten",
    universe: "Universum",
    create: "Mein Universum erstellen",
    open: "Menü öffnen",
    close: "Menü schließen",
  },
  hero: {
    title: "Triff Menschen, die dich ebenfalls suchen.",
    body: "In beide Richtungen. Vor der ersten Nachricht.",
    primary: "Meine Kompatibilität erkunden",
    labels: ["Du", "Suchst", "Gegenseitig"],
    orientationHelp: "Richte den Kompass aus",
  },
  reciprocity: {
    title: "Du suchst sie. Sie suchen dich auch.",
    titleLines: ["Du suchst sie.", "Sie suchen dich auch."],
    body: "Embir prüft Gegenseitigkeit, bevor eine Verbindung entsteht.",
    cta: "Absicht wählen",
    result: "Gegenseitige Kompatibilität",
    outbound: "Du suchst sie",
    inbound: "Sie sucht dich auch",
    axes: ["Orientierung", "Absicht", "Affinitäten"],
    demoNotice: "Pädagogische Visualisierung, kein persönlicher Score.",
  },
  intentions: {
    title: "Sag, was du heute suchst.",
    body: "Morgen darf es sich ändern. Der Kontext bleibt klar.",
    items: [
      { label: "Liebe", href: "/de/amour", preview: "Für alle, die mehr als ein Match suchen." },
      { label: "Freundschaft", href: "/de/amis", preview: "Weil neue Freundschaften auch zählen." },
      { label: "Casual", href: "/de/plan-cul", preview: "Ohne Druck, mit Respekt." },
      { label: "Sport", href: "/de/sport", preview: "Finde Tennispartner oder Laufbuddy." },
      { label: "Ausgehen", href: "/de/evenements", preview: "Jemand für Konzerte, Galerien und Nächte." },
      { label: "Gespräch", href: "/de/fun", preview: "Einfach reden. Wirklich." },
    ],
  },
  universe: {
    title: "Ein Profil, das nach dir klingt.",
    titleLines: ["Ein Profil,", "das nach dir klingt."],
    body: "Dein Universum zeigt Atmosphäre, Rhythmus und die wichtigen Details.",
    tabs: ["Atmosphäre", "Absichten", "Rhythmus", "Details"],
    name: "Maya, 29",
    descriptor: "Sound-Architektin · Genf",
    quote: "Ich mag Gespräche, die abbiegen, mehr als eine aufgesagte Bio.",
    intentions: ["Liebe", "Konzerte", "Wandern"],
    primary: "Ihr Universum betreten",
    secondary: "Meins gestalten",
    drag: "Zum Erkunden ziehen",
    demoNotice: "Demoprofil zur Vorstellung der Embir-Erfahrung.",
  },
  final: {
    title: "Dein Universum beginnt mit einer ehrlichen Absicht.",
    primary: "Mein Universum erstellen",
    secondary: "Zurück zum Kompass",
  },
  seo: makeSeo("/de", {
    intentionsTitle: "Jede Absicht hat Raum",
    orientationsTitle: "Für jede Orientierung gedacht",
    citiesTitle: "Menschen in deiner Stadt treffen",
    safetyTitle: "Klare Grenzen von Anfang an",
    faqTitle: "Häufige Fragen",
    love: "Liebe finden",
    friends: "Freunde treffen",
    activities: "Aktivitäten teilen",
    casual: "Casual Dating",
    sport: "Sportliche Treffen",
    events: "Events und Ausgehen",
    gay: "Gay Dating",
    lesbian: "Lesbisches Dating",
    bi: "Bi Dating",
    queer: "Queer Dating",
    trans: "Trans Dating",
    safety: "Sicherheit",
    moderation: "Moderation",
    privacy: "Datenschutz",
    about: "Über uns",
    q1: "Wie funktioniert gegenseitige Kompatibilität?",
    a1: "Du definierst deine Absichten. Embir prüft auch, ob die andere Person jemanden wie dich sucht.",
    q2: "Kann ich mehrere Arten von Verbindung suchen?",
    a2: "Ja. Liebe, Freundschaft, Ausgehen, Sport und Gespräch können nebeneinander bestehen.",
    q3: "Ist Embir auf eine Orientierung beschränkt?",
    a3: "Nein. Discovery ist für mehrere Orientierungen, Identitäten und klare Präferenzen gebaut.",
  }),
};

const it: LandingCopy = {
  nav: {
    discover: "Scoprire",
    compatibility: "Compatibilità",
    intentions: "Intenzioni",
    universe: "Universo",
    create: "Crea il mio universo",
    open: "Apri menu",
    close: "Chiudi menu",
  },
  hero: {
    title: "Incontra chi sta cercando anche te.",
    body: "In entrambe le direzioni. Prima del primo messaggio.",
    primary: "Esplora la mia compatibilità",
    labels: ["Tu", "Cerchi", "Reciproco"],
    orientationHelp: "Orienta la bussola",
  },
  reciprocity: {
    title: "Tu cerchi loro. Anche loro cercano te.",
    titleLines: ["Tu cerchi loro.", "Anche loro cercano te."],
    body: "Embir controlla la reciprocità prima di proporre una connessione.",
    cta: "Scegli un’intenzione",
    result: "Compatibilità reciproca",
    outbound: "Tu la cerchi",
    inbound: "Lei cerca anche te",
    axes: ["Orientamento", "Intenzione", "Affinità"],
    demoNotice: "Visualizzazione educativa, non un punteggio personale.",
  },
  intentions: {
    title: "Dì cosa cerchi oggi.",
    body: "Domani può cambiare. Il contesto resta chiaro.",
    items: [
      { label: "Amore", href: "/it/amour", preview: "Per chi cerca più di un match." },
      { label: "Amicizia", href: "/it/amis", preview: "Perché anche nuovi amici contano." },
      { label: "Casual", href: "/it/plan-cul", preview: "Senza pressione, con rispetto." },
      { label: "Sport", href: "/it/sport", preview: "Trova partner di tennis o di corsa." },
      { label: "Uscite", href: "/it/evenements", preview: "Qualcuno per concerti, gallerie e serate." },
      { label: "Conversazione", href: "/it/fun", preview: "Solo parlare, davvero." },
    ],
  },
  universe: {
    title: "Un profilo che ti somiglia.",
    titleLines: ["Un profilo", "che ti somiglia."],
    body: "Il tuo universo mostra atmosfera, ritmo e dettagli importanti.",
    tabs: ["Atmosfera", "Intenzioni", "Ritmo", "Dettagli"],
    name: "Maya, 29",
    descriptor: "Architetta sonora · Ginevra",
    quote: "Preferisco una conversazione che devia a una bio recitata.",
    intentions: ["Amore", "Concerti", "Trekking"],
    primary: "Entrare nel suo universo",
    secondary: "Personalizzare il mio",
    drag: "Scorri per esplorare",
    demoNotice: "Profilo dimostrativo creato per presentare l’esperienza Embir.",
  },
  final: {
    title: "Il tuo universo inizia con un’intenzione sincera.",
    primary: "Crea il mio universo",
    secondary: "Torna alla bussola",
  },
  seo: makeSeo("/it", {
    intentionsTitle: "Ogni intenzione ha spazio",
    orientationsTitle: "Pensato per ogni orientamento",
    citiesTitle: "Incontrare nella tua città",
    safetyTitle: "Limiti chiari dall’inizio",
    faqTitle: "Domande frequenti",
    love: "Trovare amore",
    friends: "Conoscere amici",
    activities: "Condividere attività",
    casual: "Incontri casual",
    sport: "Incontri sportivi",
    events: "Eventi e uscite",
    gay: "Dating gay",
    lesbian: "Dating lesbico",
    bi: "Dating bi",
    queer: "Dating queer",
    trans: "Dating trans",
    safety: "Sicurezza",
    moderation: "Moderazione",
    privacy: "Privacy",
    about: "Chi siamo",
    q1: "Come funziona la compatibilità reciproca?",
    a1: "Definisci le tue intenzioni. Embir verifica anche se l’altra persona cerca qualcuno come te.",
    q2: "Posso cercare più forme di legame?",
    a2: "Sì. Amore, amicizia, uscite, sport e conversazione possono convivere.",
    q3: "Embir è limitato a un orientamento?",
    a3: "No. La scoperta è pensata per più orientamenti, identità e preferenze esplicite.",
  }),
};

export const landingCopy: Record<LandingLocale, LandingCopy> = {
  fr,
  en,
  es,
  de,
  it,
};
