/**
 * QA USER JOURNEY — Embyr
 * Teste le parcours utilisateur complet
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'https://embir.xyz';
const SCREENSHOTS = '/root/embyr/qa-screenshots-ux';
const REPORT = [];

async function screenshot(page, name) {
  const path = `${SCREENSHOTS}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function checkPage(page, url, name) {
  const result = { page: name, url, status: 'unknown', errors: [], overflow: false, ctas: [] };
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    result.status = response.status();
    page.on('console', msg => { if (msg.type() === 'error') result.errors.push(msg.text()); });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    result.overflow = overflow;
    const ctas = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href], button')).slice(0, 10).map(b => ({
        text: b.textContent?.trim().slice(0, 60) || '',
        href: b.getAttribute('href') || '',
        visible: b.offsetParent !== null,
      }));
    });
    result.ctas = ctas.filter(c => c.visible && c.text);
    const textLen = await page.evaluate(() => document.body.textContent?.trim().length || 0);
    result.isEmpty = textLen < 100;
    result.screenshot = await screenshot(page, name);
  } catch (e) {
    result.status = 'error';
    result.errors.push(e.message);
  }
  REPORT.push(result);
  return result;
}

(async () => {
  if (!fs.existsSync(SCREENSHOTS)) fs.mkdirSync(SCREENSHOTS, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  
  // Visiteur
  console.log('=== VISITEUR EMBYR ===');
  const page = await context.newPage();
  await checkPage(page, `${BASE}/`, '01-landing');
  await checkPage(page, `${BASE}/membres`, '02-membres');
  await checkPage(page, `${BASE}/premium`, '03-premium');
  await checkPage(page, `${BASE}/auth/login`, '04-login');
  await checkPage(page, `${BASE}/auth/register`, '05-register');
  await checkPage(page, `${BASE}/pricing`, '06-pricing');
  // /profiles → vérifier redirect
  const resp = await page.goto(`${BASE}/profiles`, { waitUntil: 'networkidle', timeout: 10000 });
  const finalUrl = page.url();
  REPORT.push({
    page: '07-profiles-redirect',
    url: `${BASE}/profiles`,
    status: resp.status(),
    finalUrl,
    redirectWorks: finalUrl.includes('/membres'),
    screenshot: await screenshot(page, '07-profiles-redirect'),
    errors: [],
    overflow: false,
  });
  console.log(`  /profiles → ${resp.status()} → ${finalUrl}`);
  await page.close();
  
  // Mobile
  console.log('=== MOBILE 390 ===');
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const mp = await mobile.newPage();
  await checkPage(mp, `${BASE}/`, 'm01-landing-mobile');
  await checkPage(mp, `${BASE}/membres`, 'm02-membres-mobile');
  await checkPage(mp, `${BASE}/premium`, 'm03-premium-mobile');
  await mp.close();
  await mobile.close();
  
  await browser.close();
  
  // Report
  const errors = REPORT.filter(r => r.errors?.length || r.overflow || r.isEmpty || r.status >= 400);
  console.log('\n========================================');
  console.log('RAPPORT QA UTILISATEUR EMBYR');
  console.log('========================================');
  console.log(`Pages testées: ${REPORT.length}`);
  console.log(`Erreurs: ${errors.length}`);
  for (const r of REPORT) {
    const issues = [];
    if (r.status >= 400) issues.push(`HTTP ${r.status}`);
    if (r.errors?.length) issues.push(`${r.errors.length} console errors`);
    if (r.overflow) issues.push('overflow');
    if (r.isEmpty) issues.push('vide');
    const icon = issues.length ? '❌' : '✅';
    console.log(`  ${icon} ${(r.page||'').padEnd(24)} → ${r.status} ${issues.length ? '(' + issues.join(', ') + ')' : ''}`);
  }
  fs.writeFileSync(`${SCREENSHOTS}/report.json`, JSON.stringify(REPORT, null, 2));
  console.log(`\nRapport: ${SCREENSHOTS}/report.json`);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
