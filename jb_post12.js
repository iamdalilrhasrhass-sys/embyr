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
    // Register first
    console.log('Going to register page...');
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    // Fill all via JS
    const fillResult = await page.evaluate(() => {
      const rows = document.querySelectorAll('.formRow');
      let usernameEl, emailEl, passwordEl, confirmEl;
      let monthEl, dayEl, yearEl, locEl, captchaEl, acceptEl;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      
      rows.forEach(row => {
        const label = row.querySelector('.formRow-label');
        if (!label) return;
        const text = label.innerText.trim();
        const input = row.querySelector('input');
        const select = row.querySelector('select');
        
        if (text === 'Username') usernameEl = input;
        else if (text === 'Email') emailEl = input;
        else if (text === 'Password') passwordEl = input;
        else if (text === 'Verify password') confirmEl = input;
        else if (text === 'Date of birth') {
          dayEl = row.querySelector('input[name="dob_day"]');
          yearEl = row.querySelector('input[name="dob_year"]');
          monthEl = row.querySelector('select[name="dob_month"]');
        }
        else if (text === 'Location') locEl = input;
        else if (text === 'Verification' && input && input.type === 'text') captchaEl = input;
        else if (input && input.name === 'accept') acceptEl = input;
      });
      
      if (usernameEl) {
        nativeInputValueSetter.call(usernameEl, 'GayAppUser2025');
        usernameEl.dispatchEvent(new Event('input', { bubbles: true }));
        usernameEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (emailEl) {
        nativeInputValueSetter.call(emailEl, 'gayapp2025@yopmail.com');
        emailEl.dispatchEvent(new Event('input', { bubbles: true }));
        emailEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (passwordEl) {
        nativeInputValueSetter.call(passwordEl, 'TempPass123!');
        passwordEl.dispatchEvent(new Event('input', { bubbles: true }));
        passwordEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (confirmEl) {
        nativeInputValueSetter.call(confirmEl, 'TempPass123!');
        confirmEl.dispatchEvent(new Event('input', { bubbles: true }));
        confirmEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      if (monthEl) monthEl.value = '6';
      if (dayEl) {
        nativeInputValueSetter.call(dayEl, '15');
        dayEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (yearEl) {
        nativeInputValueSetter.call(yearEl, '1990');
        yearEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (locEl) {
        nativeInputValueSetter.call(locEl, 'United States');
        locEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (captchaEl) {
        nativeInputValueSetter.call(captchaEl, 'RAINBOW');
        captchaEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (acceptEl) acceptEl.checked = true;
      
      return { user: !!usernameEl, email: !!emailEl, pass: !!passwordEl, confirm: !!confirmEl, month: !!monthEl, day: !!dayEl, year: !!yearEl, loc: !!locEl, captcha: !!captchaEl, accept: !!acceptEl };
    });
    
    console.log('Fill result:', JSON.stringify(fillResult));
    
    // Wait for timer
    console.log('Waiting 10s...');
    await page.waitForTimeout(10000);
    
    // Submit
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return;
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    
    await page.waitForTimeout(5000);
    console.log('URL after submit:', page.url());
    
    // Check if we got logged in despite rejection
    const loggedIn = await page.evaluate(() => {
      return {
        url: window.location.href,
        body: document.body.innerText.substring(0, 1000),
        hasLogout: !!document.querySelector('a:has-text("Log out")'),
        username: document.querySelector('.p-navgroup-link--user') ? document.querySelector('.p-navgroup-link--user').innerText.trim() : ''
      };
    });
    
    console.log('Login status:', JSON.stringify(loggedIn, null, 2));
    
    // If logged in, try to navigate to Gay Discussion
    if (loggedIn.hasLogout || loggedIn.body.includes('Log out')) {
      console.log('\nLogged in! Navigating to Gay Discussion...');
      await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      await page.waitForTimeout(2000);
      
      console.log('Forum URL:', page.url());
      console.log('Forum title:', await page.title());
      
      const forumState = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const postBtn = document.querySelector('a:has-text("Post new thread"), a:has-text("Post New Thread")');
        return {
          h1: h1 ? h1.innerText : 'none',
          url: window.location.href,
          hasPostBtn: !!postBtn,
          postBtnHtml: postBtn ? postBtn.outerHTML.substring(0, 200) : '',
          bodyText: document.body.innerText.substring(0, 500)
        };
      });
      
      console.log('Forum state:', JSON.stringify(forumState, null, 2));
      
      await page.screenshot({ path: '/root/embyr/gay_discussion_forum.png', fullPage: true });
      
      if (forumState.postBtnHtml) {
        console.log('\nFound Post New Thread button!');
        // Extract href
        const postMatch = forumState.postBtnHtml.match(/href="([^"]+)"/);
        const postHref = postMatch ? postMatch[1] : '';
        console.log('Post thread href:', postHref);
      }
    }
    
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/root/embyr/error_state.png', fullPage: true });
  }

  await browser.close();
  process.exit(0);
})();
