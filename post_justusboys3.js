const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Testing main forum page...");
  await page.goto('https://forums.justusboys.com/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("URL:", page.url());
  console.log("Title:", await page.title());
  
  // Check if guests can see threads in the Gay Discussion section
  // Look for all forum section links
  const links = await page.$$eval('a[href*="gay-discussion"], a[href*="forum"][href*="38"]', els => 
    els.map(e => ({ text: e.textContent?.trim()?.substring(0, 60), href: e.href }))
  );
  console.log("Gay Discussion links:", JSON.stringify(links, null, 2));
  
  // Check if there's any text about posting, or any quick-reply
  const allText = await page.evaluate(() => document.body.innerText);
  console.log("Page mentions of posting:", allText.substring(0, 2000));
  
  // Check for the Gay Discussion section on main page - look for the block
  // The original URL format used www.justusboys.com/forum/forums/38-Gay-Discussion
  await page.goto('https://www.justusboys.com/forum/forums/38-Gay-Discussion', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("\nAfter old URL redirect:");
  console.log("URL:", page.url());
  console.log("Title:", await page.title());
  const text2 = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log("Text:", text2);
  
  await page.screenshot({ path: '/root/embyr/justusboys_main.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
