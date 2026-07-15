import assert from "node:assert/strict";
import test from "node:test";
import {
  adminSignupEmail,
  formatZurichDateTime,
  renderQueuedEmail,
  type RenderedEmail,
} from "../../src/emails/templates.ts";
import {
  adminSignupDedupeKey,
  adminSignupSubject,
  assertAdminSignupEmailData,
  isQueuedEmailPayload,
  type AdminSignupEmailData,
  type AggregateReportData,
  type QueuedEmailPayload,
} from "../../src/lib/email-core.ts";

const aggregateReport: AggregateReportData = {
  cadence: "daily",
  periodStart: "2026-07-13T22:00:00.000Z",
  periodEnd: "2026-07-14T22:00:00.000Z",
  newUsers: 4,
  activePresenceSignals: 18,
  mutualMatches: 3,
  messagesSent: 11,
  reportsCreated: 0,
  analyticsEvents: 94,
  emailsSent: 8,
  emailsPending: 1,
  emailsFailed: 0,
  topSources: [{ label: "reddit", count: 3 }],
  alerts: ["Aucune anomalie critique"],
  health: {
    failedJobs24h: 0,
    staleJobs: 0,
    stuckEmails: 0,
    outboxBacklog: 1,
    apiErrors24h: 0,
    trackingLagMinutes: 2,
    unaggregatedRetentionDays: 90,
  },
};

const completeSignup: AdminSignupEmailData = {
  occurredAt: "2026-07-14T16:53:39.719Z",
  country: "CH",
  language: "fr",
  source: "reddit",
  campaign: "beta-juillet",
  onboardingStatus: "completed",
  totalUsers: 26,
  qualifiedMembers: 19,
  growth24h: 4,
};

const payloads: Array<{ name: string; payload: QueuedEmailPayload }> = [
  {
    name: "email-verification",
    payload: {
      schemaVersion: 1,
      recipientKind: "user",
      template: "email-verification",
      data: {
        verificationUrl:
          "https://embir.xyz/fr/auth/verify-email#token=short-lived-test-token",
        expiresAt: "2026-07-16T00:00:00.000Z",
        locale: "fr",
      },
    },
  },
  {
    name: "welcome",
    payload: {
      schemaVersion: 1,
      recipientKind: "user",
      template: "welcome",
      data: {},
    },
  },
  {
    name: "profile-reminder",
    payload: {
      schemaVersion: 1,
      recipientKind: "user",
      template: "profile-reminder",
      data: { completionPercent: 62 },
    },
  },
  {
    name: "weekly-digest",
    payload: {
      schemaVersion: 1,
      recipientKind: "user",
      template: "weekly-digest",
      data: {
        newMatches: 2,
        topArticles: [
          {
            title: "Créer une vraie connexion",
            url: "https://embir.xyz/fr/blog/connexion-reciproque",
          },
        ],
      },
    },
  },
  {
    name: "admin-aggregate",
    payload: {
      schemaVersion: 1,
      recipientKind: "admin_report",
      template: "admin-aggregate",
      data: aggregateReport,
    },
  },
  {
    name: "admin-signup",
    payload: {
      schemaVersion: 1,
      recipientKind: "admin_signup",
      template: "admin-signup",
      data: completeSignup,
    },
  },
];

function assertCleanMultipart(rendered: RenderedEmail): void {
  assert.ok(rendered.html.trim().length > 300, "HTML part must be substantial");
  assert.ok(rendered.text.trim().length > 40, "text part must be useful");
  assert.match(rendered.html, /^<!doctype html>/i);
  assert.match(rendered.html, /<body\b/i);
  assert.doesNotMatch(rendered.text, /<(?:html|body|table|tr|td|p|a)\b/i);
  assert.doesNotMatch(rendered.text, /&(?:nbsp|amp|lt|gt);/i);
}

