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
  const outputLines = [];

  function log(msg) {
    console.log(msg);
    outputLines.push(msg);
  }

  try {
    // Register first
    log('Registering...');
    await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Fill form via JS
    await page.evaluate(() => {
      const rows = document.querySelectorAll('.formRow');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      let user, email, pass, confirm, day, year, loc, captcha, accept;
      let month;
      
      rows.forEach(row => {
        const label = row.querySelector('.formRow-label');
        if (!label) return;
        const t = label.innerText.trim();
        if (t === 'Username') user = row.querySelector('input[type="text"]');
        else if (t === 'Email') email = row.querySelector('input[type="email"]');
        else if (t === 'Password') pass = row.querySelector('input[type="password"]');
        else if (t === 'Verify password') confirm = row.querySelector('input[type="password"]');
        else if (t === 'Date of birth') {
          day = row.querySelector('input[name="dob_day"]');
          year = row.querySelector('input[name="dob_year"]');
          month = row.querySelector('select[name="dob_month"]');
        }
        else if (t === 'Location') loc = row.querySelector('input[type="text"]');
        else if (t === 'Verification') captcha = row.querySelector('input[type="text"]');
      });
      accept = document.querySelector('input[name="accept"]');
      
      const setVal = (el, val) => {
        if (!el) return;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      
      setVal(user, 'EmbyrFan');
      setVal(email, 'embyrf@yopmail.com');
      setVal(pass, 'Test1234!');
      if (confirm) {
        setVal(confirm, 'Test1234!');
        confirm.closest('.formRow').style.display = '';
        confirm.style.display = '';
        confirm.style.visibility = 'visible';
      }
      if (month) month.value = '6';
      setVal(day, '15');
      setVal(year, '1992');
      setVal(loc, 'San Francisco');
      setVal(captcha, 'RAINBOW');
      if (accept) { accept.checked = true; accept.dispatchEvent(new Event('change')); }
    });
    
    await page.waitForTimeout(10000);
    
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"], input[type="submit"]');
      if (btn) btn.click();
    });
    
    await page.waitForTimeout(6000);
    log('Reg result: ' + page.url());
    
    // Navigate to error page to see the actual message
    await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/post-thread', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);
    
    const errorMsg = await page.evaluate(() => {
      const body = document.body.innerText;
      // Find the error section
      const match = body.match(/Oops! We ran into some problems\.[^]*?(?=Home|$)/);
      return match ? match[0].trim() : body.substring(0, 1000);
    });
    
    log('Error message: ' + errorMsg);
    
    await page.screenshot({ path: '/root/embyr/error_details.png', fullPage: true });
    
  } catch (err) {
    log('Error: ' + err.message);
  }

  fs.writeFileSync('/root/embyr/justusboys_post.txt', outputLines.join('\n'));
  
  await browser.close();
  process.exit(0);
})();
