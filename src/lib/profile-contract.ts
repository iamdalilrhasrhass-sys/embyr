import type { Prisma } from "@prisma/client";

const ORIENTATIONS = [
  "HETERO",
  "HOMOSEXUEL",
  "LESBIENNE",
  "BI",
  "QUEER",
  "PAN",
  "FLUIDE",
  "DEMI",
  "ASEXUEL",
  "AUTRE",
] as const;

const GENDERS = [
  "FEMME_TRANS",
  "TRAVESTI",
  "PERSONNE_FEMININE",
  "HOMME",
  "FEMME",
  "COUPLE",
  "AUTRE",
] as const;

const INTENTS = [
  "AMOUR",
  "AMIS",
  "FUN",
  "PLAN_CUL",
  "SPORT",
  "EVENEMENTS",
  "DISCUSSION",
  "AUTRE",
] as const;

const LOOKING_FOR = [
  "RENCONTRE_SERIEUSE",
  "DISCUSSION",
  "RENCONTRE_DISCARTE",
  "AMITIE",
  "RELATION_LIBRE",
  "AUTRE",
] as const;

type ValidationResult =
  | { ok: true; profile: Prisma.ProfileUpdateInput; consentSensitiveData?: true }
  | { ok: false; error: string };

function stringValue(value: unknown, max: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const clean = value.trim().replace(/\s+/g, " ");
  return clean ? clean.slice(0, max) : null;
}

function enumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): T[number] | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return typeof value === "string" && allowed.includes(value) ? value : undefined;
}

function enumArray<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  max = 8,
): T[number][] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > max) return undefined;
  const clean = [...new Set(value)];
  if (!clean.every((item) => typeof item === "string" && allowed.includes(item))) {
    return undefined;
  }
  return clean as T[number][];
}

function integerValue(value: unknown, min: number, max: number): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return undefined;
  return parsed;
}

