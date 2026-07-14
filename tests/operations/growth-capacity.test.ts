import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("capacity QA is bounded, read-only and refuses production by default", async () => {
  const source = await readFile("scripts/qa-growth-capacity.mjs", "utf8");
  assert.match(source, /totalRequests[\s\S]*10_000/);
  assert.match(source, /concurrency[\s\S]*100/);
  assert.match(source, /ALLOW_PRODUCTION_LOAD_TEST/);
  assert.match(source, /Production load testing is disabled/);
  assert.doesNotMatch(source, /method:\s*["'](?:POST|PUT|PATCH|DELETE)["']/i);
  assert.match(source, /technical_request_capacity_only/);
  assert.match(source, /p95/);
  assert.match(source, /errorRate/);
});

test("growth QA covers French and English on mobile and desktop browsers", async () => {
  const source = await readFile("scripts/qa-growth-2500.mjs", "utf8");
  assert.match(source, /chromium, firefox, webkit/);
  assert.match(source, /\/fr\/lausanne/);
  assert.match(source, /\/lausanne/);
  assert.match(source, /mobile-390/);
  assert.match(source, /desktop-1440/);
  assert.match(source, /smallTouchTargets/);
  assert.match(source, /Horizontal overflow/);
  assert.match(source, /utm_campaign=lausanne_launch_2500/);
});
