'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { ANALYTICS_CONSENT_EVENT } from '@/lib/analytics-consent';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string>('');

  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (currentPath !== lastPath.current) {
      lastPath.current = currentPath;
      trackPageView();
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const trackAfterConsent = (event: Event) => {
      if (event instanceof CustomEvent && event.detail === true) {
        lastPath.current = pathname;
        trackPageView();
      }
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, trackAfterConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, trackAfterConsent);
  }, [pathname]);

  return <>{children}</>;
}
