const { chromium } = require('playwright');
const path = require('path');
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
    // Navigate to forum
    console.log('Navigating...');
    await page.goto('https://www.justusboys.com/forum/forums/38-Gay-Discussion', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);
    
    console.log('Title:', await page.title());
    console.log('URL:', page.url());

    // Get all links and their hrefs with context (parent text, classes)
    const links = await page.evaluate(() => {
      const allLinks = document.querySelectorAll('a');
      return Array.from(allLinks).map(a => ({
        text: a.innerText.trim().substring(0, 80),
        href: a.href,
        classes: a.className.substring(0, 100),
        id: a.id,
        parentText: a.parentElement ? a.parentElement.innerText.trim().substring(0, 80) : ''
      })).filter(l => l.text || l.href.includes('thread'));
    });
    
    console.log('\nAll links:');
    links.forEach((l, i) => {
      console.log(`[${i}] "${l.text}" href="${l.href}" class="${l.classes}"`);
    });

    // Look for Post New Thread specifically
    const postThreadLinks = links.filter(l => 
      l.text.toLowerCase().includes('post new thread') || 
      l.text.toLowerCase().includes('new thread') ||
      l.href.toLowerCase().includes('post-thread') ||
      l.href.toLowerCase().includes('add-thread') ||
      l.href.toLowerCase().includes('create-thread') ||
      l.href.toLowerCase().includes('newthread')
    );
    
    console.log('\nPost thread links:', JSON.stringify(postThreadLinks, null, 2));

    // Also look for any page structure clues
    const htmlSnippet = await page.evaluate(() => {
      // Get the main content area
      const main = document.querySelector('main, #content, .p-body, .p-body-inner, .pageContent');
      return main ? main.innerHTML.substring(0, 3000) : document.body.innerHTML.substring(0, 3000);
    });
    
    // Save HTML for analysis
    fs.writeFileSync('/root/embyr/page_html.txt', htmlSnippet);
    console.log('\nHTML snippet saved to /root/embyr/page_html.txt');

    // Take full page screenshot
    await page.screenshot({ path: '/root/embyr/full_forum_page.png', fullPage: true });
    console.log('Screenshot saved');

  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
