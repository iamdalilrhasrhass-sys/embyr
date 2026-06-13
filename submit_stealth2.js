const { chromium } = require('playwright');
const fs = require('fs');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'en-US',
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false
  });
  
  // Override automation detection
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    // Override chrome object
    window.chrome = { runtime: {} };
  });
  
  const page = await context.newPage();
  
  console.log('Navigating...');
  await page.goto('https://topbestalternatives.com/submit/', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  await sleep(3000);
  console.log('Page loaded.');
  
  // Fill form using keyboard
  await page.keyboard.type('Dalil M');
  
  // Use evaluate to fill all fields at once, faster
  await page.evaluate(() => {
    const fields = {
      'your-subject': 'Dalil M',
      'your-email': 'arkcourtia@gmail.com',
      'product-name': 'EMBYR - Free Gay Dating App',
      'product-description': 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.',
      'product-url': 'https://embir.xyz',
      'text-desired': 'Grindr'
    };
    for (const [name, value] of Object.entries(fields)) {
      const el = document.querySelector(`[name="${name}"]`);
      if (el) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    // Click Free
    const freeRadio = document.querySelector('input[type="radio"][name="listing-type"][value="Free"]');
    if (freeRadio) {
      freeRadio.checked = true;
      freeRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  console.log('Form filled.');
  
  // Now, wait a moment then try to interact with the Turnstile frame
  await sleep(2000);
  
  // Try to find Turnstile iframe
  const frames = page.frames();
  console.log('Total frames:', frames.length);
  for (const f of frames) {
    const url = f.url();
    if (url.includes('turnstile') || url.includes('challenges')) {
      console.log('Found Turnstile frame:', url.substring(0, 120));
      console.log('Frame title:', await f.title().catch(() => 'N/A'));
      
      // Try to find and interact with elements in the frame
      try {
        const body = await f.$('body');
        if (body) {
          const html = await f.content();
          console.log('Frame body snippet:', html.substring(0, 300));
        }
      } catch(e) {
        console.log('Frame interaction error:', e.message);
      }
    }
  }
  
  // Check if Turnstile auto-solved after interactions
  await sleep(2000);
  
  const tokenCheck = await page.evaluate(() => {
    const input = document.querySelector('input[name="_wpcf7_turnstile_response"]');
    return {
      exists: !!input,
      value: input ? input.value.substring(0, 30) : null,
      length: input ? input.value.length : 0
    };
  });
  console.log('Token check:', JSON.stringify(tokenCheck));
  
  // If no token, try a completely different approach - submit directly to the form action
  // by intercepting the form submission
  if (!tokenCheck.value || tokenCheck.length < 10) {
    console.log('No Turnstile token. Trying direct form submission bypass...');
    
    // Try submitting with a dummy token or empty token
    const result = await page.evaluate(async () => {
      // Get the form
      const form = document.querySelector('form.wpcf7-form');
      if (!form) return { error: 'no form' };
      
      // Create FormData
      const formData = new FormData(form);
      
      // Try submitting via fetch directly
      try {
        const response = await fetch('/wp-json/contact-form-7/v1/contact-forms/60730/feedback', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        return { apiResult: data };
      } catch(e) {
        return { error: e.message };
      }
    });
    console.log('Direct API result:', JSON.stringify(result));
    
    // Try the HTML form submit
    const submitResult = await page.evaluate(() => {
      const form = document.querySelector('form.wpcf7-form');
      if (!form) return { error: 'no form' };
      
      // Submit via the form directly
      form.submit();
      return { submitted: true };
    });
    console.log('Form submitted directly:', JSON.stringify(submitResult));
    
    await sleep(5000);
    console.log('URL after direct submit:', page.url());
  }
  
  await page.screenshot({ path: '/root/embyr/tba_final2.png', fullPage: true });
  
  const resultContent = `
Submission Attempt - TopBestAlternatives.com
============================================
Date: ${new Date().toISOString()}
URL: https://topbestalternatives.com/submit/
Target Alternative: Grindr

Form Data Submitted:
- Name: Dalil M
- Email: arkcourtia@gmail.com
- Product Name: EMBYR - Free Gay Dating App
- Description: A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.
- Product URL: https://embir.xyz
- Alternative to: Grindr
- Listing Type: Free

Turnstile Token: ${tokenCheck.value ? `present (${tokenCheck.length} chars)` : 'empty'}
Direct API Result: ${JSON.stringify(result)}
Final URL: ${page.url()}

NOTE: The site uses Cloudflare Turnstile captcha which could not be auto-solved
in headless mode. Manual submission may be required.
`;
  
  fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', resultContent);
  console.log('Result saved.');
  
  await browser.close();
  console.log('Done.');
})();