test("all six queued email types render useful HTML and plain-text parts", async (t) => {
  assert.equal(payloads.length, 6);
  for (const entry of payloads) {
    await t.test(entry.name, () => {
      assert.equal(isQueuedEmailPayload(entry.payload), true);
      assertCleanMultipart(renderQueuedEmail(entry.payload, "Elaine"));
    });
  }
});

test("signup uses the exact Europe/Zurich date and never exposes the raw ISO timestamp", () => {
  const rendered = adminSignupEmail(completeSignup);
  const expected = "14 juillet 2026 à 18 h 53";

  assert.equal(formatZurichDateTime(completeSignup.occurredAt), expected);
  assert.match(rendered.html, new RegExp(expected));
  assert.match(rendered.text, new RegExp(expected));
  assert.doesNotMatch(rendered.html, /2026-07-14T16:53:39\.719Z/);
  assert.doesNotMatch(rendered.text, /2026-07-14T16:53:39\.719Z/);
  assert.match(rendered.text, /Date et heure : 14 juillet 2026 à 18 h 53/);
});

test("signup subject is professional and exact", () => {
  assert.equal(
    adminSignupSubject(26),
    "Nouvelle inscription Embir — 26 utilisateurs au total",
  );
  assert.throws(() => adminSignupSubject(-1), /Invalid admin signup total/);
  assert.throws(() => adminSignupSubject(2.5), /Invalid admin signup total/);
});

