export const LOCALE_COOKIE = "embir_locale";

export const SWITCHER_LOCALES = ["fr", "en", "es", "de", "it"] as const;

export type SwitcherLocale = (typeof SWITCHER_LOCALES)[number];

const SWITCHER_LOCALE_SET = new Set<string>(SWITCHER_LOCALES);
const ROUTE_LOCALE_PREFIXES = new Set([
  "fr", "en", "es", "de", "pt", "it", "nl", "ru", "zh", "ja",
  "ko", "ar", "hi", "tr", "pl", "sv", "da", "fi", "no", "th",
  "vi", "id", "ms", "ro",
]);

export function isSwitcherLocale(value: string | null | undefined): value is SwitcherLocale {
  return typeof value === "string" && SWITCHER_LOCALE_SET.has(value);
}

export function detectSupportedLocale(acceptLanguage: string | null): SwitcherLocale {
  if (!acceptLanguage) return "en";

  const candidates = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [rawTag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "0") : 1;

      return {
        locale: rawTag.trim().toLowerCase().slice(0, 2),
        q: Number.isFinite(q) ? q : 0,
        index,
      };
    })
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const candidate of candidates) {
    if (isSwitcherLocale(candidate.locale)) return candidate.locale;
  }

  return "en";
}

export function pickPreferredLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null;
  acceptLanguage: string | null;
}): SwitcherLocale {
  return isSwitcherLocale(cookieLocale)
    ? cookieLocale
    : detectSupportedLocale(acceptLanguage);
}

export function pathnameHasLocalePrefix(pathname: string, locales: readonly string[]): boolean {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return Boolean(firstSegment && locales.includes(firstSegment));
}

export function stripRouteLocalePrefix(pathname: string): string {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (!ROUTE_LOCALE_PREFIXES.has(firstSegment)) return pathname || "/";

  const stripped = `/${segments.slice(2).join("/")}`.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

export function localizePathname(pathname: string, locale: SwitcherLocale): string {
  const stripped = stripRouteLocalePrefix(pathname || "/");
  if (locale === "en") return stripped;
  if (stripped === "/") return `/${locale}`;
  return `/${locale}${stripped}`;
}
