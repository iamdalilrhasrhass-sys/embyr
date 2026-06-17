'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

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

  return <>{children}</>;
}
