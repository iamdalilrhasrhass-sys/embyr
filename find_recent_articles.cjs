const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
  });
  
  const page = await context.newPage();
  
  // Load homepage and scroll to find latest articles
  await page.goto("https://www.towleroad.com", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // Scroll down to load more content
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(2000);
  
  // Extract all article links with dates
  const articles = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    const results = [];
    const seen = new Set();
    links.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      // Match article URLs with dates
      const match = href?.match(/towleroad\.com\/(\d{4})\/(\d{2})\//);
      if (href && !seen.has(href) && match && text.length > 10) {
        seen.add(href);
        results.push({
          href,
          text: text.slice(0, 150),
          year: match[1],
          month: match[2]
        });
      }
    });
    return results;
  });
  
  console.log("All articles found:", articles.length);
  
  // Group by year
  const byYear = {};
  articles.forEach(a => {
    if (!byYear[a.year]) byYear[a.year] = [];
    byYear[a.year].push(a);
  });
  
  Object.keys(byYear).sort().reverse().forEach(year => {
    console.log(`\n${year} (${byYear[year].length} articles):`);
    byYear[year].slice(0, 5).forEach(a => {
      console.log(`  [${a.year}-${a.month}] ${a.text.slice(0, 80)}`);
    });
    if (byYear[year].length > 5) {
      console.log(`  ... and ${byYear[year].length - 5} more`);
    }
  });
  
  // Also check for any 2026 articles
  const recent2026 = articles.filter(a => a.year >= "2025");
  if (recent2026.length > 0) {
    console.log("\n=== 2025/2026 Articles ===");
    recent2026.forEach(a => console.log(`  ${a.href} -> ${a.text.slice(0, 100)}`));
  }
  
  await browser.close();
})();
