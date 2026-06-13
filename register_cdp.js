const { chromium } = require('playwright');

(async () => {
  // Connect to the running Chromium via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  console.log("Connected to browser");
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Navigating to registration page...");
  try {
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    console.log("Success! URL:", page.url());
    console.log("Title:", await page.title());
  } catch(e) {
    console.log("Navigation error:", e.message);
    // Try again
    await page.goto('https://forums.justusboys.com/login/register', { 
      timeout: 30000 
    });
    console.log("URL after retry:", page.url());
  }
  
  await page.screenshot({ path: '/root/embyr/reg_page_cdp.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
