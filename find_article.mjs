import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('https://instinctmagazine.com/', { timeout: 30000, waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const links = await page.evaluate(() => {
    const articles = document.querySelectorAll('article a, .entry-title a, h2 a, h3 a, .post-title a, a[rel="bookmark"]');
    return Array.from(articles).slice(0, 30).map(a => ({ title: a.textContent.trim(), href: a.href }));
});
console.log(JSON.stringify(links, null, 2));
await browser.close();
