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
  const email = `guyseeker${Date.now()}@gmail.com`;
  const password = 'ForumPass2024!';
  
  console.log(`Username: ${username}, Email: ${email}`);
  
  // Get ALL field names including all checkboxes
  const fieldInfo = await page.evaluate(() => {
    const inputs = document.querySelectorAll('form input');
    const info = {};
    for (const inp of inputs) {
      const name = inp.getAttribute('name');
      const type = inp.getAttribute('type');
      const placeholder = inp.getAttribute('placeholder');
      const id = inp.getAttribute('id');
      
      if (!name) return;
      
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
      else if (type === 'checkbox') {
        if (!info.checkboxes) info.checkboxes = [];
        // Get the label text
        const label = document.querySelector(`label.iconic input[name="${name}"]`)?.closest('label')?.querySelector('.iconic-label');
        const labelText = label ? label.textContent : 'no label';
        info.checkboxes.push({name, label: labelText});
      }
    }
    return info;
  });
  
  console.log("Fields:", JSON.stringify(fieldInfo, null, 2));
  
  // Fill the form
  await page.evaluate(() => {
    const tt = document.querySelector('input[name="timetaken"]');
    if (tt) tt.value = '15';
  });
  
  await page.evaluate(({fieldInfo, username, email, password}) => {
    const uf = document.querySelector(`input[name="${fieldInfo.username}"]`);
    if (uf) { uf.value = username; uf.dispatchEvent(new Event('input', {bubbles: true})); }
    
    const ef = document.querySelector(`input[name="${fieldInfo.email}"]`);
    if (ef) { ef.value = email; ef.dispatchEvent(new Event('input', {bubbles: true})); }
    
    const pf = document.querySelector(`input[name="${fieldInfo.password}"]`);
    if (pf) { 
      pf.value = password; 
      pf.dispatchEvent(new Event('input', {bubbles: true}));
      pf.dispatchEvent(new Event('change', {bubbles: true}));
    }
    
    const pcf = document.querySelector(`input[name="${fieldInfo.password_confirm}"]`);
    if (pcf) { 
      pcf.value = password; 
      pcf.dispatchEvent(new Event('input', {bubbles: true}));
    }
    
    const dd = document.querySelector(`input[name="${fieldInfo.dob_day}"]`);
    if (dd) { dd.value = '15'; dd.dispatchEvent(new Event('input', {bubbles: true})); }
    
    const dy = document.querySelector(`input[name="${fieldInfo.dob_year}"]`);
    if (dy) { dy.value = '1990'; dy.dispatchEvent(new Event('input', {bubbles: true})); }
    
    const lf = document.querySelector(`input[name="${fieldInfo.location}"]`);
    if (lf) { lf.value = 'USA'; lf.dispatchEvent(new Event('input', {bubbles: true})); }
    
    const cf = document.querySelector(`input[name="${fieldInfo.captcha}"]`);
    if (cf) { cf.value = 'rainbow'; cf.dispatchEvent(new Event('input', {bubbles: true})); }
    
  }, {fieldInfo, username, email, password});
  
  // Select month
  await page.selectOption('form select[name=dob_month]', '6');
  
  // Check ALL checkboxes
  await page.evaluate(() => {
    const allCheckboxes = document.querySelectorAll('form input[type="checkbox"]');
    for (const cb of allCheckboxes) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change', {bubbles: true}));
    }
  });
  
  console.log("Waiting 10 seconds...");
  await page.waitForTimeout(11000);
  
  // Submit
  console.log("Submitting...");
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(10000);
  console.log("URL after:", page.url());
  const respText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log("Response:", respText);
  
  await page.screenshot({ path: '/root/embyr/register_result3.png', fullPage: true });
  
  // Now try to log in
  if (respText.includes('complete')) {
    console.log("\nRegistration says complete! Trying to log in...");
    
    // Check if already logged in
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.includes('Log in') || bodyText.includes('Log out')) {
      console.log("Already logged in!");
    } else {
      // Try to log in from the registration completion page
      // There should be a link to "Return to the forum home page" or similar
      await page.goto('https://forums.justusboys.com/login/', { waitUntil: 'networkidle', timeout: 30000 });
      await page.fill('input[name="login"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(8000);
      console.log("Login URL:", page.url());
      const loginText = await page.evaluate(() => document.body.innerText.substring(0, 500));
      console.log("Login result:", loginText);
    }
    
    // Navigate to Gay Discussion
    console.log("\nNavigating to Gay Discussion...");
    await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log("GD URL:", page.url());
    console.log("GD Title:", await page.title());
    
    const gdText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log("GD Page:", gdText);
    await page.screenshot({ path: '/root/embyr/gay_discussion.png', fullPage: true });
  }
  
  await browser.close();
})();
