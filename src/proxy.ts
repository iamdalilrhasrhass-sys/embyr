import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

const NOINDEX_PATTERNS: string[] = [
  'admin', 'affichage', 'albums', 'ambassadeur', 'ambassadrice',
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
  'verification', 'welcome',
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
  const fullPath = pathname.replace(/^\//, '');
  return NOINDEX_PATTERNS.includes(fullPath.split('/')[0]) ||
         NOINDEX_PATTERNS.includes(fullPath);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ne pas intercepter les appels API, assets statiques, etc.
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/uploads/') || pathname.startsWith('/brand/')) {
    return intl(request);
  }

  // Vérifier si la route est protégée
  if (matchFirstSegment(pathname, PROTECTED_ROUTES)) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      // Extraire la locale pour la redirection
      const locale = routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) || 'en';
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
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
