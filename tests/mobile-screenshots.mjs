import { chromium } from 'playwright';

const BASE = 'http://localhost:3100';
const WIDTHS = [375, 390, 430];
const PAGES = [
  { path: '/', name: 'landing' },
  { path: '/auth/register', name: 'register' },
  { path: '/auth/login', name: 'login' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/membres', name: 'membres' },
  { path: '/messages', name: 'messages' },
  { path: '/premium', name: 'premium' },
  { path: '/inviter', name: 'inviter' },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
  });
  const page = await context.newPage();

  for (const { path, name } of PAGES) {
    try {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 15000 });
      const title = await page.title();
      const hasOverflow = await page.evaluate(() => {
        const html = document.documentElement;
        return html.scrollWidth > html.clientWidth;
      });
      const status = hasOverflow ? 'OVERFLOW!' : 'OK';
      const result = `${width}px ${name.padEnd(12)} ${status.padEnd(10)} "${title.slice(0, 60)}"`;
      console.log(result);
      results.push({ width, name, overflow: hasOverflow, title });
      await page.screenshot({ path: `/root/embyr/tests/screenshots/${name}-${width}.png`, fullPage: false });
    } catch (e) {
      console.log(`${width}px ${name.padEnd(12)} ERROR      ${e.message.slice(0, 80)}`);
      results.push({ width, name, error: e.message });
    }
  }

  await context.close();
}

await browser.close();

const overflows = results.filter(r => r.overflow);
if (overflows.length > 0) {
  console.log(`\n⚠️  ${overflows.length} pages with horizontal overflow:`);
  overflows.forEach(o => console.log(`  ${o.width}px ${o.name}`));
} else {
  console.log('\n✅ Zéro overflow horizontal sur toutes les pages');
}
