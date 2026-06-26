import type { DiscoveryGender, DiscoverySeeking } from "@/lib/discovery-preview";

export type DiscoveryLocale = "fr" | "en";

export interface DiscoveryOption<T extends string> {
  value: T;
  label: string;
}

export interface DiscoveryCopy {
  title: string;
  subtitle: string;
  disclosure: string;
  fields: {
    gender: string;
    seeking: string;
    intent: string;
    city: string;
    cityPlaceholder: string;
  };
  genderOptions: Array<DiscoveryOption<DiscoveryGender>>;
  seekingOptions: Array<DiscoveryOption<DiscoverySeeking>>;
  intentOptions: Array<DiscoveryOption<string>>;
  submit: string;
  loading: string;
  resultsTitle: string;
  emptyTitle: string;
  emptyBody: string;
  unavailableTitle: string;
  unavailableBody: string;
  retry: string;
  unlock: string;
  noCard: string;
}

export const discoveryCopy: Record<DiscoveryLocale, DiscoveryCopy> = {
  fr: {
    title: "Découvrez des profils compatibles, sans vous inscrire d’abord.",
    subtitle:
      "Répondez à trois questions, puis voyez si Embir trouve déjà des personnes alignées avec votre intention.",
    disclosure:
      "Aperçus anonymisés issus de profils réellement publiés. Aucun nom, photo, activité exacte ou identifiant n’est affiché avant inscription.",
    fields: {
      gender: "Je suis",
      seeking: "Je cherche",
      intent: "Pour",
      city: "Ville",
      cityPlaceholder: "Paris, Lyon, Genève…",
    },
    genderOptions: [
      { value: "homme", label: "Un homme" },
      { value: "femme", label: "Une femme" },
      { value: "autre", label: "Autre" },
    ],
    seekingOptions: [
      { value: "homme", label: "Des hommes" },
      { value: "femme", label: "Des femmes" },
      { value: "tout", label: "Ouvert" },
    ],
    intentOptions: [
      { value: "AMOUR", label: "Amour" },
      { value: "AMIS", label: "Amitié" },
      { value: "FUN", label: "Fun" },
      { value: "PLAN_CUL", label: "Casual" },
      { value: "SPORT", label: "Sport" },
      { value: "EVENEMENTS", label: "Sorties" },
    ],
    submit: "Voir les aperçus",
    loading: "Recherche d’aperçus anonymisés…",
    resultsTitle: "Aperçus compatibles trouvés",
    emptyTitle: "Embir se construit ville par ville.",
    emptyBody:
      "Aucun aperçu réel ne correspond encore à ces critères. Soyez parmi les premiers de votre secteur et aidez la communauté à démarrer proprement.",
    unavailableTitle: "Les aperçus sont temporairement indisponibles.",
    unavailableBody:
      "Le service de découverte ne répond pas pour l’instant. Ce n’est pas présenté comme une absence de profils.",
    retry: "Réessayer",
    unlock: "Créer mon profil pour débloquer",
    noCard: "Aucune carte réelle à afficher.",
  },
  en: {
    title: "Explore compatible profiles before you sign up.",
    subtitle:
      "Answer three quick questions, then see whether Embir already finds people aligned with your intention.",
    disclosure:
      "Anonymized previews from real published profiles. No name, photo, exact activity, or identifier appears before signup.",
    fields: {
      gender: "I am",
      seeking: "Looking for",
      intent: "For",
      city: "City",
      cityPlaceholder: "Paris, Lyon, Geneva…",
    },
    genderOptions: [
      { value: "homme", label: "A man" },
      { value: "femme", label: "A woman" },
      { value: "autre", label: "Another identity" },
    ],
    seekingOptions: [
      { value: "homme", label: "Men" },
      { value: "femme", label: "Women" },
      { value: "tout", label: "Open" },
    ],
    intentOptions: [
      { value: "AMOUR", label: "Love" },
      { value: "AMIS", label: "Friendship" },
      { value: "FUN", label: "Fun" },
      { value: "PLAN_CUL", label: "Casual" },
      { value: "SPORT", label: "Sport" },
      { value: "EVENEMENTS", label: "Events" },
    ],
    submit: "Show previews",
    loading: "Looking for anonymized previews…",
    resultsTitle: "Compatible previews found",
    emptyTitle: "Embir is growing city by city.",
    emptyBody:
      "No real preview matches these criteria yet. Be among the first in your area and help the community start cleanly.",
    unavailableTitle: "Previews are temporarily unavailable.",
    unavailableBody:
      "Discovery is not responding right now. We do not present this as an absence of profiles.",
    retry: "Try again",
    unlock: "Create my profile to unlock",
    noCard: "No real card to display.",
  },
};

