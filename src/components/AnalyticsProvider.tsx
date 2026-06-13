'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    trackPageView();

    // Track navigation
    const handleRouteChange = () => trackPageView();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return <>{children}</>;
}
