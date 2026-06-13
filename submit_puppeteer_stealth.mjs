import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

console.log('Navigating...');
await page.goto('https://topbestalternatives.com/submit/', {
  waitUntil: 'domcontentloaded',
  timeout: 30000
});

await page.waitForTimeout(3000);
console.log('Page loaded.');

// Fill form
await page.type('input[name="your-subject"]', 'Dalil M');
await page.type('input[name="your-email"]', 'arkcourtia@gmail.com');
await page.type('input[name="product-name"]', 'EMBYR - Free Gay Dating App');
await page.type('textarea[name="product-description"]', 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.');
await page.type('input[name="product-url"]', 'https://embir.xyz');
await page.type('input[name="text-desired"]', 'Grindr');
await page.click('input[type="radio"][name="listing-type"][value="Free"]');
console.log('Form filled.');

// Wait for Turnstile
console.log('Waiting for Turnstile (15s)...');
await page.waitForTimeout(15000);

// Check token
const token = await page.evaluate(() => {
  try {
    return turnstile.getResponse();
  } catch(e) { return null; }
});
console.log('Turnstile token:', token ? `present (${token.length} chars)` : 'null/empty');

if (token && token.length > 0) {
  console.log('Turnstile solved! Submitting...');
  await page.click('input[type="submit"]');
  await page.waitForTimeout(5000);
  
  const url = page.url();
  console.log('URL after submit:', url);
  
  const responseText = await page.$eval('.wpcf7-response-output', el => el.textContent).catch(() => 'No response');
  console.log('Response:', responseText);
}

await page.screenshot({ path: '/root/embyr/tba_stealth.png', fullPage: true });
console.log('Screenshot saved');

await browser.close();
console.log('Done.');
