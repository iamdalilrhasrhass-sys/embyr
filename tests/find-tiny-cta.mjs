import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
const page = await context.newPage();
await page.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 15000 });

const tinyElements = await page.evaluate(() => {
  const results = [];
  const all = document.querySelectorAll('a, button, [role="button"], [onclick]');
  all.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.width < 80 && rect.height < 30) {
      results.push({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 40),
        class: el.className?.toString().slice(0, 60),
        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        href: el.getAttribute('href')?.slice(0, 60),
      });
    }
  });
  return results;
});

console.log(JSON.stringify(tinyElements, null, 2));
await browser.close();
