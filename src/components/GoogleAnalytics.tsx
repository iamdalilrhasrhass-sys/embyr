'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
  ANALYTICS_CONSENT_EVENT,
  readAnalyticsConsent,
} from '@/lib/analytics-consent';

const configuredMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_MEASUREMENT_ID =
  configuredMeasurementId && /^G-[A-Z0-9]+$/i.test(configuredMeasurementId)
    ? configuredMeasurementId
    : null;

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEnabled(readAnalyticsConsent()), 0);
    const updateConsent = (event: Event) => {
      if (event instanceof CustomEvent) setEnabled(event.detail === true);
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, updateConsent);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, updateConsent);
    };
  }, []);

  if (!GA_MEASUREMENT_ID || !enabled) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
