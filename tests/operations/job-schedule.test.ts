import assert from "node:assert/strict";
import test from "node:test";
import { buildJobWindow } from "../../src/lib/job-schedule.ts";

test("hourly idempotency keys use UTC hour buckets", () => {
  const window = buildJobWindow("hourly", new Date("2026-07-12T13:47:22.000Z"));
  assert.equal(window.idempotencyKey, "hourly:2026-07-12T13");
  assert.equal(window.reportStart.toISOString(), "2026-07-12T12:00:00.000Z");
  assert.equal(window.reportEnd.toISOString(), "2026-07-12T13:00:00.000Z");
});

test("daily jobs report the previous complete UTC day", () => {
  const window = buildJobWindow("daily", new Date("2026-07-12T23:59:59.000Z"));
  assert.equal(window.idempotencyKey, "daily:2026-07-12");
  assert.equal(window.reportStart.toISOString(), "2026-07-11T00:00:00.000Z");
  assert.equal(window.reportEnd.toISOString(), "2026-07-12T00:00:00.000Z");
});

test("weekly jobs use Monday UTC and report the previous complete week", () => {
  const window = buildJobWindow("weekly", new Date("2026-07-15T09:00:00.000Z"));
  assert.equal(window.idempotencyKey, "weekly:2026-07-13");
  assert.equal(window.reportStart.toISOString(), "2026-07-06T00:00:00.000Z");
  assert.equal(window.reportEnd.toISOString(), "2026-07-13T00:00:00.000Z");
});
