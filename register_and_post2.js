const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log("Step 1: Loading registration page...");
  await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
  
  const username = 'guyseeker_' + Math.floor(Math.random() * 10000);
  const email = `guyseeker${Date.now()}@protonmail.com`;
  const password = 'JustUsBoys2024!';
  
  console.log(`Username: ${username}, Email: ${email}`);
  
  // Get all inputs
  const inputs = await page.$$('form input');
  const fieldMap = {};
  for (const input of inputs) {
    const name = await input.getAttribute('name');
    const type = await input.getAttribute('type');
    const id = await input.getAttribute('id');
    const placeholder = await input.getAttribute('placeholder');
    // Classify fields
    if (type === 'text' && placeholder === 'Day') fieldMap.dob_day = name;
    else if (type === 'text' && placeholder === 'Year') fieldMap.dob_year = name;
    else if (type === 'text' && placeholder === 'Please answer the question above...') fieldMap.captcha = name;
    else if (type === 'text' && name === 'website_code') fieldMap.honeypot = name;
    else if (type === 'email') fieldMap.email = name;
    else if (type === 'password' && name !== 'password_confirm') fieldMap.password = name;
    else if (type === 'password' && name === 'password_confirm') fieldMap.password_confirm = name;
    else if (type === 'text' && name && name.length > 30 && id && id.includes('_xfUid-1')) fieldMap.username = name;
    else if (type === 'text' && name && name.length > 30 && id && id.includes('location')) fieldMap.location_cb = name;
    else if (type === 'text' && name === 'location') fieldMap.location = name;
    else if (type === 'text' && name.length > 30 && id && !id.includes('_xfUid-1')) fieldMap.other = name;
  }
  
  console.log("Field mapping:", JSON.stringify(fieldMap, null, 2));
  
  // The dynamic field names are the tricky part
  // Let me just use CSS selectors based on position/placeholder
  await page.screenshot({ path: '/root/embyr/register_before.png', fullPage: true });
  
  // Fill username (first text input with dynamic name)
  const textInputs = await page.$$('form input[type="text"]:not([name="website_code"]):not([name="_xfClientLoadTime"]):not([name="dob_day"]):not([name="dob_year"]):not([name="captcha_question_answer"]):not([name="location"])');
  console.log(`Found ${textInputs.length} remaining text inputs`);
  for (const inp of textInputs) {
    console.log("Text input:", await inp.getAttribute('name'), await inp.getAttribute('id'));
  }
  
  // Actually let me just try to use labels to find fields
  const labels = await page.$$('form label');
  for (const label of labels) {
    const text = await label.textContent();
    console.log("Label:", text?.trim());
  }
  
  await browser.close();
})();
