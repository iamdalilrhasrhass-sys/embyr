const { chromium } = require('playwright');
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
    // Go to register page
    console.log('Going to register page...');
    await page.goto('https://forums.justusboys.com/register/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    // Take screenshot
    await page.screenshot({ path: '/root/embyr/register_page.png', fullPage: true });
    
    // Get the HTML of the registration form
    const formHtml = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? form.innerHTML.substring(0, 3000) : 'No form found';
    });
    console.log('Form HTML:', formHtml.substring(0, 1000));
    
    // Check all input fields
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
        name: el.getAttribute('name') || '',
        type: el.getAttribute('type') || '',
        placeholder: el.getAttribute('placeholder') || '',
        id: el.id || '',
        class: el.className.substring(0, 50)
      }));
    });
    console.log('\nInputs:', JSON.stringify(inputs, null, 2));
    
    // Check for any text about guest posting or requirements
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('\nPage text:', bodyText.substring(0, 1500));
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
