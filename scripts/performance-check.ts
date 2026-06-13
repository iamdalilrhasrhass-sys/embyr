#!/usr/bin/env tsx
/**
 * Performance Monitor — Core Web Vitals tracking
 * Run: npx tsx scripts/performance-check.ts
 */

const BASE_URL = 'https://embir.xyz';
const REPORT_DIR = '/root/embir/data/performance';

const PAGES = [
  '/',
  '/fr/',
  '/es/',
  '/blog/best-free-grindr-alternatives-2026',
  '/blog/10-gay-dating-commandments',
  '/blog/gay-dating-safety-rules',
  '/about',
  '/paris',
];

interface PageMetrics {
  page: string;
  statusCode: number;
  ttfb: number;    // Time to First Byte (ms)
  pageSize: number; // KB
  totalTime: number; // ms
}

const THRESHOLDS = {
  ttfb: 800,    // ms
  pageSize: 3000, // KB
  totalTime: 3000, // ms
};

async function measurePage(url: string): Promise<PageMetrics> {
  const fullUrl = `${BASE_URL}${url}`;
  const start = Date.now();
  try {
    const res = await fetch(fullUrl, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const ttfb = Date.now() - start;
    const text = await res.text();
    const totalTime = Date.now() - start;
    return {
      page: url,
      statusCode: res.status,
      ttfb,
      pageSize: Math.round(text.length / 1024),
      totalTime,
    };
  } catch {
    return {
      page: url,
      statusCode: 0,
      ttfb: 20000,
      pageSize: 0,
      totalTime: 20000,
    };
  }
}

async function main() {
  console.log(`[Perf Monitor] ${new Date().toISOString()}`);
  console.log(`Testing ${PAGES.length} pages...`);

  const results: PageMetrics[] = [];
  for (const page of PAGES) {
    const metrics = await measurePage(page);
    results.push(metrics);

    const warnings: string[] = [];
    if (metrics.ttfb > THRESHOLDS.ttfb) warnings.push(`TTFB ${metrics.ttfb}ms > ${THRESHOLDS.ttfb}ms`);
    if (metrics.pageSize > THRESHOLDS.pageSize) warnings.push(`Size ${metrics.pageSize}KB > ${THRESHOLDS.pageSize}KB`);
    if (metrics.totalTime > THRESHOLDS.totalTime) warnings.push(`Total ${metrics.totalTime}ms > ${THRESHOLDS.totalTime}ms`);

    const icon = metrics.statusCode === 200 ? (warnings.length > 0 ? '⚠️' : '✅') : '❌';
    console.log(`  ${icon} ${page} — ${metrics.statusCode} | ${metrics.ttfb}ms | ${metrics.pageSize}KB`);
    for (const w of warnings) console.log(`      ${w}`);
  }

  // Save report
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fs = require('fs');
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    `${REPORT_DIR}/${dateStr}.json`,
    JSON.stringify({ timestamp: now.toISOString(), results, thresholds: THRESHOLDS }, null, 2)
  );

  const failures = results.filter((r) => r.statusCode !== 200).length;
  console.log(`  Done. ${failures} errors. Report: ${REPORT_DIR}/${dateStr}.json`);
  process.exit(failures > 0 ? 1 : 0);
}

main();
