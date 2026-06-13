const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Checking registration page...");
  await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("URL:", page.url());
  console.log("Title:", await page.title());
  
  const text = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  console.log("Page text:", text);
  
  // Check forms
  const forms = await page.$$eval('form', forms => 
    forms.map(f => ({ action: f.action.substring(0, 100), id: f.id, method: f.method,
      textareas: Array.from(f.querySelectorAll('textarea')).map(t => ({ name: t.name, id: t.id })),
      inputs: Array.from(f.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type, id: i.id, placeholder: i.placeholder, value: i.value?.substring(0, 30) }))
    }))
  );
  console.log("Forms:", JSON.stringify(forms, null, 2));
  
  await page.screenshot({ path: '/root/embyr/justusboys_register.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
