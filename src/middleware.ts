import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);
const FRENCH_COUNTRIES = new Set(['FR', 'BE', 'LU', 'MC']);
const MARKET_REDIRECT: Record<string, string> = { US: '/us', GB: '/uk' };

/**
 * Routes that must NEVER be indexed by search engines.
 * These are app/auth/internal pages that inherit home metadata
 * and would create duplicate content in Google's index.
 *
 * Patterns are matched against the pathname WITHOUT locale prefix.
 * e.g. /fr/dashboard -> /dashboard -> matches "dashboard"
 *      /en/auth/login -> /auth/login -> matches "auth/login"
 */
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

/**
 * Check if a pathname (after locale stripping) should be noindex.
 * Matches exact path segments: /dashboard, /dashboard/profile, /forum/123
 */
function shouldNoindex(pathname: string): boolean {
  // Strip locale prefix: /fr/dashboard -> /dashboard, /en/auth/login -> /auth/login
  let path = pathname;
  for (const locale of routing.locales) {
    if (path === `/${locale}` || path === '/') return false; // home is always indexable
    if (path.startsWith(`/${locale}/`)) {
      path = path.slice(`/${locale}/`.length - 1); // keep leading /
      break;
    }
  }

  // Check against patterns — match first path segment
  const firstSegment = path.split('/').filter(Boolean)[0] ?? '';
  const fullPath = path.replace(/^\//, '');

  // Direct match on first segment
  if (NOINDEX_PATTERNS.includes(firstSegment)) return true;

  // Also match full two-segment paths like "auth/login"
  if (NOINDEX_PATTERNS.includes(fullPath)) return true;

  return false;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Geo-redirect for first-time visitors on home
  const hasChoice = request.cookies.has('NEXT_LOCALE');
  if (pathname === '/' && !hasChoice) {
    const country = (request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry') ?? '').toUpperCase();
    const al = request.headers.get('accept-language')?.toLowerCase() ?? '';
    let target: string | null = null;
    if (MARKET_REDIRECT[country]) target = MARKET_REDIRECT[country];
    else if (country === 'CH') target = al.startsWith('fr') ? '/fr/suisse' : '/switzerland';
    else if (FRENCH_COUNTRIES.has(country)) target = '/fr';
    else if (al.startsWith('fr')) target = '/fr';
    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url, { status: 302 });
    }
  }

  // Process i18n
  const response = intl(request);

  // Add X-Robots-Tag: noindex for app/auth/internal routes
  if (shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
