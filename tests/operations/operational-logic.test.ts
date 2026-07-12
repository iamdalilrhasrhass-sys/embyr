import assert from "node:assert/strict";
import test from "node:test";
import { isWithinQuietHours } from "../../src/lib/email-outbox.ts";
import { detectAggregateAnomalies } from "../../src/lib/job-maintenance.ts";
import type { AggregateReportData } from "../../src/lib/email-core.ts";

const baseReport: AggregateReportData = {
  cadence: "daily",
  periodStart: "2026-07-10T00:00:00.000Z",
  periodEnd: "2026-07-11T00:00:00.000Z",
  newUsers: 2,
  activePresenceSignals: 3,
  mutualMatches: 1,
  messagesSent: 4,
  reportsCreated: 0,
  analyticsEvents: 100,
  emailsSent: 1,
  emailsPending: 0,
  emailsFailed: 0,
};

test("quiet hours work across midnight in the recipient timezone", () => {
  assert.equal(
    isWithinQuietHours({
      now: new Date("2026-07-11T21:30:00.000Z"),
      timezone: "Europe/Zurich",
      start: "22:00",
      end: "08:00",
    }),
    true,
  );
  assert.equal(
    isWithinQuietHours({
      now: new Date("2026-07-11T10:00:00.000Z"),
      timezone: "Europe/Zurich",
      start: "22:00",
      end: "08:00",
    }),
    false,
  );
});

test("aggregate anomalies only fire after meaningful baselines", () => {
  const alerts = detectAggregateAnomalies({
    ...baseReport,
    uniqueVisitors: 20,
    previousVisitors: 50,
    previousNewUsers: 10,
    sevenDayAverageVisitors: 6,
  });
  assert.equal(alerts.length, 3);
  assert.deepEqual(
    detectAggregateAnomalies({
      ...baseReport,
      uniqueVisitors: 1,
      previousVisitors: 2,
      previousNewUsers: 1,
      sevenDayAverageVisitors: 1,
    }),
    [],
  );
});
