import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const frenchSpeakingCountries = new Set(["FR", "BE", "CH", "LU", "MC"]);

function preferredRootPath(request: NextRequest) {
  const country = (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    ""
  ).toUpperCase();
  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";

  if (country === "US") return "/us";
  if (country === "GB") return "/uk";
  if (country === "CH") return acceptLanguage.startsWith("fr") ? "/fr/suisse" : "/switzerland";
  if (frenchSpeakingCountries.has(country)) return "/fr";
  if (acceptLanguage.startsWith("fr")) return "/fr";
  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;

  if (pathname === "/" && !localeCookie) {
    const preferredPath = preferredRootPath(request);
    if (preferredPath) {
      const url = request.nextUrl.clone();
      url.pathname = preferredPath;
      return NextResponse.redirect(url, { status: 302 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*|uploads|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
