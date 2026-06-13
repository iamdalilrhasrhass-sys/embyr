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

  const articleUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";
  
  console.log("=== Loading article ===");
  await page.goto(articleUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  console.log("Article:", title);
  
  // Take screenshot of article top
  await page.screenshot({ path: "/root/embyr/towleroad_article_top.png" });
  
  // Scroll to the Disqus thread
  const disqusThread = await page.$('#disqus_thread');
  if (disqusThread) {
    await disqusThread.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    console.log("Scrolled to disqus_thread");
  }
  
  // Wait for the Disqus iframe
  await page.waitForTimeout(2000);
  
  // Find the Disqus iframe
  const disqusFrame = page.frameLocator('iframe[src*="disqus.com/embed/comments"]');
  console.log("Looking for Disqus iframe...");
  
  // Wait for iframe to load
  await page.waitForTimeout(3000);
  
  // Check if we can find elements in the iframe
  try {
    // First, let's see what's in the frame
    const frameContent = await disqusFrame.locator('body').textContent({ timeout: 10000 });
    console.log("Frame content (first 500 chars):", frameContent.slice(0, 500));
  } catch (e) {
    console.log("Could not get frame body:", e.message);
  }
  
  // Let's try to interact with the Disqus comment form
  // Disqus guest posting flow:
  // 1. Click on "Post as a guest" or name field
  // 2. Fill name and email
  // 3. Write comment
  // 4. Post
  
  // Look for Disqus elements
  try {
    // Check for guest login button or name input
    const guestBtn = disqusFrame.locator('button:has-text("guest")');
    const guestBtnAlt = disqusFrame.locator('[data-action="guest"]');
    const nameInput = disqusFrame.locator('input[name="author"], input[placeholder*="Name"], input[id*="name"]');
    const emailInput = disqusFrame.locator('input[name="email"], input[placeholder*="Email"], input[id*="email"]');
    
    console.log("Guest button exists:", await guestBtn.count());
    console.log("Guest btn alt exists:", await guestBtnAlt.count());
    console.log("Name input exists:", await nameInput.count());
    console.log("Email input exists:", await emailInput.count());
    
    // Also look for the comment textarea
    const textarea = disqusFrame.locator('textarea');
    console.log("Textareas count:", await textarea.count());
    
    // If textarea exists, let's try to fill it
    if (await textarea.count() > 0) {
      await textarea.first().click();
      await page.waitForTimeout(1000);
      await textarea.first().fill("This is terrible. Stories like this are why so many gay men are looking for alternatives to Grindr. It's refreshing to see apps like EMBIR (embir.xyz) popping up as a free, community-focused alternative.");
      console.log("Filled textarea");
      await page.waitForTimeout(1000);
    }
    
    // Look for various buttons
    const buttons = await disqusFrame.locator('button').allTextContents();
    console.log("Buttons in frame:", buttons);
    
  } catch (e) {
    console.log("Error interacting with frame:", e.message);
  }
  
  // Take screenshot of the current state
  await page.screenshot({ path: "/root/embyr/towleroad_comment_attempt.png" });
  console.log("Screenshot saved");
  
  // Log all available info
  const result = {
    articleUrl,
    articleTitle: title,
    timestamp: new Date().toISOString(),
    status: "attempted",
    errors: []
  };
  
  fs.writeFileSync("/root/embyr/towleroad_comment.txt", JSON.stringify(result, null, 2));
  console.log("Result saved");
  
  await browser.close();
})();
