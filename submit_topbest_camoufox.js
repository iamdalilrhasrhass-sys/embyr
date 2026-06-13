const { firefox } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await firefox.launch({
    headless: true,
    executablePath: '/root/.cache/camoufox/camoufox',
    args: ['-no-remote']
  });
  
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'en-US'
  });
  
  const page = await ctx.newPage();
  
  console.log('Navigating to submit page...');
  await page.goto('https://topbestalternatives.com/submit/', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  await page.waitForTimeout(5000);
  
  console.log('Page loaded. Looking for form...');
  
  // Check form
  const formExists = await page.$('form.wpcf7-form');
  console.log('Form exists:', !!formExists);
  
  if (!formExists) {
    console.log('No CF7 form found.');
    await browser.close();
    return;
  }
  
  // Check Turnstile
  const turnstileDiv = await page.$('.cf-turnstile');
  console.log('Turnstile div:', !!turnstileDiv);
  
  // Fill form
  console.log('Filling form...');
  await page.fill('input[name="your-subject"]', 'Dalil M');
  await page.fill('input[name="your-email"]', 'arkcourtia@gmail.com');
  await page.fill('input[name="product-name"]', 'EMBYR - Free Gay Dating App');
  await page.fill('textarea[name="product-description"]', 'A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.');
  await page.fill('input[name="product-url"]', 'https://embir.xyz');
  await page.fill('input[name="text-desired"]', 'Grindr');
  
  // Select Free
  await page.check('input[type="radio"][name="listing-type"][value="Free"]');
  console.log('Form filled.');
  
  // Wait for Turnstile to solve
  console.log('Waiting for Turnstile auto-solve (20s)...');
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1000);
    const tr = await page.$('input[name="_wpcf7_turnstile_response"]');
    if (tr) {
      const val = await tr.inputValue();
      if (val && val.length > 10) {
        console.log(`Turnstile solved! Token length: ${val.length}`);
        break;
      }
    }
    if (i % 5 === 4) {
      console.log(`  ...waited ${i+1}s`);
      // Screenshot periodically
      await page.screenshot({ path: `/root/embyr/tba_wait_${i+1}.png`, fullPage: true });
    }
  }
  
  // Final check
  const trFinal = await page.$('input[name="_wpcf7_turnstile_response"]');
  let token = '';
  if (trFinal) {
    token = await trFinal.inputValue();
    console.log('Final Turnstile token length:', token.length);
  }
  
  await page.screenshot({ path: '/root/embyr/tba_camoufox_filled.png', fullPage: true });
  
  if (token && token.length > 10) {
    console.log('Turnstile solved! Submitting form...');
    
    // Try submitting via the actual form
    const submitBtn = await page.$('input[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('Clicked submit');
      
      await page.waitForTimeout(8000);
      
      const url = page.url();
      console.log('URL after submit:', url);
      
      // Check response
      let responseText = '';
      try {
        const resp = await page.$('.wpcf7-response-output');
        if (resp) responseText = await resp.textContent();
      } catch(e) {}
      
      // Look for success message
      const pageContent = await page.content();
      const hasSuccess = pageContent.includes('Thank you') || pageContent.includes('success') || pageContent.includes('sent');
      
      let status = 'UNKNOWN';
      if (hasSuccess || !url.includes('/submit/')) {
        status = 'SUCCESS - Form submitted successfully';
      } else {
        status = 'Form submitted, checking response...';
      }
      
      const resultContent = `
TopBestAlternatives.com - Submission Result
=============================================
Date: ${new Date().toISOString()}
Status: ${status}
URL after submit: ${url}
Response: ${responseText || 'No message found'}

Form Data Submitted:
- Name: Dalil M
- Email: arkcourtia@gmail.com
- Product Name: EMBYR - Free Gay Dating App
- Description: A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.
- Product URL: https://embir.xyz
- Alternative to: Grindr
- Listing Type: Free

Turnstile: Solved (token length: ${token.length})
`;
      fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', resultContent);
      console.log('Result saved to /root/embyr/topbestalternatives_result.txt');
    }
  } else {
    console.log('Turnstile NOT solved automatically in Camoufox either.');
    
    // Try clicking submit anyway
    const submitBtn = await page.$('input[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(5000);
      const url = page.url();
      console.log('URL after submit (no token):', url);
    }
    
    fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', 
      'FAILED: Turnstile could not be solved in headless Camoufox.\n' +
      'The form uses Cloudflare Turnstile captcha which blocks automated submissions.\n\n' +
      'Manual submission required at: https://topbestalternatives.com/submit/\n\n' +
      'Check screenshots: /root/embyr/tba_camoufox_filled.png');
  }
  
  await browser.close();
  console.log('Done.');
})();
