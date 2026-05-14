const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://embir.xyz';
const OUT = '/root/embyr/qa-screenshots';
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['membres', '/membres'],
  ['premium', '/premium'],
  ['auth-login', '/auth/login'],
  ['auth-register', '/auth/register'],
];

const viewports = [
  ['desktop', { width: 1440, height: 1200 }],
  ['mobile-430', { width: 430, height: 932 }],
  ['mobile-390', { width: 390, height: 844 }],
];

async function run() {
  console.log('🚀 Lancement QA visuelle Embyr...');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const results = [];

  for (const [vpName, viewport] of viewports) {
    console.log(`  📱 ${vpName} (${viewport.width}x${viewport.height})`);
    const ctx = await browser.newContext({ viewport, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' });
    const page = await ctx.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') results.push({ route: 'n/a', viewport: vpName, type: 'console-error', text: msg.text().slice(0, 200) });
    });
    page.on('pageerror', err => {
      results.push({ route: 'n/a', viewport: vpName, type: 'page-error', text: err.message.slice(0, 200) });
    });

    for (const [name, route] of pages) {
      const url = BASE + route;
      try {
        console.log(`    → ${route}`);
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1500);
        const status = response?.status() ?? 'no-response';
        const title = await page.title().catch(() => '');
        const bodyText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');

        const ssName = `${name}-${vpName}.png`;
        const ssPath = path.join(OUT, ssName);
        await page.screenshot({ path: ssPath, fullPage: true });
        const fileSize = fs.statSync(ssPath).size;

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 4);
        const empty = bodyText.trim().length < 40;
        const hasError = bodyText.includes('Application error') || bodyText.includes('500') || bodyText.includes('Internal Server');

        results.push({
          route, viewport: vpName, status, title: title.slice(0, 80),
          screenshot: ssPath, fileSize,
          overflow, empty, hasError,
          textLen: bodyText.trim().length
        });
      } catch (e) {
        results.push({ route, viewport: vpName, type: 'load-error', message: e.message.slice(0, 300) });
      }
    }
    await ctx.close();
  }
  await browser.close();

  const reportPath = path.join(OUT, 'qa-visual-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  const errors = results.filter(r => r.type?.includes('error') || r.hasError || r.empty || r.overflow);
  const routes200 = results.filter(r => r.status === 200).length;
  console.log(`\n📊 RÉSUMÉ EMBYR`);
  console.log(`   Total checks: ${results.length}`);
  console.log(`   Routes 200: ${routes200}/${results.length}`);
  console.log(`   Problèmes: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`   ⚠️  ${e.route} [${e.viewport}] ${e.type || 'render'} - ${e.message || e.text || e.title || ''}`));
  }
  console.log(`   Screenshots: ${OUT}/`);
  console.log(`   Rapport: ${reportPath}`);
}

run().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
