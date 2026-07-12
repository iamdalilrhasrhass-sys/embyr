export const ANALYTICS_CONSENT_KEY = 'embir_cookie_consent';
export const ANALYTICS_CONSENT_EVENT = 'embir:analytics-consent';

export function readAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'all';
  } catch {
    return false;
  }
}

export function writeAnalyticsConsent(enabled: boolean): void {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, enabled ? 'all' : 'essential');
  } catch {
    // The choice still applies to the current page when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<boolean>(ANALYTICS_CONSENT_EVENT, { detail: enabled }));
}
