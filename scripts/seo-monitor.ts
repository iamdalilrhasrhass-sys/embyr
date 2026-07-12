#!/usr/bin/env tsx
/**
 * SEO Monitor — Daily checks for embir.xyz
 * Run: npx tsx scripts/seo-monitor.ts
 * Cron: 0 6 * * * cd /root/embir && npx tsx scripts/seo-monitor.ts >> /root/embir/data/seo-reports/cron.log 2>&1
 */

const BASE_URL = 'https://embir.xyz';
const REPORT_DIR = '/root/embir/data/seo-reports';

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  value?: string | number;
}

async function checkUrl(url: string): Promise<{ status: number; size: number; time: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    const text = await res.text();
    return { status: res.status, size: text.length, time: Date.now() - start };
  } catch (e: any) {
    return { status: 0, size: 0, time: Date.now() - start };
  }
}

async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // 1. Sitemap accessible
  const sitemap = await checkUrl(`${BASE_URL}/sitemap.xml`);
  results.push({
    name: 'sitemap_accessible',
    status: sitemap.status === 200 ? 'pass' : 'fail',
    detail: sitemap.status === 200 ? 'Sitemap OK' : `HTTP ${sitemap.status}`,
    value: sitemap.status,
  });

  // Count URLs
  if (sitemap.status === 200) {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await sitemapRes.text();
    const urlCount = (xml.match(/<url>/g) || []).length;
    results.push({
      name: 'sitemap_url_count',
      status: urlCount > 100 ? 'pass' : 'warn',
      detail: `${urlCount} URLs in sitemap`,
      value: urlCount,
    });
  }

  // 2. Robots.txt
  const robots = await checkUrl(`${BASE_URL}/robots.txt`);
  results.push({
    name: 'robots_txt_valid',
    status: robots.status === 200 ? 'pass' : 'fail',
    detail: robots.status === 200 ? 'robots.txt OK' : `HTTP ${robots.status}`,
    value: robots.status,
  });

  // 3. Homepage
  const home = await checkUrl(BASE_URL);
  results.push({
    name: 'homepage_accessible',
    status: home.status === 200 ? 'pass' : 'fail',
    detail: `HTTP ${home.status}, ${(home.size / 1024).toFixed(0)}KB, ${home.time}ms`,
    value: home.time,
  });

  // 4. Key blog pages
  const keyPages = [
    '/blog/10-gay-dating-commandments',
    '/blog/free-grindr-alternatives-2026',
    '/blog/gay-dating-safety-rules',
  ];
  for (const page of keyPages) {
    const r = await checkUrl(`${BASE_URL}${page}`);
    results.push({
      name: `blog_page_${page.split('/').pop()}`,
      status: r.status === 200 ? 'pass' : 'fail',
      detail: `HTTP ${r.status}, ${r.time}ms`,
      value: r.time,
    });
  }

  // 5. Key locale pages
  for (const locale of ['fr', 'es', 'de']) {
    const r = await checkUrl(`${BASE_URL}/${locale}`);
    results.push({
      name: `locale_${locale}`,
      status: r.status === 200 ? 'pass' : 'fail',
      detail: `HTTP ${r.status}, ${r.time}ms`,
      value: r.time,
    });
  }

  // 6. Broken links check (sample)
  const brokenLinks: string[] = [];
  if (home.status === 200) {
    const homeRes = await fetch(BASE_URL);
    const html = await homeRes.text();
    const hrefMatches = html.matchAll(/href="(\/[^"]+)"/g);
    for (const match of hrefMatches) {
      const link = match[1];
      if (link.startsWith('/') && !link.includes('//')) {
        const r = await checkUrl(`${BASE_URL}${link}`);
        if (r.status >= 400) brokenLinks.push(`${link} (${r.status})`);
      }
    }
  }
  results.push({
    name: 'broken_links',
    status: brokenLinks.length === 0 ? 'pass' : 'fail',
    detail: brokenLinks.length === 0 ? 'No broken links' : `${brokenLinks.length} broken: ${brokenLinks.slice(0, 5).join(', ')}`,
    value: brokenLinks.length,
  });

  return results;
}

async function main() {
  console.log(`[SEO Monitor] ${new Date().toISOString()}`);
  const results = await runChecks();

  const fails = results.filter((r) => r.status === 'fail');
  const warns = results.filter((r) => r.status === 'warn');
  const passes = results.filter((r) => r.status === 'pass');

  console.log(`  PASS: ${passes.length}  WARN: ${warns.length}  FAIL: ${fails.length}`);

  for (const r of fails) {
    console.log(`  ❌ ${r.name}: ${r.detail}`);
  }
  for (const r of warns) {
    console.log(`  ⚠️  ${r.name}: ${r.detail}`);
  }

  // Save report
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fs = require('fs');
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    `${REPORT_DIR}/${dateStr}.json`,
    JSON.stringify({ timestamp: now.toISOString(), results, summary: { passes: passes.length, warns: warns.length, fails: fails.length } }, null, 2)
  );

  process.exit(fails.length > 0 ? 1 : 0);
}

main();
