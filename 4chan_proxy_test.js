const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');

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
  
  // 1. Check IP through proxy
  await page.goto('https://api.ipify.org?format=json', { timeout: 15000 });
  const ip = await page.evaluate(() => document.body.innerText);
  console.log('PROXY_IP:', ip);
  
  // 2. Go to 4chan /lgbt/
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('BOARD_LOADED');
  
  // 3. Click "Start a New Thread" if needed
  const startLink = page.locator('#togglePostFormLink a');
  if (await startLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startLink.click();
    await page.waitForTimeout(1500);
  }
  
  // 4. Fill form via evaluate
  await page.evaluate(() => {
    const sub = document.querySelector('input[name="sub"]');
    if (sub) sub.value = 'EMBIR - App gay 100% gratuite';
    
    const com = document.querySelector('textarea[name="com"]');
    if (com) {
      com.value = 'EMBIR est une app de rencontre gay 100% gratuite.\n\nPlus de 60 villes, traduit en 25 langues, swipe Tinder-like.\nZERO pub, ZERO limite de messages, ZERO comptes premium a 30€.\n\nPendant que Grindr facture 30€/mois, on reste gratuit.\n\nembir.xyz\n\nDispo maintenant.';
    }
  });
  console.log('FORM_FILLED');
  
  // 5. Wait for dynamic captcha to load
  await page.waitForTimeout(5000);
  
  // 6. Check what's in the captcha area
  const captchaState = await page.evaluate(() => {
    const root = document.getElementById('t-root');
    return {
      tRoot: root ? root.innerHTML.substring(0, 1000) : 'NO_T_ROOT',
      t_root_html: root ? root.outerHTML.substring(0, 1000) : 'NO_ELEMENT',
      // Check for any iframes (recaptcha etc)
      iframes: Array.from(document.querySelectorAll('iframe')).map(f => ({ src: f.src, id: f.id })),
      // Check all scripts that might be captcha-related
      scripts: Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src,
        text: s.textContent ? s.textContent.substring(0, 200) : ''
      })).filter(s => s.src.includes('captcha') || s.text.includes('captcha') || s.text.includes('t_captcha')),
      // Check page source for captcha mentions
      allText: document.body ? document.body.innerText.substring(0, 500) : ''
    };
  });
  console.log('CAPTCHA_STATE:', JSON.stringify(captchaState, null, 2));
  
  // 7. Screenshot the form
  await page.screenshot({ path: '/tmp/4chan_proxy_form.png', fullPage: false });
  console.log('FORM_SCREENSHOT');
  
  // 8. Try submitting
  const submitBtn = page.locator('input[type="submit"][value="Post"]');
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('CLICKING_SUBMIT');
    await submitBtn.click();
    await page.waitForTimeout(10000);
    
    const result = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body ? document.body.innerText.substring(0, 2000) : 'NO_BODY',
        captchaNow: document.getElementById('t-root')?.innerHTML?.substring(0, 500) || 'NO_T_ROOT'
      };
    });
    console.log('SUBMIT_RESULT:', JSON.stringify(result, null, 2));
    await page.screenshot({ path: '/tmp/4chan_proxy_submit.png', fullPage: false });
    
    // If there's a captcha image, try to solve it
    // Check for any img elements that might be the captcha
    const imgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(i => i.complete && i.naturalWidth > 0 && i.naturalHeight > 0)
        .map(i => ({ src: i.src, w: i.naturalWidth, h: i.naturalHeight }));
    });
    console.log('IMAGES:', JSON.stringify(imgs, null, 2));
  }
  
  await page.waitForTimeout(2000);
  
  // Final check
  const final = await page.evaluate(() => ({
    url: window.location.href,
    title: document.title,
    text: document.body ? document.body.innerText.substring(0, 1000) : ''
  }));
  console.log('FINAL:', JSON.stringify(final, null, 2));
  
  await browser.close();
})();
