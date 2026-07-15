export const EMBIR_FIRST_PARTY_EMAIL_DOMAIN = "embir.xyz";

export function isFirstPartyEmailAddress(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  const separator = normalized.lastIndexOf("@");
  if (separator <= 0 || separator === normalized.length - 1) return false;
  return normalized.slice(separator + 1) === EMBIR_FIRST_PARTY_EMAIL_DOMAIN;
}
