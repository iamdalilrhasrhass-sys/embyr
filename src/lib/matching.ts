import { prisma } from "@/lib/prisma";

/**
 * EMBIR Matching Engine — Multi-orientation & Hinge-style intents
 * 
 * Règle d'or : un hétéro ne voit jamais un gay (sauf si catégorisé autrement),
 * un gay voit des gays, etc. Filtre BIDIRECTIONNEL strict.
 *
 * 22 Juin 2026 — Refonte totale
 */

// ── Valeurs standardisées ──

export const INTENTS = [
  "AMOUR",       // relation amoureuse sérieuse
  "AMIS",        // rencontres amicales
  "FUN",         // s'amuser, faire la fête
  "PLAN_CUL",    // rencontres sans engagement
  "SPORT",       // activités sportives
  "EVENEMENTS",  // créer/participer à des événements
  "DISCUSSION",  // discuter, échanger
  "AUTRE",
] as const;

export const ORIENTATIONS = [
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

export const GENDER_VALUES = [
  "HOMME",
  "FEMME",
  "FEMME_TRANS",
  "TRAVESTI",
  "PERSONNE_FEMININE",
  "COUPLE",
  "AUTRE",
] as const;

export type Intent = typeof INTENTS[number];
export type Orientation = typeof ORIENTATIONS[number];
export type GenderValue = typeof GENDER_VALUES[number];

export interface MatchCandidate {
  profile: any;
  score: number;
  reasons: string[];
  matchedIntents: string[];
}

interface UserProfile {
  id: string;
  userId: string;
  genderIdentity?: string | null;
  seekingGenders?: string[];
  intentions?: string[];
  orientation?: string | null;
  city?: string | null;
  country?: string | null;
  age?: number | null;
  seekingAgeMin?: number | null;
  seekingAgeMax?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  seekingRadiusKm?: number | null;
  activities?: string[];
}

/**
 * Vérifie la compatibilité BIDIRECTIONNELLE d'orientation.
 * 
 * - user.seekingGenders doit contenir candidate.genderIdentity
 * - candidate.seekingGenders doit contenir user.genderIdentity
 * 
 * Si l'un des deux n'a pas rempli seekingGenders, on reste permissif
 * (rétrocompatibilité — mais le onboarding encourage à remplir).
 */
export function isOrientationCompatible(
  user: UserProfile,
  candidate: UserProfile
): boolean {
  const userSeeks = user.seekingGenders ?? [];
  const candidateSeeks = candidate.seekingGenders ?? [];

  // Permissif si l'un des deux n'a pas rempli ses préférences
  if (userSeeks.length === 0 || candidateSeeks.length === 0) {
    return true;
  }

  if (!user.genderIdentity || !candidate.genderIdentity) {
    return true;
  }

  const userAcceptsCandidate = userSeeks.includes(candidate.genderIdentity);
  const candidateAcceptsUser = candidateSeeks.includes(user.genderIdentity);

  return userAcceptsCandidate && candidateAcceptsUser;
}

/**
 * Vérifie la compatibilité d'âge bidirectionnelle.
 */
export function isAgeCompatible(
  user: UserProfile,
  candidate: UserProfile
): boolean {
  if (!candidate.age) return true;

  // L'utilisateur a-t-il un filtre d'âge ?
  if (user.seekingAgeMin != null && candidate.age < user.seekingAgeMin) return false;
  if (user.seekingAgeMax != null && candidate.age > user.seekingAgeMax) return false;

  // Le candidat a-t-il un filtre d'âge qui exclut l'utilisateur ?
  if (user.age != null) {
    if (candidate.seekingAgeMin != null && user.age < candidate.seekingAgeMin) return false;
    if (candidate.seekingAgeMax != null && user.age > candidate.seekingAgeMax) return false;
  }

  return true;
}

/**
 * Calcule la distance entre deux points (Haversine, en km).
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Score de compatibilité entre deux profils.
 * 
 * Facteurs :
 * - Intents communs : +30 par intent commun (max 90)
 * - Même ville : +25 / Même pays : +15
 * - Profil vérifié : +15
 * - Actif < 7 jours : +10
 * - Profil complet : +10
 * - Activités communes : +5 par activité (max 20)
 * - Distance < rayon : +10
 */
export function scoreCandidate(
  user: UserProfile,
  candidate: UserProfile
): { score: number; reasons: string[]; matchedIntents: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const matchedIntents: string[] = [];

  // Intents communs — affichage concret
  const userIntents = user.intentions ?? [];
  const candidateIntents = candidate.intentions ?? [];
  const commonIntents = userIntents.filter((i) => candidateIntents.includes(i));
  matchedIntents.push(...commonIntents);
  if (commonIntents.length > 0) {
    score += Math.min(90, commonIntents.length * 30);
    const intentLabels: Record<string, string> = {
      AMOUR: "Amour", AMIS: "Amis", FUN: "Fun", PLAN_CUL: "Plan cul",
      SPORT: "Sport", EVENEMENTS: "Événements", DISCUSSION: "Discussion", AUTRE: "Autre",
    };
    const labels = commonIntents.map((i) => intentLabels[i] ?? i).join(", ");
    reasons.push(`Même intention: ${labels}`);
  }

  // Géographie
  if (user.city && candidate.city && user.city === candidate.city) {
    score += 25;
    reasons.push("Même ville");
  } else if (user.country && candidate.country && user.country === candidate.country) {
    score += 15;
    reasons.push("Même pays");
  }

  // Distance
  if (
    user.latitude != null &&
    user.longitude != null &&
    candidate.latitude != null &&
    candidate.longitude != null &&
    user.seekingRadiusKm != null
  ) {
    const dist = haversineKm(
      user.latitude!,
      user.longitude!,
      candidate.latitude!,
      candidate.longitude!
    );
    if (dist <= user.seekingRadiusKm) {
      score += 10;
      reasons.push(`À ${Math.round(dist)} km`);
    }
  }

  // Vérifié
  if ((candidate as any).isVerified) {
    score += 15;
    reasons.push("Profil vérifié");
  }

  // Activité récente
  if ((candidate as any).lastActiveAt) {
    const lastActive = new Date((candidate as any).lastActiveAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (lastActive > sevenDaysAgo) {
      score += 10;
      const daysAgo = Math.floor((Date.now() - lastActive.getTime()) / (24 * 60 * 60 * 1000));
      if (daysAgo === 0) reasons.push("Actif aujourd'hui");
      else if (daysAgo === 1) reasons.push("Actif hier");
      else reasons.push(`Actif il y a ${daysAgo} jours`);
    }
  }

  // Complétude du profil
  const completion = (candidate as any).profileCompletionScore ?? 0;
  if (completion > 0) {
    score += Math.min(10, Math.round(completion / 10));
  }

  // Activités communes — affichage concret
  const userActivities = user.activities ?? [];
  const candidateActivities = candidate.activities ?? [];
  const commonActivities = userActivities.filter((a) => candidateActivities.includes(a));
  if (commonActivities.length > 0) {
    score += Math.min(20, commonActivities.length * 5);
    const activityLabels = commonActivities.slice(0, 3).join(", ");
    reasons.push(`${commonActivities.length} passion${commonActivities.length > 1 ? "s" : ""} commune${commonActivities.length > 1 ? "s" : ""}: ${activityLabels}`);
  }

  return { score, reasons, matchedIntents };
}

/**
 * Récupère les candidats compatibles pour un utilisateur.
 * 
 * Applique le filtre bidirectionnel d'orientation + âge + intents,
 * puis score et trie.
 */
export async function getCompatibleCandidates(
  userId: string,
  options: { limit?: number; intentFilter?: string } = {}
): Promise<MatchCandidate[]> {
  const { limit = 20, intentFilter } = options;

  const userProfile = await prisma.profile.findUnique({ where: { userId } });
  if (!userProfile) {
    throw new Error("Profil introuvable");
  }

  // Exclure les matchs existants + blocks + l'utilisateur lui-même
  const [existingMatches, blocksMade, blocksReceived] = await Promise.all([
    prisma.match.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      select: { user1Id: true, user2Id: true },
    }),
    prisma.block.findMany({
      where: { blockerId: userId },
      select: { blockedId: true },
    }),
    prisma.block.findMany({
      where: { blockedId: userId },
      select: { blockerId: true },
    }),
  ]);

  const excludeIds = new Set<string>([userId]);
  existingMatches.forEach((m) => {
    if (m.user1Id === userId) excludeIds.add(m.user2Id);
    else excludeIds.add(m.user1Id);
  });
  blocksMade.forEach((b) => excludeIds.add(b.blockedId));
  blocksReceived.forEach((b) => excludeIds.add(b.blockerId));

  // Récupérer les candidats — on en prend plus car on va filtrer en mémoire
  // (le filtre bidirectionnel d'orientation ne peut pas se faire en SQL simplement)
  const candidates = await prisma.profile.findMany({
    where: {
      userId: { notIn: Array.from(excludeIds) },
      publicVisibility: true,
      ...(intentFilter ? { intentions: { has: intentFilter } } : {}),
    },
    take: 200,
    orderBy: { lastActiveAt: "desc" },
  });

  // Filtrer bidirectionnellement + scorer
  const scored: MatchCandidate[] = [];

  for (const candidate of candidates) {
    // Filtre orientation bidirectionnel STRICT
    if (!isOrientationCompatible(userProfile as any, candidate as any)) {
      continue;
    }

    // Filtre âge bidirectionnel
    if (!isAgeCompatible(userProfile as any, candidate as any)) {
      continue;
    }

    const { score, reasons, matchedIntents } = scoreCandidate(
      userProfile as any,
      candidate as any
    );

    scored.push({
      profile: candidate,
      score,
      reasons,
      matchedIntents,
    });
  }

  // Trier par score décroissant
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

/**
 * Construit une description lisible de l'orientation pour l'affichage.
 */
export function describeOrientation(orientation?: string | null): string {
  if (!orientation) return "";
  const labels: Record<string, string> = {
    HETERO: "Hétéro",
    HOMOSEXUEL: "Homosexuel",
    LESBIENNE: "Lesbienne",
    BI: "Bi",
    QUEER: "Queer",
    PAN: "Pan",
    FLUIDE: "Fluide",
    DEMI: "Demi",
    ASEXUEL: "Asexuel",
    AUTRE: "Autre",
  };
  return labels[orientation] ?? orientation;
}

/**
 * Construit une description lisible des intents.
 */
export function describeIntents(intents?: string[] | null): string[] {
  if (!intents || intents.length === 0) return [];
  const labels: Record<string, string> = {
    AMOUR: "Amour",
    AMIS: "Amis",
    FUN: "Fun",
    PLAN_CUL: "Plan cul",
    SPORT: "Sport",
    EVENEMENTS: "Événements",
    DISCUSSION: "Discussion",
    AUTRE: "Autre",
  };
  return intents.map((i) => labels[i] ?? i).filter(Boolean);
}

/**
 * Construit une description lisible du genre.
 */
export function describeGender(gender?: string | null): string {
  if (!gender) return "";
  const labels: Record<string, string> = {
    HOMME: "Homme",
    FEMME: "Femme",
    FEMME_TRANS: "Femme trans",
    TRAVESTI: "Travesti",
    PERSONNE_FEMININE: "Personne féminine",
    COUPLE: "Couple",
    AUTRE: "Autre",
  };
  return labels[gender] ?? gender;
}
