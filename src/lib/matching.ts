import type {
  ConnectionIntent,
  GenderIdentity,
  ProfileModerationState,
  ProfileVisibility,
  SexualOrientation,
} from "@prisma/client";
import { prisma } from "./prisma.ts";
import { publicProfileSelect } from "./profile-contract.ts";

export const INTENTS = [
  "AMOUR",
  "AMIS",
  "FUN",
  "PLAN_CUL",
  "SPORT",
  "EVENEMENTS",
  "DISCUSSION",
  "AUTRE",
] as const satisfies readonly ConnectionIntent[];

export type CompatibilityProfile = {
  userId: string;
  age: number;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  genderIdentity: GenderIdentity | null;
  orientation: SexualOrientation | null;
  seekingGenders: GenderIdentity[];
  primaryIntent: ConnectionIntent | null;
  acceptedIntents: ConnectionIntent[];
  activities: string[];
  seekingAgeMin: number | null;
  seekingAgeMax: number | null;
  seekingRadiusKm: number | null;
  visibilityStatus: ProfileVisibility;
  moderationState: ProfileModerationState;
  publicVisibility: boolean;
  onboardingCompletedAt: Date | null;
  isVerified: boolean;
  lastActiveAt: Date | null;
  profileCompletionScore: number;
};

export type ActiveSignalForMatching = {
  intent: ConnectionIntent;
  expiresAt: Date;
  visible: boolean;
  active: boolean;
};

export type CompatibilityResult =
  | {
      eligible: true;
      score: number;
      reasonCodes: string[];
      reasons: string[];
      matchedIntents: ConnectionIntent[];
      distanceKm: number | null;
    }
  | { eligible: false; reasonCode: string };

export type PublicCandidate = {
  profile: Record<string, unknown>;
  reasons: string[];
  reasonCodes: string[];
  matchedIntents: ConnectionIntent[];
  incomingSignal: boolean;
};

const DAY = 24 * 60 * 60 * 1000;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

export function isOrientationCompatible(
  user: Pick<CompatibilityProfile, "genderIdentity" | "seekingGenders">,
  candidate: Pick<CompatibilityProfile, "genderIdentity" | "seekingGenders">,
): boolean {
  if (!user.genderIdentity || !candidate.genderIdentity) return false;
  if (user.seekingGenders.length === 0 || candidate.seekingGenders.length === 0) return false;
  return (
    user.seekingGenders.includes(candidate.genderIdentity) &&
    candidate.seekingGenders.includes(user.genderIdentity)
  );
}

export function isAgeCompatible(
  user: Pick<CompatibilityProfile, "age" | "seekingAgeMin" | "seekingAgeMax">,
  candidate: Pick<CompatibilityProfile, "age" | "seekingAgeMin" | "seekingAgeMax">,
): boolean {
  const userMin = user.seekingAgeMin ?? 18;
  const userMax = user.seekingAgeMax ?? 120;
  const candidateMin = candidate.seekingAgeMin ?? 18;
  const candidateMax = candidate.seekingAgeMax ?? 120;
  return (
    candidate.age >= userMin &&
    candidate.age <= userMax &&
    user.age >= candidateMin &&
    user.age <= candidateMax
  );
}

function activeSignal(
  signal: ActiveSignalForMatching | null | undefined,
  now: Date,
): signal is ActiveSignalForMatching {
  return Boolean(signal?.active && signal.visible && signal.expiresAt > now);
}

