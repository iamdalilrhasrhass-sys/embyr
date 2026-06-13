const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  // Go to Towleroad
  console.log("=== Loading Towleroad home ===");
  await page.goto("https://www.towleroad.com", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // Get page title and visible text
  const title = await page.title();
  console.log("Title:", title);
  
  // Find article links with potential dating/gay themes
  const articles = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    const results = [];
    const seen = new Set();
    links.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      if (href && !seen.has(href) && href.includes('towleroad.com') && text.length > 10) {
        seen.add(href);
        results.push({ href, text: text.slice(0, 120) });
      }
    });
    return results.slice(0, 40);
  });
  
  console.log("\n=== Found articles ===");
  articles.forEach((a, i) => console.log(`${i}: ${a.text} -> ${a.href}`));
  
  // Look for dating/gay specific articles
  const datingKeywords = ['dating', 'grindr', 'gay', 'lgbt', 'hookup', 'relationship', 'love', 'sex', 'romance', 'app'];
  
  const relevant = articles.filter(a => {
    const lower = (a.text + a.href).toLowerCase();
    return datingKeywords.some(k => lower.includes(k));
  });
  
  console.log("\n=== Dating/gay related ===");
  relevant.forEach((a, i) => console.log(`${i}: ${a.text} -> ${a.href}`));

  await browser.close();
})();
