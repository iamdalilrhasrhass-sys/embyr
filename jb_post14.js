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
    // Register with fresh approach - fill ALL fields properly
    console.log('Going to register...');
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    // Use a completely different approach - type everything using Playwright's type method
    // which triggers real events
    
    // Username - find by label text
    const usernameInput = await page.locator('.formRow:has(.formRow-label:text("Username")) input').first();
    await usernameInput.click();
    await usernameInput.fill('GayAppUser2026');
    console.log('✓ Username');
    
    // Email
    const emailInput = await page.locator('.formRow:has(.formRow-label:text("Email")) input[type="email"]').first();
    await emailInput.click();
    await emailInput.fill('gayapp2026@yopmail.com');
    console.log('✓ Email');
    
    // Password - type slowly to trigger confirm field
    const passwordInput = await page.locator('.formRow:has(.formRow-label:text("Password")) input[type="password"]').first();
    await passwordInput.click();
    await passwordInput.fill('TempPass123!');
    console.log('✓ Password');
    await page.waitForTimeout(1500);
    
    // Confirm password
    try {
      const confirmInput = page.locator('input[name="password_confirm"]');
      if (await confirmInput.isVisible()) {
        await confirmInput.fill('TempPass123!');
        console.log('✓ Confirm password (visible)');
      } else {
        // Force click to make it visible, then set value via JS
        await confirmInput.evaluate(el => {
          el.closest('.formRow').style.display = 'block';
          el.style.display = 'block';
          el.style.visibility = 'visible';
        });
        await confirmInput.fill('TempPass123!');
        console.log('✓ Confirm password (force visible)');
      }
    } catch(e) {
      console.log('Confirm password error:', e.message);
      await page.evaluate(() => {
        document.querySelector('input[name="password_confirm"]').value = 'TempPass123!';
      });
      console.log('✓ Confirm password (JS set)');
    }
    
    // DOB month
    await page.selectOption('select[name="dob_month"]', '6');
    // DOB day
    await page.fill('input[name="dob_day"]', '15');
    // DOB year
    await page.fill('input[name="dob_year"]', '1990');
    console.log('✓ DOB');
    
    // Location
    await page.fill('input[name="location"]', 'United States');
    console.log('✓ Location');
    
    // Captcha
    await page.fill('input[name="captcha_question_answer"]', 'RAINBOW');
    console.log('✓ Captcha');
    
    // Accept checkbox
    await page.check('input[name="accept"]');
    console.log('✓ Accept');
    
    await page.screenshot({ path: '/root/embyr/register_filled_v2.png', fullPage: true });
    
    // Wait for timer
    console.log('⏳ Waiting 10s...');
    await page.waitForTimeout(10000);
    
    // Submit
    console.log('Submitting...');
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForTimeout(6000);
    
    console.log('URL:', page.url());
    const body = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log('Result:', body);
    
    await page.screenshot({ path: '/root/embyr/register_final_v2.png', fullPage: true });
    
    // If logged in - navigate to Gay Discussion
    if (body.includes('Log out') || body.includes('Log Out')) {
      console.log('\n*** LOGGED IN! ***');
      
      await page.goto('https://forums.justusboys.com/forums/gay-discussion.38/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      await page.waitForTimeout(2000);
      
      console.log('Forum URL:', page.url());
      console.log('Forum title:', await page.title());
      
      // Look for post button
      const postBtn = await page.$('[data-xf-click="overlay"] a, a[href*="post-thread"], a:has-text("Post new thread"), .button--cta');
      
      // Get all buttons
      const buttons = await page.$$eval('a, button', els => 
        els.map(el => ({
          text: el.innerText.trim().substring(0, 60),
          href: el.href || '',
          className: el.className.substring(0, 60)
        })).filter(b => b.text.toLowerCase().includes('post') || b.text.toLowerCase().includes('new') || b.text.toLowerCase().includes('thread'))
      );
      console.log('Post buttons:', JSON.stringify(buttons, null, 2));
      
      await page.screenshot({ path: '/root/embyr/forum_logged_in.png', fullPage: true });
    }
    
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/root/embyr/error_state.png', fullPage: true });
  }

  await browser.close();
  process.exit(0);
})();
