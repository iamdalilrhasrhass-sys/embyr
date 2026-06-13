const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Try accessing a specific thread from Make Friends section
  console.log("Trying to access a thread...");
  await page.goto('https://forums.justusboys.com/threads/the-brother-you-always-wanted.533520/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("URL:", page.url());
  console.log("Title:", await page.title());
  
  const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log("Page text:", text);
  
  // Check for quick reply or post form
  const forms = await page.$$eval('form', forms => 
    forms.map(f => ({ action: f.action.substring(0, 100), id: f.id, method: f.method,
      classes: f.className,
      textareas: Array.from(f.querySelectorAll('textarea')).map(t => ({ name: t.name, id: t.id, placeholder: t.placeholder, classes: t.className })),
      inputs: Array.from(f.querySelectorAll('input[type="submit"], input[type="text"]')).map(i => ({ name: i.name, type: i.type, value: i.value?.substring(0, 50) }))
    }))
  );
  console.log("Forms:", JSON.stringify(forms, null, 2));
  
  await page.screenshot({ path: '/root/embyr/justusboys_thread.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
