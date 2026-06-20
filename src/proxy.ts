import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
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
  const response = intl(request);

  if (shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
