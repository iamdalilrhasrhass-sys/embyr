const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Step 1: Navigating to Gay Discussion forum...");
  await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log("Page title:", await page.title());
  console.log("Current URL:", page.url());
  
  const postBtns = await page.$$eval('a, button', els => 
    els.filter(e => {
      const t = (e.textContent || '').toLowerCase();
      return t.includes('post') || t.includes('new thread') || t.includes('create');
    })
    .map(e => ({ tag: e.tagName, text: e.textContent?.trim()?.substring(0, 80), href: e.href || '', id: e.id }))
  );
  console.log("Post-related elements:", JSON.stringify(postBtns, null, 2));
  
  const allForms = await page.$$eval('form', forms => 
    forms.map(f => ({ action: f.action, id: f.id, method: f.method, textareas: Array.from(f.querySelectorAll('textarea')).map(t => ({ name: t.name, id: t.id, placeholder: t.placeholder })), inputs: Array.from(f.querySelectorAll('input[type="text"], input[type="submit"]')).map(i => ({ name: i.name, id: i.id, value: i.value })) }))
  );
  console.log("Forms detail:", JSON.stringify(allForms, null, 2));
  
  const pageText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  console.log("Page text preview:", pageText);
  
  await page.screenshot({ path: '/root/embyr/justusboys_gd.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
