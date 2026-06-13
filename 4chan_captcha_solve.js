const { chromium } = require('playwright');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    proxy: { server: 'http://174.137.134.182:2999' }
  });
  
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 2000 }
  });
  const page = await ctx.newPage();
  
  // Go to /lgbt/
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('BOARD_LOADED');
  
  // Click "Start a New Thread"
  const startLink = page.locator('#togglePostFormLink a');
  if (await startLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startLink.click();
    await page.waitForTimeout(1000);
  }
  
  // Fill form
  await page.evaluate(() => {
    const sub = document.querySelector('input[name="sub"]');
    if (sub) sub.value = 'EMBYR - App gay 100% gratuite';
    const com = document.querySelector('textarea[name="com"]');
    if (com) {
      com.value = 'EMBYR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite de messages, ZERO comptes premium a 30€.\n\nPendant que Grindr facture 30€/mois, on reste gratuit.\n\nembir.xyz\n\nDispo maintenant.';
    }
  });
  console.log('FORM_FILLED');
  
  // Click "Get Captcha"
  const getCaptchaBtn = page.locator('#t-load');
  if (await getCaptchaBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await getCaptchaBtn.click();
    console.log('CLICKED_GET_CAPTCHA');
  }
  
  // Wait for iframe to load and message to come back
  await page.waitForTimeout(5000);
  
  // Take screenshot of captcha area
  await page.screenshot({ path: '/tmp/4chan_captcha_loaded.png', fullPage: false });
  console.log('SCREENSHOT_CAPTCHA');
  
  // Check the state now
  const state = await page.evaluate(() => {
    const root = document.getElementById('t-root');
    if (!root) return { error: 'no t-root' };
    
    return {
      html: root.innerHTML.substring(0, 2000),
      // Check for iframe
      iframe: document.getElementById('t-frame') ? {
        src: document.getElementById('t-frame').src,
        visible: true
      } : 'NO_IFRAME',
      // Check slider
      slider: document.getElementById('t-slider') ? {
        min: document.getElementById('t-slider').min,
        max: document.getElementById('t-slider').max,
        value: document.getElementById('t-slider').value,
        disabled: document.getElementById('t-slider').disabled
      } : 'NO_SLIDER',
      // Hidden fields
      challenge: document.querySelector('input[name="t-challenge"]')?.value || 'NO_CHALLENGE',
      response: document.querySelector('input[name="t-response"]')?.value || 'NO_RESPONSE',
      // Dialog (ext mode)
      dialog: document.getElementById('js-t-ext-cnt') ? {
        open: document.getElementById('js-t-ext-cnt').open,
        html: document.getElementById('js-t-ext-cnt').innerHTML.substring(0, 1000)
      } : 'NO_DIALOG',
      // Task content
      task: document.getElementById('t-task') ? {
        html: document.getElementById('t-task').innerHTML.substring(0, 1000),
        bgImage: document.getElementById('t-task').style.backgroundImage
      } : 'NO_TASK'
    };
  });
  console.log('CAPTCHA_STATE:', JSON.stringify(state, null, 2));
  
  // Try to see the captcha iframe content
  const iframe = await page.$('#t-frame');
  if (iframe) {
    const frame = await iframe.contentFrame();
    if (frame) {
      const frameContent = await frame.evaluate(() => document.body ? document.body.innerHTML.substring(0, 2000) : 'NO_CONTENT');
      console.log('FRAME_CONTENT:', frameContent);
      
      // Take screenshot of iframe
      await frame.screenshot({ path: '/tmp/4chan_captcha_iframe.png' });
      console.log('IFRAME_SCREENSHOT');
    } else {
      console.log('NO_FRAME_ACCESS (cross-origin)');
    }
  }
  
  // Try clicking the slider at various positions and see what happens
  // The slider goes from 0 to max (number of items)
  const max = await page.evaluate(() => {
    const slider = document.getElementById('t-slider');
    return slider ? parseInt(slider.max) : 0;
  });
  console.log('SLIDER_MAX:', max);
  
  // Also check if there's a dialog (ext mode with images/text)
  const hasDialog = await page.evaluate(() => {
    return !!document.getElementById('js-t-ext-cnt');
  });
  console.log('HAS_EXT_DIALOG:', hasDialog);
  
  // If there's a dialog with text input, type something
  if (hasDialog) {
    const dialogHtml = await page.evaluate(() => {
      const d = document.getElementById('js-t-ext-cnt');
      return d ? d.innerHTML : 'NO_DIALOG';
    });
    console.log('DIALOG_HTML:', dialogHtml);
  }
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
