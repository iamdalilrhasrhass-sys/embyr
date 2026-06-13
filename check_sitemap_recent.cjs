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
  
  // Check sitemap
  console.log("=== Checking sitemap ===");
  await page.goto("https://www.towleroad.com/sitemap.xml", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);
  const sitemapContent = await page.evaluate(() => document.body.innerText);
  console.log(sitemapContent.slice(0, 2000));
  
  await browser.close();
})();
