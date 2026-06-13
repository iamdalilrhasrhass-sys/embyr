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

  async function tryRegister() {
    console.log('Going to register page...');
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    // Get dynamic field names
    const fieldInfo = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input:not([type="hidden"])');
      const result = {};
      inputs.forEach(el => {
        const name = el.getAttribute('name');
        const id = el.id;
        const placeholder = el.getAttribute('placeholder') || '';
        const label = el.closest('.formRow') ? el.closest('.formRow').querySelector('.formRow-label') : null;
        const labelText = label ? label.innerText.trim() : '';
        if (name && name !== '_xfClientLoadTime') {
          result[labelText || placeholder || name] = { name, type: el.type, placeholder, id };
        }
      });
      return result;
    });
    
    console.log('Field mapping:');
    for (const [label, info] of Object.entries(fieldInfo)) {
      console.log(`  "${label}" -> name="${info.name}" type="${info.type}"`);
    }
    
    // Find fields by type + label proximity
    let usernameField, emailField, passwordField;
    
    for (const [label, info] of Object.entries(fieldInfo)) {
      if (label === 'Username') usernameField = info.name;
      else if (label === 'Email') emailField = info.name;
      else if (label === 'Password') passwordField = info.name;
    }
    
    console.log('\nKey fields:', { usernameField, emailField, passwordField });
    
    if (!usernameField || !emailField || !passwordField) {
      throw new Error('Could not identify required fields');
    }
    
    // Fill username
    await page.fill(`input[name="${usernameField}"]`, 'GayAppUser2024');
    console.log('✓ Filled username');
    
    // Fill email
    await page.fill(`input[name="${emailField}"]`, 'gayappuser2024@yopmail.com');
    console.log('✓ Filled email');
    
    // Type password slowly to trigger confirm field visibility
    await page.fill(`input[name="${passwordField}"]`, '');
    await page.type(`input[name="${passwordField}"]`, 'TempPass123!', { delay: 20 });
    console.log('✓ Filled password');
    await page.waitForTimeout(1000);
    
    // Now confirm password should be visible
    const confirmField = page.locator('input[name="password_confirm"]');
    if (await confirmField.isVisible()) {
      await confirmField.fill('TempPass123!');
      console.log('✓ Filled confirm password');
    } else {
      // Try clicking on it first
      console.log('Confirm field not visible, trying click...');
      await confirmField.click({ force: true });
      await page.waitForTimeout(500);
      await confirmField.fill('TempPass123!');
      console.log('✓ Filled confirm password (force)');
    }
    
    // DOB
    await page.selectOption('select[name="dob_month"]', '6');
    await page.fill('input[name="dob_day"]', '15');
    await page.fill('input[name="dob_year"]', '1990');
    console.log('✓ Filled DOB');
    
    // Location
    await page.fill('input[name="location"]', 'United States');
    console.log('✓ Filled location');
    
    // Captcha
    await page.fill('input[name="captcha_question_answer"]', 'RAINBOW');
    console.log('✓ Filled captcha');
    
    // Wait for 8 second timer
    console.log('⏳ Waiting 10 seconds for timer...');
    await page.waitForTimeout(10000);
    
    // Accept terms
    const acceptCheckbox = page.locator('input[name="accept"]');
    await acceptCheckbox.check();
    console.log('✓ Checked accept terms');
    
    await page.screenshot({ path: '/root/embyr/filled_register.png', fullPage: true });
    console.log('✓ Screenshot saved');
    
    // Submit
    const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      console.log('Clicking submit...');
      await submitBtn.click();
      await page.waitForTimeout(6000);
      
      console.log('After submit URL:', page.url());
      
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1500));
      console.log('Result body:', bodyText);
      
      await page.screenshot({ path: '/root/embyr/register_result.png', fullPage: true });
    }
  }

  try {
    await tryRegister();
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/root/embyr/register_error.png', fullPage: true });
  }

  await browser.close();
  process.exit(0);
})();
