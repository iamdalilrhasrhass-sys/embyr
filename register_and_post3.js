const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Step 1: Loading registration page...");
  await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
  
  const uid = Math.floor(Math.random() * 10000);
  const username = 'guyseeker' + uid;
  const email = `guyseeker${Date.now()}@outlook.com`;
  const password = 'ForumPass2024!';
  
  console.log(`Username: ${username}`);
  console.log(`Email: ${email}`);
  
  // First, let me find all the dynamic field names
  const getFieldName = async (placeholder, type) => {
    const inputs = await page.$$('form input');
    for (const input of inputs) {
      const p = await input.getAttribute('placeholder');
      const t = await input.getAttribute('type');
      if (p === placeholder && t === type) {
        return await input.getAttribute('name');
      }
    }
    return null;
  };
  
  const usernameField = await getFieldName(null, 'text');
  // Actually, let me use a different approach - use the field map from before
  const fieldNames = {};
  const allInputs = await page.$$('form input');
  
  for (const input of allInputs) {
    const name = await input.getAttribute('name');
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    const id = await input.getAttribute('id');
    
    if (type === 'email') fieldNames.email = name;
    else if (type === 'password' && name !== 'password_confirm') fieldNames.password = name;
    else if (type === 'password' && name === 'password_confirm') fieldNames.password_confirm = name;
    else if (placeholder === 'Day') fieldNames.dob_day = name;
    else if (placeholder === 'Year') fieldNames.dob_year = name;
    else if (placeholder === 'Please answer the question above...') fieldNames.captcha = name;
    else if (name === 'website_code') fieldNames.honeypot = name;
    else if (type === 'text' && name && !name.includes('_xfClientLoadTime') && 
             name.length > 20 && id && id.includes('_xfUid') && !fieldNames.username) {
      // Check if this is the username field by looking at nearby labels
      fieldNames.username = name;
    }
    else if (name === 'location') fieldNames.location = name;
    else if (type === 'checkbox' && name === 'name_cb') fieldNames.name_cb = name;
    else if (type === 'checkbox' && name === 'email_cb') fieldNames.email_cb = name;
    else if (type === 'checkbox' && name === 'email_hp') fieldNames.email_hp = name;
    else if (type === 'checkbox' && name === 'password_cb') fieldNames.password_cb = name;
    else if (type === 'checkbox' && name === 'accept') fieldNames.accept = name;
    else if (type === 'hidden' && name === 'timetaken') fieldNames.timetaken = name;
  }
  
  console.log("Field names:", JSON.stringify(fieldNames, null, 2));
  
  // Now fill the form
  // Honeypot: leave empty
  // Username
  await page.fill(`input[name="${fieldNames.username}"]`, username);
  // Email
  await page.fill(`input[name="${fieldNames.email}"]`, email);
  // Password
  await page.fill(`input[name="${fieldNames.password}"]`, password);
  // Password confirm
  await page.fill(`input[name="${fieldNames.password_confirm}"]`, password);
  // DOB
  await page.fill(`input[name="${fieldNames.dob_day}"]`, '15');
  // Select month
  await page.selectOption('form select[name=dob_month]', '6');
  await page.fill(`input[name="${fieldNames.dob_year}"]`, '1990');
  // Location
  await page.fill(`input[name="${fieldNames.location}"]`, 'USA');
  // CAPTCHA - rainbow
  await page.fill(`input[name="${fieldNames.captcha}"]`, 'rainbow');
  
  // Check the agreement checkboxes
  await page.check(`input[name="accept"]`);
  await page.check(`input[name="name_cb"]`);
  await page.check(`input[name="email_cb"]`);
  await page.check(`input[name="email_hp"]`);
  await page.check(`input[name="password_cb"]`);
  
  // Set timetaken to realistic value
  await page.evaluate(() => {
    const el = document.querySelector('input[name="timetaken"]');
    if (el) el.value = '12';
  });
  
  // Wait 10 seconds as required
  console.log("Waiting 10 seconds...");
  await page.waitForTimeout(10500);
  
  // Now submit
  console.log("Submitting registration...");
  await page.click('form input[type="submit"], form button[type="submit"]');
  
  await page.waitForTimeout(5000);
  console.log("After submit URL:", page.url());
  const text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  console.log("Response:", text);
  
  await page.screenshot({ path: '/root/embyr/register_result.png', fullPage: true });
  
  // If registration worked, try to post in Gay Discussion
  if (page.url().includes('forums.justusboys.com') && !page.url().includes('register')) {
    console.log("\nRegistration likely successful! Navigating to Gay Discussion...");
    await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log("GD URL:", page.url());
    
    const gdText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log("GD Text:", gdText);
    await page.screenshot({ path: '/root/embyr/gay_discussion.png', fullPage: true });
  }
  
  await browser.close();
})();
