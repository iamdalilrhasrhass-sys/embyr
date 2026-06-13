const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    locale: "en-US"
  });
  const page = await context.newPage();
  
  // Use: "It's dehumanising! Grindr slammed for forcing workers..."
  const articleUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";
  
  console.log("=== Loading article ===");
  await page.goto(articleUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  console.log("Article title:", title);
  
  // Take a screenshot of the article
  await page.screenshot({ path: "/root/embyr/towleroad_article_top.png", fullPage: false });
  console.log("Screenshot saved: article top");
  
  // Scroll to find Disqus
  console.log("\n=== Looking for Disqus ===");
  
  // Scroll down to find the comments section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  
  // Check what's at the bottom of the page
  const pageText = await page.evaluate(() => document.body.innerText.slice(-2000));
  console.log("Bottom of page text:", pageText.slice(0, 500));
  
  // Look for Disqus iframe or container
  const disqusElements = await page.evaluate(() => {
    // Check for Disqus thread container
    const disqusThread = document.getElementById('disqus_thread');
    const disqusEmbeds = document.querySelectorAll('[id*="disqus"]');
    const iframes = document.querySelectorAll('iframe');
    const disqusIframes = [];
    iframes.forEach(f => {
      if (f.src && f.src.includes('disqus')) disqusIframes.push(f.src);
    });
    return {
      hasDisqusThread: !!disqusThread,
      disqusEmbeds: Array.from(disqusEmbeds).map(e => e.id || e.className),
      disqusIframes,
      allIframes: Array.from(iframes).map(f => ({ src: f.src?.slice(0, 100), id: f.id }))
    };
  });
  
  console.log("Disqus elements:", JSON.stringify(disqusElements, null, 2));
  
  // Try to scroll to the Disqus thread position
  // Disqus typically loads at a specific position
  console.log("\n=== Scrolling to find comments section ===");
  
  // Let's scroll through the page looking for comment-related content
  for (let i = 0; i < 5; i++) {
    const scrollPos = (document.body.scrollHeight / 5) * i;
    await page.evaluate((pos) => window.scrollTo(0, pos), scrollPos);
    await page.waitForTimeout(1000);
  }
  
  // Now check again for Disqus after scrolling
  const disqusCheck2 = await page.evaluate(() => {
    const thread = document.getElementById('disqus_thread');
    if (thread) {
      return {
        found: true,
        innerHTML: thread.innerHTML.slice(0, 300),
        children: thread.children.length
      };
    }
    // Check for any comment section
    const comments = document.querySelectorAll('[class*="comment"], [id*="comment"]');
    return {
      found: false,
      commentElements: Array.from(comments).slice(0, 5).map(c => c.id || c.className || c.tagName)
    };
  });
  
  console.log("Disqus check:", JSON.stringify(disqusCheck2, null, 2));
  
  // Let me also check the full HTML structure
  const htmlCheck = await page.evaluate(() => {
    // Check main content area
    const main = document.querySelector('main, .content, article, .entry-content');
    if (main) return { tag: main.tagName, id: main.id, className: main.className.slice(0, 100) };
    return { noMain: true };
  });
  console.log("Main content:", JSON.stringify(htmlCheck));
  
  await browser.close();
})();
