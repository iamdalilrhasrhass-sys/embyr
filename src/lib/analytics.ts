'use client';

type AnalyticsEvent = 
  | 'page_view'
  | 'signup_start'
  | 'signup_complete'
  | 'profile_view'
  | 'message_sent'
  | 'language_switch'
  | 'blog_article_read'
  | 'cta_click'
  | 'feedback_submitted';

interface AnalyticsProperties {
  page?: string;
  language?: string;
  articleSlug?: string;
  ctaLocation?: string;
  referrer?: string;
  [key: string]: any;
}

export function trackEvent(
  eventName: AnalyticsEvent,
  properties?: AnalyticsProperties
) {
  if (typeof window === 'undefined') return;

  // GA4
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...properties,
      page: window.location.pathname,
      language: document.documentElement.lang,
    });
  }

  // Backend tracking
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: eventName,
      properties,
      timestamp: Date.now(),
      page: window.location.pathname,
      language: document.documentElement.lang,
      referrer: document.referrer,
    }),
    keepalive: true,
  }).catch(() => {}); // fire-and-forget
}

export function trackPageView() {
  trackEvent('page_view');
}

export function trackBlogRead(slug: string) {
  trackEvent('blog_article_read', { articleSlug: slug });
}

export function trackCTAClick(location: string) {
  trackEvent('cta_click', { ctaLocation: location });
}

export function trackSignupComplete() {
  trackEvent('signup_complete');
}
