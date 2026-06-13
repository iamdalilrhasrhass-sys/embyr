const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const username = 'guyseeker9795';
  const password = 'ForumPass2024!';
  
  console.log("Step 1: Loading login page...");
  await page.goto('https://forums.justusboys.com/login/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Fill login form
  await page.fill('input[name="login"]', username);
  await page.fill('input[name="password"]', password);
  
  // Click the button with type="submit"
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(8000);
  console.log("After login URL:", page.url());
  
  const pageText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  console.log("Page text:", pageText);
  
  await page.screenshot({ path: '/root/embyr/after_login.png', fullPage: true });
  
  // Check if logged in successfully
  const isLoggedIn = await page.evaluate(() => !document.body.innerText.includes('Log in') || document.body.innerText.includes('Log out'));
  console.log("Logged in:", isLoggedIn);
  
  // Navigate to Gay Discussion
  console.log("\nStep 2: Navigating to Gay Discussion...");
  await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("GD URL:", page.url());
  console.log("GD Title:", await page.title());
  
  const gdText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log("GD Page:", gdText);
  
  await page.screenshot({ path: '/root/embyr/gay_discussion.png', fullPage: true });
  
  await browser.close();
})();
