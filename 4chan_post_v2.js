const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');

const SUBJECT = "EMBIR - L'app gay 100% gratuite qui cartonne en Europe";
const MESSAGE = `EMBIR c'est quoi ?

L'app de rencontre gay 100% gratuite. Pas de pub, pas de limite de messages, pas de comptes premium a 30€/mois.

Ce qui change :
- Tinder-like (swipe)
- +60 villes deja couvertes
- Traduit en 25 langues
- Pas de bullshit Grindr

Pourquoi c'est gratuit ? Parce que le marche des apps gay est un oligopole qui abuse. Grindr c'est 30€/mois pour des fonctions de base. On veut casser ca.

embir.xyz

Dispo maintenant.`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  });
  const page = await ctx.newPage();
  
  // Go to /lgbt/ board
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000, waitUntil: 'networkidle' });
  console.log('PAGE_LOADED');
  
  // Fill the form
  await page.fill('input[name="sub"]', SUBJECT);
  console.log('SUBJECT_FILLED');
  
  await page.fill('textarea[name="com"]', MESSAGE);
  console.log('MESSAGE_FILLED');

  // Wait for captcha to load (it loads dynamically)
  await page.waitForTimeout(3000);
  
  // Check for captcha image
  const captchaElements = await page.evaluate(() => {
    // Check various possible captcha selectors
    const selectors = [
      'img[src*="captcha"]',
      'img[src*="t_captcha"]', 
      '#t-captcha img',
      '.t-captcha img',
      'img[src*="recaptcha"]',
      '#recaptcha iframe',
      '.g-recaptcha iframe',
      'img[alt*="captcha"]',
      'img[alt*="CAPTCHA"]'
    ];
    
    const results = {};
    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      if (els.length > 0) {
        results[sel] = Array.from(els).map(el => ({
          src: el.src || '',
          alt: el.alt || '',
          width: el.width || el.offsetWidth,
          height: el.height || el.offsetHeight,
          id: el.id || '',
          className: el.className || ''
        }));
      }
    }
    
    // Also get all images on the page
    const allImgs = document.querySelectorAll('img');
    results.all_images = Array.from(allImgs).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width || img.offsetWidth,
      height: img.height || img.offsetHeight,
      id: img.id || '',
      className: img.className || '',
      rect: img.getBoundingClientRect ? {
        top: img.getBoundingClientRect().top,
        left: img.getBoundingClientRect().left,
        width: img.getBoundingClientRect().width,
        height: img.getBoundingClientRect().height
      } : null
    }));
    
    return results;
  });
  
  console.log('CAPTCHA_ELEMENTS:', JSON.stringify(captchaElements, null, 2));
  
  // Take a full screenshot to see what's there
  await page.screenshot({ path: '/tmp/4chan_full.png', fullPage: false });
  console.log('FULL_SCREENSHOT');
  
  // Also check the HTML of the form area specifically
  const formArea = await page.evaluate(() => {
    const form = document.querySelector('form[name="post"]');
    if (!form) return 'NO_FORM';
    
    // Get the form and its children as HTML
    const formDivs = form.querySelectorAll('table tr, div');
    const results = [];
    formDivs.forEach((el, i) => {
      if (i < 20) {  // limit to first 20
        results.push({
          tag: el.tagName,
          id: el.id || '',
          className: el.className || '',
          innerHTML: el.innerHTML.substring(0, 200)
        });
      }
    });
    return results;
  });
  
  console.log('FORM_AREA:', JSON.stringify(formArea, null, 2));
  
  // Try to click submit and see what happens
  const submitBtn = await page.$('input[type="submit"]');
  if (submitBtn) {
    console.log('SUBMIT_BTN_FOUND');
    // Get the captcha image manually before submit
    await page.waitForTimeout(1000);
    
    // Take a screenshot of the form area specifically
    const formElement = await page.$('form[name="post"]');
    if (formElement) {
      await formElement.screenshot({ path: '/tmp/4chan_form_area.png' });
      console.log('FORM_AREA_SCREENSHOT');
    }
    
    // Try submit
    await submitBtn.click();
    await page.waitForTimeout(5000);
    
    // Check what happened
    const afterSubmit = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyText: document.body ? document.body.innerText.substring(0, 2000) : 'NO_BODY',
        error: document.querySelector('.errmsg, .error, [class*="error"], [id*="error"]')?.innerText || 'NO_ERROR'
      };
    });
    console.log('AFTER_SUBMIT:', JSON.stringify(afterSubmit, null, 2));
    
    await page.screenshot({ path: '/tmp/4chan_after_submit.png' });
    console.log('AFTER_SUBMIT_SCREENSHOT');
  }
  
  await browser.close();
  console.log('DONE');
})();
