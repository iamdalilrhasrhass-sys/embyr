const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const result = { success: false, steps: [], screenshot: null, error: null };

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate to the forum
    result.steps.push('Navigating to JustUsBoys forum...');
    console.log('Navigating to forum...');
    await page.goto('https://www.justusboys.com/forum/forums/38-Gay-Discussion', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);
    console.log('Page loaded, title:', await page.title());
    result.steps.push(`Page title: ${await page.title()}`);

    // Take screenshot of forum page
    await page.screenshot({ path: '/root/embyr/forum_page.png', fullPage: false });
    result.screenshot = '/root/embyr/forum_page.png';

    // Step 2: Find "Post New Thread" button
    result.steps.push('Looking for Post New Thread button...');
    console.log('Looking for post button...');
    
    // Try various selectors for the post new thread button
    const selectors = [
      'a[href*="post-thread"]',
      'a:has-text("Post New Thread")',
      'a:has-text("New Thread")',
      'a.PostNewThread',
      '.PostNewThread a',
      'a.button--primary:has-text("Post")',
      'a.button:has-text("Post")',
      '[data-content="post-thread"] a',
      '.buttonGroup a:has-text("Post")',
      'a[href*="threads/add"]',
      'a[href*="create-thread"]',
      'a[href*="new-thread"]',
      'a[href*="newthread"]',
      'a[href*="new_topic"]',
      'a[href*="newpost"]',
      'a[href*="new_post"]'
    ];

    let postButton = null;
    for (const sel of selectors) {
      try {
        const btn = await page.$(sel);
        if (btn) {
          postButton = btn;
          console.log('Found button with selector:', sel);
          result.steps.push(`Found Post New Thread button: ${sel}`);
          break;
        }
      } catch(e) {}
    }

    // Also try looking at the page HTML to find the right selector
    if (!postButton) {
      // Log all links visible
      const links = await page.$$eval('a', els => els.map(a => ({ text: a.innerText.trim().substring(0, 50), href: a.href.substring(0, 120) })).filter(l => l.text));
      console.log('All links on page:');
      links.forEach(l => console.log(`  "${l.text}" -> ${l.href}`));
      result.steps.push(`Found ${links.length} links, searching for post thread...`);
      
      // Look for link containing "Post" or "New Thread" or "thread"
      const target = links.find(l => 
        l.text.toLowerCase().includes('post new thread') || 
        l.text.toLowerCase().includes('new thread') ||
        l.text.toLowerCase().includes('post thread') ||
        l.text.toLowerCase().includes('create thread')
      );
      
      if (target) {
        console.log('Found via link text:', target.text);
        result.steps.push(`Found link: "${target.text}" -> ${target.href}`);
        await page.goto(target.href, { waitUntil: 'networkidle', timeout: 30000 });
      } else {
        // Try clicking any link that says "Post" 
        const postWord = links.find(l => l.text.toLowerCase().includes('post'));
        if (postWord) {
          console.log('Clicking link with "Post":', postWord.text);
          result.steps.push(`Clicking: "${postWord.text}" -> ${postWord.href}`);
          // Navigate directly
          await page.goto(postWord.href, { waitUntil: 'networkidle', timeout: 30000 });
        } else {
          // Try navigating directly to post thread URL
          console.log('Trying direct post thread URL...');
          result.steps.push('Trying direct post-thread URL...');
          
          // Based on XenForo, typical URL pattern
          await page.goto('https://www.justusboys.com/forum/post-thread?node_id=38', {
            waitUntil: 'networkidle',
            timeout: 30000
          }).catch(async () => {
            await page.goto('https://www.justusboys.com/forum/threads/create?node_id=38', {
              waitUntil: 'networkidle',
              timeout: 30000
            }).catch(async () => {
              await page.goto('https://www.justusboys.com/forum/forums/38/add', {
                waitUntil: 'networkidle',
                timeout: 30000
              });
            });
          });
        }
      }
    }

    if (postButton) {
      await postButton.click();
      await page.waitForTimeout(3000);
    }

    console.log('Current URL:', page.url());
    result.steps.push(`Current URL: ${page.url()}`);

    // Step 3: Fill in the thread form
    result.steps.push('Filling in thread form...');
    
    // Check if we need to log in (guest posting might not be allowed)
    const loginForm = await page.$('input[name="login"], input[name="username"], form[action*="login"]');
    if (loginForm) {
      result.steps.push('Login form detected - guest posting may not be allowed');
      console.log('Login form detected. Guest posting might not be allowed on this forum.');
      
      await page.screenshot({ path: '/root/embyr/login_page.png', fullPage: false });
      
      // Try to find any guest posting option or anonymous posting
      result.steps.push('Login required - cannot post as guest');
      throw new Error('Guest posting not allowed - login page detected');
    }

    // Try to find and fill the title field
    const titleSelectors = [
      'input[name="title"]',
      'input[name="thread_title"]',
      'input[placeholder*="Title"]',
      'input.title',
      'input[type="text"][class*="title"]',
      'input:not([type="hidden"])'
    ];

    let titleInput = null;
    for (const sel of titleSelectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          titleInput = el;
          console.log('Found title input with:', sel);
          result.steps.push(`Found title input: ${sel}`);
          break;
        }
      } catch(e) {}
    }

    if (titleInput) {
      await titleInput.fill('Has anyone tried EMBYR? Found a completely free Grindr alternative');
      result.steps.push('Filled title');
    } else {
      result.steps.push('Could not find title input');
    }

    // Try to find the message/body editor
    const bodySelectors = [
      'textarea[name="message"]',
      'textarea[name="message_html"]',
      '.fr-box textarea',
      '.fr-element',
      '[contenteditable="true"]',
      'textarea',
      '.message-body textarea',
      'div[role="textbox"]',
      'textarea[name="content"]'
    ];

    let bodyInput = null;
    for (const sel of bodySelectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          bodyInput = el;
          console.log('Found body input with:', sel);
          result.steps.push(`Found body input: ${sel}`);
          break;
        }
      } catch(e) {}
    }

    if (bodyInput) {
      const tag = await bodyInput.evaluate(el => el.tagName);
      const contentType = await bodyInput.evaluate(el => el.getAttribute('contenteditable'));
      
      const message = `I've been testing this new app called EMBYR (embir.xyz) for the past week and honestly I'm pretty impressed so far. It's a gay dating app that's completely free - no paywalls, no "gold" features, no limits on who you can talk to. Unlike Grindr where you basically need a subscription to actually use it properly these days.\n\nHas anyone else tried it? The user base is still growing obviously but it seems legit. Just curious what other people think.`;
      
      if (contentType === 'true' || tag === 'DIV') {
        await bodyInput.fill(message);
        // For contentEditable, we might need to press keyboard
        await page.keyboard.type(message);
      } else {
        await bodyInput.fill(message);
      }
      result.steps.push('Filled message body');
    } else {
      result.steps.push('Could not find body input');
    }

    // Take screenshot of the filled form
    await page.screenshot({ path: '/root/embyr/filled_form.png', fullPage: true });
    result.steps.push('Took screenshot of filled form');

    // Step 4: Try to find and click submit button
    result.steps.push('Looking for submit button...');
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Post")',
      'button:has-text("Create")',
      'button:has-text("Submit")',
      'button:has-text("Save")',
      'button.button--primary',
      'a.button--primary',
      '.formSubmitRow-controls button',
      '.submitRow button'
    ];

    let submitBtn = null;
    for (const sel of submitSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn) {
          submitBtn = btn;
          console.log('Found submit button with:', sel);
          result.steps.push(`Found submit button: ${sel}`);
          break;
        }
      } catch(e) {}
    }

    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(5000);
      console.log('Submitted thread, new URL:', page.url());
      result.steps.push(`After submit URL: ${page.url()}`);
      
      await page.screenshot({ path: '/root/embyr/post_result.png', fullPage: false });
      result.screenshot = '/root/embyr/post_result.png';
    } else {
      result.steps.push('Could not find submit button - taking screenshot of what we have');
      await page.screenshot({ path: '/root/embyr/no_submit.png', fullPage: false });
    }

    result.success = true;

  } catch (err) {
    console.error('Error:', err.message);
    result.error = err.message;
    try {
      await page.screenshot({ path: '/root/embyr/error_state.png', fullPage: false });
    } catch(e) {}
  }

  // Save result
  const output = [
    `Success: ${result.success}`,
    `Screenshot: ${result.screenshot}`,
    `Error: ${result.error || 'none'}`,
    '',
    'Steps:',
    ...result.steps.map((s, i) => `  ${i+1}. ${s}`),
    ''
  ].join('\n');

  fs.writeFileSync('/root/embyr/justusboys_post.txt', output);
  console.log('\n=== RESULT ===');
  console.log(output);

  await browser.close();
  process.exit(0);
})();
