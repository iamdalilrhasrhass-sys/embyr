import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'http://localhost:3100';
const WIDTHS = [360, 375, 390, 414, 430];
const PAGES = [
  '/',
  '/auth/register',
  '/auth/login',
  '/dashboard',
  '/dashboard/profile',
  '/membres',
  '/messages',
  '/premium',
  '/inviter',
];

mkdirSync('/root/embyr/tests/mobile-ultra-screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });
const allResults = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const page = await context.newPage();
  const widthResults = [];

  for (const path of PAGES) {
    const name = path === '/' ? 'landing' : path.replace(/\//g, '_').replace(/^_/, '');
    const result = { width, path, name, overflow: false, consoleErrors: [], status: 'OK', issues: [] };

    try {
      page.on('console', msg => {
        if (msg.type() === 'error') result.consoleErrors.push(msg.text());
      });

      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 15000 });

      // Check overflow
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScroll: document.body.scrollWidth,
        bodyClient: document.body.clientWidth,
        viewportWidth: window.innerWidth,
        title: document.title,
        // Check for any element wider than viewport
        maxElementWidth: Math.max(...Array.from(document.querySelectorAll('*'))
          .map(el => el.scrollWidth)
          .filter(w => w > 0)),
        viewportWidth2: window.innerWidth,
      }));

      result.metrics = metrics;
      result.overflow = metrics.scrollWidth > metrics.clientWidth || metrics.bodyScroll > metrics.bodyClient;

      // Specific checks
      const checks = await page.evaluate(() => {
        const issues = [];
        // Check for fixed elements at bottom
        const bottomFixed = Array.from(document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]'))
          .filter(el => {
            const style = window.getComputedStyle(el);
            return style.position === 'fixed' && parseInt(style.bottom) >= 0 && parseInt(style.bottom) < 100;
          });
        if (bottomFixed.length > 0) issues.push(`bottom-fixed:${bottomFixed.length}`);

        // Check input font sizes
        const smallInputs = Array.from(document.querySelectorAll('input, textarea, select'))
          .filter(el => {
            const fs = parseFloat(window.getComputedStyle(el).fontSize);
            return fs < 16 && fs > 0;
          });
        if (smallInputs.length > 0) issues.push(`small-inputs:${smallInputs.length}`);

        // Check touch targets
        const smallButtons = Array.from(document.querySelectorAll('button, a[role="button"], [class*="btn"]'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return (rect.width < 44 || rect.height < 44) && rect.width > 0;
          });
        if (smallButtons.length > 0) issues.push(`small-buttons:${smallButtons.length}`);

        // Check for horizontal scroll containers
        const hScroll = Array.from(document.querySelectorAll('*'))
          .filter(el => el.scrollWidth > el.clientWidth && el.clientWidth > 0);
        if (hScroll.length > 0) issues.push(`h-scroll-containers:${hScroll.length}`);

        return issues;
      });

      result.issues = checks;

      if (result.overflow) result.status = 'OVERFLOW';
      else if (result.consoleErrors.length > 5) result.status = 'CONSOLE';
      else if (result.issues.length > 3) result.status = 'ISSUES';

      await page.screenshot({
        path: `/root/embyr/tests/mobile-ultra-screenshots/${name}-${width}.png`,
        fullPage: true,
      });

      console.log(`${width}px ${name.padEnd(16)} ${result.status.padEnd(10)} overflow:${result.overflow} issues:[${result.issues.join(',')}]`);
    } catch (e) {
      result.status = 'ERROR';
      result.error = e.message.slice(0, 100);
      console.log(`${width}px ${name.padEnd(16)} ERROR     ${e.message.slice(0, 80)}`);
    }

    widthResults.push(result);
    page.removeAllListeners('console');
  }

  allResults.push(...widthResults);
  await context.close();
}

await browser.close();

// Summary
const overflows = allResults.filter(r => r.overflow);
const errors = allResults.filter(r => r.status === 'ERROR');
const issuePages = allResults.filter(r => r.issues.length > 0);

console.log(`\n========================================`);
console.log(`TOTAL: ${allResults.length} screenshots`);
console.log(`OVERFLOWS: ${overflows.length}`);
console.log(`ERRORS: ${errors.length}`);
console.log(`PAGES WITH ISSUES: ${issuePages.length}`);
console.log(`========================================`);

if (overflows.length > 0) {
  console.log(`\n⚠️  OVERFLOW PAGES:`);
  overflows.forEach(r => console.log(`  ${r.width}px ${r.path}`));
}
if (issuePages.length > 0) {
  console.log(`\n🔧 PAGES WITH ISSUES:`);
  issuePages.forEach(r => console.log(`  ${r.width}px ${r.path} [${r.issues.join(', ')}]`));
}

writeFileSync('/root/embyr/tests/mobile-audit-results.json', JSON.stringify(allResults, null, 2));
console.log('\n✅ Results saved to /root/embyr/tests/mobile-audit-results.json');
