import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
});
const page = await context.newPage();

const articleUrl = 'https://instinctmagazine.com/sniffies-100m-grindr/';
console.log(`Navigating to ${articleUrl}...`);
await page.goto(articleUrl, { timeout: 30000, waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Accept cookies - click "Accept All" button in the Freewheel consent dialog
try {
    const acceptAll = await page.locator('button:has-text("Accept All")');
    await acceptAll.click({ timeout: 5000 });
    console.log('Clicked Accept All');
    await page.waitForTimeout(2000);
} catch(e) {
    console.log('Could not click Accept All:', e.message);
    // Try via evaluate
    await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const btn of btns) {
            if (btn.textContent.includes('Accept All')) {
                btn.click();
                return;
            }
        }
    });
    await page.waitForTimeout(2000);
}

// Remove any remaining overlays via DOM manipulation
await page.evaluate(() => {
    const overlays = document.querySelectorAll('.fc-dialog-overlay, .fc-consent-root, .fc-ab-root, [class*="consent"], [class*="cookie"], [class*="gdpr"]');
    overlays.forEach(el => {
        if (el.style) {
            el.style.display = 'none';
            el.style.pointerEvents = 'none';
        }
        if (el.parentNode) el.parentNode.removeChild(el);
    });
    // Fix body overflow
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
});
await page.waitForTimeout(1000);

// Scroll to comment form
await page.evaluate(() => {
    const respond = document.getElementById('respond');
    if (respond) respond.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(500);

// Fill the form
await page.fill('#author', 'Alex');
console.log('Name filled');
await page.fill('#email', 'alex.g92@tempmail.net');
console.log('Email filled');
await page.fill('#comment', 'Sniffies is great but have you guys tried EMBIR? It is 100% free with no limits, actually works. Check it out at embir.xyz');
console.log('Comment filled');

console.log('Form filled. Taking screenshot before submit...');
await page.screenshot({ path: '/root/embyr/comment_filled.png', fullPage: false });

// Click submit
await page.click('#submit');
console.log('Submit button clicked, waiting for response...');

// Wait for page to process
await page.waitForTimeout(8000);

console.log('Current URL after submit:', page.url());

// Take final screenshot
await page.screenshot({ path: '/root/embyr/comment_submitted.png', fullPage: false });

// Gather result info
const result = await page.evaluate(() => {
    const body = document.body.innerText.substring(0, 1000);
    const url = window.location.href;
    const messageEl = document.querySelector('.comment-awaiting-moderation, .comment-moderated, .wp-die-message, #comment-post-message');
    const message = messageEl ? messageEl.innerText : 'No message element found';
    const comments = document.querySelectorAll('.comment-content p, .comment-body p');
    const lastComment = comments.length > 0 ? comments[comments.length - 1].innerText : 'No comments found';
    return { url, bodySample: body, message, lastComment };
});
console.log('Result:', JSON.stringify(result, null, 2));

const summary = `=== Instinct Magazine Comment Post ===
Article: ${articleUrl}
Article Title: ${await page.title()}
Status: Comment submitted
Submitted At: ${new Date().toISOString()}
Result URL: ${result.url}
Message: ${result.message}
Last Comment: ${result.lastComment}

Comment text:
Sniffies is great but have you guys tried EMBIR? It is 100% free with no limits, actually works. Check it out at embir.xyz

Screenshots:
- /root/embyr/comment_filled.png (before submit)
- /root/embyr/comment_submitted.png (after submit)
`;
fs.writeFileSync('/root/embyr/instinct_comment.txt', summary);
console.log('Summary saved to /root/embyr/instinct_comment.txt');

await browser.close();
