const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // Try Tech Talk - likely non-adult, might be accessible
    console.log('Trying Tech Talk...');
    await page.goto('https://forums.justusboys.com/forums/tech-talk.75/', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    // Check if we can see it
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const hasLoginForm = !!document.querySelector('input[name="login"]');
      const bodyText = document.body.innerText.substring(0, 500);
      return { h1: h1 ? h1.innerText : 'none', hasLoginForm, bodyText };
    });
    
    console.log('H1:', info.h1);
    console.log('Has login:', info.hasLoginForm);
    console.log('Body:', info.bodyText);
    
    if (!info.hasLoginForm) {
      // Look for post new thread button
      const buttons = await page.$$eval('a', els => 
        els.filter(a => {
          const t = a.innerText.toLowerCase();
          return t.includes('post') || t.includes('new thread') || t.includes('create');
        }).map(a => ({ text: a.innerText.trim().substring(0, 60), href: a.href.substring(0, 120) }))
      );
      console.log('\nPost-related buttons:', JSON.stringify(buttons, null, 2));
    }
    
    await page.screenshot({ path: '/root/embyr/tech_talk.png', fullPage: true });
    
    // Also try Site Help
    console.log('\nTrying Site Help...');
    await page.goto('https://forums.justusboys.com/forums/site-help-feedback-bug-reports.102/', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    const info2 = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const hasLoginForm = !!document.querySelector('input[name="login"]');
      return { h1: h1 ? h1.innerText : 'none', hasLoginForm, url: window.location.href };
    });
    console.log('Site Help - H1:', info2.h1);
    console.log('Site Help - Has login:', info2.hasLoginForm);
    console.log('Site Help - URL:', info2.url);
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
