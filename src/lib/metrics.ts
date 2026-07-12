export function comparablePercentage(
  numerator: number,
  denominator: number,
): number | null {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    numerator < 0 ||
    denominator <= 0 ||
    numerator > denominator
  ) {
    return null;
  }
  return Math.round((numerator / denominator) * 10_000) / 100;
}
