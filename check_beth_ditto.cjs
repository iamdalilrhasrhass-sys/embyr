const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    bypassCSP: true
  });
  
  // Check Beth Ditto article (most recent by sitemap)
  const urlsToCheck = [
    "https://www.towleroad.com/2024/03/beth-ditto-became-incredibly-resourceful-at-an-early-age/",
    "https://www.towleroad.com/2024/03/ricky-martins-dad-urged-him-to-come-out-as-gay/",
    "https://www.towleroad.com/2024/03/luke-evans-recalls-feeling-free-in-london/",
    "https://www.towleroad.com/2024/03/robbie-williams-worried-he-was-ugly-when-people-stopped-asking-about-his-sexuality/"
  ];
  
  for (const url of urlsToCheck) {
    const page = await context.newPage();
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    console.log(`\n=== ${url.split('/').pop() || url} ===`);
    
    try {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(3000);
      
      // Scroll to disqus
      await page.evaluate(() => {
        document.getElementById('disqus_thread')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(5000);
      
      const frames = page.frames();
      const df = frames.find(f => f.url().includes('disqus.com/embed'));
      
      if (df) {
        const text = await df.evaluate(() => document.body.innerText);
        const closed = text.includes('closed') || text.includes('thread is closed');
        console.log(`Disqus: ${closed ? 'CLOSED' : 'OPEN?'}`);
        console.log(`Text: ${text.slice(0, 300)}`);
      } else {
        console.log("No Disqus frame");
      }
    } catch(e) {
      console.log(`Error: ${e.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
})();
