import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();

// Try searching for Grindr
await page.goto('https://instinctmagazine.com/?s=grindr', { timeout: 30000, waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log("=== SEARCH RESULTS for 'grindr' ===");
const links = await page.evaluate(() => {
    const articles = document.querySelectorAll('article a, .entry-title a, h2 a, h3 a, .post-title a, a[rel="bookmark"]');
    return Array.from(articles).slice(0, 20).map(a => ({ title: a.textContent.trim(), href: a.href }));
});
console.log(JSON.stringify(links, null, 2));
console.log("URL:", page.url());
await browser.close();
