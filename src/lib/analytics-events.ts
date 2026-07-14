export const ANALYTICS_EVENT_VERSION = 1 as const;

const publicEventPropertyKeys = {
  page_view: [],
  landing_viewed: [],
  signup_page_view: [],
  signup_started: ["signupStep"],
  signup_completed: [],
  signup_error: ["errorType"],
  profile_view: ["source"],
  message_sent: ["format"],
  language_switch: ["fromLocale", "toLocale"],
  blog_article_read: ["articleSlug", "readingTrigger", "scrollDepth", "secondsOnPage"],
  cta_click: ["ctaLocation", "ctaLabel", "destination"],
  invite_page_view: [],
  referral_link_copied: [],
  referral_share_clicked: ["channel"],
  ambassador_application_started: [],
  ambassador_application_submitted: [],
  ambassador_application_error: ["errorType"],
  city_page_view: ["city", "country"],
  landing_page_view: ["market", "pageType"],
  outbound_click: ["destination", "ctaLabel"],
  feedback_submitted: ["feedbackType"],
  dashboard_view: [],
  dashboard_load_error: ["errorType"],
  dashboard_like: [],
  dashboard_pass: [],
  dashboard_match: [],
  dashboard_to_profile: [],
  experiment_exposure: ["testName", "variant"],
  experiment_conversion: ["testName", "variant", "action"],
  signal_created: ["intent", "socialEnergy", "durationHours", "formatCount"],
  feed_item_seen: ["rankingPosition", "compatibilityScore"],
  signal_sent: ["format"],
  resonance_created: ["compatibilityScore"],
  contextual_signal_sent: ["format"],
  reveal_requested: [],
  reveal_accepted: [],
  reveal_declined: [],
  meeting_proposed: ["meetingFormat"],
  meeting_confirmed: ["meetingFormat"],
  outcome_submitted: ["outcome"],
  notification_opened: ["notificationType"],
  notification_preferences_updated: ["channel", "enabled"],
} as const;

export type PublicAnalyticsEventName = keyof typeof publicEventPropertyKeys;

type AnalyticsPropertyValue = string | number | boolean;
export type AnalyticsProperties = Record<string, AnalyticsPropertyValue | undefined>;

export interface AnalyticsEnvelopeInput {
  event?: unknown;
  eventId?: unknown;
  eventVersion?: unknown;
  occurredAt?: unknown;
  timestamp?: unknown;
  properties?: unknown;
  page?: unknown;
  language?: unknown;
  sessionId?: unknown;
  anonymousId?: unknown;
  source?: unknown;
  medium?: unknown;
  campaign?: unknown;
  referrer?: unknown;
}

export interface ParsedAnalyticsEnvelope {
  event: PublicAnalyticsEventName;
  eventId?: string;
  eventVersion: typeof ANALYTICS_EVENT_VERSION;
  occurredAt: Date;
  properties: Record<string, AnalyticsPropertyValue>;
  page?: string;
  language?: string;
  sessionId?: string;
  anonymousId?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
}

export type AnalyticsParseResult =
  | { ok: true; value: ParsedAnalyticsEnvelope }
  | { ok: false; error: string };

const allowedEnvelopeKeys = new Set([
  "event",
  "eventId",
  "eventVersion",
  "occurredAt",
  "timestamp",
  "properties",
  "page",
  "language",
  "sessionId",
  "anonymousId",
  "source",
  "medium",
  "campaign",
  "referrer",
]);

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const localePattern = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;
const propertyLimits: Record<string, { type: "string" | "number" | "boolean"; max?: number }> = {
  action: { type: "string", max: 50 },
  articleSlug: { type: "string", max: 120 },
  channel: { type: "string", max: 30 },
  city: { type: "string", max: 100 },
  compatibilityScore: { type: "number" },
  country: { type: "string", max: 80 },
  ctaLabel: { type: "string", max: 100 },
  ctaLocation: { type: "string", max: 100 },
  destination: { type: "string", max: 240 },
  durationHours: { type: "number" },
  enabled: { type: "boolean" },
  errorType: { type: "string", max: 80 },
  feedbackType: { type: "string", max: 30 },
  format: { type: "string", max: 30 },
  formatCount: { type: "number" },
  fromLocale: { type: "string", max: 12 },
  intent: { type: "string", max: 40 },
  market: { type: "string", max: 80 },
  meetingFormat: { type: "string", max: 40 },
  notificationType: { type: "string", max: 40 },
  outcome: { type: "string", max: 40 },
  pageType: { type: "string", max: 40 },
  rankingPosition: { type: "number" },
  readingTrigger: { type: "string", max: 40 },
  scrollDepth: { type: "number" },
  secondsOnPage: { type: "number" },
  signupStep: { type: "string", max: 40 },
  socialEnergy: { type: "string", max: 40 },
  source: { type: "string", max: 60 },
  testName: { type: "string", max: 80 },
  toLocale: { type: "string", max: 12 },
  variant: { type: "string", max: 20 },
};

