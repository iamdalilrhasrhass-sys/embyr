const { firefox } = require('playwright');

// Use Camoufox binary via Playwright Firefox
(async () => {
  const browser = await firefox.launch({
    headless: true,
    executablePath: '/root/.cache/camoufox/camoufox',
    args: ['-no-remote']
  });
  console.log('BROWSER_LAUNCHED');
  
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 2000 }
  });
  const page = await ctx.newPage();
  
  // First check our IP
  await page.goto('https://api.ipify.org?format=json', { timeout: 15000 });
  const myIp = await page.evaluate(() => document.body.innerText);
  console.log('CAMOUFOX_IP:', myIp);
  
  // Go to 4chan /lgbt/
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('BOARD_LOADED');
  
  // Click "Start a New Thread" if needed
  const startLink = page.locator('#togglePostFormLink a');
  if (await startLink.isVisible()) {
    await startLink.click();
    await page.waitForTimeout(1500);
  }
  
  // Fill form via evaluate (bypass Playwright visibility checks)
  await page.evaluate(() => {
    const subInput = document.querySelector('input[name="sub"]');
    if (subInput) subInput.value = 'EMBIR - App gay 100% gratuite';
    
    const comText = document.querySelector('textarea[name="com"]');
    if (comText) {
      comText.value = 'EMBIR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite de messages, ZERO comptes premium a 30€.\n\nGrindr c est 30€/mois pour des fonctions de base.\n\nOn casse ce monopole.\n\nembir.xyz\n\nDispo maintenant.';
    }
  });
  console.log('FORM_FILLED');
  
  // Wait for captcha to potentially load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/4chan_camoufox_form.png', fullPage: false });
  console.log('SCREENSHOT_FORM');
  
  // Try submitting
  const submitBtn = page.locator('input[type="submit"][value="Post"]');
  if (await submitBtn.isVisible()) {
    await submitBtn.click();
    await page.waitForTimeout(8000);
    
    const result = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body ? document.body.innerText.substring(0, 2000) : 'NO_BODY'
      };
    });
    console.log('SUBMIT_RESULT:', JSON.stringify(result, null, 2));
    await page.screenshot({ path: '/tmp/4chan_camoufox_result.png', fullPage: false });
  }
  
  await page.waitForTimeout(2000);
  const finalResult = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      text: document.body ? document.body.innerText.substring(0, 1000) : 'NO_BODY'
    };
  });
  console.log('FINAL:', JSON.stringify(finalResult, null, 2));
  
  await browser.close();
})();
