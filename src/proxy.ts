import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import {
  LOCALE_COOKIE,
  LOCALE_SOURCE_COOKIE,
  buildLocalizedPath,
  detectLocaleFromRequest,
  getLocaleFromPathname,
} from './i18n/locale-detection';
import { routing } from './i18n/routing';
import { isTrustedApiMutation } from './lib/request-security';

const intl = createMiddleware(routing);

const NOINDEX_PATTERNS: string[] = [
  'admin', 'affichage', 'albums', 'ambassadeur', 'ambassadrice', 'connections',
  'apercu-visiteur', 'auth', 'blacklist', 'certification', 'dashboard',
  'decouvrir', 'discover', 'early-access', 'favoris', 'forum',
  'grindr-cost-calculator', 'installer-application', 'invite', 'inviter',
  'membres', 'messages', 'mode-discret', 'notifications', 'onboarding',
  'parametres', 'premium', 'pricing', 'profiles', 'reddit-setup',
  'referral', 'salons', 'sites-partenaires', 'temoignages',
  'verification', 'videos', 'welcome',
];

// Routes that require authentication (app pages only, not API)
const PROTECTED_ROUTES = [
  'dashboard', 'onboarding', 'discover', 'members', 'membres',
  'messages', 'profile', 'settings', 'parametres', 'premium',
  'inviter', 'invite', 'favoris', 'favorites', 'albums', 'forum',
  'verification', 'welcome', 'connections', 'notifications',
];

function matchFirstSegment(pathname: string, patterns: string[]): boolean {
  let path = pathname;
  for (const locale of routing.locales) {
    if (path.startsWith(`/${locale}/`)) {
      path = '/' + path.slice(`/${locale}/`.length);
      break;
    }
    if (path === `/${locale}`) return false;
  }

  const segment = path.split('/').filter(Boolean)[0] ?? '';
  return patterns.includes(segment);
}

function shouldNoindex(pathname: string): boolean {
  return matchFirstSegment(pathname, NOINDEX_PATTERNS);
}

function rememberLocale(response: NextResponse, locale: 'en' | 'fr', source: 'auto' | 'manual' = 'auto') {
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 31536000,
    path: '/',
    sameSite: 'lax',
  });
  response.cookies.set(LOCALE_SOURCE_COOKIE, source, {
    maxAge: 31536000,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    if (!isTrustedApiMutation(request)) {
      return new NextResponse(null, {
        status: 403,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    return NextResponse.next();
  }

  // Ne pas intercepter les assets statiques.
  if (pathname.startsWith('/_next/') || pathname.startsWith('/uploads/') || pathname.startsWith('/brand/')) {
    return NextResponse.next();
  }

  const detectedLocale = detectLocaleFromRequest({
    cookies: request.cookies,
    headers: request.headers,
    pathname,
  });
  const pathLocale = getLocaleFromPathname(pathname);
  const localeSource = request.cookies.get(LOCALE_SOURCE_COOKIE)?.value === 'manual' ? 'manual' : 'auto';

  if (pathname === '/' && detectedLocale === 'fr') {
    const localeUrl = request.nextUrl.clone();
    localeUrl.pathname = buildLocalizedPath(pathname, detectedLocale);
    return rememberLocale(NextResponse.redirect(localeUrl), detectedLocale, localeSource);
  }

  // Vérifier si la route est protégée
  if (matchFirstSegment(pathname, PROTECTED_ROUTES)) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      // Extraire la locale pour la redirection
      const locale = pathLocale ?? detectedLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return rememberLocale(NextResponse.redirect(loginUrl), locale, localeSource);
    }
  }

  const response = intl(request);

  if (shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return rememberLocale(response, pathLocale ?? (pathname === '/' ? detectedLocale : 'en'), localeSource);
}

export const config = {
  matcher: ['/api/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
