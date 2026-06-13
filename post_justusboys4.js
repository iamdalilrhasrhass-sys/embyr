const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Let's try accessing the old site format which might be different
  console.log("Trying old site...");
  await page.goto('https://www.justusboys.com/forum/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("URL:", page.url());
  console.log("Title:", await page.title());
  
  const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log("Text:", text);
  
  await page.screenshot({ path: '/root/embyr/justusboys_old.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
