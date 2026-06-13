const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  // Try the Living | Loving category
  console.log("=== Living | Loving category ===");
  await page.goto("https://www.towleroad.com/category/life/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  
  const articles = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    const results = [];
    const seen = new Set();
    links.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      if (href && !seen.has(href) && href.includes('towleroad.com') && !href.includes('/category/') && !href.includes('/tag/') && href.match(/\/\d{4}\/\d{2}\//) && text.length > 15) {
        seen.add(href);
        results.push({ href, text: text.slice(0, 150) });
      }
    });
    return results.slice(0, 20);
  });
  
  console.log("Articles from /life/:");
  articles.forEach((a, i) => console.log(`${i}: ${a.text} -> ${a.href}`));

  // Also check if we can find a "dating" tag or search
  console.log("\n=== Search for dating ===");
  await page.goto("https://www.towleroad.com/?s=dating", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  
  const searchRes = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    const results = [];
    const seen = new Set();
    links.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      if (href && !seen.has(href) && href.includes('towleroad.com') && href.match(/\/\d{4}\/\d{2}\//) && text.length > 15) {
        seen.add(href);
        results.push({ href, text: text.slice(0, 150) });
      }
    });
    return results.slice(0, 15);
  });
  
  console.log("Search results for 'dating':");
  searchRes.forEach((a, i) => console.log(`${i}: ${a.text} -> ${a.href}`));

  await browser.close();
})();
