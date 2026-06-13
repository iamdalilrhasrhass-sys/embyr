const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // First, let's get some existing thread URLs from the main forum listing
  // We can see threads from "Hot Topics" and other public sections
  await page.goto('https://forums.justusboys.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Extract all thread links
  const links = await page.$$eval('a[href*="/threads/"]', els => 
    els.map(e => e.href).filter(h => h.includes('/threads/'))
  );
  console.log("Found thread links:", JSON.stringify(links.slice(0, 20), null, 2));
  
  // Also try the old-style URL
  await page.goto('https://www.justusboys.com/forum/showthread.php?t=344403', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  console.log("\nOld URL test:");
  console.log("URL:", page.url());
  const text = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log("Text:", text);
  
  await browser.close();
})();