const codePropertyKeys = new Set([
  "action",
  "channel",
  "errorType",
  "feedbackType",
  "format",
  "fromLocale",
  "intent",
  "meetingFormat",
  "notificationType",
  "outcome",
  "pageType",
  "readingTrigger",
  "signupStep",
  "socialEnergy",
  "source",
  "toLocale",
  "variant",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (!cleaned || cleaned.length > maxLength) return undefined;
  return cleaned;
}

function cleanPath(value: unknown): string | undefined {
  const path = cleanString(value, 300);
  if (!path || !path.startsWith("/") || path.startsWith("//")) return undefined;
  return path.split(/[?#]/, 1)[0];
}

function cleanReferrer(value: unknown): string | undefined {
  const referrer = cleanString(value, 500);
  if (!referrer) return undefined;
  try {
    const url = new URL(referrer, "https://embir.xyz");
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch {
    return undefined;
  }
}

function cleanDestination(value: string): string | undefined {
  try {
    const url = new URL(value, "https://embir.xyz");
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return `${url.origin}${url.pathname}`.slice(0, 240);
  } catch {
    return undefined;
  }
}

function cleanAttribution(value: unknown, maxLength: number): string | undefined {
  const cleaned = cleanString(value, maxLength);
  return cleaned && /^[a-z0-9_.-]+$/i.test(cleaned) ? cleaned : undefined;
}

function parseOccurredAt(input: AnalyticsEnvelopeInput): Date | undefined {
  const raw = input.occurredAt ?? input.timestamp ?? Date.now();
  const date = typeof raw === "number" || typeof raw === "string" ? new Date(raw) : null;
  if (!date || Number.isNaN(date.getTime())) return undefined;

  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (date.getTime() < now - thirtyDays || date.getTime() > now + 5 * 60 * 1000) {
    return undefined;
  }
  return date;
}

function parseProperties(
  event: PublicAnalyticsEventName,
  input: unknown,
): { ok: true; value: Record<string, AnalyticsPropertyValue> } | { ok: false; error: string } {
  if (input === undefined) return { ok: true, value: {} };
  if (!isRecord(input)) return { ok: false, error: "invalid_properties" };

  const allowed = new Set<string>(publicEventPropertyKeys[event]);
  const parsed: Record<string, AnalyticsPropertyValue> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!allowed.has(key) || !(key in propertyLimits)) {
      return { ok: false, error: "unknown_property" };
    }
    if (value === undefined) continue;

    const rule = propertyLimits[key];
    if (typeof value !== rule.type) return { ok: false, error: "invalid_property_type" };
    if (typeof value === "string") {
      const cleaned = cleanString(value, rule.max ?? 100);
      if (!cleaned) return { ok: false, error: "invalid_property_value" };
      if (codePropertyKeys.has(key) && !/^[a-z0-9_-]+$/i.test(cleaned)) {
        return { ok: false, error: "invalid_property_value" };
      }
      if (key === "destination") {
        const destination = cleanDestination(cleaned);
        if (!destination) return { ok: false, error: "invalid_property_value" };
        parsed[key] = destination;
      } else {
        parsed[key] = cleaned;
      }
    } else if (typeof value === "number") {
      if (!Number.isFinite(value) || Math.abs(value) > 1_000_000) {
        return { ok: false, error: "invalid_property_value" };
      }
      parsed[key] = value;
    } else if (typeof value === "boolean") {
      parsed[key] = value;
    } else {
      return { ok: false, error: "invalid_property_type" };
    }
  }

  return { ok: true, value: parsed };
}

export function parseAnalyticsEnvelope(input: unknown): AnalyticsParseResult {
  if (!isRecord(input)) return { ok: false, error: "invalid_payload" };
  if (Object.keys(input).some((key) => !allowedEnvelopeKeys.has(key))) {
    return { ok: false, error: "unknown_field" };
  }

  const event = cleanString(input.event, 80);
  if (!event || !(event in publicEventPropertyKeys)) {
    return { ok: false, error: "unknown_event" };
  }
  const eventName = event as PublicAnalyticsEventName;

  if (input.eventVersion !== undefined && input.eventVersion !== ANALYTICS_EVENT_VERSION) {
    return { ok: false, error: "unsupported_version" };
  }

  const eventId = input.eventId === undefined ? undefined : cleanString(input.eventId, 36);
  if (eventId !== undefined && !uuidPattern.test(eventId)) {
    return { ok: false, error: "invalid_event_id" };
  }

  const occurredAt = parseOccurredAt(input);
  if (!occurredAt) return { ok: false, error: "invalid_occurred_at" };

  const properties = parseProperties(eventName, input.properties);
  if (!properties.ok) return properties;

  const page = input.page === undefined ? undefined : cleanPath(input.page);
  if (input.page !== undefined && !page) return { ok: false, error: "invalid_page" };

  const language = input.language === undefined ? undefined : cleanString(input.language, 12);
  if (language !== undefined && !localePattern.test(language)) {
    return { ok: false, error: "invalid_language" };
  }

  const sessionId = input.sessionId === undefined ? undefined : cleanString(input.sessionId, 36);
  const anonymousId = input.anonymousId === undefined ? undefined : cleanString(input.anonymousId, 36);
  if ((sessionId && !uuidPattern.test(sessionId)) || (anonymousId && !uuidPattern.test(anonymousId))) {
    return { ok: false, error: "invalid_visitor_id" };
  }

  const source = input.source === undefined ? undefined : cleanAttribution(input.source, 80);
  const medium = input.medium === undefined ? undefined : cleanAttribution(input.medium, 80);
  const campaign = input.campaign === undefined ? undefined : cleanAttribution(input.campaign, 120);
  const referrer = input.referrer === undefined ? undefined : cleanReferrer(input.referrer);

  if ((input.source !== undefined && !source) || (input.medium !== undefined && !medium)) {
    return { ok: false, error: "invalid_attribution" };
  }
  if (input.campaign !== undefined && !campaign) {
    return { ok: false, error: "invalid_attribution" };
  }
  if (input.referrer !== undefined && input.referrer !== "" && !referrer) {
    return { ok: false, error: "invalid_referrer" };
  }

  return {
    ok: true,
    value: {
      event: eventName,
      eventId,
      eventVersion: ANALYTICS_EVENT_VERSION,
      occurredAt,
      properties: properties.value,
      page,
      language,
      sessionId,
      anonymousId,
      source,
      medium,
      campaign,
      referrer,
    },
  };
}
