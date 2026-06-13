'use client';

import { useState, useEffect, useCallback } from 'react';

interface ABTestResult {
  variant: 'A' | 'B';
  trackEvent: (eventName: string, metadata?: Record<string, any>) => void;
}

const storageKey = (name: string) => `ab_test_${name}`;

export function useABTest(testName: string, trafficSplit: number = 50): ABTestResult {
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(testName));
    if (stored === 'A' || stored === 'B') {
      setVariant(stored);
    } else {
      const assigned = Math.random() * 100 < trafficSplit ? 'B' : 'A';
      localStorage.setItem(storageKey(testName), assigned);
      setVariant(assigned);
    }
  }, [testName, trafficSplit]);

  const trackEvent = useCallback(
    (eventName: string, metadata?: Record<string, any>) => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: `ab_${eventName}`,
          properties: { testName, variant, ...metadata },
          timestamp: Date.now(),
          page: window.location.pathname,
        }),
        keepalive: true,
      }).catch(() => {});
    },
    [testName, variant]
  );

  return { variant, trackEvent };
}
