#!/usr/bin/env node
import { performance } from "node:perf_hooks";

const baseUrl = new URL(process.env.BASE_URL || "http://127.0.0.1:3100");
const totalRequests = Math.min(10_000, Math.max(100, Number(process.env.TOTAL_REQUESTS || 2_500)));
const concurrency = Math.min(100, Math.max(1, Number(process.env.CONCURRENCY || 25)));
const maxP95Ms = Math.min(10_000, Math.max(100, Number(process.env.MAX_P95_MS || 1_500)));
const maxErrorRate = Math.min(10, Math.max(0, Number(process.env.MAX_ERROR_RATE || 1)));
const productionHost = /(^|\.)embir\.xyz$/i.test(baseUrl.hostname);

if (productionHost && process.env.ALLOW_PRODUCTION_LOAD_TEST !== "true") {
  throw new Error("Production load testing is disabled. Use a local or isolated candidate release.");
}

const routes = ["/fr", "/fr/lausanne", "/fr/auth/register", "/fr/auth/login"];
const latencies = [];
const statuses = new Map();
let nextRequest = 0;
let failures = 0;

async function worker() {
  while (true) {
    const index = nextRequest;
    nextRequest += 1;
    if (index >= totalRequests) return;
    const route = routes[index % routes.length];
    const startedAt = performance.now();
    try {
      const response = await fetch(new URL(route, baseUrl), {
        redirect: "manual",
        headers: { "User-Agent": "Embir-Growth-Capacity-QA/1.0" },
        signal: AbortSignal.timeout(10_000),
      });
      await response.arrayBuffer();
      const latency = performance.now() - startedAt;
      latencies.push(latency);
      statuses.set(response.status, (statuses.get(response.status) || 0) + 1);
      if (response.status < 200 || response.status >= 400) failures += 1;
    } catch {
      latencies.push(performance.now() - startedAt);
      failures += 1;
      statuses.set("network_error", (statuses.get("network_error") || 0) + 1);
    }
  }
}

function percentile(values, ratio) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))];
}

const startedAt = performance.now();
await Promise.all(Array.from({ length: concurrency }, () => worker()));
const durationMs = performance.now() - startedAt;
const errorRate = Math.round((failures / totalRequests) * 10_000) / 100;
const result = {
  scope: "technical_request_capacity_only",
  baseUrl: baseUrl.origin,
  totalRequests,
  concurrency,
  durationSeconds: Math.round(durationMs / 100) / 10,
  requestsPerSecond: Math.round((totalRequests / (durationMs / 1_000)) * 10) / 10,
  latencyMs: {
    p50: Math.round(percentile(latencies, 0.5)),
    p95: Math.round(percentile(latencies, 0.95)),
    p99: Math.round(percentile(latencies, 0.99)),
  },
  errorRate,
  statuses: Object.fromEntries([...statuses.entries()].sort(([left], [right]) => String(left).localeCompare(String(right)))),
  thresholds: { maxP95Ms, maxErrorRate },
};

console.log(JSON.stringify(result, null, 2));
if (result.latencyMs.p95 > maxP95Ms || errorRate > maxErrorRate) process.exitCode = 1;
