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
    await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Get unique field names
    const fieldInfo = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const fields = {};
      inputs.forEach(el => {
        const name = el.getAttribute('name');
        const id = el.id;
        const type = el.getAttribute('type');
        const placeholder = el.getAttribute('placeholder') || '';
        const label = el.closest('.formRow') ? el.closest('.formRow').querySelector('label') : null;
        const labelText = label ? label.innerText.trim() : '';
        if (name && name !== '_xfToken' && name !== '_xfClientLoadTime') {
          fields[labelText || placeholder || id] = { name, type, placeholder, id };
        }
      });
      return fields;
    });
    
    console.log('Fields:', JSON.stringify(fieldInfo, null, 2));
    
    // Fill username
    const usernameInput = await page.$('input[name$="b984fced6f01b0c4cd71bcb08450ba51"], input[autocomplete="off"][maxlength="25"]');
    // Actually, simpler: find by label
    const allTextInputs = await page.$$('input[type="text"]');
    for (const inp of allTextInputs) {
      const placeholder = await inp.getAttribute('placeholder');
      const name = await inp.getAttribute('name');
      console.log(`  text input: name="${name}", placeholder="${placeholder}"`);
    }
    
    const allEmailInputs = await page.$$('input[type="email"]');
    for (const inp of allEmailInputs) {
      const name = await inp.getAttribute('name');
      console.log(`  email input: name="${name}"`);
    }
    
    const allPasswordInputs = await page.$$('input[type="password"]');
    for (const inp of allPasswordInputs) {
      const name = await inp.getAttribute('name');
      console.log(`  password input: name="${name}"`);
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