test("admin signup CTA targets only the authenticated cockpit route", () => {
  const rendered = adminSignupEmail(completeSignup);
  const expectedUrl = "https://embir.xyz/admin/analytics";

  assert.match(rendered.html, /href="https:\/\/embir\.xyz\/admin\/analytics"/);
  assert.match(rendered.html, />Voir le cockpit Embir<\/a>/);
  assert.match(rendered.text, new RegExp(`Voir le cockpit Embir : ${expectedUrl}`));
  assert.doesNotMatch(rendered.html, /admin\/analytics[?#]/i);
  assert.doesNotMatch(rendered.text, /admin\/analytics[?#]/i);
  assert.doesNotMatch(rendered.html, /(?:token|secret|api[_-]?key)=[^&\s"']+/i);
  assert.doesNotMatch(rendered.text, /(?:token|secret|api[_-]?key)=[^&\s]+/i);
});

test("email shell declares dark-mode support and keeps critical layout styles inline", () => {
  const { html } = adminSignupEmail(completeSignup);

  assert.match(html, /<meta name="color-scheme" content="dark light">/);
  assert.match(html, /<meta name="supported-color-schemes" content="dark light">/);
  assert.match(html, /:root\{color-scheme:dark light;supported-color-schemes:dark light\}/);
  assert.match(html, /@media only screen and \(max-width:430px\)/);
  assert.match(html, /width:100%;max-width:600px/);
  assert.match(
    html,
    /<body bgcolor="#0e0c0f" style="[^"]*background-color:#0e0c0f!important;[^"]*color:#f8f3f1!important;/,
  );
  assert.match(
    html,
    /<td class="embir-content" bgcolor="#1a1719" style="[^"]*background-color:#1a1719!important;[^"]*color:#f8f3f1!important;">/,
  );
  assert.match(
    html,
    /<td bgcolor="#ff8a72" style="[^"]*background-color:#ff8a72;[^"]*"><a[^>]+color:#241013!important;/,
  );
});

test("email palette has no gradient, transparency, or light text on a light surface", () => {
  const { html } = adminSignupEmail(completeSignup);
  const allowedBackgrounds = new Set([
    "#0e0c0f",
    "#141114",
    "#1a1719",
    "#242023",
    "#8f3048",
    "#ff8a72",
  ]);
  const backgrounds = [
    ...html.matchAll(/bgcolor="(#[0-9a-f]{6})"/gi),
    ...html.matchAll(/background-color:(#[0-9a-f]{6})/gi),
  ].map((match) => match[1].toLowerCase());

  assert.ok(backgrounds.length >= 8, "explicit email background colors are required");
  for (const color of backgrounds) {
    assert.equal(allowedBackgrounds.has(color), true, `unexpected background ${color}`);
  }
  assert.doesNotMatch(html, /(?:linear|radial|conic)-gradient|rgba?\(|hsla?\(/i);
  assert.doesNotMatch(html, /(?:opacity\s*:|\btransparent\b)/i);
  assert.match(
    html,
    /bgcolor="#ff8a72"[^>]*>[\s\S]*?<a[^>]*color:#241013!important;[^>]*>Voir le cockpit Embir<\/a>/i,
  );
  assert.doesNotMatch(
    html,
    /(?:bgcolor|background-color:)="?#(?:fff(?:fff)?|f8f3f1|fff7f4|cfc4c8)\b/i,
  );
});

test("missing optional signup values have compact, explicit fallbacks in both parts", () => {
  const rendered = adminSignupEmail({
    occurredAt: completeSignup.occurredAt,
    country: null,
    language: "fr",
    source: null,
    campaign: null,
    onboardingStatus: "started",
    totalUsers: 26,
  });

  for (const expected of [
    "Zone générale : Non renseignée",
    "Source d’acquisition : Direct",
    "Campagne UTM : Aucune",
    "Membres qualifiés : Non disponible",
    "Évolution sur 24 heures : Non disponible",
  ]) {
    assert.match(rendered.text, new RegExp(expected));
  }
  assert.match(rendered.html, /Non renseignée/);
  assert.match(rendered.html, /Non disponible/);
  assert.doesNotMatch(rendered.html, />undefined<|>null</i);
  assert.doesNotMatch(rendered.text, /:\s*(?:undefined|null)\b/i);
});

test("signup rendering ignores sensitive and exact-location fields", () => {
  const sensitiveData = {
    ...completeSignup,
    email: "person@example.com",
    ipAddress: "203.0.113.99",
    latitude: 46.2044,
    longitude: 6.1432,
    exactAddress: "10 rue privée, Genève",
    adminToken: "permanent-secret-value",
  };
  const rendered = adminSignupEmail(sensitiveData);

  for (const forbidden of [
    /person@example\.com/i,
    /203\.0\.113\.99/,
    /46\.2044|6\.1432/,
    /10 rue privée/i,
    /permanent-secret-value/i,
  ]) {
    assert.doesNotMatch(rendered.html, forbidden);
    assert.doesNotMatch(rendered.text, forbidden);
  }
  assert.equal(
    isQueuedEmailPayload({
      schemaVersion: 1,
      recipientKind: "admin_signup",
      template: "admin-signup",
      data: sensitiveData,
    }),
    false,
  );
});

test("signup deduplication key and payload validation are deterministic", () => {
  const first = adminSignupDedupeKey("  user_12345678  ");
  const second = adminSignupDedupeKey("user_12345678");

  assert.equal(first, "admin-signup:user_12345678");
  assert.equal(second, first);
  assert.notEqual(adminSignupDedupeKey("user_87654321"), first);
  assert.throws(() => adminSignupDedupeKey("short"), /Invalid user id/);
  assert.throws(
    () => adminSignupDedupeKey("user_1234:injected"),
    /Invalid user id/,
  );
  assert.doesNotThrow(() => assertAdminSignupEmailData(completeSignup));
  assert.throws(
    () => assertAdminSignupEmailData({ ...completeSignup, occurredAt: "2026-07-14" }),
    /Invalid admin signup timestamp/,
  );
  assert.throws(
    () => assertAdminSignupEmailData({ ...completeSignup, qualifiedMembers: -1 }),
    /Invalid admin signup qualified members/,
  );
  assert.throws(
    () => assertAdminSignupEmailData({ ...completeSignup, growth24h: -1 }),
    /Invalid admin signup 24-hour growth/,
  );
  assert.throws(
    () => assertAdminSignupEmailData({ ...completeSignup, country: "Genève centre" }),
    /Invalid admin signup general zone/,
  );
});
