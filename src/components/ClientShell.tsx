'use client';

import AnalyticsProvider from './AnalyticsProvider';
import FeedbackWidget from './FeedbackWidget';

export default function ClientShell({ children }: { children?: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <FeedbackWidget />
    </AnalyticsProvider>
  );
}
