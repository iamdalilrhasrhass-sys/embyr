'use client';

type AnalyticsEvent =
  | 'page_view'
  | 'signup_started'
  | 'signup_completed'
  | 'signup_error'
  | 'signup_page_view'
  | 'profile_view'
  | 'message_sent'
  | 'language_switch'
  | 'blog_article_read'
  | 'cta_click'
  | 'invite_page_view'
  | 'city_page_view'
  | 'landing_page_view'
  | 'outbound_click'
  | 'feedback_submitted';

interface AnalyticsProperties {
  page?: string;
  language?: string;
  articleSlug?: string;
  ctaLocation?: string;
  ctaLabel?: string;
  city?: string;
  country?: string;
  market?: string;
  pageType?: string;
  locale?: string;
  referrer?: string;
  readingTrigger?: string;
  scrollDepth?: number;
  secondsOnPage?: number;
  signupStep?: string;
  errorType?: string;
  destination?: string;
  campaign?: string;
  [key: string]: any;
}

function send(eventName: AnalyticsEvent, properties?: AnalyticsProperties) {
  if (typeof window === 'undefined') return;

  // GA4
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...properties,
      page: window.location.pathname,
      language: document.documentElement.lang,
    });
  }

  // Backend tracking — fire and forget
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
  }).catch(() => {});
}

// ── Page views ──
export function trackPageView() {
  send('page_view');
}

// ── Blog ──
let blogReadFired = new Set<string>();

export function trackBlogRead(slug: string, trigger: string, scrollDepth?: number, secondsOnPage?: number) {
  const key = `${slug}-${trigger}`;
  if (blogReadFired.has(key)) return;
  blogReadFired.add(key);

  send('blog_article_read', {
    articleSlug: slug,
    readingTrigger: trigger,
    scrollDepth,
    secondsOnPage,
  });
}

export function resetBlogReadTracking() {
  blogReadFired = new Set<string>();
}

// ── CTA ──
export function trackCTAClick(label: string, location: string, destination?: string, campaign?: string) {
  send('cta_click', {
    ctaLabel: label,
    ctaLocation: location,
    destination: destination || '',
    campaign: campaign || '',
  });
}

// ── Signup ──
export function trackSignupPageView() {
  send('signup_page_view');
}

export function trackSignupStarted(step?: string) {
  send('signup_started', { signupStep: step || 'form_focus' });
}

export function trackSignupCompleted() {
  send('signup_completed');
}

export function trackSignupError(errorType: string) {
  send('signup_error', { errorType });
}

// ── Pages spécifiques ──
export function trackInvitePageView() {
  send('invite_page_view');
}

export function trackCityPageView(city: string, country: string) {
  send('city_page_view', { city, country });
}

export function trackLandingPageView(market: string, pageType: string) {
  send('landing_page_view', { market, pageType });
}

// ── Outbound clicks ──
export function trackOutboundClick(destination: string, label: string) {
  send('outbound_click', { destination, ctaLabel: label });
}
