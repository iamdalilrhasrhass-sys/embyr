export type SupportedLocale = "fr" | "en" | "es";

export type ConnectionIntent =
  | "AMOUR"
  | "AMIS"
  | "FUN"
  | "PLAN_CUL"
  | "SPORT"
  | "EVENEMENTS"
  | "DISCUSSION"
  | "AUTRE";

export type SocialEnergy = "CALME" | "OUVERTE" | "SPONTANEE";

export type SignalFormat =
  | "DISCUSSION"
  | "CAFE"
  | "BALADE"
  | "SPORT"
  | "SORTIE"
  | "ACTIVITE"
  | "AUTRE";

export type ContextualTargetType =
  | "PHOTO"
  | "PROMPT"
  | "ACTIVITY"
  | "VOICE"
  | "PROFILE_DETAIL";

export interface PresenceSignal {
  id: string;
  intent: ConnectionIntent;
  socialEnergy: SocialEnergy;
  formats: SignalFormat[];
  availabilityText?: string | null;
  approximateArea?: string | null;
  active?: boolean;
  expiresAt?: string | null;
}

export interface ContextTarget {
  type: ContextualTargetType;
  id?: string | null;
  label: string;
  preview?: string | null;
}

export interface CandidateProfile {
  id?: string;
  userId?: string;
  username?: string;
  displayName?: string | null;
  age?: number | null;
  city?: string | null;
  genderIdentity?: string | null;
  orientation?: string | null;
  description?: string | null;
  profilePhotoUrl?: string | null;
  isVerified?: boolean;
  primaryIntent?: ConnectionIntent | null;
  acceptedIntents?: ConnectionIntent[];
  intentions?: string[];
  activities?: string[];
}

export interface SparkCandidate {
  id?: string;
  userId?: string;
  selectionId?: string;
  reasonCodes?: string[];
  reasons?: string[];
  contextTargets?: ContextTarget[];
  profile?: CandidateProfile;
  [key: string]: unknown;
}

export interface DensityInfo {
  eligibleCount?: number;
  localCount?: number;
  selectionSize?: number;
  isColdStart?: boolean;
  label?: string;
}

export interface ConnectionProfile {
  username?: string;
  displayName?: string | null;
  city?: string | null;
  profilePhotoUrl?: string | null;
}

export interface ConnectionUser {
  id?: string;
  profile?: ConnectionProfile | null;
}

export interface ActiveConnection {
  id?: string;
  matchId?: string;
  state?: string;
  status?: string;
  user1Id?: string;
  user2Id?: string;
  user1?: ConnectionUser | null;
  user2?: ConnectionUser | null;
  otherUser?: ConnectionUser | null;
  profile?: ConnectionProfile | null;
  lastMessageAt?: string | null;
  matchedAt?: string | null;
  updatedAt?: string | null;
  conversationId?: string | null;
  nextAction?: string | null;
}

export interface ContextualAction {
  action: "like" | "pass";
  targetType?: ContextualTargetType;
  targetId?: string | null;
  note?: string;
}

export function supportedLocale(locale: string): SupportedLocale {
  return locale === "en" || locale === "es" ? locale : "fr";
}

export function localePath(locale: SupportedLocale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? normalized : `/${locale}${normalized}`;
}

export function candidateProfile(candidate: SparkCandidate): CandidateProfile {
  return candidate.profile ?? (candidate as CandidateProfile);
}

export function candidateUserId(candidate: SparkCandidate): string | null {
  return candidate.userId ?? candidateProfile(candidate).userId ?? null;
}

export function candidateKey(candidate: SparkCandidate): string {
  const profile = candidateProfile(candidate);
  return (
    candidate.id ??
    profile.id ??
    profile.userId ??
    profile.username ??
    "unknown-candidate"
  );
}