export function validateProfileUpdate(
  input: unknown,
  hasSensitiveConsent: boolean,
): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Données de profil invalides" };
  }
  const body = input as Record<string, unknown>;
  const profile: Prisma.ProfileUpdateInput = {};

  if (body.username !== undefined) {
    const username = stringValue(body.username, 30);
    if (!username || !/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
      return { ok: false, error: "Le pseudo doit contenir 3 à 30 caractères valides" };
    }
    profile.username = username;
  }

  const displayName = stringValue(body.displayName, 60);
  if (body.displayName !== undefined && displayName === undefined) {
    return { ok: false, error: "Nom affiché invalide" };
  }
  if (displayName !== undefined) profile.displayName = displayName;

  const age = integerValue(body.age, 18, 120);
  if (body.age !== undefined && age === undefined) {
    return { ok: false, error: "L’âge doit être compris entre 18 et 120 ans" };
  }
  if (age !== undefined && age !== null) profile.age = age;

  const city = stringValue(body.city, 80);
  const country = stringValue(body.country, 80);
  const description = stringValue(body.description, 1000);
  if (body.city !== undefined && city === undefined) return { ok: false, error: "Ville invalide" };
  if (body.country !== undefined && country === undefined) return { ok: false, error: "Pays invalide" };
  if (body.description !== undefined && description === undefined) return { ok: false, error: "Description invalide" };
  if (city !== undefined) profile.city = city;
  if (country !== undefined) profile.country = country;
  if (description !== undefined) profile.description = description;

  const genderIdentity = enumValue(body.genderIdentity, GENDERS);
  const lookingFor = enumValue(body.lookingFor, LOOKING_FOR);
  const orientation = enumValue(body.orientation, ORIENTATIONS);
  const seekingGenders = enumArray(body.seekingGenders, GENDERS, GENDERS.length);
  const acceptedIntents = enumArray(body.acceptedIntents ?? body.intentions, INTENTS, INTENTS.length);
  const primaryIntent = enumValue(body.primaryIntent ?? acceptedIntents?.[0], INTENTS);

  if (body.genderIdentity !== undefined && genderIdentity === undefined) return { ok: false, error: "Genre invalide" };
  if (body.lookingFor !== undefined && lookingFor === undefined) return { ok: false, error: "Recherche invalide" };
  if (body.orientation !== undefined && orientation === undefined) return { ok: false, error: "Orientation invalide" };
  if (body.seekingGenders !== undefined && seekingGenders === undefined) return { ok: false, error: "Genres recherchés invalides" };
  if ((body.acceptedIntents !== undefined || body.intentions !== undefined) && acceptedIntents === undefined) return { ok: false, error: "Intentions invalides" };
  if (body.primaryIntent !== undefined && primaryIntent === undefined) return { ok: false, error: "Intention principale invalide" };

  const suppliesSensitiveData = orientation !== undefined || seekingGenders !== undefined;
  const grantsConsent = body.consentSensitiveData === true;
  if (suppliesSensitiveData && !hasSensitiveConsent && !grantsConsent) {
    return { ok: false, error: "Un consentement explicite est requis pour ces préférences" };
  }

  if (genderIdentity !== undefined) profile.genderIdentity = genderIdentity;
  if (lookingFor !== undefined) profile.lookingFor = lookingFor;
  if (orientation !== undefined) profile.orientation = orientation;
  if (seekingGenders !== undefined) profile.seekingGenders = { set: seekingGenders };
  if (acceptedIntents !== undefined) {
    profile.acceptedIntents = { set: acceptedIntents };
    profile.intentions = { set: acceptedIntents };
  }
  if (primaryIntent !== undefined) profile.primaryIntent = primaryIntent;

  if (body.activities !== undefined) {
    if (!Array.isArray(body.activities) || body.activities.length > 20) {
      return { ok: false, error: "Activités invalides" };
    }
    const activities = [...new Set(body.activities.map((item) => stringValue(item, 40)))];
    if (activities.some((item) => !item)) return { ok: false, error: "Activités invalides" };
    profile.activities = { set: activities as string[] };
  }

  const seekingAgeMin = integerValue(body.seekingAgeMin, 18, 120);
  const seekingAgeMax = integerValue(body.seekingAgeMax, 18, 120);
  const seekingRadiusKm = integerValue(body.seekingRadiusKm, 1, 500);
  if (body.seekingAgeMin !== undefined && seekingAgeMin === undefined) return { ok: false, error: "Âge minimum invalide" };
  if (body.seekingAgeMax !== undefined && seekingAgeMax === undefined) return { ok: false, error: "Âge maximum invalide" };
  if (body.seekingRadiusKm !== undefined && seekingRadiusKm === undefined) return { ok: false, error: "Rayon invalide" };
  if (typeof seekingAgeMin === "number" && typeof seekingAgeMax === "number" && seekingAgeMin > seekingAgeMax) {
    return { ok: false, error: "La tranche d’âge est inversée" };
  }
  if (seekingAgeMin !== undefined) profile.seekingAgeMin = seekingAgeMin;
  if (seekingAgeMax !== undefined) profile.seekingAgeMax = seekingAgeMax;
  if (seekingRadiusKm !== undefined) profile.seekingRadiusKm = seekingRadiusKm;

  if (body.language !== undefined) {
    if (!(["fr", "en", "es"] as const).includes(body.language as "fr" | "en" | "es")) {
      return { ok: false, error: "Langue invalide" };
    }
    profile.language = body.language as string;
  }

  const onboardingStep = integerValue(body.onboardingStep, 0, 10);
  if (body.onboardingStep !== undefined && onboardingStep === undefined) return { ok: false, error: "Étape d’onboarding invalide" };
  if (typeof onboardingStep === "number") profile.onboardingStep = onboardingStep;
  if (body.onboardingComplete === true) {
    if (!genderIdentity && body.genderIdentity !== undefined) return { ok: false, error: "Profil incomplet" };
    profile.onboardingCompletedAt = new Date();
    profile.onboardingStep = 10;
    profile.profileCompletionScore = 100;
  }

  return {
    ok: true,
    profile,
    ...(grantsConsent ? { consentSensitiveData: true as const } : {}),
  };
}

export const publicProfileSelect = {
  id: true,
  userId: true,
  username: true,
  displayName: true,
  age: true,
  city: true,
  country: true,
  genderIdentity: true,
  description: true,
  profilePhotoUrl: true,
  isVerified: true,
  lastActiveAt: true,
  primaryIntent: true,
  acceptedIntents: true,
  activities: true,
  language: true,
  courtesyBadges: true,
} satisfies Prisma.ProfileSelect;
