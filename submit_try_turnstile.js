const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'en-US'
  });
  
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  const page = await context.newPage();
  
  console.log('Navigating...');
  await page.goto('https://topbestalternatives.com/submit/', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  await page.waitForTimeout(3000);
  
  console.log('Page loaded. Filling form...');
  
  // Fill all fields quickly
  await page.evaluate(() => {
    document.querySelector('input[name="your-subject"]').value = 'Dalil M';
    document.querySelector('input[name="your-email"]').value = 'arkcourtia@gmail.com';
    document.querySelector('input[name="product-name"]').value = 'EMBYR - Free Gay Dating App';
    document.querySelector('textarea[name="product-description"]').value = 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.';
    document.querySelector('input[name="product-url"]').value = 'https://embir.xyz';
    document.querySelector('input[name="text-desired"]').value = 'Grindr';
    document.querySelector('input[type="radio"][name="listing-type"][value="Free"]').checked = true;
  });
  
  console.log('Form filled via evaluate.');
  
  // Now try to interact with Turnstile
  console.log('Interacting with Turnstile...');
  
  // First, let's check if Turnstile has loaded any iframes
  const iframes = page.frames();
  console.log('Total frames:', iframes.length);
  for (const f of iframes) {
    const url = f.url();
    if (url.includes('turnstile') || url.includes('challenges')) {
      console.log('Turnstile frame:', url.substring(0, 100));
    }
  }
  
  // Try to find the Turnstile iframe in the DOM
  const turnstileIframe = await page.$('iframe[src*="turnstile"]');
  console.log('Turnstile iframe in DOM:', !!turnstileIframe);
  
  if (turnstileIframe) {
    // Try clicking the checkbox in the iframe
    const frame = await turnstileIframe.contentFrame();
    if (frame) {
      console.log('Turnstile iframe URL:', frame.url().substring(0, 100));
      
      // Look for the checkbox
      const checkbox = await frame.$('#checkbox');
      if (checkbox) {
        console.log('Found checkbox! Clicking...');
        await checkbox.click();
        await page.waitForTimeout(3000);
      } else {
        console.log('No checkbox found in Turnstile frame');
        const frameContent = await frame.content();
        console.log('Frame HTML (first 500 chars):', frameContent.substring(0, 500));
      }
    }
  } else {
    console.log('No Turnstile iframe found - might be invisible/auto mode');
  }
  
  // Check token
  const tr = await page.$('input[name="_wpcf7_turnstile_response"]');
  if (tr) {
    const val = await tr.inputValue();
    console.log('Turnstile token length:', val.length);
    if (val.length > 0) {
      console.log('Token: ' + val.substring(0, 30) + '...');
    }
  }
  
  await page.screenshot({ path: '/root/embyr/tba_turnstile.png', fullPage: true });
  
  // Try a different approach - directly call turnstile.render
  console.log('Trying to directly call turnstile API...');
  const turnstileResult = await page.evaluate(() => {
    // Check if turnstile object exists
    if (typeof turnstile !== 'undefined') {
      return {
        exists: true,
        execute: typeof turnstile.execute === 'function',
        render: typeof turnstile.render === 'function',
        getResponse: typeof turnstile.getResponse === 'function'
      };
    }
    return { exists: false };
  });
  console.log('Turnstile API:', JSON.stringify(turnstileResult));
  
  if (turnstileResult.exists) {
    // Try to get the current token
    const token = await page.evaluate(() => {
      try {
        return turnstile.getResponse();
      } catch(e) { return 'Error: ' + e.message; }
    });
    console.log('Turnstile getResponse:', token ? (token.length > 0 ? 'has token (' + token.length + ' chars)' : 'empty') : 'null');
    
    // Try to explicitly execute
    const executeResult = await page.evaluate(() => {
      try {
        // Find the widget
        const widgets = document.querySelectorAll('.cf-turnstile');
        if (widgets.length > 0) {
          const widgetId = widgets[0].getAttribute('data-widget-id');
          return { widgetId, widgetFound: !!widgetId };
        }
        return { error: 'no widget found' };
      } catch(e) { return { error: e.message }; }
    });
    console.log('Execute result:', JSON.stringify(executeResult));
    
    // Wait more after any interaction
    await page.waitForTimeout(5000);
    
    // Check again
    const tr2 = await page.$('input[name="_wpcf7_turnstile_response"]');
    if (tr2) {
      const val2 = await tr2.inputValue();
      console.log('Token after interaction, length:', val2.length);
    }
  }
  
  // Try submitting via the POST endpoint directly
  // Let me look at what the turnstile error might be
  await page.screenshot({ path: '/root/embyr/tba_final.png', fullPage: true });
  console.log('Screenshots saved.');
  
  await browser.close();
  console.log('Done.');
})();