export function evaluateCompatibility(
  user: CompatibilityProfile,
  candidate: CompatibilityProfile,
  options: {
    now?: Date;
    intentFilter?: ConnectionIntent;
    userSignal?: ActiveSignalForMatching | null;
    candidateSignal?: ActiveSignalForMatching | null;
  } = {},
): CompatibilityResult {
  const now = options.now ?? new Date();
  if (user.userId === candidate.userId) return { eligible: false, reasonCode: "SELF" };
  if (!user.onboardingCompletedAt || !candidate.onboardingCompletedAt) {
    return { eligible: false, reasonCode: "ONBOARDING_INCOMPLETE" };
  }
  if (
    !user.publicVisibility ||
    !candidate.publicVisibility ||
    user.visibilityStatus === "HIDDEN" ||
    candidate.visibilityStatus === "HIDDEN"
  ) {
    return { eligible: false, reasonCode: "INVISIBLE" };
  }
  if (user.moderationState !== "ACTIVE" || candidate.moderationState !== "ACTIVE") {
    return { eligible: false, reasonCode: "MODERATION" };
  }
  if (!isOrientationCompatible(user, candidate)) {
    return { eligible: false, reasonCode: "GENDER_PREFERENCES" };
  }
  if (!isAgeCompatible(user, candidate)) return { eligible: false, reasonCode: "AGE" };

  const userIntents = new Set([
    ...user.acceptedIntents,
    ...(user.primaryIntent ? [user.primaryIntent] : []),
  ]);
  const candidateIntents = new Set([
    ...candidate.acceptedIntents,
    ...(candidate.primaryIntent ? [candidate.primaryIntent] : []),
  ]);
  const matchedIntents = [...userIntents].filter((intent) => candidateIntents.has(intent));
  if (userIntents.size === 0 || candidateIntents.size === 0 || matchedIntents.length === 0) {
    return { eligible: false, reasonCode: "INTENT" };
  }
  if (options.intentFilter && !matchedIntents.includes(options.intentFilter)) {
    return { eligible: false, reasonCode: "INTENT_FILTER" };
  }

  let distanceKm: number | null = null;
  const hasCoordinates =
    user.latitude !== null &&
    user.longitude !== null &&
    candidate.latitude !== null &&
    candidate.longitude !== null;
  if (hasCoordinates) {
    distanceKm = haversineKm(
      user.latitude as number,
      user.longitude as number,
      candidate.latitude as number,
      candidate.longitude as number,
    );
    const userRadius = user.seekingRadiusKm ?? 500;
    const candidateRadius = candidate.seekingRadiusKm ?? 500;
    if (distanceKm > userRadius || distanceKm > candidateRadius) {
      return { eligible: false, reasonCode: "DISTANCE" };
    }
  } else if (
    (user.seekingRadiusKm || candidate.seekingRadiusKm) &&
    (!user.city || !candidate.city || user.city.toLocaleLowerCase() !== candidate.city.toLocaleLowerCase())
  ) {
    return { eligible: false, reasonCode: "DISTANCE_UNKNOWN" };
  }

  const reasonCodes = ["RECIPROCAL_PREFERENCES"];
  const reasons = ["Vos préférences sont réciproquement compatibles"];
  let score = 45 + Math.min(24, matchedIntents.length * 8);

  reasonCodes.push("SHARED_INTENT");
  reasons.push(
    matchedIntents.length === 1
      ? "Vous recherchez la même forme de connexion"
      : `Vous partagez ${matchedIntents.length} intentions`,
  );

  if (distanceKm !== null) {
    score += distanceKm <= 25 ? 15 : distanceKm <= 100 ? 8 : 3;
    reasonCodes.push("WITHIN_DISTANCE");
    reasons.push(`Vous êtes à environ ${Math.max(1, Math.round(distanceKm))} km`);
  } else if (user.city && candidate.city && user.city.toLocaleLowerCase() === candidate.city.toLocaleLowerCase()) {
    score += 12;
    reasonCodes.push("SAME_CITY_APPROX");
    reasons.push("Vous êtes dans la même ville");
  }

  const candidateActivities = new Set(candidate.activities.map((value) => value.toLocaleLowerCase()));
  const sharedActivities = user.activities.filter((value) => candidateActivities.has(value.toLocaleLowerCase()));
  if (sharedActivities.length) {
    score += Math.min(12, sharedActivities.length * 4);
    reasonCodes.push("SHARED_ACTIVITIES");
    reasons.push(
      sharedActivities.length === 1
        ? `Vous partagez l’activité « ${sharedActivities[0]} »`
        : `Vous partagez ${sharedActivities.length} activités`,
    );
  }

  const currentUserSignal = options.userSignal;
  const currentCandidateSignal = options.candidateSignal;
  const userSignalActive = activeSignal(currentUserSignal, now);
  const candidateSignalActive = activeSignal(currentCandidateSignal, now);
  if (userSignalActive && candidateSignalActive && currentUserSignal.intent === currentCandidateSignal.intent) {
    score += 18;
    reasonCodes.push("SYNCHRONIZED_AVAILABILITY");
    reasons.push("Vos signaux sont actifs pour la même intention");
  }
  if (candidate.isVerified) score += 4;
  if (candidate.lastActiveAt && candidate.lastActiveAt > new Date(now.getTime() - 7 * DAY)) score += 5;
  score += Math.min(5, Math.floor(candidate.profileCompletionScore / 20));

  return { eligible: true, score, reasonCodes, reasons, matchedIntents, distanceKm };
}

export const internalCandidateSelect = {
  ...publicProfileSelect,
  latitude: true,
  longitude: true,
  orientation: true,
  seekingGenders: true,
  seekingAgeMin: true,
  seekingAgeMax: true,
  seekingRadiusKm: true,
  visibilityStatus: true,
  moderationState: true,
  publicVisibility: true,
  onboardingCompletedAt: true,
  profileCompletionScore: true,
} as const;

