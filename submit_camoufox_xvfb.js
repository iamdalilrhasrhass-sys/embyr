const { firefox } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await firefox.launch({
    headless: false,  // non-headless with Xvfb
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
  
  await page.waitForTimeout(3000);
  console.log('Page loaded.');
  
  // Fill form using keyboard for more realistic interaction
  console.log('Filling form...');
  await page.click('input[name="your-subject"]');
  await page.keyboard.type('Dalil M', { delay: 40 });
  
  await page.click('input[name="your-email"]');
  await page.keyboard.type('arkcourtia@gmail.com', { delay: 20 });
  
  await page.click('input[name="product-name"]');
  await page.keyboard.type('EMBIR - Free Gay Dating App', { delay: 30 });
  
  await page.click('textarea[name="product-description"]');
  await page.keyboard.type('A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.', { delay: 15 });
  
  await page.click('input[name="product-url"]');
  await page.keyboard.type('https://embir.xyz', { delay: 20 });
  
  await page.click('input[name="text-desired"]');
  await page.keyboard.type('Grindr', { delay: 40 });
  
  // Click Free radio
  await page.click('input[type="radio"][name="listing-type"][value="Free"]');
  console.log('Form filled with keyboard typing.');
  
  // Wait for Turnstile
  console.log('Waiting for Turnstile (25s)...');
  for (let i = 0; i < 25; i++) {
    await page.waitForTimeout(1000);
    const tr = await page.$('input[name="_wpcf7_turnstile_response"]');
    if (tr) {
      const val = await tr.inputValue();
      if (val && val.length > 10) {
        console.log(`Turnstile solved at ${i+1}s! Token length: ${val.length}`);
        break;
      }
    }
    if (i % 5 === 4) console.log(`  ...waited ${i+1}s`);
  }
  
  // Check final token
  const trFinal = await page.$('input[name="_wpcf7_turnstile_response"]');
  let token = '';
  if (trFinal) {
    token = await trFinal.inputValue();
    console.log('Final token length:', token.length);
  }
  
  await page.screenshot({ path: '/root/embyr/tba_xvfb.png', fullPage: true });
  
  if (token && token.length > 10) {
    console.log('Turnstile solved! Submitting...');
    await page.click('input[type="submit"]');
    await page.waitForTimeout(8000);
    
    const url = page.url();
    console.log('URL after submit:', url);
    
    let responseText = '';
    try {
      responseText = await page.$eval('.wpcf7-response-output', el => el.textContent);
    } catch(e) {}
    console.log('Response:', responseText);
    
    const resultContent = `
TopBestAlternatives.com - Submission Result
=============================================
Date: ${new Date().toISOString()}
URL after submit: ${url}
Response: ${responseText || 'No message found'}
Turnstile: Solved (token length: ${token.length})

Form Data:
- Name: Dalil M
- Email: arkcourtia@gmail.com
- Product: EMBIR - Free Gay Dating App
- Description: A 100% free gay dating app with no premium subscriptions, no ads, and no message limits. Available in 60+ cities and 25 languages.
- URL: https://embir.xyz
- Alternative to: Grindr
- Listing Type: Free
`;
    fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', resultContent);
    console.log('Result saved!');
  } else {
    console.log('Turnstile NOT solved.');
    fs.writeFileSync('/root/embyr/topbestalternatives_result.txt', 
      'FAILED: Turnstile could not be solved even with Xvfb + Camoufox.\n' +
      'Manual submission needed at: https://topbestalternatives.com/submit/\n\n' +
      'With data: name=Dalil M, email=arkcourtia@gmail.com, product=EMBIR - Free Gay Dating App,\n' +
      'description=A 100% free gay dating app..., url=https://embir.xyz, alt=Grindr, type=Free');
  }
  
  await browser.close();
  console.log('Done.');
})();
