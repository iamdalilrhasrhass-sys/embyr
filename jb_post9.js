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
    console.log('Going to register page...');
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    // Get the dynamic field names
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
    
    // Extract field names
    let usernameField, emailField, passwordField, confirmField, captchaField;
    let dobMonth, dobDay, dobYear, locationField, acceptField;
    
    for (const [label, info] of Object.entries(fieldInfo)) {
      if (label === 'Username') usernameField = info.name;
      else if (label === 'Email') emailField = info.name;
      else if (label === 'Password') passwordField = info.name;
      else if (label === 'Verify password') confirmField = info.name;
      else if (label.includes('Verification') || info.placeholder.includes('answer')) captchaField = info.name;
      else if (label === 'Location') locationField = info.name;
      else if (label === 'Date of birth' && info.type === 'text' && info.placeholder === 'Year') dobYear = info.name;
      else if (info.name === 'dob_day') dobDay = 'dob_day';
      else if (info.name === 'dob_year') dobYear = 'dob_year';
    }
    
    // DOB month - find the select
    const monthSelect = await page.$('select[name="dob_month"]');
    const monthName = monthSelect ? await monthSelect.getAttribute('name') : null;
    console.log('\nMonth select name:', monthName);
    
    console.log('\nIdentified fields:');
    console.log('  Username:', usernameField);
    console.log('  Email:', emailField);
    console.log('  Password:', passwordField);
    console.log('  Confirm:', confirmField);
    console.log('  Captcha:', captchaField);
    console.log('  DOB Month:', monthName);
    console.log('  DOB Day: dob_day');
    console.log('  DOB Year:', dobYear);
    console.log('  Location:', locationField);
    
    // Now fill the form
    if (usernameField) {
      await page.fill(`input[name="${usernameField}"]`, 'GayAppUser2024');
      console.log('Filled username');
    }
    
    if (emailField) {
      // Use a real-looking but temporary email
      await page.fill(`input[name="${emailField}"]`, 'gayappuser2024@yopmail.com');
      console.log('Filled email');
    }
    
    if (passwordField) {
      await page.fill(`input[name="${passwordField}"]`, 'TempPass123!');
      console.log('Filled password');
    }
    
    if (confirmField) {
      await page.fill(`input[name="${confirmField}"]`, 'TempPass123!');
      console.log('Filled confirm password');
    }
    
    // DOB
    if (monthName) {
      await page.selectOption(`select[name="${monthName}"]`, '6');
    }
    if (dobDay) {
      await page.fill(`input[name="${dobDay}"]`, '15');
    }
    if (dobYear) {
      await page.fill(`input[name="${dobYear}"]`, '1990');
    }
    console.log('Filled DOB');
    
    if (locationField) {
      await page.fill(`input[name="${locationField}"]`, 'United States');
      console.log('Filled location');
    }
    
    // Captcha - answer: RAINBOW
    if (captchaField) {
      await page.fill(`input[name="${captchaField}"]`, 'RAINBOW');
      console.log('Filled captcha');
    }
    
    // Wait for the 8 second timer
    console.log('Waiting 10 seconds for timer...');
    await page.waitForTimeout(10000);
    
    // Accept terms
    await page.check('input[name="accept"]');
    console.log('Checked accept');
    
    await page.screenshot({ path: '/root/embyr/filled_register.png', fullPage: true });
    
    // Find and click submit button
    const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      console.log('Clicking submit...');
      await submitBtn.click();
      await page.waitForTimeout(5000);
      console.log('After submit URL:', page.url());
      
      // Check result
      const resultText = await page.evaluate(() => {
        const alerts = document.querySelectorAll('.blockMessage, .alert, .notice');
        return Array.from(alerts).map(a => a.innerText.trim().substring(0, 200));
      });
      console.log('Alerts:', JSON.stringify(resultText));
      
      await page.screenshot({ path: '/root/embyr/register_result.png', fullPage: true });
      
      // Check body for error/success
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
      console.log('Body:', bodyText);
    } else {
      console.log('No submit button found');
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