export async function getCompatibleCandidates(
  userId: string,
  options: { limit?: number; intentFilter?: ConnectionIntent } = {},
): Promise<{ candidates: PublicCandidate[]; hasMore: boolean; setupRequired: boolean }> {
  const limit = Math.min(5, Math.max(1, options.limit ?? 5));
  const now = new Date();
  const exposureCutoff = new Date(now.getTime() - 7 * DAY);

  const [userProfile, matches, blocks, recentExposures, userSignal] = await Promise.all([
    prisma.profile.findUnique({ where: { userId }, select: internalCandidateSelect }),
    prisma.match.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      select: { user1Id: true, user2Id: true, initiatorId: true, state: true, status: true },
    }),
    prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    }),
    prisma.profileExposure.findMany({
      where: { viewerId: userId, exposedAt: { gte: exposureCutoff } },
      select: { candidateId: true },
    }),
    prisma.presenceSignal.findFirst({
      where: { userId, active: true, visible: true, expiresAt: { gt: now } },
      orderBy: { activatedAt: "desc" },
      select: { intent: true, expiresAt: true, active: true, visible: true },
    }),
  ]);

  if (!userProfile) throw new Error("Profil introuvable");
  if (!userProfile.onboardingCompletedAt || userProfile.seekingGenders.length === 0) {
    return { candidates: [], hasMore: false, setupRequired: true };
  }

  const excluded = new Set<string>([userId, ...recentExposures.map((item) => item.candidateId)]);
  const incoming = new Set<string>();
  for (const match of matches) {
    const otherId = match.user1Id === userId ? match.user2Id : match.user1Id;
    const isIncoming =
      (match.state === "SIGNAL_SENT" || match.status === "pending") &&
      match.initiatorId !== null &&
      match.initiatorId !== userId;
    if (isIncoming) {
      incoming.add(otherId);
      excluded.delete(otherId);
    } else {
      excluded.add(otherId);
    }
  }
  for (const block of blocks) {
    excluded.add(block.blockerId === userId ? block.blockedId : block.blockerId);
  }

  const candidates = await prisma.profile.findMany({
    where: {
      userId: { notIn: [...excluded] },
      publicVisibility: true,
      visibilityStatus: { not: "HIDDEN" },
      moderationState: "ACTIVE",
      onboardingCompletedAt: { not: null },
      user: { is: { bannedAt: null, deletedAt: null } },
    },
    select: internalCandidateSelect,
    take: 200,
    orderBy: [{ lastActiveAt: "desc" }, { createdAt: "desc" }],
  });

  const candidateIds = candidates.map((candidate) => candidate.userId);
  const [candidateSignals, exposureCounts] = await Promise.all([
    prisma.presenceSignal.findMany({
      where: { userId: { in: candidateIds }, active: true, visible: true, expiresAt: { gt: now } },
      orderBy: { activatedAt: "desc" },
      select: { userId: true, intent: true, expiresAt: true, active: true, visible: true },
    }),
    prisma.profileExposure.groupBy({
      by: ["candidateId"],
      where: { candidateId: { in: candidateIds }, exposedAt: { gte: new Date(now.getTime() - 30 * DAY) } },
      _count: { _all: true },
    }),
  ]);
  const signalsByUser = new Map(candidateSignals.map((signal) => [signal.userId, signal]));
  const countsByUser = new Map(exposureCounts.map((row) => [row.candidateId, row._count._all]));

  const eligible = candidates.flatMap((candidate) => {
    const evaluated = evaluateCompatibility(userProfile, candidate, {
      now,
      intentFilter: options.intentFilter,
      userSignal,
      candidateSignal: signalsByUser.get(candidate.userId),
    });
    if (!evaluated.eligible) return [];
    const exposurePenalty = (countsByUser.get(candidate.userId) ?? 0) * 5;
    const incomingBoost = incoming.has(candidate.userId) ? 1000 : 0;
    const publicProfile = Object.fromEntries(
      Object.keys(publicProfileSelect).map((key) => [key, candidate[key as keyof typeof candidate]]),
    );
    return [{
      sortScore: evaluated.score - exposurePenalty + incomingBoost,
      profile: publicProfile,
      reasons: evaluated.reasons.slice(0, 3),
      reasonCodes: evaluated.reasonCodes,
      matchedIntents: evaluated.matchedIntents,
      incomingSignal: incoming.has(candidate.userId),
    }];
  });

  eligible.sort((a, b) => b.sortScore - a.sortScore);
  const selected = eligible.slice(0, limit).map(({ sortScore: _sortScore, ...candidate }) => candidate);
  return { candidates: selected, hasMore: eligible.length > limit, setupRequired: false };
}

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

export function describeIntents(intents?: string[] | null): string[] {
  const labels: Record<string, string> = {
    AMOUR: "Amour",
    AMIS: "Amis",
    FUN: "Rencontre légère",
    PLAN_CUL: "Sans engagement",
    SPORT: "Sport",
    EVENEMENTS: "Sortie",
    DISCUSSION: "Discussion",
    AUTRE: "Autre",
  };
  return (intents ?? []).map((intent) => labels[intent] ?? intent);
}

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
