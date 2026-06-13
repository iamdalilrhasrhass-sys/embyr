const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] 
  });
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
  
  console.log(`Username: ${username}`);
  
  // Get ALL form field names in one evaluate
  const fieldInfo = await page.evaluate(() => {
    const inputs = document.querySelectorAll('form input');
    const info = {checkboxes: []};
    for (const inp of inputs) {
      const n = inp.getAttribute('name');
      const t = inp.getAttribute('type');
      const p = inp.getAttribute('placeholder');
      if (!n) continue;
      if (t === 'email') info.email = n;
      else if (t === 'password' && n !== 'password_confirm') info.pw = n;
      else if (t === 'password') info.pw_confirm = n;
      else if (p === 'Day') info.dob_day = n;
      else if (p === 'Year') info.dob_year = n;
      else if (p === 'Please answer the question above...') info.captcha = n;
      else if (n === 'website_code') info.honeypot = n;
      else if (n === 'location') info.location = n;
      else if (t === 'text' && n.length > 20) info.username = n;
      else if (t === 'checkbox') info.checkboxes.push(n);
      else if (t === 'hidden' && n === 'timetaken') info.timetaken = n;
    }
    return info;
  });
  
  console.log("Fields:", JSON.stringify(fieldInfo, null, 2));
  
  // Fill using page.fill() for visible fields and JS for hidden ones
  await page.fill(`input[name="${fieldInfo.username}"]`, username);
  await page.fill(`input[name="${fieldInfo.email}"]`, email);
  await page.fill(`input[name="${fieldInfo.pw}"]`, password);
  
  // Try to fill password_confirm - it might be hidden behind a "Show" button
  try {
    await page.fill(`input[name="${fieldInfo.pw_confirm}"]`, password);
  } catch(e) {
    console.log("Could not fill password_confirm directly, trying via JS");
    await page.evaluate(({pw_confirm, password}) => {
      const el = document.querySelector(`input[name="${pw_confirm}"]`);
      if (el) { 
        el.value = password; 
        el.dispatchEvent(new Event('input', {bubbles: true}));
        el.style.display = 'block';
      }
    }, {pw_confirm: fieldInfo.pw_confirm, password});
  }
  
  await page.fill(`input[name="${fieldInfo.dob_day}"]`, '15');
  await page.selectOption('form select[name=dob_month]', '6');
  await page.fill(`input[name="${fieldInfo.dob_year}"]`, '1990');
  await page.fill(`input[name="${fieldInfo.location}"]`, 'USA');
  
  // Captcha
  await page.fill(`input[name="${fieldInfo.captcha}"]`, 'rainbow');
  
  // Check all checkboxes
  for (const cb of fieldInfo.checkboxes) {
    try { await page.check(`input[name="${cb}"]`); } catch(e) { 
      await page.evaluate(({cb}) => {
        const el = document.querySelector(`input[name="${cb}"]`);
        if (el) { el.checked = true; }
      }, {cb});
    }
  }
  
  // Set timetaken
  await page.evaluate(() => {
    const tt = document.querySelector('input[name="timetaken"]');
    if (tt) tt.value = '15';
  });
  
  console.log("Waiting 10 seconds...");
  await page.waitForTimeout(11000);
  
  // Take screenshot before submit
  await page.screenshot({ path: '/root/embyr/before_submit2.png', fullPage: true });
  
  console.log("Submitting...");
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(10000);
  
  const url = page.url();
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log("URL:", url);
  console.log("Response:", bodyText);
  
  await page.screenshot({ path: '/root/embyr/register_final.png', fullPage: true });
  
  fs.writeFileSync('/root/embyr/reg_result.txt', bodyText);
  
  await browser.close();
})();
