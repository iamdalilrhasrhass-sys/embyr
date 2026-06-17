import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);
const FRENCH_COUNTRIES = new Set(['FR', 'BE', 'LU', 'MC']);
const MARKET_REDIRECT: Record<string, string> = { US: '/us', GB: '/uk' };

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasChoice = request.cookies.has('NEXT_LOCALE');
  if (pathname === '/' && !hasChoice) {
    const country = (request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry') ?? '').toUpperCase();
    const al = request.headers.get('accept-language')?.toLowerCase() ?? '';
    let target: string | null = null;
    if (MARKET_REDIRECT[country]) target = MARKET_REDIRECT[country];
    else if (country === 'CH') target = al.startsWith('fr') ? '/fr/suisse' : '/switzerland';
    else if (FRENCH_COUNTRIES.has(country)) target = '/fr';
    else if (al.startsWith('fr')) target = '/fr';
    if (target) { const url = request.nextUrl.clone(); url.pathname = target; return NextResponse.redirect(url, { status: 302 }); }
  }
  return intl(request);
}
export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
