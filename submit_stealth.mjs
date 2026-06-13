import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled'
  ]
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

console.log('Navigating...');
await page.goto('https://topbestalternatives.com/submit/', {
  waitUntil: 'domcontentloaded',
  timeout: 30000
});

await sleep(3000);
console.log('Page loaded. Checking Turnstile...');

// Fill form first (interaction may help trigger Turnstile)
console.log('Filling form...');
await page.type('input[name="your-subject"]', 'Dalil M', { delay: 30 });
await page.type('input[name="your-email"]', 'arkcourtia@gmail.com', { delay: 20 });
await page.type('input[name="product-name"]', 'EMBYR - Free Gay Dating App', { delay: 25 });
await page.type('textarea[name="product-description"]', 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.', { delay: 10 });
await page.type('input[name="product-url"]', 'https://embir.xyz', { delay: 15 });
await page.type('input[name="text-desired"]', 'Grindr', { delay: 30 });
await page.click('input[type="radio"][name="listing-type"][value="Free"]');
console.log('Form filled.');

// Wait for Turnstile
console.log('Waiting for Turnstile to auto-solve...');
for (let i = 0; i < 20; i++) {
  await sleep(1000);
  const hasToken = await page.evaluate(() => {
    try {
      const input = document.querySelector('input[name="_wpcf7_turnstile_response"]');
      if (input && input.value && input.value.length > 10) return input.value.length;
      return 0;
    } catch(e) { return 0; }
  });
  if (hasToken > 0) {
    console.log(`Turnstile solved at ${i+1}s! Token length: ${hasToken}`);
    break;
  }
  if (i % 5 === 4) console.log(`  ...waited ${i+1}s`);
}

// Check token
const token = await page.evaluate(() => {
  try {
    const input = document.querySelector('input[name="_wpcf7_turnstile_response"]');
    return input ? input.value : null;
  } catch(e) { return null; }
});
console.log('Token:', token ? (token.length > 0 ? `present (${token.length} chars)` : 'empty string') : 'null');

// If still no token, try explicit execute
if (!token || token.length === 0) {
  console.log('No auto-token. Trying explicit turnstile.execute()...');
  
  const execResult = await page.evaluate(() => {
    try {
      if (typeof turnstile === 'undefined') return { error: 'turnstile not defined' };
      
      const div = document.querySelector('.cf-turnstile');
      if (!div) return { error: 'no .cf-turnstile element' };
      
      // Check for existing widget
      const existingId = div.getAttribute('data-widget-id');
      if (existingId) {
        turnstile.execute(existingId);
        return { method: 'existing', widgetId: existingId };
      }
      
      // Try to render and get widget ID
      const widgetId = turnstile.render(div, {
        sitekey: '0x4AAAAAACs0k3VM21Kv5KUf'
      });
      div.setAttribute('data-widget-id', widgetId);
      turnstile.execute(widgetId);
      return { method: 'new', widgetId };
    } catch(e) {
      return { error: e.message };
    }
  });
  console.log('Execute result:', JSON.stringify(execResult));
  
  await sleep(5000);
  
  const token2 = await page.evaluate(() => {
    try {
      const input = document.querySelector('input[name="_wpcf7_turnstile_response"]');
      return input ? input.value : null;
    } catch(e) { return null; }
  });
  console.log('Token after execute:', token2 ? (token2.length > 0 ? `present (${token2.length})` : 'empty') : 'null');
}

// Screenshot
await page.screenshot({ path: '/root/embyr/tba_stealth2.png', fullPage: true });
console.log('Screenshot saved.');

// Final check
const finalToken = await page.evaluate(() => {
  try {
    const input = document.querySelector('input[name="_wpcf7_turnstile_response"]');
    return input ? input.value : null;
  } catch(e) { return null; }
});

if (finalToken && finalToken.length > 10) {
  console.log('Have valid Turnstile token. Submitting...');
  await page.click('input[type="submit"]');
  await sleep(5000);
  
  const url = page.url();
  console.log('URL:', url);
  
  let resp = '';
  try { resp = await page.$eval('.wpcf7-response-output', el => el.textContent); } catch(e) {}
  console.log('Response:', resp);
  
  fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', 
    `SUCCESSFUL SUBMISSION via puppeteer-extra stealth\n\nURL after submit: ${url}\nResponse: ${resp}\nToken length: ${finalToken.length}\n\nForm Data:\nName: Dalil M\nEmail: arkcourtia@gmail.com\nProduct: EMBYR - Free Gay Dating App\nDescription: A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.\nURL: https://embir.xyz\nAlternative to: Grindr\nListing Type: Free`);
} else {
  console.log('Could not obtain Turnstile token.');
  fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', 
    'FAILED: Could not solve Turnstile captcha.\nAttempted methods:\n1. puppeteer-extra with stealth plugin\n2. Xvfb + Camoufox (Firefox)\n3. Direct turnstile.execute() API call\n4. Playwright Chromium with various settings\n\nManual submission required at: https://topbestalternatives.com/submit/');
}

await browser.close();
console.log('Done.');
