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
  
  // Check login form elements
  const formInfo = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return 'No form found';
    const els = form.querySelectorAll('input, button, a');
    return Array.from(els).map(e => ({
      tag: e.tagName,
      type: e.getAttribute('type'),
      name: e.getAttribute('name'),
      id: e.getAttribute('id'),
      value: e.getAttribute('value'),
      text: e.textContent?.trim()?.substring(0, 30),
      onclick: e.getAttribute('onclick')?.substring(0, 50)
    }));
  });
  console.log("Login form elements:", JSON.stringify(formInfo, null, 2));
  
  await page.screenshot({ path: '/root/embyr/login_page.png', fullPage: true });
  
  await browser.close();
})();
