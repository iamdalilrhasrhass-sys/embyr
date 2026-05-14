export const PRICING = [
  {
    id: "premium_1w",
    name: "1 semaine",
    price: 4.99,
    period: "1 semaine",
    mention: "Idéal pour tester",
    compareLabel: "au lieu de 7,99 € sur les plateformes classiques",
    popular: false,
    recommended: false,
  },
  {
    id: "premium_1m",
    name: "1 mois",
    price: 14.99,
    period: "1 mois",
    mention: "Le plus choisi",
    compareLabel: "moins cher que 19,99 €",
    popular: false,
    recommended: true,
  },
  {
    id: "premium_3m",
    name: "3 mois",
    price: 29.99,
    period: "3 mois",
    mention: "Le plus populaire",
    compareLabel: "économisez 10 € face aux offres classiques",
    popular: true,
    recommended: false,
  },
  {
    id: "premium_12m",
    name: "12 mois",
    price: 49.99,
    period: "12 mois",
    mention: "Le plus économique",
    compareLabel: "moins cher que 79,99 €",
    popular: false,
    recommended: false,
  }
];

export const FAST_OPTIONS = [
  {
    id: "decouverte_24h",
    name: "Accès 24h Découverte",
    price: 2.49,
    period: "24h"
  },
  {
    id: "boost_24h",
    name: "Boost profil 24h",
    price: 0.99,
    period: "24h"
  },
  {
    id: "highlight_7d",
    name: "VIP annuel",
    price: 69.99,
    period: "1 an"
  }
];

export const PREMIUM_FEATURES = [
  "Messagerie illimitée",
  "Voir qui a consulté mon profil",
  "Voir qui m'a ajouté en favoris",
  "Recherche en ligne",
  "Recherche par préférences",
  "Accès aux profils vérifiés",
  "Accès aux albums publics",
  "Accès aux albums privés si autorisé par le profil",
  "Favoris illimités",
  "Mode discret",
  "Filtrer les profils connectés",
  "Masquer certaines visites",
  "Accès prioritaire aux nouveaux profils",
  "Support prioritaire",
  "Navigation confidentielle",
  "Accès gratuit actif de 00h00 à 07h00 selon les règles de la plateforme"
];

export function formatPriceEUR(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}
