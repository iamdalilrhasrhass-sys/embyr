const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('Going to register page...');
    await page.goto('https://forums.justusboys.com/login/register', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(2000);
    
    // Find the exact form structure
    const formStructure = await page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return 'No form';
      
      // Get all inputs with their full context
      const allInputs = form.querySelectorAll('input, select, textarea');
      return Array.from(allInputs).map(el => ({
        tag: el.tagName,
        type: el.type || (el.tagName === 'SELECT' ? 'select' : ''),
        name: el.name,
        id: el.id,
        className: el.className.substring(0, 40),
        required: el.required || false,
        checked: el.checked || false,
        value: el.value || '',
        // Get parent row label
        rowLabel: el.closest('.formRow') ? (el.closest('.formRow').querySelector('.formRow-label')?.innerText?.trim() || '') : '',
        visible: el.offsetParent !== null
      }));
    });
    
    console.log('Form structure:');
    formStructure.forEach((el, i) => {
      console.log(`[${i}] ${el.tagName} type="${el.type}" name="${el.name}" label="${el.rowLabel}" visible=${el.visible} required=${el.required}`);
    });
    
    // Check for the accept checkbox specifically
    const acceptInput = formStructure.find(el => el.name === 'accept' || el.rowLabel.includes('agree') || el.rowLabel.includes('terms'));
    console.log('\nAccept checkbox:', acceptInput);
    
    // Check for errors on the page
    const errors = await page.evaluate(() => {
      const errorEls = document.querySelectorAll('.formRow-error, .inputValidationError, .blockMessage--error, .blockMessage--error');
      return Array.from(errorEls).map(e => e.innerText.trim().substring(0, 200)).filter(Boolean);
    });
    console.log('Page errors:', errors);
    
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
