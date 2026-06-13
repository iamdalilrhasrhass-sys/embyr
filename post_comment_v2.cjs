const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--ignore-certificate-errors'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    locale: "en-US",
    permissions: ['clipboard-read', 'clipboard-write'],
    bypassCSP: true
  });
  
  const page = await context.newPage();

  const articleUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";
  
  console.log("=== Loading article ===");
  await page.goto(articleUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  console.log("Article:", title);
  
  // Take screenshot
  await page.screenshot({ path: "/root/embyr/towleroad_article.png" });
  
  // Scroll to the Disqus thread
  await page.evaluate(() => {
    const el = document.getElementById('disqus_thread');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(3000);
  
  // Wait for Disqus iframe to load
  await page.waitForTimeout(5000);
  
  // Try loading the Disqus embed URL directly in a new page
  console.log("\n=== Loading Disqus embed directly ===");
  
  const disqusEmbedUrl = "https://disqus.com/embed/comments/?base=default&f=towleroad&t_i=688074%20https%3A%2F%2Fwww.towleroad.com%2F%3Fp%3D688074&t_u=https%3A%2F%2Fwww.towleroad.com%2F2023%2F08%2Fits-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs%2F";
  
  const disqusPage = await context.newPage();
  await disqusPage.goto(disqusEmbedUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await disqusPage.waitForTimeout(5000);
  
  const disqusContent = await disqusPage.evaluate(() => document.body.innerText);
  console.log("Disqus page content (first 800 chars):", disqusContent.slice(0, 800));
  
  // Take screenshot of Disqus page
  await disqusPage.screenshot({ path: "/root/embyr/disqus_embed.png" });
  
  // Check if the page loaded properly
  const hasError = await disqusPage.evaluate(() => {
    return document.body.innerText.includes('unable to load Disqus') || 
           document.body.innerText.includes('troubleshooting');
  });
  console.log("Has Disqus loading error:", hasError);
  
  // Try to find buttons or inputs in the Disqus page
  const elements = await disqusPage.evaluate(() => {
    const all = [];
    document.querySelectorAll('button, input, textarea, a, select').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        all.push({
          tag: el.tagName,
          type: el.type || '',
          placeholder: el.placeholder || '',
          text: el.textContent?.trim()?.slice(0, 50) || '',
          visible: rect.width > 0 && rect.height > 0
        });
      }
    });
    return all.slice(0, 40);
  });
  console.log("\nInteractive elements:", JSON.stringify(elements, null, 2));
  
  await browser.close();
})();
