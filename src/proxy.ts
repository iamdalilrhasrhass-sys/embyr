import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import {
  LOCALE_COOKIE,
  localizePathname,
  pathnameHasLocalePrefix,
  pickPreferredLocale,
} from './i18n/locale-detection';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

const NOINDEX_PATTERNS: string[] = [
  'admin',
  'affichage',
  'albums',
  'ambassadeur',
  'ambassadrice',
  'apercu-visiteur',
  'auth',
  'blacklist',
  'certification',
  'dashboard',
  'decouvrir',
  'discover',
  'early-access',
  'favoris',
  'forum',
  'grindr-cost-calculator',
  'installer-application',
  'invite',
  'inviter',
  'membres',
  'messages',
  'mode-discret',
  'notifications',
  'onboarding',
  'parametres',
  'premium',
  'pricing',
  'profiles',
  'reddit-setup',
  'referral',
  'salons',
  'sites-partenaires',
  'temoignages',
  'verification',
  'videos',
  'welcome',
];

function shouldNoindex(pathname: string): boolean {
  let path = pathname;
  for (const locale of routing.locales) {
    if (path === `/${locale}` || path === '/') return false;
    if (path.startsWith(`/${locale}/`)) {
      path = path.slice(`/${locale}/`.length - 1);
      break;
    }
  }

  const firstSegment = path.split('/').filter(Boolean)[0] ?? '';
  const fullPath = path.replace(/^\//, '');

  return NOINDEX_PATTERNS.includes(firstSegment) || NOINDEX_PATTERNS.includes(fullPath);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathnameHasLocalePrefix(pathname, routing.locales)) {
    const locale = pickPreferredLocale({
      cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
      acceptLanguage: request.headers.get('accept-language'),
    });

    if (locale !== routing.defaultLocale) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = localizePathname(pathname, locale);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      if (shouldNoindex(pathname)) {
        redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
      }

      return redirectResponse;
    }
  }

  const response = intl(request);

  if (shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
