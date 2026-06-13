const { chromium } = require('playwright');

(async () => {
  // Launch with maximum stealth - use headed mode via Xvfb
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--disable-features=ChromeWhatsNewUI',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-infobars',
      '--disable-gpu',
      '--window-size=1280,2000',
      `--display=:99`
    ],
    proxy: { server: 'http://174.137.134.182:2999' }
  });
  
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 2000 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-CH-UA': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
    }
  });
  
  const page = await ctx.newPage();
  
  // Stealth: override navigator.webdriver
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    // Override chrome runtime
    window.chrome = { runtime: {} };
  });
  
  // Check IP first
  await page.goto('https://api.ipify.org?format=json', { timeout: 15000 });
  const ip = await page.evaluate(() => document.body.innerText);
  console.log('IP:', ip);
  
  // Go to 4chan
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('BOARD_LOADED');
  
  // Wait a bit for any Cloudflare checks on main page
  await page.waitForTimeout(3000);
  
  // Click "Start a New Thread"
  const link = page.locator('#togglePostFormLink a');
  await link.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  if (await link.isVisible().catch(() => false)) {
    await link.click();
    await page.waitForTimeout(1000);
  }
  
  // Fill form
  await page.evaluate(() => {
    const sub = document.querySelector('input[name="sub"]');
    if (sub) sub.value = 'EMBYR - App gay 100% gratuite';
    const com = document.querySelector('textarea[name="com"]');
    if (com) com.value = 'EMBYR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite.\n\nembir.xyz';
  });
  console.log('FORM_FILLED');
  
  // Click Get Captcha and wait
  await page.click('#t-load');
  console.log('CAPTCHA_REQUESTED');
  
  // Monitor captcha state
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(1000);
    
    const state = await page.evaluate(() => {
      const challenge = document.querySelector('input[name="t-challenge"]')?.value;
      const slider = document.getElementById('t-slider');
      const iframe = document.getElementById('t-frame');
      return {
        challenge: (challenge || '').substring(0, 20),
        sliderDisabled: slider?.disabled,
        sliderMax: slider?.max || '',
        hasIframe: !!iframe,
        iframeSrc: iframe?.src?.substring(0, 100) || '',
        taskContent: document.getElementById('t-task')?.textContent?.substring(0, 100) || '',
        loadBtnDisabled: document.getElementById('t-load')?.disabled,
        loadBtnText: document.getElementById('t-load')?.textContent || '',
      };
    });
    console.log(`t=${i}s ch=${state.challenge} slider=${!state.sliderDisabled} max=${state.sliderMax} iframe=${state.hasIframe}`);
    
    if (state.challenge && state.challenge.length > 5 && state.sliderDisabled === false) {
      console.log('CAPTCHA_READY!');
      // Take screenshot
      await page.screenshot({ path: '/tmp/4chan_stealth_captcha_ready.png' });
      break;
    }
    
    // If load button re-enabled, turnstile might have failed - reload
    if (!state.loadBtnDisabled && state.loadBtnText === 'Get Captcha' && i > 10) {
      console.log('Turnstile may have failed, trying to reload captcha...');
      await page.click('#t-load');
      await page.waitForTimeout(2000);
    }
  }
  
  // Final screenshot
  await page.screenshot({ path: '/tmp/4chan_stealth_final.png' });
  console.log('DONE');
  
  await browser.close();
})();
