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
    // Try navigating directly to Gay Discussion forum
    // It might be under a different slug
    const possibleUrls = [
      'https://forums.justusboys.com/forums/gay-discussion.38/',
      'https://forums.justusboys.com/forums/gay-discussions.38/',
      'https://forums.justusboys.com/forums/gay-discussion-forum.38/',
      'https://forums.justusboys.com/forums/38-gay-discussion.38/',
      'https://forums.justusboys.com/forums/38/',
    ];
    
    for (const url of possibleUrls) {
      console.log(`\nTrying: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1000);
      
      const info = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const title = document.title;
        const url = window.location.href;
        const bodyPreview = document.body.innerText.substring(0, 300);
        const hasLoginForm = !!document.querySelector('input[name="login"]');
        return { h1: h1 ? h1.innerText : 'none', title, url, bodyPreview, hasLoginForm };
      });
      
      console.log('  H1:', info.h1);
      console.log('  Title:', info.title);
      console.log('  Final URL:', info.url);
      console.log('  Has login form:', info.hasLoginForm);
      console.log('  Preview:', info.bodyPreview);
      
      // Check for post new thread button
      const postBtn = await page.$('a:has-text("Post new thread"), a:has-text("Post New Thread"), a[href*="post-thread"]');
      if (postBtn) {
        console.log('  *** FOUND POST NEW THREAD BUTTON ***');
        const href = await postBtn.getAttribute('href');
        console.log('  Href:', href);
      }
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
