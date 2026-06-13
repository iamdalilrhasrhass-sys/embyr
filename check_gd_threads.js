const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Try to find a Gay Discussion thread - let me guess some thread IDs
  // Gay Discussion section is 38, let me try some recent threads
  const threadIds = [533500, 533000, 532000, 531000, 530000];
  
  for (const tid of threadIds) {
    console.log(`Trying thread ${tid}...`);
    await page.goto(`https://forums.justusboys.com/threads/gay-discussion-${tid}/`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);
    console.log(`  URL: ${page.url()}`);
    console.log(`  Title: ${await page.title()}`);
    
    const text = await page.evaluate(() => document.body.innerText.substring(0, 300));
    if (!text.includes('Log in') && !text.includes('must be logged-in')) {
      console.log(`  FOUND ACCESSIBLE THREAD!`);
      console.log(`  Preview: ${text.substring(0, 500)}`);
      await page.screenshot({ path: `/root/embyr/gd_thread_${tid}.png`, fullPage: true });
      break;
    }
  }
  
  await browser.close();
})();
