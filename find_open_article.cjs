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
  
  // Check multiple articles for open comments
  const articleUrls = [
    "https://www.towleroad.com/2024/04/group-of-gay-footballers-set-date-to-reveal-identities-imminently-with-couples-in-hiding/",
    "https://www.towleroad.com/2024/04/mean-girls-star-jonathan-bennett-recalls-the-moment-his-life-changed-forever/",
    "https://www.towleroad.com/2024/04/sir-elton-john-sent-lance-bass-gift-basket-to-celebrate-coming-out/",
    "https://www.towleroad.com/2024/04/relationship-status-influences-heterosexual-womens-sexual-prejudice-towards-lesbians/",
    "https://www.towleroad.com/2024/03/keep-key-west-gay-rebel-relax/",
    "https://www.towleroad.com/2024/04/sophia-bushs-girlfriend-proud-the-actress-has-opened-up-about-coming-out-as-queer/",
    "https://www.towleroad.com/2024/04/mel-b-declares-shell-always-be-open-when-it-comes-to-her-sexuality/"
  ];
  
  const results = [];
  
  for (const url of articleUrls) {
    const page = await context.newPage();
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
    });
    
    console.log(`\n=== Checking: ${url.slice(0, 80)}... ===`);
    
    try {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(5000);
      
      // Check for disqus frame
      const frames = page.frames();
      const disqusFrame = frames.find(f => f.url().includes('disqus.com/embed/comments'));
      
      if (disqusFrame) {
        try {
          const bodyText = await disqusFrame.evaluate(() => document.body.innerText);
          const isClosed = bodyText.includes('closed') || bodyText.includes('thread is closed');
          const canPost = !isClosed && (bodyText.includes('textarea') || bodyText.includes('write a comment') || bodyText.includes('Post'));
          
          console.log(`Disqus loaded: ${!isClosed ? 'OPEN' : 'CLOSED'}`);
          console.log(`Can post: ${canPost}`);
          console.log(`Body preview: ${bodyText.slice(0, 200)}`);
          
          results.push({ url, isClosed, canPost, preview: bodyText.slice(0, 100) });
        } catch(e) {
          console.log(`Frame error: ${e.message}`);
          results.push({ url, error: e.message });
        }
      } else {
        console.log("No Disqus frame found");
        results.push({ url, noDisqus: true });
      }
    } catch(e) {
      console.log(`Page load error: ${e.message}`);
      results.push({ url, loadError: e.message });
    }
    
    await page.close();
  }
  
  console.log("\n\n=== Summary ===");
  results.forEach(r => {
    console.log(`${r.isClosed ? '❌ CLOSED' : '✅ OPEN'} | CanPost: ${r.canPost} | ${r.url.slice(0, 80)}`);
  });
  
  fs.writeFileSync("/root/embyr/towleroad_articles_check.json", JSON.stringify(results, null, 2));
  
  await browser.close();
})();
