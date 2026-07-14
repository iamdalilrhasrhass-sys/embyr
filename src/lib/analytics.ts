'use client';

import {
  ANALYTICS_EVENT_VERSION,
  type AnalyticsProperties,
  type PublicAnalyticsEventName,
} from '@/lib/analytics-events';
import { readAnalyticsConsent } from '@/lib/analytics-consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const ANONYMOUS_ID_KEY = 'embir_anonymous_id';
const SESSION_ID_KEY = 'embir_session_id';
const ATTRIBUTION_KEY = 'embir_attribution';

export interface AnalyticsAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
}

function storageId(storage: Storage, key: string): string | undefined {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    if (typeof crypto.randomUUID !== 'function') return undefined;
    const created = crypto.randomUUID();
    storage.setItem(key, created);
    return created;
  } catch {
    return undefined;
  }
}

function currentAttribution(): AnalyticsAttribution {
  const params = new URLSearchParams(window.location.search);
  return {
    source: normalizeAttribution(params.get('utm_source'), 80),
    medium: normalizeAttribution(params.get('utm_medium'), 80),
    campaign: normalizeAttribution(params.get('utm_campaign'), 120),
  };
}

function hasAttribution(value: AnalyticsAttribution): boolean {
  return Boolean(value.source || value.medium || value.campaign);
}

/**
 * Keeps campaign context during the current journey only after analytics consent.
 * Without consent, only parameters on the current URL are returned and nothing is stored.
 */
export function readAnalyticsAttribution(): AnalyticsAttribution {
  if (typeof window === 'undefined') return {};

  const current = currentAttribution();
  if (!readAnalyticsConsent()) return current;

  try {
    if (hasAttribution(current)) {
      window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
      return current;
    }
    const stored = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || '{}') as AnalyticsAttribution;
    return {
      source: normalizeAttribution(stored.source, 80),
      medium: normalizeAttribution(stored.medium, 80),
      campaign: normalizeAttribution(stored.campaign, 120),
    };
  } catch {
    return current;
  }
}

function normalizeAttribution(value: string | null | undefined, maxLength: number): string | undefined {
  if (!value) return undefined;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, maxLength) || undefined;
}

function normalizeCode(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'unknown';
}

export function trackAnalyticsEvent(
  eventName: PublicAnalyticsEventName,
  properties?: AnalyticsProperties,
  attributionOverride?: { campaign?: string },
) {
  if (typeof window === 'undefined') return;
  if (!readAnalyticsConsent()) return;

  const context = {
    event: eventName,
    eventId: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : undefined,
    eventVersion: ANALYTICS_EVENT_VERSION,
    occurredAt: new Date().toISOString(),
    properties,
    page: window.location.pathname,
    language: document.documentElement.lang || 'en',
    referrer: document.referrer,
    anonymousId: storageId(window.localStorage, ANONYMOUS_ID_KEY),
    sessionId: storageId(window.sessionStorage, SESSION_ID_KEY),
    ...readAnalyticsAttribution(),
    ...(attributionOverride?.campaign
      ? { campaign: normalizeAttribution(attributionOverride.campaign, 120) }
      : {}),
  };

  // GA4
  if (window.gtag) {
    window.gtag('event', eventName === 'landing_viewed' ? 'page_view' : eventName, {
      ...properties,
      page_path: context.page,
      language: context.language,
      ...(eventName === 'landing_viewed' ? { embir_event_name: eventName } : {}),
    });
  }

  // Backend tracking — fire and forget
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
    keepalive: true,
  }).catch(() => {});
}

// ── Page views ──
export function trackPageView() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const isLocalizedHomepage = path === '/' || /^\/[a-z]{2,3}(?:-[a-z]{2})?$/i.test(path);
  trackAnalyticsEvent(isLocalizedHomepage ? 'landing_viewed' : 'page_view');
}

// ── Blog ──
let blogReadFired = new Set<string>();

export function trackBlogRead(slug: string, trigger: string, scrollDepth?: number, secondsOnPage?: number) {
  const key = `${slug}-${trigger}`;
  if (blogReadFired.has(key)) return;
  blogReadFired.add(key);

  trackAnalyticsEvent('blog_article_read', {
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
  trackAnalyticsEvent('cta_click', {
    ctaLabel: label,
    ctaLocation: location,
    destination,
  }, campaign ? { campaign } : undefined);
}

// ── Signup ──
export function trackSignupPageView() {
  trackAnalyticsEvent('signup_page_view');
}

export function trackSignupStarted(step?: string) {
  trackAnalyticsEvent('signup_started', { signupStep: step || 'form_focus' });
}

export function trackSignupCompleted() {
  trackAnalyticsEvent('signup_completed');
}

export function trackSignupError(errorType: string) {
  trackAnalyticsEvent('signup_error', { errorType: normalizeCode(errorType) });
}

// ── Pages spécifiques ──
export function trackInvitePageView() {
  trackAnalyticsEvent('invite_page_view');
}

export function trackReferralLinkCopied() {
  trackAnalyticsEvent('referral_link_copied');
}

export function trackReferralShare(channel: string) {
  trackAnalyticsEvent('referral_share_clicked', { channel: normalizeCode(channel) });
}

export function trackAmbassadorApplication(event: 'started' | 'submitted' | 'error', errorType?: string) {
  if (event === 'started') {
    trackAnalyticsEvent('ambassador_application_started');
    return;
  }
  if (event === 'submitted') {
    trackAnalyticsEvent('ambassador_application_submitted');
    return;
  }
  trackAnalyticsEvent('ambassador_application_error', {
    errorType: normalizeCode(errorType || 'unknown'),
  });
}

export function trackCityPageView(city: string, country: string) {
  trackAnalyticsEvent('city_page_view', { city, country });
}

export function trackLandingPageView(market: string, pageType: string) {
  trackAnalyticsEvent('landing_page_view', { market, pageType });
}

// ── Outbound clicks ──
export function trackOutboundClick(destination: string, label: string) {
  trackAnalyticsEvent('outbound_click', { destination, ctaLabel: label });
}
