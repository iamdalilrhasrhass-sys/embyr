const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    proxy: { server: 'http://174.137.134.182:2999' }
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 2000 }
  });
  const page = await ctx.newPage();
  
  // 1. Login to Twitter
  console.log('1. LOGIN TO TWITTER...');
  await page.goto('https://twitter.com/login', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Fill email
  const emailInput = page.locator('input[autocomplete="username"], input[name="text"]').first();
  if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailInput.fill('embyrpromo1779557374@wshu.net');
    await page.waitForTimeout(1000);
    
    // Click Next
    const nextBtn = page.locator('button:has-text("Next"), button:has-text("Suivant"), div[role="button"]:has-text("Next")').first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Check if Twitter asks for username (unusual login)
    const usernameInput = page.locator('input[name="text"]').first();
    if (await usernameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await usernameInput.fill('EmbyrApp');
      const next2 = page.locator('button:has-text("Next"), button:has-text("Suivant")').first();
      if (await next2.isVisible({ timeout: 2000 }).catch(() => false)) {
        await next2.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Fill password
    const passInput = page.locator('input[type="password"]').first();
    if (await passInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passInput.fill('EmbyrPromo2026!');
      const loginBtn = page.locator('button:has-text("Log in"), button:has-text("Se connecter")').first();
      if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await loginBtn.click();
        await page.waitForTimeout(5000);
      }
    }
  }
  
  // Check if we're logged in
  const currentUrl = page.url();
  console.log(`URL after login: ${currentUrl}`);
  
  if (currentUrl.includes('home') || currentUrl.includes('explore') || !currentUrl.includes('login')) {
    console.log('✅ LOGGED IN!');
    await page.screenshot({ path: '/tmp/tw_loggedin.png' });
    
    // Save the storage state
    await ctx.storageState({ path: '/tmp/twitter_state.json' });
    console.log('State saved!');
    
    // 2. Post a tweet about Embyr
    console.log('\n2. POSTING TWEET...');
    await page.goto('https://twitter.com/compose/tweet', { timeout: 15000, waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Try the compose box
    const tweetBox = page.locator('div[data-testid="tweetTextarea_0"], div[role="textbox"], div[contenteditable="true"]').first();
    if (await tweetBox.isVisible({ timeout: 5000 }).catch(() => false)) {
      const tweetText = `Lassé de payer 30€/mois pour Grindr ?\n\nEMBYR est 100% gratuit. Toujours.\nSwipe, match, chat — sans pub ni limite.\n\nDéjà disponible en 25 langues et +60 villes.\n\nembir.xyz\n\n#LGBTQ #Grindr #DatingApp #Gay`;
      
      await tweetBox.click();
      await tweetBox.fill(tweetText);
      await page.waitForTimeout(1000);
      
      // Click Post/ Tweet button
      const postBtn = page.locator('button[data-testid="tweetButton"], button:has-text("Post"), button:has-text("Tweet")').first();
      if (await postBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await postBtn.click();
        await page.waitForTimeout(5000);
        console.log('✅ TWEET POSTED!');
        await page.screenshot({ path: '/tmp/tw_tweeted.png' });
      } else {
        console.log('Post button not found');
        await page.screenshot({ path: '/tmp/tw_nopostbtn.png' });
      }
    } else {
      console.log('Tweet box not found');
      await page.screenshot({ path: '/tmp/tw_notweetbox.png' });
    }
    
    // 3. Search for Grindr discussions and reply
    console.log('\n3. SEARCHING FOR GRINDR DISCUSSIONS...');
    await page.goto('https://twitter.com/search?q=Grindr%20gay%20dating%20app&f=live', { timeout: 20000, waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: '/tmp/tw_search.png' });
    
    // Get tweet texts and links
    const tweets = await page.evaluate(() => {
      const articles = document.querySelectorAll('article[data-testid="tweet"]');
      return Array.from(articles).slice(0, 5).map(a => ({
        text: a.textContent?.substring(0, 200) || '',
        link: a.querySelector('a[href*="/status/"]')?.href || ''
      }));
    });
    console.log(`Found ${tweets.length} tweets:`);
    tweets.forEach((t, i) => console.log(`  ${i+1}. ${t.text.substring(0, 100)}`));
    
  } else {
    console.log('❌ LOGIN FAILED');
    await page.screenshot({ path: '/tmp/tw_loginfail.png' });
    
    // Check what's on the page
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 1000) || '');
    console.log('Page text:', bodyText);
  }
  
  await browser.close();
})();
