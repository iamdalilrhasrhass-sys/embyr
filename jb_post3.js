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
    // Try direct navigation to the Gay Discussion forum
    // XenForo pattern: /forums/{slug}.{id}/
    const urls = [
      'https://forums.justusboys.com/forums/gay-discussion.38/',
      'https://forums.justusboys.com/forums/38/',
      'https://forums.justusboys.com/forums/-.38/',
    ];

    for (const url of urls) {
      console.log(`Trying: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1000);
      console.log(`  Current URL: ${page.url()}`);
      console.log(`  Title: ${await page.title()}`);
      
      const isForum = await page.evaluate(() => {
        // Check if we see thread listing or "Post New Thread" button
        const body = document.body.innerText;
        return {
          hasThreadList: body.includes('Thread') || body.includes('thread'),
          hasPostButton: body.includes('Post New Thread') || body.includes('New thread') || body.includes('new thread'),
          hasLogin: body.includes('Log in') || body.includes('login'),
          snippets: body.substring(0, 500)
        };
      });
      
      console.log('  Analysis:', JSON.stringify(isForum, null, 2));
      
      // Look for post thread button
      const buttons = await page.$$eval('a', els => 
        els.filter(a => {
          const t = a.innerText.toLowerCase();
          return t.includes('post') || t.includes('new thread') || t.includes('create') || t.includes('thread');
        }).map(a => ({ text: a.innerText.trim().substring(0, 60), href: a.href.substring(0, 120), class: a.className.substring(0, 100) }))
      );
      console.log('  Relevant buttons:', JSON.stringify(buttons));
      
      // Take screenshot
      await page.screenshot({ path: `/root/embyr/forum_attempt_${urls.indexOf(url)}.png`, fullPage: true });
      
      // Look for the actual forum node heading
      const heading = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText : 'no h1';
      });
      console.log(`  H1: ${heading}`);
    }

  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
