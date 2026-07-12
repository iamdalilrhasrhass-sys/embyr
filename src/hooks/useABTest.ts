'use client';

import { useState, useEffect, useCallback } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics';

interface ABTestResult {
  variant: 'A' | 'B';
  trackEvent: (eventName: string) => void;
}

const storageKey = (name: string) => `ab_test_${name}`;

export function useABTest(testName: string, trafficSplit: number = 50): ABTestResult {
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem(storageKey(testName));
      if (stored === 'A' || stored === 'B') {
        setVariant(stored);
      } else {
        const assigned = Math.random() * 100 < trafficSplit ? 'B' : 'A';
        localStorage.setItem(storageKey(testName), assigned);
        setVariant(assigned);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [testName, trafficSplit]);

  const trackEvent = useCallback(
    (eventName: string) => {
      const action = eventName
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '_')
        .slice(0, 50) || 'conversion';
      trackAnalyticsEvent('experiment_conversion', { testName, variant, action });
    },
    [testName, variant]
  );

  return { variant, trackEvent };
}
