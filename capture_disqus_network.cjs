const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  const articleUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";

  // Capture all XHR requests
  const disqusApiCalls = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('disqus.com/api/') || url.includes('disqus.com/_/') || url.includes('disqus.com/next/')) {
      disqusApiCalls.push({
        url: url.slice(0, 200),
        method: request.method(),
        postData: request.postData()?.slice(0, 500)
      });
    }
  });
  
  await page.goto(articleUrl, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(8000);
  
  console.log("Disqus API calls captured:", disqusApiCalls.length);
  disqusApiCalls.forEach((c, i) => {
    console.log(`\n--- API call ${i} ---`);
    console.log(`URL: ${c.url}`);
    console.log(`Method: ${c.method}`);
    if (c.postData) console.log(`PostData: ${c.postData}`);
  });
  
  // Also check the Disqus embed JS for API key
  const apiKey = await page.evaluate(() => {
    // Try to find the public API key
    if (typeof DISQUS !== 'undefined' && DISQUS.api) return DISQUS.api;
    return null;
  });
  console.log("\nDISQUS.api:", apiKey);
  
  await browser.close();
})();
