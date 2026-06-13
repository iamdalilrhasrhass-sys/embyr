const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Try to access a public thread like "Hot Topics" or "Make Friends"
  console.log("Trying to access a public thread...");
  await page.goto('https://forums.justusboys.com/forums/make-friends-introductions-and-connections.49/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("URL:", page.url());
  console.log("Title:", await page.title());
  
  const text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  console.log("Page text:", text);
  
  // Check for forms
  const forms = await page.$$eval('form', forms => 
    forms.map(f => ({ action: f.action, id: f.id, method: f.method, 
      textareas: Array.from(f.querySelectorAll('textarea')).map(t => ({ name: t.name, id: t.id, placeholder: t.placeholder })),
      inputs: Array.from(f.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type, value: i.value }))
    }))
  );
  console.log("Forms:", JSON.stringify(forms, null, 2));
  
  await page.screenshot({ path: '/root/embyr/justusboys_makefriends.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
