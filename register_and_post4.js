const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Loading registration page...");
  await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
  
  const uid = Math.floor(Math.random() * 9000) + 1000;
  const username = 'guyseeker' + uid;
  const email = `guyseeker${Date.now()}@outlook.com`;
  const password = 'ForumPass2024!';
  
  console.log(`Username: ${username}, Email: ${email}`);
  
  // Use JS to fill everything in one go
  await page.evaluate(() => {
    // Set timetaken
    const tt = document.querySelector('input[name="timetaken"]');
    if (tt) tt.value = '15';
  });
  
  // Get all field names
  const fieldInfo = await page.evaluate(() => {
    const inputs = document.querySelectorAll('form input');
    const info = {};
    for (const inp of inputs) {
      const name = inp.getAttribute('name');
      const type = inp.getAttribute('type');
      const placeholder = inp.getAttribute('placeholder');
      const id = inp.getAttribute('id');
      
      if (type === 'email') info.email = name;
      else if (type === 'password' && name !== 'password_confirm') info.password = name;
      else if (type === 'password') info.password_confirm = name;
      else if (placeholder === 'Day') info.dob_day = name;
      else if (placeholder === 'Year') info.dob_year = name;
      else if (placeholder === 'Please answer the question above...') info.captcha = name;
      else if (name === 'website_code') info.honeypot = name;
      else if (name === 'location') info.location = name;
      else if (type === 'text' && name && !name.includes('_xfClientLoadTime') && 
               name.length > 20) info.username = name;
    }
    return info;
  });
  
  console.log("Fields:", JSON.stringify(fieldInfo, null, 2));
  
  // Now fill values via JS evaluation
  await page.evaluate(({fieldInfo, username, email, password}) => {
    // Username
    const uf = document.querySelector(`input[name="${fieldInfo.username}"]`);
    if (uf) { uf.value = username; uf.dispatchEvent(new Event('input', {bubbles: true})); }
    
    // Email
    const ef = document.querySelector(`input[name="${fieldInfo.email}"]`);
    if (ef) { ef.value = email; ef.dispatchEvent(new Event('input', {bubbles: true})); }
    
    // Password
    const pf = document.querySelector(`input[name="${fieldInfo.password}"]`);
    if (pf) { 
      pf.value = password; 
      pf.dispatchEvent(new Event('input', {bubbles: true}));
      pf.dispatchEvent(new Event('change', {bubbles: true}));
    }
    
    // Password confirm
    const pcf = document.querySelector(`input[name="${fieldInfo.password_confirm}"]`);
    if (pcf) { 
      pcf.value = password; 
      pcf.dispatchEvent(new Event('input', {bubbles: true}));
    }
    
    // DOB
    const dd = document.querySelector(`input[name="${fieldInfo.dob_day}"]`);
    if (dd) { dd.value = '15'; dd.dispatchEvent(new Event('input', {bubbles: true})); }
    
    const dy = document.querySelector(`input[name="${fieldInfo.dob_year}"]`);
    if (dy) { dy.value = '1990'; dy.dispatchEvent(new Event('input', {bubbles: true})); }
    
    // Location
    const lf = document.querySelector(`input[name="${fieldInfo.location}"]`);
    if (lf) { lf.value = 'USA'; lf.dispatchEvent(new Event('input', {bubbles: true})); }
    
    // CAPTCHA
    const cf = document.querySelector(`input[name="${fieldInfo.captcha}"]`);
    if (cf) { cf.value = 'rainbow'; cf.dispatchEvent(new Event('input', {bubbles: true})); }
    
  }, {fieldInfo, username, email, password});
  
  // Select month dropdown
  await page.selectOption('form select[name=dob_month]', '6');
  
  // Check checkboxes via JS
  await page.evaluate(() => {
    const boxes = ['accept', 'name_cb', 'email_cb', 'email_hp', 'password_cb'];
    for (const box of boxes) {
      const el = document.querySelector(`input[name="${box}"]`);
      if (el) { el.checked = true; el.dispatchEvent(new Event('change', {bubbles: true})); }
    }
  });
  
  // Wait 10 seconds
  console.log("Waiting 10 seconds for the agreement timer...");
  await page.waitForTimeout(11000);
  
  // Find submit button
  const submitBtn = await page.$('form input[type="submit"], form button[type="submit"]');
  if (submitBtn) {
    console.log("Submit button text:", await submitBtn.getAttribute('value') || await submitBtn.textContent());
  }
  
  // Submit
  console.log("Submitting registration...");
  await page.evaluate(() => {
    const btn = document.querySelector('form input[type="submit"]') || document.querySelector('form button[type="submit"]');
    if (btn) btn.click();
  });
  
  await page.waitForTimeout(8000);
  console.log("Post-submit URL:", page.url());
  const respText = await page.evaluate(() => document.body.innerText.substring(0, 1500));
  console.log("Response:", respText);
  
  await page.screenshot({ path: '/root/embyr/register_result.png', fullPage: true });
  
  await browser.close();
})();
