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
    // Go to home page first (not the adult-forum which requires login)
    console.log('Going to home page...');
    await page.goto('https://forums.justusboys.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    console.log('Title:', await page.title());
    console.log('URL:', page.url());
    
    // Check if there's a way to see the Gay Discussion forum without login
    // Look at all the sections/links
    const allForums = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      return Array.from(links)
        .filter(a => a.href && a.innerText.trim())
        .map(a => ({ text: a.innerText.trim().substring(0, 60), href: a.href.substring(0, 120), class: a.className.substring(0, 60) }))
        .filter(l => l.href.includes('/forums/'));
    });
    
    console.log('\nAll forum links:');
    allForums.forEach((f, i) => console.log(`[${i}] "${f.text}" -> ${f.href}`));
    
    // Click on the "Mostly Safe For Work" section to expand it
    const msfw = await page.$('a[href="#mostly-safe-for-work.109"]');
    if (msfw) {
      console.log('\nFound Mostly Safe For Work section, clicking...');
      await msfw.click();
      await page.waitForTimeout(2000);
      
      // Now look for Gay Discussion link
      const gayDisc = await page.$('a[href*="gay-discussion"]');
      if (gayDisc) {
        console.log('Found Gay Discussion link, clicking...');
        await gayDisc.click();
        await page.waitForTimeout(2000);
        console.log('After click URL:', page.url());
      }
    }
    
    // If still not there, try the MSFW section
    console.log('\nCurrent URL:', page.url());
    console.log('Title:', await page.title());
    
    // Check if we now see Gay Discussion
    const sectionText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log('Page text:', sectionText);
    
    await page.screenshot({ path: '/root/embyr/home_page.png', fullPage: true });
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
