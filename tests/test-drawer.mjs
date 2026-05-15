import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
const page = await context.newPage();

await page.goto('http://localhost:3100/membres', { waitUntil: 'networkidle', timeout: 15000 });

// Find drawer trigger
const btns = await page.$$('button');
let found = false;
for (const btn of btns) {
  const text = await btn.textContent();
  if (text?.includes('☰')) {
    await btn.click();
    await page.waitForTimeout(800);
    found = true;
    break;
  }
}

if (found) {
  const drawerContent = await page.evaluate(() => {
    const nav = document.querySelector('nav.mobile-drawer, nav[class*="drawer"]');
    if (!nav) return 'drawer not visible';
    const links = nav.querySelectorAll('a[href]');
    return Array.from(links).map(a => ({
      href: a.getAttribute('href'),
      label: a.textContent?.trim().slice(0, 30),
    }));
  });
  console.log('Drawer found! Links:');
  console.log(JSON.stringify(drawerContent, null, 2));
  
  // Check for dead links
  const deadLinks = drawerContent.filter(l => 
    l.href?.includes('decouvrir') || 
    l.href?.includes('dashbord') || 
    l.href?.includes('ambassadrice')
  );
  if (deadLinks.length > 0) console.log('⚠️ DEAD LINKS:', deadLinks);
  else console.log('✅ No dead links');
} else {
  console.log('❌ Drawer trigger not found on /membres');
}

await browser.close();
