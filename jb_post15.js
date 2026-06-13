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
    log('Going to register...');
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    // Fill everything via JavaScript evaluation to bypass all UI issues
    await page.evaluate(() => {
      const rows = document.querySelectorAll('.formRow');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      
      let usernameEl, emailEl, passwordEl, confirmEl;
      let monthEl, dayEl, yearEl, locEl, captchaEl, acceptEl;
      
      rows.forEach(row => {
        const label = row.querySelector('.formRow-label');
        if (!label) return;
        const text = label.innerText.trim();
        
        if (text === 'Username') {
          usernameEl = row.querySelector('input[type="text"]');
        } else if (text === 'Email') {
          emailEl = row.querySelector('input[type="email"]');
        } else if (text === 'Password') {
          passwordEl = row.querySelector('input[type="password"]');
        } else if (text === 'Verify password') {
          confirmEl = row.querySelector('input[type="password"]');
        } else if (text === 'Date of birth') {
          dayEl = row.querySelector('input[name="dob_day"]');
          yearEl = row.querySelector('input[name="dob_year"]');
          monthEl = row.querySelector('select[name="dob_month"]');
        } else if (text === 'Location') {
          locEl = row.querySelector('input[type="text"]');
        } else if (text === 'Verification') {
          captchaEl = row.querySelector('input[type="text"]');
        }
      });
      
      // Accept checkbox has no label text
      acceptEl = document.querySelector('input[name="accept"]');
      
      if (usernameEl) {
        nativeSetter.call(usernameEl, 'GayApp2027');
        usernameEl.dispatchEvent(new Event('input', { bubbles: true }));
        usernameEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (emailEl) {
        nativeSetter.call(emailEl, 'gayapp2027@yopmail.com');
        emailEl.dispatchEvent(new Event('input', { bubbles: true }));
        emailEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (passwordEl) {
        nativeSetter.call(passwordEl, 'TempPass123!');
        passwordEl.dispatchEvent(new Event('input', { bubbles: true }));
        passwordEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (confirmEl) {
        nativeSetter.call(confirmEl, 'TempPass123!');
        confirmEl.dispatchEvent(new Event('input', { bubbles: true }));
        confirmEl.dispatchEvent(new Event('change', { bubbles: true }));
        // Make visible
        confirmEl.closest('.formRow').style.display = '';
        confirmEl.style.display = '';
      }
      
      if (monthEl) monthEl.value = '6';
      if (dayEl) {
        nativeSetter.call(dayEl, '15');
        dayEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (yearEl) {
        nativeSetter.call(yearEl, '1991');
        yearEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (locEl) {
        nativeSetter.call(locEl, 'New York');
        locEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (captchaEl) {
        nativeSetter.call(captchaEl, 'RAINBOW');
        captchaEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (acceptEl) {
        acceptEl.checked = true;
        acceptEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    log('✓ All fields filled via JS');
    
    await page.screenshot({ path: '/root/embyr/register_filled_v3.png', fullPage: true });
    
    // Wait for timer
    log('⏳ Waiting 10s for timer...');
    await page.waitForTimeout(10000);
    
    // Submit using JS
    log('Submitting...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"], input[type="submit"]');
      if (btn) btn.click();
    });
    
    await page.waitForTimeout(8000);
    
    log('URL: ' + page.url());
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    log('Result: ' + bodyText);
    
    await page.screenshot({ path: '/root/embyr/register_result_v3.png', fullPage: true });
    
    // Check login status
    const loginStatus = await page.evaluate(() => {
      const logoutLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText.trim() === 'Log out');
      const username = document.querySelector('.p-navgroup-link--user');
      return {
        loggedIn: !!logoutLink,
        username: username ? username.innerText.trim() : '',
        hasRejection: document.body.innerText.includes('rejected') || document.body.innerText.includes('spam-like')
      };
    });
    
    log('Login status: ' + JSON.stringify(loginStatus));
    
    // If logged in and not rejected, try to post
    if (loginStatus.loggedIn && !loginStatus.hasRejection) {
      log('\n*** SUCCESSFULLY LOGGED IN! ***');
      
      // Navigate to Gay Discussion
      await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      await page.waitForTimeout(2000);
      
      log('Forum URL: ' + page.url());
      
      // Look for post thread button
      const postBtnInfo = await page.evaluate(() => {
        const allLinks = document.querySelectorAll('a');
        const postLinks = Array.from(allLinks).filter(a => 
          a.innerText.toLowerCase().includes('post new thread') || 
          a.innerText.toLowerCase().includes('new thread') ||
          a.href.includes('post-thread') ||
          a.href.includes('add-thread')
        ).map(a => ({
          text: a.innerText.trim(),
          href: a.href,
          class: a.className
        }));
        return postLinks;
      });
      
      log('Post buttons: ' + JSON.stringify(postBtnInfo));
      
      await page.screenshot({ path: '/root/embyr/forum_after_login.png', fullPage: true });
    }
    
  } catch (err) {
    log('Error: ' + err.message);
    await page.screenshot({ path: '/root/embyr/error_state.png', fullPage: true });
  }

  // Save result
  fs.writeFileSync('/root/embyr/justusboys_post.txt', outputLines.join('\n'));
  
  await browser.close();
  process.exit(0);
})();
