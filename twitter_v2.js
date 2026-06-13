const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 1500 }
  });
  const page = await ctx.newPage();
  
  // 1. Login
  console.log('1. LOGIN...');
  await page.goto('https://x.com/login', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/tw_login_page.png' });
  
  // Get page info
  const loginInfo = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    const labels = document.querySelectorAll('label, span');
    const buttons = document.querySelectorAll('button, div[role="button"]');
    return {
      inputs: Array.from(inputs).map(i => ({ name: i.name, type: i.type, placeholder: i.placeholder, class: i.className.substring(0, 50), id: i.id })),
      buttons: Array.from(buttons).slice(0, 10).map(b => ({ text: b.textContent?.substring(0, 50), role: b.getAttribute('role') })),
      labels: Array.from(labels).slice(0, 10).map(l => ({ text: l.textContent?.substring(0, 50) }))
    };
  });
  console.log('LOGIN_PAGE:', JSON.stringify(loginInfo, null, 2));
  
  // The inputs are already on the page - just fill them directly  
  const usernameInput = page.locator('input[name="username_or_email"]').first();
  await usernameInput.fill('EmbyrApp', { force: true });
  await page.waitForTimeout(500);
  console.log('Filled username (forced)');
  
  // Click Continue/Next using the button's actual parent
  // The Continue button might be inside a div that intercepts clicks
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  console.log('Pressed Enter for Continue');
  
  // Now fill password
  const passInput = page.locator('input[type="password"]').first();
  if (await passInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await passInput.fill('EmbyrPromo2026!');
    await page.waitForTimeout(500);
    
    const loginBtn = page.locator('button:has-text("Log in"), button:has-text("Sign in")').first();
    if (await loginBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await loginBtn.click();
      await page.waitForTimeout(5000);
    }
  } else {
    // Maybe Twitter asked for username verification
    console.log('No password input - checking for username verification...');
    await page.screenshot({ path: '/tmp/tw_verify.png' });
    
    const userInput = page.locator('input').first();
    if (await userInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      const p = await userInput.getAttribute('placeholder');
      console.log('Input placeholder:', p);
      if (p?.includes('username') || p?.includes('confirm')) {
        await userInput.fill('EmbyrApp');
        const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
        if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(3000);
        }
      }
    }
    
    // Try password again
    const pass2 = page.locator('input[type="password"]').first();
    if (await pass2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pass2.fill('EmbyrPromo2026!');
      const loginBtn2 = page.locator('button:has-text("Log in")').first();
      if (await loginBtn2.isVisible({ timeout: 2000 }).catch(() => false)) {
        await loginBtn2.click();
        await page.waitForTimeout(5000);
      }
    }
  }
  
  // Check result
  const afterLogin = page.url();
  console.log(`URL after login: ${afterLogin}`);
  await page.screenshot({ path: '/tmp/tw_afterlogin.png' });
  
  if (!afterLogin.includes('login') && !afterLogin.includes('jf/onboarding')) {
    console.log('✅ LOGGED IN!');
    
    // Post a tweet
    console.log('\n2. POSTING TWEET...');
    await page.goto('https://x.com/home', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Find the tweet composer
    const tweetArea = page.locator('div[data-testid="tweetTextarea_0"], div[role="textbox"][contenteditable="true"]').first();
    if (await tweetArea.isVisible({ timeout: 5000 }).catch(() => false)) {
      const text = "EMBYR - l'app de rencontre gay 100% gratuite.\n\nGrindr facture 30€/mois. Nous, on reste gratuit. Toujours.\n\nSwipe, match, chat. 60+ villes. 25 langues.\n\nPas de pub. Pas de limite de messages.\n\nembir.xyz";
      await tweetArea.click();
      await page.keyboard.type(text, { delay: 30 });
      await page.waitForTimeout(1000);
      
      const postBtn = page.locator('button[data-testid="tweetButtonInline"]').first();
      if (await postBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await postBtn.click();
        await page.waitForTimeout(5000);
        console.log('✅ TWEET POSTED!');
        await page.screenshot({ path: '/tmp/tw_posted.png' });
      }
    }
    
    // Search for Grindr discussions
    console.log('\n3. SEARCHING...');
    await page.goto('https://x.com/search?q=Grindr%20expensive&f=live', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: '/tmp/tw_search_results.png' });
    
  } else {
    console.log('❌ LOGIN FAILED');
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 500) || '');
    console.log('Body:', bodyText);
  }
  
  await browser.close();
})();
