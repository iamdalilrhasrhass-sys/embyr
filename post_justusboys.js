const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Navigating to Gay Discussion forum...");
  await page.goto('https://www.justusboys.com/forum/forums/38-Gay-Discussion', { waitUntil: 'networkidle', timeout: 30000 });
  
  const html = await page.content();
  console.log("Page title:", await page.title());
  
  // Check for post new thread button or quick reply box
  const buttons = await page.$$eval('a, button, input[type="submit"]', els => 
    els.map(e => ({ tag: e.tagName, text: e.textContent?.trim()?.substring(0, 100), href: e.href || '', id: e.id, class: e.className?.substring(0, 80), name: e.name || '' }))
      .filter(e => e.text && e.text.length > 0)
  );
  console.log("Interactive elements:", JSON.stringify(buttons, null, 2));
  
  const forms = await page.$$eval('form', forms => 
    forms.map(f => ({ action: f.action, id: f.id, method: f.method, name: f.name }))
  );
  console.log("Forms:", JSON.stringify(forms, null, 2));
  
  await page.screenshot({ path: '/root/embyr/justusboys_01.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
