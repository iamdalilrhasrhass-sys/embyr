'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import AnalyticsProvider from './AnalyticsProvider';

const FeedbackWidget = dynamic(() => import('./FeedbackWidget'), { ssr: false });

export default function ClientShell({ children }: { children?: React.ReactNode }) {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowFeedback(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnalyticsProvider>
      {showFeedback && <FeedbackWidget />}
    </AnalyticsProvider>
  );
}
