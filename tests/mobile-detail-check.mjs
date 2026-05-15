import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:3100';
const browser = await chromium.launch({ headless: true });

// Detailed checks on key pages at 375px
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
});
const page = await context.newPage();

const results = {};

// 1. Landing — check hero layout, CTA, badges
await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
results.landing = await page.evaluate(() => {
  const issues = [];
  const h1 = document.querySelector('h1');
  const ctas = document.querySelectorAll('a[href*="register"], a[href*="auth"], button');
  const badges = document.querySelectorAll('[class*="badge"]');

  if (h1) {
    const style = window.getComputedStyle(h1);
    const fs = parseFloat(style.fontSize);
    if (fs > 48) issues.push(`h1-too-large:${fs}px`);
  }

  // CTA touch targets
  ctas.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && (rect.width < 44 || rect.height < 44)) {
      issues.push(`cta-small:${Math.round(rect.width)}x${Math.round(rect.height)}`);
    }
  });

  return issues;
});

// 2. Auth — input font sizes + zoom
await page.goto(BASE + '/auth/register', { waitUntil: 'networkidle', timeout: 15000 });
results.register = await page.evaluate(() => {
  const issues = [];
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(el => {
    const fs = parseFloat(window.getComputedStyle(el).fontSize);
    if (fs > 0 && fs < 16) issues.push(`input-too-small:${fs}px`);
  });
  return issues;
});

await page.goto(BASE + '/auth/login', { waitUntil: 'networkidle', timeout: 15000 });
results.login = await page.evaluate(() => {
  const issues = [];
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(el => {
    const fs = parseFloat(window.getComputedStyle(el).fontSize);
    if (fs > 0 && fs < 16) issues.push(`input-too-small:${fs}px`);
  });
  return issues;
});

// 3. Dashboard — check bottom spacing, cards
await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
results.dashboard = await page.evaluate(() => {
  const issues = [];
  const body = document.body;
  const bottomPadding = parseFloat(window.getComputedStyle(body).paddingBottom);
  if (bottomPadding < 70) issues.push(`bottom-padding:${bottomPadding}px (need 70+ for nav)`);
  return issues;
});

// 4. Profile — input sizes
await page.goto(BASE + '/dashboard/profile', { waitUntil: 'networkidle', timeout: 15000 });
results.profile = await page.evaluate(() => {
  const issues = [];
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(el => {
    const fs = parseFloat(window.getComputedStyle(el).fontSize);
    if (fs > 0 && fs < 16) issues.push(`input-too-small:${fs}px`);
  });
  return issues;
});

// 5. Messages — chat input visible
await page.goto(BASE + '/messages', { waitUntil: 'networkidle', timeout: 15000 });
results.messages = await page.evaluate(() => {
  const issues = [];
  const sendBtns = document.querySelectorAll('button[type="submit"], [class*="send"], [class*="Send"]');
  if (sendBtns.length === 0) issues.push('no-send-button');
  return issues;
});

// 6. Premium — check no prices
await page.goto(BASE + '/premium', { waitUntil: 'networkidle', timeout: 15000 });
results.premium = await page.evaluate(() => {
  const issues = [];
  const body = document.body.innerText;
  if (body.includes('€') || body.includes('euro') || body.includes('mensuel')) {
    issues.push('prices-visible');
  }
  return issues;
});

// 7. SideDrawer test
await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
// Try to open drawer
const drawerBtn = await page.$('[class*="hamburger"], [class*="menu"], button[aria-label*="menu"], [class*="drawer"]');
results.drawer = { found: !!drawerBtn };
if (drawerBtn) {
  await drawerBtn.click();
  await page.waitForTimeout(500);
  const drawerLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('nav a[href]');
    return Array.from(links).map(a => ({ href: a.getAttribute('href'), text: a.textContent?.trim().slice(0, 30) }));
  });
  results.drawer.links = drawerLinks;
}

await context.close();
await browser.close();

console.log(JSON.stringify(results, null, 2));
writeFileSync('/root/embyr/tests/mobile-detail-check.json', JSON.stringify(results, null, 2));
