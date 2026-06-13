const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({
    headless: false,
    executablePath: '/root/.cache/camoufox/camoufox',
    args: ['-no-remote', '-display', ':99']
  });
  
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 2000 },
    proxy: { server: 'http://174.137.134.182:2999' }
  });
  const page = await ctx.newPage();
  
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
    document.querySelector('input[name="sub"]').value = 'EMBIR - App gay 100% gratuite';
    document.querySelector('textarea[name="com"]').value = 'EMBIR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite de messages, ZERO comptes premium a 30€.\n\nembir.xyz\n\nDispo maintenant.';
  });
  
  // Click "Get Captcha"
  const loadBtn = page.locator('#t-load');
  await loadBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await loadBtn.click();
  console.log('CLICKED_GET_CAPTCHA');
  
  // Wait and check captcha state
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    
    const state = await page.evaluate(() => {
      const challenge = document.querySelector('input[name="t-challenge"]')?.value;
      const slider = document.getElementById('t-slider');
      return {
        challenge: challenge || 'EMPTY',
        sliderEnabled: slider ? !slider.disabled : 'NO_SLIDER',
        sliderMax: slider?.max || 'N/A',
      };
    });
    
    const indicator = state.challenge !== 'EMPTY' ? '✓' : '.';
    console.log(`t=${i}s ${indicator} challenge=${state.challenge.substring(0,16)} slider=${state.sliderEnabled}`);
    
    if (state.challenge !== 'EMPTY' && state.sliderEnabled === true) {
      console.log('CAPTCHA_LOADED!');
      await page.screenshot({ path: '/tmp/4chan_camoufox_captcha.png', fullPage: false });
      
      // Try to solve: slide to different positions and submit
      const max = parseInt(state.sliderMax) || 10;
      console.log(`Slider max: ${max}, trying all positions...`);
      
      // Try each slider position
      for (let pos = 1; pos <= max; pos++) {
        await page.evaluate((p) => {
          const slider = document.getElementById('t-slider');
          slider.value = p;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
        }, pos);
        await page.waitForTimeout(100);
        
        // Check what happens when we set this position
        // Click next
        const nextBtn = page.locator('#t-next');
        if (await nextBtn.isEnabled().catch(() => false)) {
          // Get current task content for this position
          const taskContent = await page.evaluate(() => {
            return document.getElementById('t-task')?.innerHTML?.substring(0, 100) || 'empty';
          });
          console.log(`  pos=${pos}: task=${taskContent.substring(0,80)}`);
        }
      }
      
      // Try submitting with the current values
      const submitBtn = page.locator('input[type="submit"][value="Post"]');
      await submitBtn.click();
      await page.waitForTimeout(5000);
      
      const result = await page.evaluate(() => ({
        url: window.location.href,
        title: document.title,
        text: document.body?.innerText?.substring(0, 500) || ''
      }));
      console.log('SUBMIT_RESULT:', result.text);
      break;
    }
  }
  
  await page.screenshot({ path: '/tmp/4chan_camoufox_final.png', fullPage: false });
  await browser.close();
})();
