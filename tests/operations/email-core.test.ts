import assert from "node:assert/strict";
import test from "node:test";
import {
  assertAdminSignupEmailData,
  assertAggregateReportData,
  hashEmailAddress,
  isQueuedEmailPayload,
  retryDelayMs,
  sanitizeOperationalError,
} from "../../src/lib/email-core.ts";
import {
  getRequiredAdminReportEmail,
  sendEmail,
} from "../../src/lib/email-local.ts";
import {
  adminAggregateReportEmail,
  renderQueuedEmail,
  welcomeEmail,
  weeklyDigestEmail,
} from "../../src/emails/templates.ts";

const aggregate = {
  cadence: "daily" as const,
  periodStart: "2026-07-10T00:00:00.000Z",
  periodEnd: "2026-07-11T00:00:00.000Z",
  newUsers: 10,
  activePresenceSignals: 8,
  mutualMatches: 4,
  messagesSent: 22,
  reportsCreated: 1,
  analyticsEvents: 100,
  emailsSent: 3,
  emailsPending: 2,
  emailsFailed: 0,
};

test("recipient hashes normalize addresses and never contain the address", () => {
  const first = hashEmailAddress(" Person@Example.COM ");
  const second = hashEmailAddress("person@example.com");
  assert.equal(first, second);
  assert.equal(first.length, 64);
  assert.doesNotMatch(first, /person|example/i);
});

test("queued payload rejects direct recipient PII", () => {
  assert.equal(
    isQueuedEmailPayload({
      schemaVersion: 1,
      recipientKind: "user",
      template: "welcome",
      data: { to: "person@example.com" },
    }),
    false,
  );
  assert.equal(
    isQueuedEmailPayload({
      schemaVersion: 1,
      recipientKind: "admin_report",
      template: "admin-aggregate",
      data: aggregate,
    }),
    true,
  );
  assert.equal(
    isQueuedEmailPayload({
      schemaVersion: 1,
      recipientKind: "user",
      template: "admin-signup",
      data: {},
    }),
    false,
  );
  assert.equal(
    isQueuedEmailPayload({
      schemaVersion: 1,
      recipientKind: "admin_signup",
      template: "admin-aggregate",
      data: aggregate,
    }),
    false,
  );
});

test("admin signup payload is aggregate-only, bounded and escaped", () => {
  const signup = {
    occurredAt: "2026-07-11T12:30:00.000Z",
    country: "<CH>",
    language: "fr",
    source: "direct",
    campaign: null,
    onboardingStatus: "started" as const,
    totalUsers: 24,
  };
  assert.doesNotThrow(() => assertAdminSignupEmailData(signup));
  const html = renderQueuedEmail({
    schemaVersion: 1,
    recipientKind: "admin_signup",
    template: "admin-signup",
    data: signup,
  });
  assert.doesNotMatch(html, /<CH>/);
  assert.match(html, /&lt;CH&gt;/);
  assert.throws(
    () => assertAdminSignupEmailData({ ...signup, totalUsers: -1 }),
    /Invalid admin signup total/,
  );
});

test("aggregate validation rejects oversized or malformed report sections", () => {
  assert.throws(
    () =>
      assertAggregateReportData({
        ...aggregate,
        alerts: ["x".repeat(501)],
      }),
    /Invalid aggregate messages/,
  );
  assert.throws(
    () =>
      assertAggregateReportData({
        ...aggregate,
        health: {
          failedJobs24h: -1,
          staleJobs: 0,
          stuckEmails: 0,
          outboxBacklog: 0,
          apiErrors24h: 0,
          trackingLagMinutes: null,
          unaggregatedRetentionDays: 0,
        },
      }),
    /Invalid aggregate health metric/,
  );
});

test("retry backoff is exponential and capped at one day", () => {
  assert.equal(retryDelayMs(1), 5 * 60 * 1000);
  assert.equal(retryDelayMs(2), 10 * 60 * 1000);
  assert.equal(retryDelayMs(99), 24 * 60 * 60 * 1000);
});

test("operational errors redact emails, credentials and bearer tokens", () => {
  const sanitized = sanitizeOperationalError(
    "send person@example.com via postgresql://user:pass@db Bearer abc.def token=secret",
  );
  assert.doesNotMatch(sanitized, /person@example\.com|user:pass|abc\.def|token=secret/);
});

test("ADMIN_REPORT_EMAIL is mandatory and has no fallback", () => {
  assert.throws(() => getRequiredAdminReportEmail({}), /must be configured/);
  assert.equal(
    getRequiredAdminReportEmail({ ADMIN_REPORT_EMAIL: "ops@example.com" }),
    "ops@example.com",
  );
});

test("Resend delivery uses provider idempotency without requiring SMTP", async () => {
  const originalFetch = globalThis.fetch;
  const previous = {
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
  };
  process.env.EMAIL_PROVIDER = "resend";
  process.env.RESEND_API_KEY = "test_provider_key";
  process.env.RESEND_FROM = "Embir Ops <ops@example.com>";

  globalThis.fetch = async (input, init) => {
    assert.equal(input, "https://api.resend.com/emails");
    const headers = init?.headers as Record<string, string>;
    assert.equal(headers["Idempotency-Key"], "admin-report:test-20260712");
    assert.equal(headers.Authorization, "Bearer test_provider_key");
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.to, ["owner@example.com"]);
    assert.equal(body.from, "Embir Ops <ops@example.com>");
    return new Response(JSON.stringify({ id: "provider-message-1" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    const result = await sendEmail({
      to: "owner@example.com",
      subject: "Embir test",
      html: "<p>Test</p>",
      dedupeKey: "admin-report:test-20260712",
    });
    assert.equal(result.providerMessageId, "provider-message-1");
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("templates escape user-controlled HTML and aggregate reports contain no PII", () => {
  const welcome = welcomeEmail('<img src=x onerror="alert(1)">');
  assert.doesNotMatch(welcome, /<img src=x/);
  const report = adminAggregateReportEmail(aggregate);
  assert.match(report, /Rapport Embir daily/);
  assert.doesNotMatch(report, /@|userId|message content/i);
  assert.doesNotThrow(() => assertAggregateReportData(aggregate));
});

test("digest templates reject non-Embir links", () => {
  const html = weeklyDigestEmail("toi", 1, [
    { title: "Unsafe", url: "javascript:alert(1)" },
    { title: "External", url: "https://example.com/article" },
    { title: "Safe", url: "https://embir.xyz/fr/blog/article" },
  ]);
  assert.doesNotMatch(html, /javascript:|example\.com/);
  assert.match(html, /embir\.xyz\/fr\/blog\/article/);
});
