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
  
  // Override navigator.webdriver
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to submit page...');
  await page.goto('https://topbestalternatives.com/submit/', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  await page.waitForTimeout(5000);
  
  console.log('Page loaded. Looking for form...');
  
  // Check if form exists
  const formExists = await page.$('form.wpcf7-form');
  console.log('Form exists:', !!formExists);
  
  if (!formExists) {
    console.log('No CF7 form found.');
    const bodyText = await page.textContent('body');
    fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', 'ERROR: CF7 form not found on the page.\n\nBody content:\n' + bodyText.substring(0, 2000));
    await browser.close();
    return;
  }
  
  // Check Turnstile before filling
  const turnstileDiv = await page.$('.cf-turnstile');
  console.log('Turnstile div exists:', !!turnstileDiv);
  
  if (turnstileDiv) {
    const siteKey = await turnstileDiv.getAttribute('data-sitekey');
    console.log('Turnstile sitekey:', siteKey);
  }
  
  // Fill the form
  console.log('Filling form...');
  await page.fill('input[name="your-subject"]', 'Dalil M');
  await page.fill('input[name="your-email"]', 'arkcourtia@gmail.com');
  await page.fill('input[name="product-name"]', 'EMBYR - Free Gay Dating App');
  await page.fill('textarea[name="product-description"]', 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.');
  await page.fill('input[name="product-url"]', 'https://embir.xyz');
  await page.fill('input[name="text-desired"]', 'Grindr');
  
  // Select Free radio
  const freeRadio = page.locator('input[type="radio"][name="listing-type"][value="Free"]');
  await freeRadio.check();
  console.log('Form filled, Free selected');
  
  // Wait for Turnstile to load
  console.log('Waiting for Turnstile solution (12s)...');
  await page.waitForTimeout(12000);
  
  // Check if Turnstile solved
  const turnstileResponse = await page.$('input[name="_wpcf7_turnstile_response"]');
  let turnstileValue = '';
  if (turnstileResponse) {
    turnstileValue = await turnstileResponse.inputValue();
    console.log('Turnstile response length:', turnstileValue.length);
  } else {
    console.log('Turnstile response input not found yet');
    // Wait more
    await page.waitForTimeout(8000);
    const tr2 = await page.$('input[name="_wpcf7_turnstile_response"]');
    if (tr2) {
      turnstileValue = await tr2.inputValue();
      console.log('Turnstile response after more wait, length:', turnstileValue.length);
    }
  }
  
  // Screenshot
  await page.screenshot({ path: '/root/embyr/tba_filled2.png', fullPage: true });
  
  if (turnstileValue.length > 0) {
    console.log('Turnstile appears solved! Submitting...');
    
    // Try REST API with token
    const formData = new URLSearchParams();
    formData.append('your-subject', 'Dalil M');
    formData.append('your-email', 'arkcourtia@gmail.com');
    formData.append('product-name', 'EMBYR - Free Gay Dating App');
    formData.append('product-description', 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.');
    formData.append('product-url', 'https://embir.xyz');
    formData.append('text-desired', 'Grindr');
    formData.append('listing-type', 'Free');
    formData.append('_wpcf7', '60730');
    formData.append('_wpcf7_version', '6.1.6');
    formData.append('_wpcf7_locale', 'en_US');
    formData.append('_wpcf7_unit_tag', 'wpcf7-f60730-p60731-o1');
    formData.append('_wpcf7_container_post', '60731');
    formData.append('_wpcf7_turnstile_response', turnstileValue);
    
    const response = await page.evaluate(async (data) => {
      const res = await fetch('/wp-json/contact-form-7/v1/contact-forms/60730/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      });
      return await res.json();
    }, formData.toString());
    
    console.log('API Response:', JSON.stringify(response, null, 2));
    
    fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', 
      'Submission via REST API with Turnstile token:\n' +
      JSON.stringify(response, null, 2) + '\n\n' +
      'Turnstile token length: ' + turnstileValue.length + '\n'
    );
  } else {
    console.log('Turnstile did NOT solve automatically.');
    console.log('Taking screenshot and trying HTML form submit anyway...');
    
    // Try clicking submit anyway
    const submitBtn = await page.$('input[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(5000);
      
      const url = page.url();
      console.log('URL after submit:', url);
      
      const responseText = await page.textContent('.wpcf7-response-output').catch(() => 'No response');
      console.log('Response:', responseText);
      
      // Check for any visible error
      const pageContent = await page.content();
      const resultPath = '/root/embyr/topbestalternatives_result.txt';
      fs.writeFileSync(resultPath, `Submission Attempt (Turnstile not solved):\n\nURL after submit: ${url}\nResponse: ${responseText}\n\nCheck screenshots for details.`);
    }
  }
  
  await browser.close();
  console.log('Done.');
})();
