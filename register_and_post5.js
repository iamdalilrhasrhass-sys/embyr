const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Use the same credentials from the successful registration
  const username = 'guyseeker9795';
  const password = 'ForumPass2024!';
  
  console.log("Step 1: Logging in...");
  await page.goto('https://forums.justusboys.com/login/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Fill login form
  await page.fill('input[name="login"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('input[type="submit"]');
  
  await page.waitForTimeout(5000);
  console.log("After login URL:", page.url());
  const loginText = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log("Login response:", loginText);
  
  // Check if we're logged in
  const pageText = await page.evaluate(() => document.body.innerText);
  if (pageText.includes('Log in') && !pageText.includes('Log out')) {
    console.log("Login may have failed, trying with email...");
    // Try again with email
    await page.goto('https://forums.justusboys.com/login/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[name="login"]', 'guyseeker1779905338116@outlook.com');
    await page.fill('input[name="password"]', password);
    await page.click('input[type="submit"]');
    await page.waitForTimeout(5000);
    console.log("After login URL:", page.url());
  }
  
  await page.screenshot({ path: '/root/embyr/after_login.png', fullPage: true });
  
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
