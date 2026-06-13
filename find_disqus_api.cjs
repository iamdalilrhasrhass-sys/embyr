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

  const articleUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";
  
  await page.goto(articleUrl, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // Find Disqus config/API key from the page
  const disqusConfig = await page.evaluate(() => {
    // Check for disqus_ variables
    const scripts = document.querySelectorAll('script');
    const disqusScripts = [];
    scripts.forEach(s => {
      if (s.textContent && (s.textContent.includes('disqus') || s.textContent.includes('DISQUS'))) {
        disqusScripts.push(s.textContent.slice(0, 2000));
      }
      if (s.src && s.src.includes('disqus')) {
        disqusScripts.push('SRC: ' + s.src);
      }
    });
    return disqusScripts;
  });
  
  console.log("Disqus scripts found:", disqusConfig.length);
  disqusConfig.forEach((c, i) => {
    console.log(`\n--- Script ${i} ---`);
    console.log(c);
  });
  
  // Also check for any disqus config object
  const configObjs = await page.evaluate(() => {
    const results = {};
    // Check for disqus_config function
    if (typeof disqus_config !== 'undefined') results.disqus_config = disqus_config.toString();
    if (typeof DISQUS !== 'undefined') results.DISQUS = 'exists';
    if (typeof disqus_shortname !== 'undefined') results.shortname = disqus_shortname;
    if (typeof disqus_identifier !== 'undefined') results.identifier = disqus_identifier;
    if (typeof disqus_url !== 'undefined') results.url = disqus_url;
    return results;
  });
  
  console.log("\nDisqus config objects:", JSON.stringify(configObjs, null, 2));
  
  await browser.close();
})();
