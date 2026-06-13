const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  // Try loading with domcontentloaded first
  console.log("=== Load homepage ===");
  await page.goto("https://www.towleroad.com", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  console.log("Title:", title);
  
  // Find all article links
  const articles = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    const results = [];
    const seen = new Set();
    links.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      if (href && !seen.has(href) && href.match(/\/\d{4}\/\d{2}\//) && text.length > 15) {
        seen.add(href);
        results.push({ href, text: text.slice(0, 150) });
      }
    });
    return results;
  });
  
  console.log("Article links on homepage:");
  articles.forEach((a, i) => console.log(`${i}: ${a.text} -> ${a.href}`));

  // Now try search
  console.log("\n=== Navigate to search ===");
  await page.goto("https://www.towleroad.com/?s=grindr", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  
  const searchRes = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    const results = [];
    const seen = new Set();
    links.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      if (href && !seen.has(href) && href.match(/\/\d{4}\/\d{2}\//) && text.length > 15) {
        seen.add(href);
        results.push({ href, text: text.slice(0, 150) });
      }
    });
    return results;
  });
  
  console.log("Search results for 'grindr':");
  searchRes.forEach((a, i) => console.log(`${i}: ${a.text} -> ${a.href}`));

  await browser.close();
})();
