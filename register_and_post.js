const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Step 1: Go to register page
  console.log("Step 1: Loading registration page...");
  await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
  console.log("At:", page.url());
  
  // Step 2: Fill in the registration form
  const username = 'guyseeker_' + Math.floor(Math.random() * 10000);
  const email = `guyseeker${Date.now()}@protonmail.com`;
  const password = 'TempPass123!';
  
  console.log(`Username: ${username}`);
  console.log(`Email: ${email}`);
  
  // Get the actual input fields by looking at the form
  // The form has dynamically named fields for honeypot protection
  
  // Let me try to fill in the form fields
  // Find all text inputs in the form
  const formFields = await page.$$('form input[type="text"], form input[type="email"], form input[type="password"]');
  console.log(`Found ${formFields.length} input fields`);
  
  for (let i = 0; i < formFields.length; i++) {
    const name = await formFields[i].getAttribute('name');
    const type = await formFields[i].getAttribute('type');
    const placeholder = await formFields[i].getAttribute('placeholder');
    const id = await formFields[i].getAttribute('id');
    console.log(`Field ${i}: name="${name}" type="${type}" placeholder="${placeholder}" id="${id}"`);
  }
  
  // Let me take a screenshot
  await page.screenshot({ path: '/root/embyr/register_form.png', fullPage: true });
  console.log("Screenshot saved");
  
  await browser.close();
})();
