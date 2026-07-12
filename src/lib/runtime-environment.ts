export const RUNTIME_ENVIRONMENTS = [
  "development",
  "test",
  "staging",
  "production",
] as const;

export type RuntimeEnvironment = (typeof RUNTIME_ENVIRONMENTS)[number];

export function isRuntimeEnvironment(value: unknown): value is RuntimeEnvironment {
  return (
    typeof value === "string" &&
    RUNTIME_ENVIRONMENTS.includes(value as RuntimeEnvironment)
  );
}

export function resolveRuntimeEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): RuntimeEnvironment {
  const explicit = env.APP_ENV?.trim().toLowerCase();
  if (isRuntimeEnvironment(explicit)) return explicit;

  const vercel = env.VERCEL_ENV?.trim().toLowerCase();
  if (vercel === "preview") return "staging";
  if (isRuntimeEnvironment(vercel)) return vercel;

  const node = env.NODE_ENV?.trim().toLowerCase();
  if (node === "production") return "production";
  if (node === "test") return "test";
  return "development";
}
