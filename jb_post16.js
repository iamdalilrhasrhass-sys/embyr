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
    // Go to home page
    log('Navigating to home...');
    await page.goto('https://forums.justusboys.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Try direct login with existing credentials
    log('Trying to log in with existing account...');
    await page.goto('https://forums.justusboys.com/login/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Find login form
    const loginForm = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(el => ({
        name: el.name,
        type: el.type,
        placeholder: el.placeholder || '',
        id: el.id,
        label: el.closest('.formRow') ? el.closest('.formRow').querySelector('.formRow-label')?.innerText?.trim() || '' : ''
      }));
    });
    
    log('Login form inputs:');
    loginForm.forEach((el, i) => log(`  [${i}] name="${el.name}" type="${el.type}" label="${el.label}" placeholder="${el.placeholder}"`));
    
    // Fill login
    const loginInput = await page.locator('input[name="login"]').first();
    const passwordInput = await page.locator('input[name="password"]').first();
    
    if (await loginInput.isVisible()) {
      await loginInput.fill('GayApp2027');
      await passwordInput.fill('TempPass123!');
      log('✓ Filled login form');
      
      await page.screenshot({ path: '/root/embyr/login_filled.png', fullPage: true });
      
      // Click login
      await page.click('button[type="submit"], input[type="submit"]');
      await page.waitForTimeout(5000);
      
      log('After login URL: ' + page.url());
      
      const loginResult = await page.evaluate(() => {
        const body = document.body.innerText.substring(0, 500);
        const hasLogout = !!Array.from(document.querySelectorAll('a')).find(a => a.innerText.trim() === 'Log out');
        return { body, hasLogout, url: window.location.href };
      });
      
      log('Login result: ' + JSON.stringify(loginResult));
      
      await page.screenshot({ path: '/root/embyr/login_result.png', fullPage: true });
      
      if (loginResult.hasLogout) {
        log('*** LOGGED IN SUCCESSFULLY ***');
        
        // Try Gay Discussion forum
        await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        await page.waitForTimeout(3000);
        
        log('Forum URL: ' + page.url());
        
        const forumInfo = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          const allLinks = Array.from(document.querySelectorAll('a'));
          const postLinks = allLinks.filter(a => 
            a.innerText.toLowerCase().includes('post new thread') || 
            a.innerText.toLowerCase().includes('new thread') ||
            a.href.includes('post-thread') ||
            a.href.includes('add-thread')
          ).map(a => ({
            text: a.innerText.trim().substring(0, 60),
            href: a.href.substring(0, 150),
            class: a.className.substring(0, 60)
          }));
          
          // Get ALL links text
          const allLinkTexts = allLinks.map(a => a.innerText.trim()).filter(t => t && t.length < 60);
          
          return {
            h1: h1 ? h1.innerText : 'none',
            url: window.location.href,
            postLinks,
            allLinkTexts: [...new Set(allLinkTexts)].filter(t => t.toLowerCase().includes('post') || t.toLowerCase().includes('thread'))
          };
        });
        
        log('Forum info: ' + JSON.stringify(forumInfo, null, 2));
        
        await page.screenshot({ path: '/root/embyr/forum_after_full_login.png', fullPage: true });
        
        // If we have post link, navigate to it
        if (forumInfo.postLinks && forumInfo.postLinks.length > 0) {
          const postUrl = forumInfo.postLinks[0].href;
          log('\nNavigating to post thread: ' + postUrl);
          await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(3000);
          
          log('Post page URL: ' + page.url());
          await page.screenshot({ path: '/root/embyr/post_thread_page.png', fullPage: true });
          
          // Now fill the post form
          log('\n*** FILLING POST FORM ***');
          
          // Find title field
          const titleInput = await page.$('input[name="title"]');
          if (titleInput) {
            await titleInput.fill('Has anyone tried EMBYR? Found a completely free Grindr alternative');
            log('✓ Title filled');
          } else {
            log('✗ Title field not found');
          }
          
          // Find message body
          // XenForo uses a rich text editor (fr-box / contenteditable)
          const messageArea = await page.$('textarea[name="message"], .fr-element, [contenteditable="true"]');
          if (messageArea) {
            const tag = await messageArea.evaluate(el => el.tagName);
            log('Message area tag: ' + tag);
            
            const msg = `I've been testing this new app called EMBYR (embir.xyz) for the past week and honestly I'm pretty impressed so far. It's a gay dating app that's completely free - no paywalls, no "gold" features, no limits on who you can talk to. Unlike Grindr where you basically need a subscription to actually use it properly these days.\n\nHas anyone else tried it? The user base is still growing obviously but it seems legit. Just curious what other people think.`;
            
            if (tag === 'TEXTAREA') {
              await messageArea.fill(msg);
            } else {
              await messageArea.click();
              await page.keyboard.type(msg, { delay: 5 });
            }
            log('✓ Message body filled');
          } else {
            log('✗ Message body field not found');
          }
          
          await page.screenshot({ path: '/root/embyr/post_form_filled.png', fullPage: true });
          
          // Try to submit
          const submitBtn = await page.$('button[type="submit"], button:has-text("Post"), button:has-text("Create"), button:has-text("Save")');
          if (submitBtn) {
            log('✓ Submit button found, clicking...');
            await submitBtn.click();
            await page.waitForTimeout(5000);
            
            log('After submit URL: ' + page.url());
            
            const postResult = await page.evaluate(() => document.body.innerText.substring(0, 1000));
            log('Post result: ' + postResult);
            
            await page.screenshot({ path: '/root/embyr/post_final.png', fullPage: true });
            outputLines.push('\n*** POSTING ATTEMPT COMPLETE ***');
          } else {
            log('✗ Submit button not found');
          }
        } else {
          log('✗ No post thread link found');
        }
      } else {
        log('✗ Login failed');
      }
    }
    
  } catch (err) {
    log('Error: ' + err.message);
    await page.screenshot({ path: '/root/embyr/error_state.png', fullPage: true });
  }

  fs.writeFileSync('/root/embyr/justusboys_post.txt', outputLines.join('\n'));
  log('\nResult saved to /root/embyr/justusboys_post.txt');
  
  await browser.close();
  process.exit(0);
})();
