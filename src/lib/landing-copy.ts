// ═══════════════════════════════════════════════════════════
//  EMBIR — Landing Copy (FR / EN / ES)
//  Triple localisation native. Écosystème complet.
// ═══════════════════════════════════════════════════════════

export type Locale = "fr" | "en" | "es";

export interface JournalArticle {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export interface ResourceItem {
  icon: string;
  title: string;
  desc: string;
  type: string;
  size: string;
}

export interface CopySet {
  // ── Hero ──
  hero_badge: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_strip: string[];
  hero_scroll_hint: string;

  // ── Manifeste / Vision ──
  manifest_eyebrow: string;
  manifest_title: string;
  manifest_body: string;
  manifest_pillars: { title: string; body: string }[];

  // ── Modèle (scroll 3D) ──
  model_eyebrow: string;
  model_title: string;
  model_steps: { num: string; title: string; body: string }[];
  model_outro: string;

  // ── Modèle économique ──
  econ_eyebrow: string;
  econ_title: string;
  econ_body: string;
  econ_cards: { title: string; body: string; tag: string }[];
  econ_pledge: string;

  // ── Univers / Intentions ──
  universe_eyebrow: string;
  universe_title: string;
  universe_subtitle: string;
  universe_cards: { icon: string; title: string; body: string }[];

  // ── Orientation ──
  orient_eyebrow: string;
  orient_title: string;
  orient_subtitle: string;
  orient_cards: { icon: string; title: string; body: string }[];

  // ── Preuve sociale ──
  proof_eyebrow: string;
  proof_title: string;
  proof_stats: { value: string; label: string }[];

  // ── Journal / Éditorial ──
  journal_eyebrow: string;
  journal_title: string;
  journal_subtitle: string;
  journal_articles: JournalArticle[];
  journal_cta: string;

  // ── Ressources ──
  resources_eyebrow: string;
  resources_title: string;
  resources_subtitle: string;
  resources_items: ResourceItem[];

  // ── Communauté ──
  community_eyebrow: string;
  community_title: string;
  community_subtitle: string;
  community_features: { icon: string; title: string; body: string }[];
  community_cta: string;

  // ── Membership / Rétention ──
  member_eyebrow: string;
  member_title: string;
  member_body: string;
  member_tiers: { name: string; price: string; perks: string[]; cta: string }[];

  // ── Newsletter ──
  news_title: string;
  news_body: string;
  news_placeholder: string;
  news_cta: string;
  news_success: string;

  // ── Contact ──
  contact_eyebrow: string;
  contact_title: string;
  contact_body: string;
  contact_fields: { name: string; email: string; message: string };
  contact_submit: string;
  contact_success: string;

  // ── Final CTA ──
  final_eyebrow: string;
  final_title: string;
  final_body: string;
  final_cta: string;

  // ── FAQ ──
  faq_title: string;
  faq_items: { q: string; a: string }[];

  // ── Footer ──
  footer_tagline: string;
  footer_product: string;
  footer_company: string;
  footer_resources: string;
  footer_legal: string;
  footer_links_product: string[];
  footer_links_company: string[];
  footer_links_resources: string[];
  footer_links_legal: string[];
  footer_rights: string;
  footer_made_with: string;

