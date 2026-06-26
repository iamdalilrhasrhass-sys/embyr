// ═══════════════════════════════════════════════════════════
//  EMBIR — SEO Cities Data
//  Villes FR · CH · UK · US pour pages programmatiques
// ═══════════════════════════════════════════════════════════

export interface CityData {
  slug: string;
  name: string;
  nameEn: string;
  country: "FR" | "CH" | "UK" | "US";
  region: string;
  lat: number;
  lng: number;
  population: string;
  contextFr?: string;
}

export const SEO_CITIES: CityData[] = [
  // France
  { slug: "paris", name: "Paris", nameEn: "Paris", country: "FR", region: "Île-de-France", lat: 48.8566, lng: 2.3522, population: "2.1M", contextFr: "Paris concentre une vie culturelle dense, des quartiers très différents et des rythmes de rencontre qui varient du Marais aux Grands Boulevards." },
  { slug: "lyon", name: "Lyon", nameEn: "Lyon", country: "FR", region: "Auvergne-Rhône-Alpes", lat: 45.7640, lng: 4.8357, population: "520K", contextFr: "Entre Rhône et Saône, Lyon mêle vie étudiante, quartiers créatifs et sorties conviviales de la Presqu’île à la Croix-Rousse." },
  { slug: "marseille", name: "Marseille", nameEn: "Marseille", country: "FR", region: "PACA", lat: 43.2965, lng: 5.3698, population: "870K", contextFr: "Ouverte sur la Méditerranée, Marseille rassemble des parcours très divers autour du Vieux-Port, des plages et des quartiers populaires." },
  { slug: "toulouse", name: "Toulouse", nameEn: "Toulouse", country: "FR", region: "Occitanie", lat: 43.6047, lng: 1.4442, population: "490K", contextFr: "Ville rose et étudiante, Toulouse combine vie aéronautique, terrasses du Sud-Ouest et promenades autour de la Garonne." },
  { slug: "nice", name: "Nice", nameEn: "Nice", country: "FR", region: "PACA", lat: 43.7102, lng: 7.2620, population: "340K", contextFr: "Nice rassemble lumière méditerranéenne, vieille ville, promenade des Anglais et rencontres marquées par le rythme de la Côte d’Azur." },
  { slug: "nantes", name: "Nantes", nameEn: "Nantes", country: "FR", region: "Pays de la Loire", lat: 47.2184, lng: -1.5536, population: "320K", contextFr: "Nantes relie créativité, bords de Loire et vie culturelle, avec une scène locale qui attire autant étudiants que jeunes actifs." },
  { slug: "strasbourg", name: "Strasbourg", nameEn: "Strasbourg", country: "FR", region: "Grand Est", lat: 48.5734, lng: 7.7521, population: "290K", contextFr: "Strasbourg mêle ambiance européenne, quartiers étudiants, canaux et influences franco-allemandes autour de la Petite France." },
  { slug: "montpellier", name: "Montpellier", nameEn: "Montpellier", country: "FR", region: "Occitanie", lat: 43.6108, lng: 3.8767, population: "290K", contextFr: "Montpellier reste l’une des grandes villes étudiantes du Sud, entre l’Écusson, les nouveaux quartiers et les plages proches." },
  { slug: "bordeaux", name: "Bordeaux", nameEn: "Bordeaux", country: "FR", region: "Nouvelle-Aquitaine", lat: 44.8378, lng: -0.5792, population: "260K", contextFr: "Bordeaux attire étudiants, jeunes actifs et nouveaux arrivants autour de ses quais, de ses quartiers rénovés et de sa culture du vin." },
  { slug: "lille", name: "Lille", nameEn: "Lille", country: "FR", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573, population: "230K", contextFr: "Lille vit sur la convivialité du Nord, les estaminets, une forte présence étudiante et des liens faciles avec la Belgique." },
  { slug: "rennes", name: "Rennes", nameEn: "Rennes", country: "FR", region: "Bretagne", lat: 48.1173, lng: -1.6778, population: "220K", contextFr: "Rennes combine énergie étudiante, scènes musicales, rues médiévales et sociabilité bretonne autour de son centre vivant." },
  { slug: "reims", name: "Reims", nameEn: "Reims", country: "FR", region: "Grand Est", lat: 49.2583, lng: 4.0317, population: "180K" },
  { slug: "le-havre", name: "Le Havre", nameEn: "Le Havre", country: "FR", region: "Normandie", lat: 49.4944, lng: 0.1079, population: "170K" },
  { slug: "saint-etienne", name: "Saint-Étienne", nameEn: "Saint-Étienne", country: "FR", region: "Auvergne-Rhône-Alpes", lat: 45.4397, lng: 4.3872, population: "170K" },
  { slug: "toulon", name: "Toulon", nameEn: "Toulon", country: "FR", region: "PACA", lat: 43.1242, lng: 5.9280, population: "170K" },
  { slug: "grenoble", name: "Grenoble", nameEn: "Grenoble", country: "FR", region: "Auvergne-Rhône-Alpes", lat: 45.1885, lng: 5.7245, population: "160K", contextFr: "Au pied des Alpes, Grenoble attire profils étudiants, scientifiques et amateurs de montagne dans une ville tournée vers l’extérieur." },
  { slug: "dijon", name: "Dijon", nameEn: "Dijon", country: "FR", region: "Bourgogne-Franche-Comté", lat: 47.3220, lng: 5.0415, population: "150K" },
  { slug: "angers", name: "Angers", nameEn: "Angers", country: "FR", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632, population: "150K" },
  { slug: "nimes", name: "Nîmes", nameEn: "Nîmes", country: "FR", region: "Occitanie", lat: 43.8367, lng: 4.3601, population: "140K" },
  { slug: "villeurbanne", name: "Villeurbanne", nameEn: "Villeurbanne", country: "FR", region: "Auvergne-Rhône-Alpes", lat: 45.7662, lng: 4.8794, population: "150K" },

  // Suisse
  { slug: "zurich", name: "Zurich", nameEn: "Zurich", country: "CH", region: "Zurich", lat: 47.3769, lng: 8.5417, population: "430K" },
  { slug: "geneve", name: "Genève", nameEn: "Geneva", country: "CH", region: "Genève", lat: 46.2044, lng: 6.1432, population: "200K" },
  { slug: "lausanne", name: "Lausanne", nameEn: "Lausanne", country: "CH", region: "Vaud", lat: 46.5197, lng: 6.6323, population: "140K" },
  { slug: "berne", name: "Berne", nameEn: "Bern", country: "CH", region: "Berne", lat: 46.9480, lng: 7.4474, population: "130K" },
  { slug: "basel", name: "Bâle", nameEn: "Basel", country: "CH", region: "Bâle-Ville", lat: 47.5596, lng: 7.5886, population: "170K" },
  { slug: "lugano", name: "Lugano", nameEn: "Lugano", country: "CH", region: "Tessin", lat: 46.0037, lng: 8.9511, population: "70K" },

  // UK
  { slug: "london", name: "Londres", nameEn: "London", country: "UK", region: "Greater London", lat: 51.5074, lng: -0.1278, population: "9M" },
  { slug: "manchester", name: "Manchester", nameEn: "Manchester", country: "UK", region: "Greater Manchester", lat: 53.4808, lng: -2.2426, population: "550K" },
  { slug: "birmingham", name: "Birmingham", nameEn: "Birmingham", country: "UK", region: "West Midlands", lat: 52.4862, lng: -1.8904, population: "1.1M" },
  { slug: "edinburgh", name: "Édimbourg", nameEn: "Edinburgh", country: "UK", region: "Scotland", lat: 55.9533, lng: -3.1883, population: "480K" },
  { slug: "glasgow", name: "Glasgow", nameEn: "Glasgow", country: "UK", region: "Scotland", lat: 55.8642, lng: -4.2518, population: "600K" },
  { slug: "bristol", name: "Bristol", nameEn: "Bristol", country: "UK", region: "South West", lat: 51.4545, lng: -2.5879, population: "460K" },
  { slug: "brighton", name: "Brighton", nameEn: "Brighton", country: "UK", region: "East Sussex", lat: 50.8225, lng: -0.1372, population: "290K" },

  // USA
  { slug: "new-york", name: "New York", nameEn: "New York", country: "US", region: "New York", lat: 40.7128, lng: -74.0060, population: "8.3M" },
  { slug: "los-angeles", name: "Los Angeles", nameEn: "Los Angeles", country: "US", region: "California", lat: 34.0522, lng: -118.2437, population: "4M" },
  { slug: "chicago", name: "Chicago", nameEn: "Chicago", country: "US", region: "Illinois", lat: 41.8781, lng: -87.6298, population: "2.7M" },
  { slug: "san-francisco", name: "San Francisco", nameEn: "San Francisco", country: "US", region: "California", lat: 37.7749, lng: -122.4194, population: "870K" },
  { slug: "miami", name: "Miami", nameEn: "Miami", country: "US", region: "Florida", lat: 25.7617, lng: -80.1918, population: "470K" },
  { slug: "boston", name: "Boston", nameEn: "Boston", country: "US", region: "Massachusetts", lat: 42.3601, lng: -71.0589, population: "690K" },
  { slug: "seattle", name: "Seattle", nameEn: "Seattle", country: "US", region: "Washington", lat: 47.6062, lng: -122.3321, population: "750K" },
  { slug: "austin", name: "Austin", nameEn: "Austin", country: "US", region: "Texas", lat: 30.2672, lng: -97.7431, population: "960K" },
];

export const SEO_INTENTS = [
  { slug: "amour", label: "Amour", labelEn: "Love", intent: "AMOUR" },
  { slug: "amis", label: "Amis", labelEn: "Friends", intent: "AMIS" },
  { slug: "fun", label: "Fun", labelEn: "Fun", intent: "FUN" },
  { slug: "plan-cul", label: "Plan cul", labelEn: "Casual", intent: "PLAN_CUL" },
  { slug: "sport", label: "Sport", labelEn: "Sports", intent: "SPORT" },
  { slug: "evenements", label: "Événements", labelEn: "Events", intent: "EVENEMENTS" },
] as const;

export const COUNTRY_NAMES: Record<string, { fr: string; en: string }> = {
  FR: { fr: "France", en: "France" },
  CH: { fr: "Suisse", en: "Switzerland" },
  UK: { fr: "Royaume-Uni", en: "United Kingdom" },
  US: { fr: "États-Unis", en: "United States" },
};
