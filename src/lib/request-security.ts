import type { NextRequest } from "next/server";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const COOKIE_AUTH_NAMES = ["token", "embir_admin_session"] as const;
const BEARER_PATTERN = /^Bearer\s+\S+$/i;

type MutationRequest = Pick<NextRequest, "method" | "headers" | "cookies" | "nextUrl">;

function normalizedHost(value: string | null): string | null {
  const candidate = value?.split(",", 1)[0]?.trim().toLocaleLowerCase();
  if (!candidate || /[\s/@]/.test(candidate)) return null;
  try {
    return new URL(`http://${candidate}`).host.toLocaleLowerCase();
  } catch {
    return null;
  }
}
function configuredFrontendHosts(): string[] {
  return [
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
  ].flatMap((candidate) => {
    if (!candidate) return [];
    try {
      const url = new URL(candidate);
      return url.protocol === "https:" || url.protocol === "http:"
        ? [url.host.toLocaleLowerCase()]
        : [];
    } catch {
      return [];
    }
  });
}

/**
 * CSRF boundary for cookie-authenticated API mutations.
 *
 * Public/webhook requests without an Embir auth cookie are left to their route's
 * signature or validation checks. Explicit Bearer clients are also allowed here
 * and remain responsible for route-level token verification.
 */
export function isTrustedApiMutation(request: MutationRequest): boolean {
  if (!request.nextUrl.pathname.startsWith("/api/")) return true;
  if (!MUTATION_METHODS.has(request.method.toUpperCase())) return true;

  if (BEARER_PATTERN.test(request.headers.get("authorization") ?? "")) return true;
  const hasCookieAuthentication = COOKIE_AUTH_NAMES.some((name) => request.cookies.has(name));
  if (!hasCookieAuthentication) return true;

  const originHeader = request.headers.get("origin");
  if (!originHeader || originHeader === "null") return false;

  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return false;
  }
  if (origin.protocol !== "https:" && origin.protocol !== "http:") return false;

  const trustedHosts = new Set(
    [
      normalizedHost(request.nextUrl.host),
      normalizedHost(request.headers.get("host")),
      normalizedHost(request.headers.get("x-forwarded-host")),
      ...configuredFrontendHosts(),
    ].filter((host): host is string => Boolean(host)),
  );

  return trustedHosts.has(origin.host.toLocaleLowerCase());
}
