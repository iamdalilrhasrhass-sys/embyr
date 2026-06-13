const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  });
  const page = await ctx.newPage();
  
  // Go to /lgbt/ board
  await page.goto('https://boards.4chan.org/lgbt/', { timeout: 30000 });
  console.log('PAGE_LOADED');
  
  // Find the new thread form
  const formHtml = await page.content();
  
  // Check for new thread form
  const hasForm = formHtml.includes('name="name"') || formHtml.includes('form') || formHtml.includes('postform');
  console.log('HAS_FORM:', hasForm);
  
  // Extract form fields info
  const fields = await page.evaluate(() => {
    const forms = document.querySelectorAll('form');
    const result = [];
    forms.forEach((f, i) => {
      const inputs = f.querySelectorAll('input, textarea, button');
      inputs.forEach(inp => {
        result.push({
          formIdx: i,
          name: inp.name || '',
          id: inp.id || '',
          type: inp.type || '',
          placeholder: inp.placeholder || '',
          className: inp.className || '',
          tagName: inp.tagName
        });
      });
    });
    return result;
  });
  
  console.log('FIELDS:', JSON.stringify(fields, null, 2));
  
  // Check for captcha
  const captchaInfo = await page.evaluate(() => {
    const captchaImgs = document.querySelectorAll('img[src*="captcha"], img[src*="t_captcha"]');
    const captchaDivs = document.querySelectorAll('div[id*="captcha"], div[class*="captcha"]');
    return {
      imgs: Array.from(captchaImgs).map(i => ({ src: i.src, alt: i.alt })),
      divs: Array.from(captchaDivs).map(d => ({ id: d.id, className: d.className, innerHTML: d.innerHTML.substring(0, 300) }))
    };
  });
  
  console.log('CAPTCHA:', JSON.stringify(captchaInfo, null, 2));
  
  // Screenshot for debugging
  await page.screenshot({ path: '/tmp/4chan_form.png', fullPage: false });
  console.log('SCREENSHOT_SAVED');
  
  await browser.close();
})();
