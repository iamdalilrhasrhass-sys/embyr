const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1500 } });
  
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  // Go directly to signup
  await page.goto('https://x.com/signup', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Force-fill the email input directly and dispatch events
  const result = await page.evaluate(() => {
    const input = document.querySelector('input[name="username_or_email"]');
    if (!input) return 'NO_INPUT';
    
    // Focus and set value
    input.focus();
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(input, 'embyrx2026@wshu.net');
    
    // Dispatch input event
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    return 'VALUE_SET';
  });
  console.log('1:', result);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/tw_s1.png' });
  
  // Find and click the Continue button using evaluate
  const clickResult = await page.evaluate(() => {
    // Try to find any clickable element with Continue text
    const elements = document.querySelectorAll('button, div[role="button"], span, a');
    for (const el of elements) {
      if (el.textContent?.trim() === 'Continue' || el.textContent?.trim() === 'Next') {
        el.click();
        return 'CLICKED_' + el.tagName;
      }
    }
    return 'NO_CONTINUE_BUTTON';
  });
  console.log('2:', clickResult);
  await page.waitForTimeout(3000);
  
  // Check what happened
  const url = page.url();
  const body = await page.evaluate(() => document.body?.innerText?.substring(0, 500) || '');
  console.log('URL:', url);
  console.log('BODY:', body);
  await page.screenshot({ path: '/tmp/tw_s2.png' });
  
  // If we're now asked for password or additional info
  const inputs2 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      name: i.name, type: i.type, placeholder: i.placeholder
    }));
  });
  console.log('INPUTS2:', JSON.stringify(inputs2));
  
  await browser.close();
})();
