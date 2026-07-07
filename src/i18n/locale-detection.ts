export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_SOURCE_COOKIE = "embir_locale_source";

export const SUPPORTED_PUBLIC_LOCALES = ["en", "fr"] as const;

export type PublicLocale = (typeof SUPPORTED_PUBLIC_LOCALES)[number];

type CookieValue = { value?: string } | string | undefined | null;

type CookieReader =
  | Map<string, string>
  | {
      get: (name: string) => CookieValue;
    };

interface LocaleRequestInput {
  cookies: CookieReader;
  headers: Pick<Headers, "get">;
  pathname: string;
}

const DEFAULT_PUBLIC_LOCALE: PublicLocale = "en";

const ROUTING_LOCALES = [
  "fr",
  "en",
  "es",
  "de",
  "pt",
  "it",
  "nl",
  "ru",
  "zh",
  "ja",
  "ko",
  "ar",
  "hi",
  "tr",
  "pl",
  "sv",
  "da",
  "fi",
  "no",
  "th",
  "vi",
  "id",
  "ms",
  "ro",
] as const;
const ROUTING_LOCALE_SET = new Set<string>(ROUTING_LOCALES);

const FRENCH_COUNTRIES = new Set([
  "BE",
  "BF",
  "BI",
  "BJ",
  "BL",
  "CA",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CM",
  "DJ",
  "DZ",
  "FR",
  "GA",
  "GF",
  "GN",
  "GP",
  "HT",
  "KM",
  "LU",
  "MA",
  "MC",
  "MF",
  "MG",
  "ML",
  "MQ",
  "NC",
  "NE",
  "PF",
  "PM",
  "RE",
  "RW",
  "SC",
  "SN",
  "TD",
  "TG",
  "TN",
  "VU",
  "WF",
  "YT",
]);

const COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "x-geo-country",
  "x-forwarded-country",
];

function isPublicLocale(locale: string | null | undefined): locale is PublicLocale {
  return SUPPORTED_PUBLIC_LOCALES.includes(locale as PublicLocale);
}

function readCookie(cookies: CookieReader, name: string): string | null {
  const value = cookies.get(name);

  if (!value) return null;
  if (typeof value === "string") return value;
  return value.value ?? null;
}

function normalizeCountry(country: string | null): string | null {
  if (!country || country === "XX" || country === "T1") return null;
  const code = country.trim().slice(0, 2).toUpperCase();
  return code.length === 2 ? code : null;
}

function detectLocaleFromCountry(headers: Pick<Headers, "get">): PublicLocale | null {
  for (const header of COUNTRY_HEADERS) {
    const country = normalizeCountry(headers.get(header));
    if (!country) continue;
    return FRENCH_COUNTRIES.has(country) ? "fr" : "en";
  }

  return null;
}

function detectLocaleFromAcceptLanguage(value: string | null): PublicLocale | null {
  if (!value) return null;

  for (const part of value.split(",")) {
    const locale = part.trim().split(";")[0]?.toLowerCase();
    if (!locale) continue;
    const language = locale.split("-")[0];
    if (language === "fr") return "fr";
    if (language === "en") return "en";
  }

  return null;
}

function splitPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase() ?? null;
  const hasLocalePrefix = Boolean(first && ROUTING_LOCALE_SET.has(first));
  const rest = hasLocalePrefix ? segments.slice(1) : segments;

  return { first, hasLocalePrefix, rest };
}

export function getLocaleFromPathname(pathname: string): PublicLocale | null {
  const { first, hasLocalePrefix } = splitPathname(pathname);
  return hasLocalePrefix && isPublicLocale(first) ? first : null;
}

export function hasLocalePrefix(pathname: string): boolean {
  return splitPathname(pathname).hasLocalePrefix;
}

export function detectLocaleFromRequest(input: LocaleRequestInput): PublicLocale {
  const cookieLocale = readCookie(input.cookies, LOCALE_COOKIE);
  const cookieSource = readCookie(input.cookies, LOCALE_SOURCE_COOKIE);
  const pathLocale = getLocaleFromPathname(input.pathname);

  if (cookieSource === "manual" && isPublicLocale(cookieLocale)) return cookieLocale;
  if (pathLocale) return pathLocale;

  return (
    detectLocaleFromCountry(input.headers) ??
    detectLocaleFromAcceptLanguage(input.headers.get("accept-language")) ??
    (isPublicLocale(cookieLocale) ? cookieLocale : null) ??
    DEFAULT_PUBLIC_LOCALE
  );
}

export function buildLocalizedPath(currentPath: string, locale: PublicLocale): string {
  const parsed = new URL(currentPath, "https://embir.local");
  const { rest } = splitPathname(parsed.pathname);
  const cleanPath = rest.length > 0 ? `/${rest.join("/")}` : "/";
  const localizedPath = locale === DEFAULT_PUBLIC_LOCALE
    ? cleanPath
    : `/${locale}${cleanPath === "/" ? "" : cleanPath}`;

  return `${localizedPath}${parsed.search}${parsed.hash}`;
}
