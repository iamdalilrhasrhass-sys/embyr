'use client';

import { useEffect, useRef } from 'react';
import { trackLandingPageView, trackCityPageView, trackInvitePageView, trackSignupPageView } from '@/lib/analytics';

type PageType = 'landing' | 'city' | 'invite' | 'signup';

interface Props {
  type: PageType;
  market?: string;
  city?: string;
  country?: string;
}

export default function PageTypeTracker({ type, market, city, country }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    switch (type) {
      case 'landing':
        trackLandingPageView(market || 'unknown', 'landing');
        break;
      case 'city':
        trackCityPageView(city || 'unknown', country || 'unknown');
        break;
      case 'invite':
        trackInvitePageView();
        break;
      case 'signup':
        trackSignupPageView();
        break;
    }
  }, [type, market, city, country]);

  return null;
}
