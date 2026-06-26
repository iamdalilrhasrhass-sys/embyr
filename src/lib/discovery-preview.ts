import { createHash } from "node:crypto";

export type DiscoveryGender = "homme" | "femme" | "autre";
export type DiscoverySeeking = "homme" | "femme" | "tout";
export type DiscoveryIntent =
  | "AMOUR"
  | "AMIS"
  | "FUN"
  | "PLAN_CUL"
  | "SPORT"
  | "EVENEMENTS";

export interface NormalizedDiscoveryQuery {
  gender: DiscoveryGender | "";
  seeking: DiscoverySeeking | "";
  intent: DiscoveryIntent | "";
  city: string;
}

export interface RealDiscoveryProfile {
  id: string;
  age: number | null;
  city: string | null;
  intentions: string[] | null;
}

export interface PublicDiscoveryPreview {
  ageBand: "Âge non précisé" | "18–24" | "25–34" | "35–44" | "45–54" | "55+";
  cityLabel: string;
  intentLabel: string;
  visualSeed: number;
}

const GENDERS = new Set<DiscoveryGender>(["homme", "femme", "autre"]);
const SEEKING = new Set<DiscoverySeeking>(["homme", "femme", "tout"]);

const INTENT_ALIASES: Record<string, DiscoveryIntent> = {
  amour: "AMOUR",
  love: "AMOUR",
  serieuse: "AMOUR",
  serious: "AMOUR",
  amis: "AMIS",
  amitie: "AMIS",
  friends: "AMIS",
  friendship: "AMIS",
  fun: "FUN",
  casual: "PLAN_CUL",
  "plan-cul": "PLAN_CUL",
  plan_cul: "PLAN_CUL",
  sport: "SPORT",
  sports: "SPORT",
  sorties: "EVENEMENTS",
  events: "EVENEMENTS",
  evenements: "EVENEMENTS",
  événements: "EVENEMENTS",
};

const INTENT_LABELS: Record<DiscoveryIntent, string> = {
  AMOUR: "Amour",
  AMIS: "Amitié",
  FUN: "Fun",
  PLAN_CUL: "Casual",
  SPORT: "Sport",
  EVENEMENTS: "Sorties",
};

export function normalizeDiscoveryQuery(input: {
  gender?: string | null;
  seeking?: string | null;
  intent?: string | null;
  city?: string | null;
}): NormalizedDiscoveryQuery {
  const genderCandidate = normalizeToken(input.gender);
  const seekingCandidate = normalizeToken(input.seeking);
  const intentCandidate = normalizeToken(input.intent);

  return {
    gender: GENDERS.has(genderCandidate as DiscoveryGender)
      ? (genderCandidate as DiscoveryGender)
      : "",
    seeking: SEEKING.has(seekingCandidate as DiscoverySeeking)
      ? (seekingCandidate as DiscoverySeeking)
      : "",
    intent: INTENT_ALIASES[intentCandidate] ?? "",
    city: normalizeCity(input.city),
  };
}

export function toPublicPreview(profile: RealDiscoveryProfile): PublicDiscoveryPreview {
  const firstIntent = (profile.intentions ?? []).find((intent) => intent in INTENT_LABELS) as
    | DiscoveryIntent
    | undefined;

  return {
    ageBand: toAgeBand(profile.age),
    cityLabel: normalizeCity(profile.city) || "Ville non précisée",
    intentLabel: firstIntent ? INTENT_LABELS[firstIntent] : "Rencontre",
    visualSeed: visualSeed(profile.id),
  };
}

export function seekingToGenderIdentity(
  seeking: DiscoverySeeking | "",
): "HOMME" | "FEMME" | undefined {
  if (seeking === "homme") return "HOMME";
  if (seeking === "femme") return "FEMME";
  return undefined;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeCity(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function toAgeBand(age: number | null): PublicDiscoveryPreview["ageBand"] {
  if (!age) return "Âge non précisé";
  if (age < 25) return "18–24";
  if (age < 35) return "25–34";
  if (age < 45) return "35–44";
  if (age < 55) return "45–54";
  return "55+";
}

function visualSeed(id: string): number {
  const digest = createHash("sha256").update(id).digest("hex");
  return Number.parseInt(digest.slice(0, 8), 16) % 1000;
}
