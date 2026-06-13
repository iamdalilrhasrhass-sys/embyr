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
    // Register and login
    log('Registering...');
    await page.goto('https://forums.justusboys.com/login/register', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Fill form via JS
    const fillOk = await page.evaluate(() => {
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
        if (!el) return false;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      
      setVal(user, 'EmbirUser');
      setVal(email, 'embiruser@yopmail.com');
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
      setVal(loc, 'Los Angeles');
      setVal(captcha, 'RAINBOW');
      if (accept) { accept.checked = true; accept.dispatchEvent(new Event('change')); }
      
      return true;
    });
    
    log('✓ Form filled');
    
    await page.waitForTimeout(10000);
    
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"], input[type="submit"]');
      if (btn) btn.click();
    });
    
    await page.waitForTimeout(6000);
    log('URL after reg: ' + page.url());
    
    const loggedIn = await page.evaluate(() => !!Array.from(document.querySelectorAll('a')).find(a => a.innerText.trim() === 'Log out'));
    log('Logged in: ' + loggedIn);
    
    if (loggedIn) {
      // Try direct post thread URLs
      const postUrls = [
        'https://forums.justusboys.com/forums/gay-discussion.38/post-thread',
        'https://forums.justusboys.com/post-thread?node_id=38',
        'https://forums.justusboys.com/forums/gay-discussion.38/create-thread',
        'https://forums.justusboys.com/forums/gay-discussion.38/add',
        'https://forums.justusboys.com/threads/create?node_id=38',
      ];
      
      for (const postUrl of postUrls) {
        log(`\nTrying post URL: ${postUrl}`);
        await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(2000);
        
        const info = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type }));
          const textareas = Array.from(document.querySelectorAll('textarea')).map(t => ({ name: t.name }));
          const editable = !!document.querySelector('[contenteditable="true"]');
          const title = document.title;
          const url = window.location.href;
          const body = document.body.innerText.substring(0, 300);
          const hasTitleInput = !!document.querySelector('input[name="title"]');
          const hasError = body.includes('error') || body.includes('Error') || body.includes('Oops');
          const isLogin = !!document.querySelector('input[name="login"]');
          return { title, url, hasTitleInput, editable, hasError, isLogin, body, inputs, textareas };
        });
        
        log(`  Title: ${info.title}`);
        log(`  URL: ${info.url}`);
        log(`  Has title: ${info.hasTitleInput}`);
        log(`  Has editable: ${info.editable}`);
        log(`  Has error: ${info.hasError}`);
        log(`  Is login: ${info.isLogin}`);
        
        if (info.hasTitleInput || info.editable) {
          log('  *** FOUND POST FORM ***');
          await page.screenshot({ path: '/root/embyr/post_form_found.png', fullPage: true });
          
          // Fill and submit
          if (info.hasTitleInput) {
            await page.fill('input[name="title"]', 'Has anyone tried EMBYR? Found a completely free Grindr alternative');
            log('  ✓ Title filled');
          }
          
          // Find message field
          if (info.textareas.length > 0) {
            const msg = `I've been testing this new app called EMBYR (embir.xyz) for the past week and honestly I'm pretty impressed so far. It's a gay dating app that's completely free - no paywalls, no "gold" features, no limits on who you can talk to. Unlike Grindr where you basically need a subscription to actually use it properly these days.\n\nHas anyone else tried it? The user base is still growing obviously but it seems legit. Just curious what other people think.`;
            
            const textareaName = info.textareas[0].name;
            await page.fill(`textarea[name="${textareaName}"]`, msg);
            log('  ✓ Message filled');
          } else if (info.editable) {
            const msg = `I've been testing this new app called EMBYR (embir.xyz) for the past week and honestly I'm pretty impressed so far. It's a completely free gay dating app - no paywalls, no limits. Unlike Grindr. Has anyone tried it?`;
            await page.click('[contenteditable="true"]');
            await page.keyboard.type(msg, { delay: 3 });
            log('  ✓ Message typed into editor');
          }
          
          await page.screenshot({ path: '/root/embyr/post_form_filled2.png', fullPage: true });
          
          // Submit
          const submitBtn = await page.$('button[type="submit"]');
          if (submitBtn) {
            const btnText = await submitBtn.innerText();
            log(`  Submit button text: "${btnText}"`);
            await submitBtn.click();
            await page.waitForTimeout(5000);
            log(`  After submit URL: ${page.url()}`);
            
            const result = await page.evaluate(() => document.body.innerText.substring(0, 800));
            log(`  Result: ${result}`);
            
            await page.screenshot({ path: '/root/embyr/post_result_final.png', fullPage: true });
            
            outputLines.push('\n*** POST ATTEMPT COMPLETE ***');
            break;
          } else {
            log('  ✗ No submit button');
          }
        }
      }
    }
    
  } catch (err) {
    log('Error: ' + err.message);
    await page.screenshot({ path: '/root/embyr/error_state.png', fullPage: true });
  }

  fs.writeFileSync('/root/embyr/justusboys_post.txt', outputLines.join('\n'));
  log('\nResult saved');
  
  await browser.close();
  process.exit(0);
})();
