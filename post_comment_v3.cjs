const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    locale: "en-US",
    bypassCSP: true,
    // Enable 3rd party cookies
    storageState: undefined
  });
  
  // Override navigator.webdriver
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    // Mock chrome object
    window.chrome = { runtime: {} };
  });

  const articleUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";
  
  console.log("=== Loading article ===");
  await page.goto(articleUrl, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(5000);
  
  // Scroll to disqus thread
  await page.evaluate(() => {
    document.getElementById('disqus_thread')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(8000); // Extra time for Disqus to load
  
  // Check the frame status
  const frameStatus = await page.evaluate(() => {
    const frame = document.querySelector('iframe[src*="disqus.com/embed"]');
    if (!frame) return { found: false };
    return {
      found: true,
      src: frame.src?.slice(0, 150),
      width: frame.width,
      height: frame.height,
      visible: frame.offsetWidth > 0 && frame.offsetHeight > 0
    };
  });
  console.log("Disqus iframe:", JSON.stringify(frameStatus));
  
  // If iframe found, try to access it
  if (frameStatus.found) {
    const frames = page.frames();
    const disqusFrame = frames.find(f => f.url().includes('disqus.com/embed'));
    
    if (disqusFrame) {
      console.log("Disqus frame URL:", disqusFrame.url().slice(0, 200));
      
      try {
        const bodyText = await disqusFrame.evaluate(() => document.body.innerText);
        console.log("Frame body text (first 500):", bodyText.slice(0, 500));
        
        // Look for guest posting elements
        const elements = await disqusFrame.evaluate(() => {
          const all = [];
          document.querySelectorAll('button, input, textarea, a, [role="button"]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 10 && rect.height > 10) {
              all.push({
                tag: el.tagName,
                type: el.type || '',
                placeholder: el.placeholder || '',
                text: el.textContent?.trim()?.slice(0, 60) || '',
                class: el.className?.slice(0, 50) || '',
                visible: rect.width > 0 && rect.height > 0
              });
            }
          });
          return all;
        });
        console.log("Interactive elements:", JSON.stringify(elements, null, 2));
        
      } catch(e) {
        console.log("Frame error:", e.message);
      }
    }
  }
  
  await page.screenshot({ path: "/root/embyr/towleroad_disqus_attempt.png" });
  console.log("Screenshot saved");
  
  await browser.close();
})();
