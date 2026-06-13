const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    proxy: { server: 'http://174.137.134.182:2999' }
  });
  
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 2000 }
  });
  
  // Go to board
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('BOARD_LOADED');
  
  // Click start new thread
  const link = page.locator('#togglePostFormLink a');
  if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
    await link.click();
    await page.waitForTimeout(1000);
  }
  
  // Fill form
  await page.evaluate(() => {
    document.querySelector('input[name="sub"]').value = 'EMBYR - App gay 100% gratuite';
    document.querySelector('textarea[name="com"]').value = 'EMBYR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite de messages, ZERO comptes premium a 30€.\n\nembir.xyz\n\nDispo maintenant.';
  });
  
  // Click "Get Captcha"
  await page.click('#t-load');
  console.log('CLICKED_GET_CAPTCHA');
  
  // Wait for Turnstile to auto-solve (this can take 5-15 seconds)
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    
    const state = await page.evaluate(() => {
      const challenge = document.querySelector('input[name="t-challenge"]')?.value;
      const response = document.querySelector('input[name="t-response"]')?.value;
      const slider = document.getElementById('t-slider');
      return {
        challenge: challenge || 'EMPTY',
        response: response || 'EMPTY',
        sliderEnabled: slider ? !slider.disabled : 'NO_SLIDER',
        sliderMax: slider?.max || 'N/A',
        taskContent: document.getElementById('t-task')?.innerHTML?.substring(0, 500) || 'EMPTY',
        loadBtnDisabled: document.getElementById('t-load')?.disabled
      };
    });
    
    console.log(`t=${i}s: challenge=${state.challenge.substring(0,20)} resp_len=${state.response.length} slider=${state.sliderEnabled}`);
    
    // If we have a challenge and slider is enabled, captcha is loaded!
    if (state.challenge !== 'EMPTY' && state.sliderEnabled === true) {
      console.log('CAPTCHA_LOADED!');
      console.log('FULL_STATE:', JSON.stringify(state, null, 2));
      break;
    }
    
    // If the load button is re-enabled and challenge is still empty, captcha failed
    if (!state.loadBtnDisabled && state.challenge === 'EMPTY' && i > 5) {
      console.log('CAPTCHA_FAILED - trying to reload...');
      const btn = page.locator('#t-load');
      if (await btn.isEnabled().catch(() => false)) {
        await btn.click();
        console.log('RELOADED');
      }
    }
  }
  
  // Take screenshots
  await page.screenshot({ path: '/tmp/4chan_final_state.png', fullPage: false });
  
  // If we have a challenge, try interacting with slider
  const finalState = await page.evaluate(() => {
    const slider = document.getElementById('t-slider');
    const result = {
      challenge: document.querySelector('input[name="t-challenge"]')?.value || 'EMPTY',
      response: document.querySelector('input[name="t-response"]')?.value || 'EMPTY',
      sliderEnabled: slider ? !slider.disabled : 'NO_SLIDER',
      sliderMax: slider?.max || 'N/A',
      taskInner: document.getElementById('t-task')?.innerHTML?.substring(0, 500) || 'EMPTY',
      taskBg: document.getElementById('t-task')?.style?.backgroundImage?.substring(0, 200) || 'EMPTY',
    };
    return result;
  });
  console.log('FINAL_STATE:', JSON.stringify(finalState, null, 2));
  
  await browser.close();
})();
