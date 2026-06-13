const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 1500 },
    locale: 'en-US'
  });
  const page = await ctx.newPage();
  
  // Anti-detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  console.log('1. GOING TO TWITTER...');
  await page.goto('https://x.com/signup', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/tw_signup1.png' });
  
  // Get page state
  const state = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      buttons: Array.from(document.querySelectorAll('button, div[role="button"], a'))
        .map(b => ({ text: (b.textContent || '').trim().substring(0, 60), role: b.getAttribute('role') }))
        .filter(b => b.text.length > 0)
        .slice(0, 20),
      inputs: Array.from(document.querySelectorAll('input')).map(i => ({
        name: i.name, type: i.type, placeholder: i.placeholder, id: i.id
      })),
      labels: Array.from(document.querySelectorAll('span, label'))
        .map(l => l.textContent?.trim())
        .filter(t => t && t.length > 0 && t.length < 100)
        .slice(0, 20)
    };
  });
  console.log('STATE:', JSON.stringify(state, null, 2));
  
  await browser.close();
})();
