import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ANALYTICS_EVENT_VERSION,
  parseAnalyticsEnvelope,
} from "../../src/lib/analytics-events.ts";
import { consumeAnalyticsEvent } from "../../src/lib/analytics-rate-limit.ts";

const eventId = "550e8400-e29b-41d4-a716-446655440000";

test("analytics envelopes are typed, versioned and privacy bounded", () => {
  const parsed = parseAnalyticsEnvelope({
    event: "blog_article_read",
    eventId,
    eventVersion: ANALYTICS_EVENT_VERSION,
    occurredAt: new Date().toISOString(),
    properties: {
      articleSlug: "bien-rencontrer",
      readingTrigger: "scroll_depth",
      scrollDepth: 75,
    },
    page: "/fr/blog/bien-rencontrer?private=value",
    referrer: "https://example.com/article?email=private@example.com",
    language: "fr",
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.eventVersion, 1);
  assert.equal(parsed.value.page, "/fr/blog/bien-rencontrer");
  assert.equal(parsed.value.referrer, "https://example.com/article");
});

test("analytics ingestion rejects unknown events, fields and event properties", () => {
  assert.deepEqual(
    parseAnalyticsEnvelope({ event: "invented_reward", properties: {} }),
    { ok: false, error: "unknown_event" },
  );
  assert.deepEqual(
    parseAnalyticsEnvelope({ event: "page_view", email: "private@example.com" }),
    { ok: false, error: "unknown_field" },
  );
  assert.deepEqual(
    parseAnalyticsEnvelope({ event: "page_view", properties: { email: "private@example.com" } }),
    { ok: false, error: "unknown_property" },
  );
});

test("analytics removes query strings from tracked destinations", () => {
  const parsed = parseAnalyticsEnvelope({
    event: "outbound_click",
    properties: {
      destination: "https://partner.example/offer?email=private@example.com",
      ctaLabel: "Découvrir",
    },
  });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.properties.destination, "https://partner.example/offer");
});

test("analytics rejects spoofed visitor identifiers and stale timestamps", () => {
  assert.deepEqual(
    parseAnalyticsEnvelope({ event: "page_view", anonymousId: "not-a-uuid" }),
    { ok: false, error: "invalid_visitor_id" },
  );
  assert.deepEqual(
    parseAnalyticsEnvelope({ event: "page_view", timestamp: 0 }),
    { ok: false, error: "invalid_occurred_at" },
  );
});

test("analytics ingestion is bounded per privacy-safe network key", () => {
  const key = `analytics-test-${Date.now()}`;
  for (let event = 0; event < 120; event += 1) {
    assert.equal(consumeAnalyticsEvent(key, 10_000).allowed, true);
  }
  const rejected = consumeAnalyticsEvent(key, 10_000);
  assert.equal(rejected.allowed, false);
  assert.equal(rejected.retryAfterSeconds, 60);
});

test("the ingestion route is idempotent and never persists raw network identifiers", async () => {
  const source = await readFile("src/app/api/analytics/track/route.ts", "utf8");

  assert.match(source, /parseAnalyticsEnvelope/);
  assert.match(source, /eventId/);
  assert.match(source, /P2002/);
  assert.match(source, /getCurrentUser/);
  assert.match(source, /ipAddress:\s*null/);
  assert.match(source, /userAgent:\s*null/);
  assert.match(source, /consumeAnalyticsEvent/);
  assert.match(source, /createHash\('sha256'\)/);
});
