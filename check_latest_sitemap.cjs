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
  
  // Check the latest sitemap
  console.log("=== Post sitemap 1 (latest) ===");
  await page.goto("https://www.towleroad.com/post-sitemap1.xml", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);
  const content = await page.evaluate(() => document.body.innerText);
  console.log(content.slice(0, 3000));
  
  // Also check post-sitemap2
  console.log("\n=== Post sitemap 2 ===");
  await page.goto("https://www.towleroad.com/post-sitemap2.xml", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);
  const content2 = await page.evaluate(() => document.body.innerText);
  console.log(content2.slice(0, 3000));
  
  // Extract all article URLs
  const urls = content.match(/https:\/\/www\.towleroad\.com\/[^\s<]+/g) || [];
  const urls2 = content2.match(/https:\/\/www\.towleroad\.com\/[^\s<]+/g) || [];
  
  console.log(`\nURLs found: ${urls.length} in sitemap1, ${urls2.length} in sitemap2`);
  
  const allUrls = [...urls, ...urls2];
  // Filter to only article URLs with dates
  const articleUrls = allUrls.filter(u => u.match(/towleroad\.com\/\d{4}\/\d{2}\//));
  
  console.log("\nAll article URLs from sitemaps:");
  articleUrls.slice(0, 30).forEach((u, i) => console.log(`${i}: ${u}`));
  
  await browser.close();
})();
