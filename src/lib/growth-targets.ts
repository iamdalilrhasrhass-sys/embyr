export const GROWTH_TARGET_TOTAL = 2_500;

export const GROWTH_STAGE_TARGETS = [
  { key: "qualifiedInTargetZones", label: "Inscrits qualifiés en zones", target: 2_500, unit: "people" },
  { key: "usableProfiles", label: "Profils utilisables", target: 2_000, unit: "people" },
  { key: "onboardedUsers", label: "Onboardings terminés", target: 1_875, unit: "people" },
  { key: "signalUsers", label: "Personnes avec signal", target: 1_500, unit: "people" },
  { key: "recommendationViewers", label: "Personnes recommandées", target: 1_375, unit: "people" },
  { key: "sparkSenders", label: "Émetteurs d’étincelle", target: 875, unit: "people" },
  { key: "sparks", label: "Étincelles envoyées", target: 1_250, unit: "events" },
  { key: "reciprocalConnections", label: "Connexions réciproques", target: 300, unit: "connections" },
  { key: "revealsStarted", label: "Résonances commencées", target: 225, unit: "connections" },
  { key: "revealsCompleted", label: "Résonances révélées", target: 150, unit: "connections" },
  { key: "activeConversations", label: "Conversations actives", target: 125, unit: "connections" },
  { key: "plansProposed", label: "Rencontres proposées", target: 50, unit: "plans" },
  { key: "plansAccepted", label: "Rencontres acceptées", target: 25, unit: "plans" },
  { key: "activeAmbassadors", label: "Ambassadeurs actifs", target: 125, unit: "people" },
  { key: "activePartners", label: "Partenaires actifs", target: 25, unit: "partners" },
] as const;

export type GrowthStageKey = (typeof GROWTH_STAGE_TARGETS)[number]["key"];

export const GROWTH_ZONE_TARGETS = [
  { key: "lausanne", label: "Lausanne & couronne", target: 750 },
  { key: "riviera", label: "Riviera vaudoise", target: 500 },
  { key: "geneva", label: "Genève & couronne", target: 750 },
  { key: "other_romandie", label: "Autres pôles romands", target: 500 },
] as const;

export type GrowthZoneKey = (typeof GROWTH_ZONE_TARGETS)[number]["key"];

export const GROWTH_PACING_WINDOWS = [90, 180, 365] as const;

export const GROWTH_CAMPAIGN_LINKS = [
  {
    label: "Reddit communautés",
    source: "reddit",
    medium: "community",
    campaign: "lausanne_launch_2500",
  },
  {
    label: "Instagram organique",
    source: "instagram",
    medium: "organic_social",
    campaign: "lausanne_launch_2500",
  },
  {
    label: "LinkedIn fondateur",
    source: "linkedin",
    medium: "founder",
    campaign: "romandie_launch_2500",
  },
  {
    label: "Ambassadeurs Lausanne",
    source: "ambassador",
    medium: "referral",
    campaign: "lausanne_ambassadors_2500",
  },
  {
    label: "Partenaires locaux",
    source: "partner",
    medium: "qr",
    campaign: "romandie_partners_2500",
  },
] as const;

export function growthProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((Math.max(0, current) / target) * 1_000) / 10);
}

export function dailyPaceNeeded(current: number, target: number, days: number): number {
  if (days <= 0) return 0;
  return Math.max(0, Math.ceil(((target - current) / days) * 10) / 10);
}

export function buildGrowthCampaignUrl(
  link: (typeof GROWTH_CAMPAIGN_LINKS)[number],
  path = "/fr/lausanne",
): string {
  const url = new URL(path, "https://embir.xyz");
  url.searchParams.set("utm_source", link.source);
  url.searchParams.set("utm_medium", link.medium);
  url.searchParams.set("utm_campaign", link.campaign);
  return url.toString();
}
