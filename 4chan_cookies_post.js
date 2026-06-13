const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Load cookies from flaresolverr
  const cookiesJson = JSON.parse(fs.readFileSync('/tmp/4chan_cf_cookies.json', 'utf8'));
  console.log('Loaded cookies:', Object.keys(cookiesJson).join(', '));
  
  // Launch with proxy
  const browser = await chromium.launch({
    headless: true,
    proxy: { server: 'http://174.137.134.182:2999' }
  });
  
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 2000 }
  });
  
  // Set cookies from flaresolverr
  for (const [name, info] of Object.entries(cookiesJson)) {
    try {
      await ctx.addCookies([{
        name,
        value: info.value,
        domain: info.domain || '.4chan.org',
        path: '/'
      }]);
    } catch(e) {
      console.log(`Cookie set error for ${name}: ${e.message.substring(0,50)}`);
    }
  }
  
  const page = await ctx.newPage();
  
  // Navigate to board
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('BOARD_LOADED');
  
  // Click "Start a New Thread"
  const link = page.locator('#togglePostFormLink a');
  await link.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  if (await link.isVisible().catch(() => false)) {
    await link.click();
    await page.waitForTimeout(1000);
  }
  
  // Fill form
  await page.evaluate(() => {
    document.querySelector('input[name="sub"]').value = 'EMBYR - App gay 100% gratuite';
    document.querySelector('textarea[name="com"]').value = 'EMBYR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite de messages, ZERO comptes premium a 30€.\n\nPendant que Grindr facture 30€/mois, on reste gratuit.\n\nembir.xyz\n\nDispo maintenant.';
  });
  console.log('FORM_FILLED');
  
  // Click "Get Captcha"
  await page.click('#t-load');
  console.log('CAPTCHA_REQUESTED');
  
  // Monitor captcha loading
  let captchaLoaded = false;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    
    const state = await page.evaluate(() => {
      const challenge = document.querySelector('input[name="t-challenge"]')?.value;
      const response = document.querySelector('input[name="t-response"]')?.value;
      const slider = document.getElementById('t-slider');
      const loadBtn = document.getElementById('t-load');
      const taskContent = document.getElementById('t-task')?.textContent || '';
      return {
        challenge: challenge || '',
        responseLen: (response || '').length,
        sliderDisabled: slider?.disabled,
        sliderMax: slider?.max || '',
        loadBtnDisabled: loadBtn?.disabled,
        loadBtnText: loadBtn?.textContent || '',
        task: taskContent.substring(0, 100)
      };
    });
    
    const indicator = state.challenge ? '✓' : '.';
    console.log(`t=${i}s ${indicator} ch=${state.challenge.substring(0,12)} resp=${state.responseLen} slider=${!state.sliderDisabled}`);
    
    if (state.challenge && state.sliderDisabled === false) {
      console.log('CAPTCHA_READY!');
      console.log('State:', JSON.stringify(state, null, 2));
      captchaLoaded = true;
      
      // Try to solve: slide to each position
      const max = parseInt(state.sliderMax) || 5;
      console.log(`Slider max: ${max}, trying positions...`);
      
      for (let pos = 1; pos <= max; pos++) {
        await page.evaluate((p) => {
          const slider = document.getElementById('t-slider');
          slider.value = p;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
        }, pos);
        await page.waitForTimeout(200);
        
        const nextEnabled = await page.evaluate(() => {
          return !document.getElementById('t-next')?.disabled;
        });
        
        if (nextEnabled) {
          console.log(`  pos=${pos}: NEXT IS ENABLED! This might be the answer.`);
          
          // Try submitting this position
          const nextBtn = page.locator('#t-next');
          await nextBtn.click();
          await page.waitForTimeout(1000);
          
          // Check if there are more tasks
          const moreTasks = await page.evaluate(() => {
            const nextBtn = document.getElementById('t-next');
            return {
              disabled: nextBtn?.disabled,
              text: nextBtn?.textContent || ''
            };
          });
          console.log(`  After next: ${moreTasks.text}`);
        }
      }
      
      // Try submitting
      const submitBtn = page.locator('input[type="submit"][value="Post"]');
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(5000);
        
        const result = await page.evaluate(() => ({
          url: window.location.href,
          text: document.body?.innerText?.substring(0, 500) || ''
        }));
        console.log('SUBMIT_RESULT:', result.text);
      }
      
      break;
    }
    
    // If load button re-enabled, try again
    if (!state.loadBtnDisabled && state.loadBtnText === 'Get Captcha' && i > 5) {
      console.log('Retrying captcha load...');
      await page.click('#t-load');
    }
  }
  
  if (!captchaLoaded) {
    console.log('CAPTCHA_TIMEOUT - taking screenshot for debug');
    await page.screenshot({ path: '/tmp/4chan_final_state.png' });
    
    const debug = await page.evaluate(() => {
      return {
        url: window.location.href,
        tRoot: document.getElementById('t-root')?.innerHTML?.substring(0, 500) || 'NO_ROOT',
        iframe: document.getElementById('t-frame')?.src || 'NO_IFRAME',
        cfCookie: document.cookie.includes('cf_clearance') ? 'YES' : 'NO'
      };
    });
    console.log('DEBUG:', JSON.stringify(debug, null, 2));
  }
  
  await browser.close();
})();