  // ── Nav ──
  nav_vision: string;
  nav_model: string;
  nav_universe: string;
  nav_pricing: string;
  nav_community: string;
  nav_journal: string;
  nav_contact: string;
  nav_join: string;
}

const fr: CopySet = {
  hero_badge: "Connexions essentielles gratuites",
  hero_title_line1: "Toutes les orientations.",
  hero_title_line2: "Toutes les envies.",
  hero_subtitle:
    "L'amour, l'amitié, le fun — par orientation, sans bruit, sans prix. Embir filtre pour que tu trouves, pas pour que tu scrolles.",
  hero_cta_primary: "Créer mon profil gratuit",
  hero_cta_secondary: "Vivre l'expérience",
  hero_strip: ["Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.", "Badge selfie disponible", "Signalement et blocage", "Multi-orientation"],
  hero_scroll_hint: "Fais défiler pour entrer",

  manifest_eyebrow: "Le manifeste",
  manifest_title: "Un espace pour chacun. Sans empiéter sur les autres.",
  manifest_body:
    "Les applications de rencontre mélangent tout le monde. Embir sépare. Chaque communauté obtient son propre espace, filtré par orientation et par intention. Pas de bruit. Pas de profils indésirables. Juste les bonnes personnes.",
  manifest_pillars: [
    { title: "Séparation réelle", body: "Le filtre est bidirectionnel et strict. Tu ne vois que les profils qui te correspondent et qui te cherchent aussi." },
    { title: "Sans carte bancaire", body: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit : profil, sélection, réciprocité et messages." },
    { title: "Vérification disponible", body: "Un membre peut envoyer un selfie avec un code unique. Si la demande est approuvée, un badge visible apparaît ; aucun badge ne garantit l’absence de risque." },
  ],

  model_eyebrow: "Comment ça marche",
  model_title: "Trois étapes. Zéro friction.",
  model_steps: [
    { num: "01", title: "Dis qui tu es", body: "Ton genre, ton orientation. C'est la base du filtre. Tu peux être fluide, bi, queer, pan — Embir s'adapte." },
    { num: "02", title: "Dis qui tu cherches", body: "Multi-sélection. Cherche plusieurs genres si tu es bi ou queer. Le filtre s'ajuste à ta réalité." },
    { num: "03", title: "Dis ce que tu veux", body: "Amour, amis, fun, plan cul, sport, événements. Embir te connecte aux personnes qui veulent la même chose." },
  ],
  model_outro: "Tu choisis. Embir filtre. Tout le monde est heureux.",

  econ_eyebrow: "Modèle économique",
  econ_title: "L'essentiel sans carte. Un produit durable.",
  econ_body:
    "Embir ne vend pas tes données et ne transforme pas la sécurité ou les connexions essentielles en leviers de frustration payante.",
  econ_cards: [
    { title: "Connexions essentielles", body: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.", tag: "Utilisateurs" },
    { title: "Embassadeurs", body: "Des membres de confiance animent les communautés locales et créent des événements réels.", tag: "Communauté" },
    { title: "Partenariats éthiques", body: "Collaborations avec des marques et associations alignées sur nos valeurs. Pas de pub intrusive.", tag: "Revenus" },
  ],
  econ_pledge: "Nos engagements : transparence, vie privée et sécurité. Non négociables.",

  universe_eyebrow: "Choisis ton intention",
  universe_title: "Une application. Toutes les raisons de se rencontrer.",
  universe_subtitle: "Moins de confusion. Tu dis ce que tu veux, Embir te montre les personnes qui veulent la même chose.",
  universe_cards: [
    { icon: "♥", title: "Amour", body: "Relation sérieuse. Trouve quelqu'un avec qui construire." },
    { icon: "✦", title: "Amis", body: "Élargis ton cercle, partage tes passions." },
    { icon: "⚡", title: "Fun", body: "S'amuser, faire la fête, vivre l'instant." },
    { icon: "✸", title: "Plan cul", body: "Rencontres sans engagement. Consentement et respect." },
    { icon: "◆", title: "Sport", body: "Trouve des partenaires d'entraînement, de course, d'escalade." },
    { icon: "❖", title: "Événements", body: "Crée ou rejoins des soirées, expos, concerts, voyages." },
  ],

  orient_eyebrow: "Multi-orientation",
  orient_title: "Ton orientation, tes règles.",
  orient_subtitle: "Embir respecte strictement ton orientation et tes préférences. Le filtre est bidirectionnel.",
  orient_cards: [
    { icon: "⚤", title: "Hétéro", body: "Tu cherches quelqu'un du sexe opposé. Tu ne vois que ces profils." },
    { icon: "⚣", title: "Gay", body: "Tu cherches un homme. Tu ne vois que les hommes qui te cherchent." },
    { icon: "⚢", title: "Lesbienne", body: "Tu cherches une femme. Tu ne vois que les femmes qui te cherchent." },
    { icon: "⚥", title: "Bi", body: "Tu cherches hommes et femmes. Le filtre s'ajuste à ta réalité." },
    { icon: "⚧", title: "Queer", body: "Tu es au-delà des catégories. Embir respecte ton identité." },
    { icon: "⬡", title: "Pan", body: "L'attirance n'a pas de genre. Tu vois qui te correspond." },
    { icon: "〰", title: "Fluide", body: "Ton orientation évolue. Embir s'adapte à chaque moment." },
    { icon: "◐", title: "Demi", body: "Tu ressens l'attirance après une connexion émotionnelle." },
    { icon: "◊", title: "Asexuel", body: "Tu cherches sans attirance sexuelle. Tendresse, amitié, complicité." },
    { icon: "✦", title: "Autre", body: "Ton orientation n'est pas listée. Embir t'accueille telle que tu es." },
  ],

  proof_eyebrow: "La communauté",
  proof_title: "Ce que les membres vivent.",
  proof_stats: [
    { value: "0 €", label: "Pour une connexion essentielle" },
    { value: "10", label: "Orientations respectées" },
    { value: "6", label: "Intentions claires" },
    { value: "Choix", label: "Mesure d’audience soumise au consentement" },
  ],

  journal_eyebrow: "Le journal",
  journal_title: "Idées, récits, et coulisses.",
  journal_subtitle: "Réflexions sur les rencontres, la technologie, et la construction d'une communauté internationale.",
  journal_articles: [
    { category: "Société", title: "Pourquoi le filtrage par orientation change tout", excerpt: "Les apps mélangent tout le monde. Embir sépare. Voici pourquoi c'est fondamental.", date: "15 juin 2026", readTime: "5 min" },
    { category: "Produit", title: "Comment nous avons conçu le filtre bidirectionnel", excerpt: "De la théorie à la pratique : l'ingénierie derrière un matching qui respecte tout le monde.", date: "10 juin 2026", readTime: "8 min" },
    { category: "Communauté", title: "Les ambassadeurs : bâtir des villes réelles", excerpt: "Comment des membres transforment Embir en mouvement local, ville par ville.", date: "5 juin 2026", readTime: "6 min" },
  ],
  journal_cta: "Lire tous les articles",

  resources_eyebrow: "Ressources",
  resources_title: "Tout pour comprendre et rejoindre.",
  resources_subtitle: "Guides, modèles, et documents. Libres d'accès, comme tout le reste.",
  resources_items: [
    { icon: "ⓘ", title: "Guide de démarrage", desc: "Tout ce qu'il faut savoir pour créer un profil qui attire les bonnes personnes.", type: "PDF", size: "2.4 MB" },
    { icon: "✦", title: "Charte de la communauté", desc: "Les règles, les valeurs, et les engagements qui régissent Embir.", type: "PDF", size: "1.1 MB" },
    { icon: "⚧", title: "Guide inclusion LGBTQ+", desc: "Comment Embir accueille chaque identité et chaque orientation.", type: "PDF", size: "3.2 MB" },
    { icon: "❖", title: "Kit ambassadeur", desc: "Organiser un événement Embir dans ta ville. Mode d'emploi complet.", type: "ZIP", size: "8.7 MB" },
  ],

  community_eyebrow: "La communauté",
  community_title: "Plus qu'une app. Un mouvement.",
  community_subtitle: "Embir n'existe pas seulement sur ton téléphone. Il vit dans les villes, les événements, les rencontres réelles.",
  community_features: [
    { icon: "📍", title: "Ambassadeurs locaux", body: "Des membres de confiance animent ta ville, organisent des événements, et accueillent les nouveaux." },
    { icon: "🎉", title: "Événements réels", body: "Soirées, workshops, rencontres sportives. Embir devient une excuse pour sortir de chez soi." },
    { icon: "💬", title: "Forums par intention", body: "Discute avec des personnes qui cherchent la même chose que toi, dans ta ville." },
    { icon: "⭐", title: "Contribution ouverte", body: "Propose des idées, vote pour les évolutions, construis la plateforme avec nous." },
  ],
  community_cta: "Rejoindre la communauté",

  member_eyebrow: "Rejoins l'écosystème",
  member_title: "Un univers, plusieurs portes d'entrée.",
  member_body: "Les connexions essentielles sont gratuites. Tu peux aussi devenir ambassadeur, créer des événements ou soutenir la plateforme.",
  member_tiers: [
    { name: "Membre", price: "0 €", perks: ["Sélection compatible", "Messagerie réciproque", "Vérification de profil", "Toutes les intentions"], cta: "Créer mon profil" },
    { name: "Ambassadeur", price: "Sur candidature", perks: ["Anime ta ville", "Crée des événements", "Badge officiel", "Accès anticipé aux features"], cta: "Postuler" },
    { name: "Soutien", price: "Libre", perks: ["Financer la gratuité", "Mention sur le mur", "Newsletter exclusive", "Pas de contrepartie materielle"], cta: "Soutenir" },
  ],

  news_title: "Reste connecté à Embir",
  news_body: "Nouveautés, événements, histoires de la communauté. Un mail par mois, jamais plus.",
  news_placeholder: "ton@email.com",
  news_cta: "S'abonner",
  news_success: "Merci ! Tu recevras bientôt des nouvelles.",

  contact_eyebrow: "Contact",
  contact_title: "Une idée ? Une question ? Un partenariat ?",
  contact_body: "Écris-nous. Une équipe réelle lit chaque message.",
  contact_fields: { name: "Ton nom", email: "Ton email", message: "Ton message" },
  contact_submit: "Envoyer",
  contact_success: "Message envoyé. On te répond sous 48h.",

  final_eyebrow: "Rejoins le mouvement",
  final_title: "Ton prochain chapitre commence ici.",
  final_body: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Juste des rencontres authentiques, pour toutes les orientations et toutes les envies.",
  final_cta: "Commencer maintenant",

  faq_title: "Questions fréquentes",
  faq_items: [
    { q: "Embir est-il vraiment gratuit ?", a: "Oui. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire : profil, sélection compatible, réciprocité et messages." },
    { q: "Un hétéro peut-il voir des profils gays ?", a: "Non, sauf si tu choisis explicitement de chercher plusieurs genres. Le filtre est bidirectionnel et strict." },
    { q: "Embir est-il seulement pour la communauté LGBTQ+ ?", a: "Non. Embir est pour tout le monde. L'objectif est que chaque communauté trouve son espace sans empiéter sur les autres." },
    { q: "Puis-je chercher plusieurs choses à la fois ?", a: "Oui. Tu peux sélectionner plusieurs intentions : amour ET amis, fun ET plan cul, sport ET événements." },
    { q: "Comment fonctionne la vérification des profils ?", a: "Tu peux envoyer un selfie avec un code unique. Si la demande est approuvée, un badge vérifié visible apparaît sur ton profil." },
  ],

  footer_tagline: "Là où chaque regard trouve sa suite.",
  footer_product: "Produit",
  footer_company: "Société",
  footer_resources: "Ressources",
  footer_legal: "Légal",
  footer_links_product: ["Fonctionnalités", "Sécurité", "Application mobile", "Roadmap"],
  footer_links_company: ["À propos", "Manifeste", "Ambassadeurs", "Carrières"],
  footer_links_resources: ["Journal", "Guides", "Charte", "Support"],
  footer_links_legal: ["Confidentialité", "Conditions", "Cookies", "Mentions légales"],
  footer_rights: "Tous droits réservés.",
  footer_made_with: "Conçu avec soin pour toutes les orientations.",

  nav_vision: "Vision",
  nav_model: "Modèle",
  nav_universe: "Univers",
  nav_pricing: "Offres",
  nav_community: "Communauté",
  nav_journal: "Journal",
  nav_contact: "Contact",
  nav_join: "Rejoindre",
};

const en: CopySet = {
  hero_badge: "Free core connections",
  hero_title_line1: "Every orientation.",
  hero_title_line2: "Every intention.",
  hero_subtitle:
    "Love, friendship, fun — by orientation, without noise, without price. Embir filters so you find, not so you scroll.",
  hero_cta_primary: "Create your free profile",
  hero_cta_secondary: "Experience it",
  hero_strip: ["Everything needed to meet someone is free. No credit card required", "Optional verified badge", "Reporting and blocking", "Multi-orientation"],
  hero_scroll_hint: "Scroll to enter",

  manifest_eyebrow: "The manifesto",
  manifest_title: "A space for everyone. Without stepping on anyone.",
  manifest_body:
    "Dating apps mix everyone together. Embir separates. Each community gets its own space, filtered by orientation and intention. No noise. No unwanted profiles. Just the right people.",
  manifest_pillars: [
    { title: "Real separation", body: "The filter is bidirectional and strict. You only see profiles that match you AND are looking for you too." },
    { title: "No credit card", body: "Everything needed to meet someone is free: profile, selection, reciprocity and messages." },
    { title: "Verification available", body: "A member can submit a selfie with a unique code. If approved, a visible badge appears; no badge guarantees the absence of risk." },
  ],

  model_eyebrow: "How it works",
  model_title: "Three steps. Zero friction.",
  model_steps: [
    { num: "01", title: "Say who you are", body: "Your gender, your orientation. That's the filter foundation. Be fluid, bi, queer, pan — Embir adapts." },
    { num: "02", title: "Say who you're looking for", body: "Multi-select. Look for multiple genders if you're bi or queer. The filter adjusts to your reality." },
    { num: "03", title: "Say what you want", body: "Love, friends, fun, casual, sports, events. Embir connects you to people who want the same thing." },
  ],
  model_outro: "You choose. Embir filters. Everyone's happy.",

  econ_eyebrow: "Business model",
  econ_title: "No card for the essentials. Built to last.",
  econ_body:
    "Embir does not sell your data or turn safety and core connections into paid frustration levers.",
  econ_cards: [
    { title: "Core connections", body: "Everything needed to meet someone is free. No credit card required.", tag: "Users" },
    { title: "Ambassadors", body: "Trusted members run local communities and create real-world events.", tag: "Community" },
    { title: "Ethical partnerships", body: "Collaborations with brands and associations aligned with our values. No intrusive ads.", tag: "Revenue" },
  ],
  econ_pledge: "Our commitments: transparency, privacy and safety. Non-negotiable.",

  universe_eyebrow: "Choose your intention",
  universe_title: "One app. Every reason to meet.",
  universe_subtitle: "Less confusion. You say what you want, Embir shows you people who want the same.",
  universe_cards: [
    { icon: "♥", title: "Love", body: "Serious relationship. Find someone to build with." },
    { icon: "✦", title: "Friends", body: "Expand your circle, share your passions." },
    { icon: "⚡", title: "Fun", body: "Have fun, party, live the moment." },
    { icon: "✸", title: "Casual", body: "No-strings encounters. Consent and respect first." },
    { icon: "◆", title: "Sports", body: "Find training, running, climbing partners." },
    { icon: "❖", title: "Events", body: "Create or join parties, exhibitions, concerts, trips." },
  ],

  orient_eyebrow: "Multi-orientation",
  orient_title: "Your orientation, your rules.",
  orient_subtitle: "Embir strictly respects your orientation and preferences. The filter is bidirectional.",
  orient_cards: [
    { icon: "⚤", title: "Straight", body: "You're looking for someone of the opposite sex. You only see those profiles." },
    { icon: "⚣", title: "Gay", body: "You're looking for a man. You only see men who are looking for you." },
    { icon: "⚢", title: "Lesbian", body: "You're looking for a woman. You only see women who are looking for you." },
    { icon: "⚥", title: "Bi", body: "You're looking for men and women. The filter adjusts to your reality." },
    { icon: "⚧", title: "Queer", body: "You're beyond categories. Embir respects your identity." },
    { icon: "⬡", title: "Pan", body: "Attraction has no gender. You see who matches you." },
    { icon: "〰", title: "Fluid", body: "Your orientation evolves. Embir adapts to every moment." },
    { icon: "◐", title: "Demi", body: "You feel attraction after an emotional connection." },
    { icon: "◊", title: "Asexual", body: "You're looking without sexual attraction. Tenderness, friendship, closeness." },
    { icon: "✦", title: "Other", body: "Your orientation isn't listed. Embir welcomes you as you are." },
  ],

  proof_eyebrow: "The community",
  proof_title: "What members experience.",
  proof_stats: [
    { value: "€0", label: "For a core connection" },
    { value: "10", label: "Orientations respected" },
    { value: "6", label: "Clear intentions" },
    { value: "Choice", label: "Audience measurement requires consent" },
  ],

  journal_eyebrow: "The journal",
  journal_title: "Ideas, stories, and behind the scenes.",
  journal_subtitle: "Reflections on dating, technology, and building an international community.",
  journal_articles: [
    { category: "Society", title: "Why orientation filtering changes everything", excerpt: "Apps mix everyone. Embir separates. Here's why it matters.", date: "June 15, 2026", readTime: "5 min" },
    { category: "Product", title: "How we designed the bidirectional filter", excerpt: "From theory to practice: the engineering behind matching that respects everyone.", date: "June 10, 2026", readTime: "8 min" },
    { category: "Community", title: "Ambassadors: building real cities", excerpt: "How members turn Embir into a local movement, city by city.", date: "June 5, 2026", readTime: "6 min" },
  ],
  journal_cta: "Read all articles",

  resources_eyebrow: "Resources",
  resources_title: "Everything to understand and join.",
  resources_subtitle: "Guides, templates, and documents. Free access, like everything else.",
  resources_items: [
    { icon: "ⓘ", title: "Getting started guide", desc: "Everything you need to create a profile that attracts the right people.", type: "PDF", size: "2.4 MB" },
    { icon: "✦", title: "Community charter", desc: "The rules, values, and commitments that govern Embir.", type: "PDF", size: "1.1 MB" },
    { icon: "⚧", title: "LGBTQ+ inclusion guide", desc: "How Embir welcomes every identity and every orientation.", type: "PDF", size: "3.2 MB" },
    { icon: "❖", title: "Ambassador kit", desc: "Organize an Embir event in your city. Complete playbook.", type: "ZIP", size: "8.7 MB" },
  ],

  community_eyebrow: "The community",
  community_title: "More than an app. A movement.",
  community_subtitle: "Embir doesn't just live on your phone. It lives in cities, events, real encounters.",
  community_features: [
    { icon: "📍", title: "Local ambassadors", body: "Trusted members run your city, organize events, and welcome newcomers." },
    { icon: "🎉", title: "Real events", body: "Parties, workshops, sports meetups. Embir becomes a reason to go out." },
    { icon: "💬", title: "Forums by intention", body: "Talk with people looking for the same thing as you, in your city." },
    { icon: "⭐", title: "Open contribution", body: "Propose ideas, vote on features, build the platform with us." },
  ],
  community_cta: "Join the community",

  member_eyebrow: "Join the ecosystem",
  member_title: "One universe, several entry points.",
  member_body: "Core connections are free. You can also become an ambassador, create events or support the platform.",
  member_tiers: [
    { name: "Member", price: "€0", perks: ["Compatible selection", "Reciprocal messaging", "Profile verification", "All intentions"], cta: "Create my profile" },
    { name: "Ambassador", price: "By application", perks: ["Run your city", "Create events", "Official badge", "Early feature access"], cta: "Apply" },
    { name: "Supporter", price: "Pay what you want", perks: ["Fund the free model", "Wall mention", "Exclusive newsletter", "No material rewards"], cta: "Support" },
  ],

  news_title: "Stay connected to Embir",
  news_body: "News, events, community stories. One email per month, never more.",
  news_placeholder: "your@email.com",
  news_cta: "Subscribe",
  news_success: "Thank you! You'll hear from us soon.",

  contact_eyebrow: "Contact",
  contact_title: "An idea? A question? A partnership?",
  contact_body: "Write to us. A real team reads every message.",
  contact_fields: { name: "Your name", email: "Your email", message: "Your message" },
  contact_submit: "Send",
  contact_success: "Message sent. We'll reply within 48h.",

  final_eyebrow: "Join the movement",
  final_title: "Your next chapter starts here.",
  final_body: "Everything needed to meet someone is free. No credit card required. No ads. No hidden subscriptions. Just authentic connections, for every orientation and every intention.",
  final_cta: "Get started now",

  faq_title: "Frequently asked questions",
  faq_items: [
    { q: "Is Embir really free?", a: "Yes. Everything needed to meet someone is free. No credit card required: profile, compatible selection, reciprocity and messaging." },
    { q: "Can a straight person see gay profiles?", a: "No, unless you explicitly choose to look for multiple genders. The filter is bidirectional and strict." },
    { q: "Is Embir only for the LGBTQ+ community?", a: "No. Embir is for everyone. The goal is for each community to find its space without encroaching on others." },
    { q: "Can I look for multiple things at once?", a: "Yes. You can select multiple intentions: love AND friends, fun AND casual, sports AND events." },
    { q: "How does profile verification work?", a: "By selfie: you take a live photo, our system verifies you're the person in your photos." },
  ],

  footer_tagline: "Where every look finds what's next.",
  footer_product: "Product",
  footer_company: "Company",
  footer_resources: "Resources",
  footer_legal: "Legal",
  footer_links_product: ["Features", "Security", "Mobile app", "Roadmap"],
  footer_links_company: ["About", "Manifesto", "Ambassadors", "Careers"],
  footer_links_resources: ["Journal", "Guides", "Charter", "Support"],
  footer_links_legal: ["Privacy", "Terms", "Cookies", "Legal notice"],
  footer_rights: "All rights reserved.",
  footer_made_with: "Crafted with care for every orientation.",

  nav_vision: "Vision",
  nav_model: "Model",
  nav_universe: "Universe",
  nav_pricing: "Pricing",
  nav_community: "Community",
  nav_journal: "Journal",
  nav_contact: "Contact",
  nav_join: "Join",
};

const es: CopySet = {
  hero_badge: "Conexiones esenciales gratis",
  hero_title_line1: "Todas las orientaciones.",
  hero_title_line2: "Todas las intenciones.",
  hero_subtitle:
    "Amor, amistad, diversión — por orientación, sin ruido, sin precio. Embir filtra para que encuentres, no para que hagas scroll.",
  hero_cta_primary: "Crear mi perfil gratis",
  hero_cta_secondary: "Vivir la experiencia",
  hero_strip: ["Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria.", "Insignia verificada opcional", "Denuncia y bloqueo", "Multi-orientación"],
  hero_scroll_hint: "Desplázate para entrar",

  manifest_eyebrow: "El manifiesto",
  manifest_title: "Un espacio para cada persona. Sin pisar a nadie.",
  manifest_body:
    "Las apps de citas mezclan a todos. Embir separa. Cada comunidad obtiene su propio espacio, filtrado por orientación e intención. Sin ruido. Sin perfiles no deseados. Solo las personas correctas.",
  manifest_pillars: [
    { title: "Separación real", body: "El filtro es bidireccional y estricto. Solo ves los perfiles que te corresponden Y que también te buscan." },
    { title: "Sin tarjeta bancaria", body: "Todo lo necesario para conocer a alguien es gratis: perfil, selección, reciprocidad y mensajes." },
    { title: "Verificación disponible", body: "Un miembro puede enviar un selfie con un código único. Si se aprueba, aparece una insignia visible; ninguna insignia elimina todos los riesgos." },
  ],

  model_eyebrow: "Cómo funciona",
  model_title: "Tres pasos. Cero fricción.",
  model_steps: [
    { num: "01", title: "Di quién eres", body: "Tu género, tu orientación. Es la base del filtro. Sé fluido, bi, queer, pan — Embir se adapta." },
    { num: "02", title: "Di a quién buscas", body: "Selección múltiple. Busca varios géneros si eres bi o queer. El filtro se ajusta a tu realidad." },
    { num: "03", title: "Di qué quieres", body: "Amor, amigos, diversión, casual, deportes, eventos. Embir te conecta con personas que quieren lo mismo." },
  ],
  model_outro: "Tú eliges. Embir filtra. Todos felices.",

  econ_eyebrow: "Modelo económico",
  econ_title: "Lo esencial sin tarjeta. Un producto sostenible.",
  econ_body:
    "Embir no vende tus datos ni convierte la seguridad o las conexiones esenciales en palancas de frustración de pago.",
  econ_cards: [
    { title: "Conexiones esenciales", body: "Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria.", tag: "Usuarios" },
    { title: "Embajadores", body: "Miembros de confianza animan las comunidades locales y crean eventos reales.", tag: "Comunidad" },
    { title: "Alianzas éticas", body: "Colaboraciones con marcas y asociaciones alineadas con nuestros valores. Sin anuncios intrusivos.", tag: "Ingresos" },
  ],
  econ_pledge: "Nuestros compromisos: transparencia, privacidad y seguridad. No negociables.",

  universe_eyebrow: "Elige tu intención",
  universe_title: "Una app. Todas las razones para encontrarse.",
  universe_subtitle: "Sin confusión. Dices lo que quieres, Embir te muestra a personas que quieren lo mismo.",
  universe_cards: [
    { icon: "♥", title: "Amor", body: "Relación seria. Encuentra a alguien con quien construir." },
    { icon: "✦", title: "Amigos", body: "Amplía tu círculo, comparte tus pasiones." },
    { icon: "⚡", title: "Diversión", body: "Divertirse, fiesta, vivir el momento." },
    { icon: "✸", title: "Casual", body: "Encuentros sin compromiso. Consentimiento y respeto." },
    { icon: "◆", title: "Deportes", body: "Encuentra compañeros de entreno, carrera, escalada." },
    { icon: "❖", title: "Eventos", body: "Crea o únete a fiestas, expos, conciertos, viajes." },
  ],

  orient_eyebrow: "Multi-orientación",
  orient_title: "Tu orientación, tus reglas.",
  orient_subtitle: "Embir respeta estrictamente tu orientación y tus preferencias. El filtro es bidireccional.",
  orient_cards: [
    { icon: "⚤", title: "Hetero", body: "Buscas a alguien del sexo opuesto. Solo ves esos perfiles." },
    { icon: "⚣", title: "Gay", body: "Buscas un hombre. Solo ves a los hombres que te buscan." },
    { icon: "⚢", title: "Lesbiana", body: "Buscas una mujer. Solo ves a las mujeres que te buscan." },
    { icon: "⚥", title: "Bi", body: "Buscas hombres y mujeres. El filtro se ajusta a tu realidad." },
    { icon: "⚧", title: "Queer", body: "Estás más allá de las categorías. Embir respeta tu identidad." },
    { icon: "⬡", title: "Pan", body: "La atracción no tiene género. Ves quien te corresponde." },
    { icon: "〰", title: "Fluide", body: "Tu orientación evoluciona. Embir se adapta a cada momento." },
    { icon: "◐", title: "Demi", body: "Sientes atracción después de una conexión emocional." },
    { icon: "◊", title: "Asexual", body: "Buscas sin atracción sexual. Ternura, amistad, complicidad." },
    { icon: "✦", title: "Otro", body: "Tu orientación no está listada. Embir te acoge como eres." },
  ],

  proof_eyebrow: "La comunidad",
  proof_title: "Lo que viven los miembros.",
  proof_stats: [
    { value: "0 €", label: "Para una conexión esencial" },
    { value: "10", label: "Orientaciones respetadas" },
    { value: "6", label: "Intenciones claras" },
    { value: "Elección", label: "La medición de audiencia requiere consentimiento" },
  ],

  journal_eyebrow: "El diario",
  journal_title: "Ideas, relatos, y detrás de las cámaras.",
  journal_subtitle: "Reflexiones sobre citas, tecnología, y construcción de una comunidad internacional.",
  journal_articles: [
    { category: "Sociedad", title: "Por qué el filtrado por orientación lo cambia todo", excerpt: "Las apps mezclan a todos. Embir separa. Esto es por qué importa.", date: "15 junio 2026", readTime: "5 min" },
    { category: "Producto", title: "Cómo diseñamos el filtro bidireccional", excerpt: "De la teoría a la práctica: la ingeniería detrás de un matching que respeta a todos.", date: "10 junio 2026", readTime: "8 min" },
    { category: "Comunidad", title: "Embajadores: construyendo ciudades reales", excerpt: "Cómo los miembros transforman Embir en un movimiento local, ciudad por ciudad.", date: "5 junio 2026", readTime: "6 min" },
  ],
  journal_cta: "Leer todos los artículos",

  resources_eyebrow: "Recursos",
  resources_title: "Todo para entender y unirse.",
  resources_subtitle: "Guías, plantillas, y documentos. Acceso libre, como todo lo demás.",
  resources_items: [
    { icon: "ⓘ", title: "Guía de inicio", desc: "Todo lo que necesitas para crear un perfil que atraiga a las personas correctas.", type: "PDF", size: "2.4 MB" },
    { icon: "✦", title: "Carta de la comunidad", desc: "Las reglas, valores y compromisos que rigen Embir.", type: "PDF", size: "1.1 MB" },
    { icon: "⚧", title: "Guía de inclusión LGBTQ+", desc: "Cómo Embir acoge cada identidad y cada orientación.", type: "PDF", size: "3.2 MB" },
    { icon: "❖", title: "Kit embajador", desc: "Organiza un evento Embir en tu ciudad. Manual completo.", type: "ZIP", size: "8.7 MB" },
  ],

  community_eyebrow: "La comunidad",
  community_title: "Más que una app. Un movimiento.",
  community_subtitle: "Embir no solo vive en tu teléfono. Vive en ciudades, eventos, encuentros reales.",
  community_features: [
    { icon: "📍", title: "Embajadores locales", body: "Miembros de confianza animan tu ciudad, organizan eventos y acogen a los nuevos." },
    { icon: "🎉", title: "Eventos reales", body: "Fiestas, talleres, encuentros deportivos. Embir se convierte en una excusa para salir." },
    { icon: "💬", title: "Foros por intención", body: "Habla con personas que buscan lo mismo que tú, en tu ciudad." },
    { icon: "⭐", title: "Contribución abierta", body: "Propón ideas, vota en las evoluciones, construye la plataforma con nosotros." },
  ],
  community_cta: "Unirse a la comunidad",

  member_eyebrow: "Únete al ecosistema",
  member_title: "Un universo, varias puertas de entrada.",
  member_body: "Las conexiones esenciales son gratis. También puedes ser embajador, crear eventos o apoyar la plataforma.",
  member_tiers: [
    { name: "Miembro", price: "0 €", perks: ["Selección compatible", "Mensajería recíproca", "Verificación de perfil", "Todas las intenciones"], cta: "Crear mi perfil" },
    { name: "Embajador", price: "Por candidatura", perks: ["Animas tu ciudad", "Creas eventos", "Insignia oficial", "Acceso anticipado"], cta: "Postular" },
    { name: "Apoyo", price: "Libre", perks: ["Financiar el modelo gratis", "Mención en el muro", "Newsletter exclusiva", "Sin recompensas materiales"], cta: "Apoyar" },
  ],

  news_title: "Mantente conectado a Embir",
  news_body: "Novedades, eventos, historias de la comunidad. Un correo al mes, nunca más.",
  news_placeholder: "tu@email.com",
  news_cta: "Suscribirse",
  news_success: "¡Gracias! Pronto tendrás noticias.",

  contact_eyebrow: "Contacto",
  contact_title: "¿Una idea? ¿Una pregunta? ¿Una alianza?",
  contact_body: "Escríbenos. Un equipo real lee cada mensaje.",
  contact_fields: { name: "Tu nombre", email: "Tu email", message: "Tu mensaje" },
  contact_submit: "Enviar",
  contact_success: "Mensaje enviado. Respondemos en 48h.",

  final_eyebrow: "Únete al movimiento",
  final_title: "Tu próximo capítulo empieza aquí.",
  final_body: "Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria. Conexiones auténticas para todas las orientaciones e intenciones.",
  final_cta: "Empezar ahora",

  faq_title: "Preguntas frecuentes",
  faq_items: [
    { q: "¿Embir es realmente gratis?", a: "Sí. Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria: perfil, selección compatible, reciprocidad y mensajes." },
    { q: "¿Puede una persona hetero ver perfiles gays?", a: "No, a menos que elijas explícitamente buscar varios géneros. El filtro es bidireccional y estricto." },
    { q: "¿Embir es solo para la comunidad LGBTQ+?", a: "No. Embir es para todos. El objetivo es que cada comunidad encuentre su espacio sin invadir a las demás." },
    { q: "¿Puedo buscar varias cosas a la vez?", a: "Sí. Puedes seleccionar varias intenciones: amor Y amigos, diversión Y casual, deportes Y eventos." },
    { q: "¿Cómo funciona la verificación de perfiles?", a: "Puedes enviar un selfie con un código único. Si se aprueba la solicitud, aparece una insignia visible en tu perfil." },
  ],

  footer_tagline: "Donde cada mirada encuentra lo que sigue.",
  footer_product: "Producto",
  footer_company: "Empresa",
  footer_resources: "Recursos",
  footer_legal: "Legal",
  footer_links_product: ["Funciones", "Seguridad", "App móvil", "Roadmap"],
  footer_links_company: ["Sobre nosotros", "Manifiesto", "Embajadores", "Empleo"],
  footer_links_resources: ["Diario", "Guías", "Carta", "Soporte"],
  footer_links_legal: ["Privacidad", "Términos", "Cookies", "Aviso legal"],
  footer_rights: "Todos los derechos reservados.",
  footer_made_with: "Hecho con cuidado para todas las orientaciones.",

  nav_vision: "Visión",
  nav_model: "Modelo",
  nav_universe: "Universo",
  nav_pricing: "Planes",
  nav_community: "Comunidad",
  nav_journal: "Diario",
  nav_contact: "Contacto",
  nav_join: "Unirse",
};

export const LANDING_COPY: Record<"fr" | "en" | "es", CopySet> = { fr, en, es };

export function getCopy(locale: string): CopySet {
  if (locale === "fr") return fr;
  if (locale === "es") return es;
  return en;
}
