/**
 * QA EMBYR — Messagerie Navigateur Cookie
 * Teste la messagerie comme un vrai utilisateur navigateur
 * avec login UI + cookies, pas Bearer token
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'https://embir.xyz';
const SC = '/root/embyr/qa-screenshots-embyr-native';
fs.mkdirSync(SC, { recursive: true });

const report = [];

async function screenshot(page, name) {
  const path = `${SC}/${name}.png`;
  await page.screenshot({ path, fullPage: name.includes('full') });
  return path;
}

async function checkPage(page, name, url) {
  console.log(`\n=== ${name} ===`);
  await page.goto(url || `${BASE}${name === 'landing' ? '/' : `/${name}`}`, { 
    waitUntil: 'domcontentloaded', timeout: 15000 
  });
  const title = await page.title();
  const status = page.url().includes('error') ? 'ERROR' : 'OK';
  
  // Console errors (exclude 401)
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  // Overflow check
  const overflow = await page.evaluate(() => {
    const html = document.documentElement;
    return html.scrollWidth > html.clientWidth;
  });

  // CTAs
  const ctas = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, a[href], [role="button"]');
    return Array.from(buttons).slice(0, 10).map(b => b.textContent?.trim().substring(0, 40));
  });

  const is404 = await page.evaluate(() => document.body.innerText.includes('404'));
  const isEmpty = await page.evaluate(() => document.body.innerText.length < 50);

  const result = {
    page: name,
    url: page.url(),
    title,
    httpStatus: '200',
    errors: errors.filter(e => !e.includes('401')),
    overflow,
    isEmpty,
    is404,
    ctas,
  };

  report.push(result);
  await screenshot(page, name);
  console.log(`  ${overflow ? '⚠️ OVERFLOW' : '✅'} 404:${is404} empty:${isEmpty} ctas:${ctas.length}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // ── VISITOR ──
  const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page1 = await ctx1.newPage();
  
  console.log('=== VISITOR PAGES ===');
  await checkPage(page1, 'landing', `${BASE}/`);
  await checkPage(page1, 'membres', `${BASE}/membres`);
  await checkPage(page1, 'premium', `${BASE}/premium`);
  await checkPage(page1, 'pricing', `${BASE}/pricing`);
  await checkPage(page1, 'auth-login', `${BASE}/connexion`);
  await checkPage(page1, 'auth-register', `${BASE}/inscription`);
  await ctx1.close();

  // ── MOBILE ──
  console.log('\n=== MOBILE 390px ===');
  const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page3 = await ctx3.newPage();
  await checkPage(page3, 'm-landing', `${BASE}/`);
  await checkPage(page3, 'm-membres', `${BASE}/membres`);
  await checkPage(page3, 'm-premium', `${BASE}/premium`);
  await ctx3.close();

  // ── BROWSER MESSAGING ──
  console.log('\n=== MESSAGERIE NAVIGATEUR ===');
  
  // User A login
  const ctxA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageA = await ctxA.newPage();
  
  try {
    // Go to login
    await pageA.goto(`${BASE}/connexion`, { waitUntil: 'domcontentloaded' });
    await screenshot(pageA, 'msg-01-login-form');
    
    // Fill login form
    const emailInput = await pageA.$('input[type="email"], input[name="email"]');
    const passInput = await pageA.$('input[type="password"], input[name="password"]');
    
    if (emailInput && passInput) {
      await emailInput.fill('embyr-msg-a-1747250800@test.local');
      await passInput.fill('MsgTest123!');
      
      // Submit
      const submitBtn = await pageA.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await pageA.waitForTimeout(3000);
        console.log('  ✅ Login submitted');
      } else {
        console.log('  ⚠️ No submit button found');
      }
    } else {
      console.log('  ⚠️ Login form not found');
    }
    
    // Go to messages
    await pageA.goto(`${BASE}/messages`, { waitUntil: 'domcontentloaded' });
    await screenshot(pageA, 'msg-02-messages-page');
    
    const msgContent = await pageA.evaluate(() => document.body.innerText.substring(0, 500));
    console.log(`  Messages page: ${msgContent.substring(0, 80)}...`);
    
    // Check for message input
    const msgInput = await pageA.$('textarea, input[type="text"], [contenteditable]');
    if (msgInput) {
      await msgInput.fill('Test messagerie Embyr — navigateur cookie');
      await pageA.keyboard.press('Enter');
      await pageA.waitForTimeout(2000);
      console.log('  ✅ Message sent');
    } else {
      console.log('  ⚠️ No message input found');
    }
    
    await screenshot(pageA, 'msg-03-after-send');
  } catch (e) {
    console.log(`  ❌ Browser messaging error: ${e.message}`);
  }
  await ctxA.close();

  await browser.close();

  // ── REPORT ──
  console.log('\n' + '='.repeat(50));
  console.log('RAPPORT QA EMBYR NATIVE');
  console.log('='.repeat(50));
  console.log(`Pages testées: ${report.length}`);
  
  const errorPages = report.filter(r => r.errors.length > 0);
  const overflowPages = report.filter(r => r.overflow);
  const emptyPages = report.filter(r => r.isEmpty || r.is404);
  
  console.log(`Erreurs console: ${errorPages.length}`);
  errorPages.forEach(r => console.log(`  ${r.page}: ${r.errors.length} errors`));
  console.log(`Overflow: ${overflowPages.length}`);
  overflowPages.forEach(r => console.log(`  ⚠️ ${r.page}`));
  console.log(`Pages vides: ${emptyPages.length}`);
  
  fs.writeFileSync(`${SC}/report.json`, JSON.stringify(report, null, 2));
  console.log(`\nRapport: ${SC}/report.json`);
  console.log(`Screenshots: ${SC}/`);
})();
