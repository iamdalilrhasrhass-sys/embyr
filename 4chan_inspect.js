const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 2000 }
  });
  const page = await ctx.newPage();
  
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('PAGE_LOADED');
  
  // First, scroll down a bit to make sure form is visible
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  
  // Screenshot before any interaction
  await page.screenshot({ path: '/tmp/4chan_before.png', fullPage: false });
  console.log('SCREENSHOT_BEFORE');
  
  // Check if the new thread form is at the top or needs to be expanded
  const formInfo = await page.evaluate(() => {
    const form = document.querySelector('form[name="post"]');
    if (!form) return { found: false };
    
    return {
      found: true,
      action: form.action,
      method: form.method,
      visible: form.checkVisibility ? form.checkVisibility() : null,
      display: window.getComputedStyle(form).display,
      visibility: window.getComputedStyle(form).visibility,
      opacity: window.getComputedStyle(form).opacity,
      rect: form.getBoundingClientRect(),
      html: form.outerHTML.substring(0, 3000)
    };
  });
  
  console.log('FORM_INFO:', JSON.stringify(formInfo, null, 2));
  
  // Also check what the page looks like - is there a reply button or new thread button?
  const allButtons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('a, button, input[type="button"], input[type="submit"]');
    return Array.from(buttons).slice(0, 50).map(b => ({
      tag: b.tagName,
      text: b.innerText || b.value || '',
      href: b.href || '',
      id: b.id || '',
      className: b.className || '',
      rect: b.getBoundingClientRect ? {
        top: b.getBoundingClientRect().top,
        left: b.getBoundingClientRect().left,
        width: b.getBoundingClientRect().width,
        height: b.getBoundingClientRect().height
      } : null
    }));
  });
  
  console.log('ALL_BUTTONS:', JSON.stringify(allButtons, null, 2));
  
  await browser.close();
})();
