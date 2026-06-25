#!/usr/bin/env python3
"""Debug the DOM structure of the login page more carefully."""
from playwright.sync_api import sync_playwright
import time

E = 'iamdalilrhasrhass@gmail.com'

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = b.new_context(locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(60000)
    
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
    time.sleep(6)
    
    # Fill email
    email_input = p.locator('input[name="username_or_email"]').first
    email_input.fill(E)
    time.sleep(1)
    
    # Find ALL 'Continuer' buttons and their parent hierarchy
    btns = p.evaluate("""() => {
        const buttons = document.querySelectorAll('button');
        const results = [];
        for (let b of buttons) {
            const text = (b.textContent || '').trim();
            if (text.includes('Continuer') || text.includes('Suivant') || text.includes('Next')) {
                results.push({
                    innerText: text,
                    datasetTestid: b.getAttribute('data-testid') || '',
                    role: b.getAttribute('role') || '',
                    type: b.getAttribute('type') || '',
                    disabled: b.disabled,
                    visible: b.offsetParent !== null,
                    clickable: b.offsetParent !== null && !b.disabled,
                    // Parent info
                    parentTag: b.parentElement ? b.parentElement.tagName : '',
                    parentBtnRole: b.parentElement ? b.parentElement.getAttribute('role') : '',
                    grandparentTag: b.parentElement && b.parentElement.parentElement ? b.parentElement.parentElement.tagName : '',
                });
            }
        }
        return results;
    }""")
    for btn in btns:
        print(f"  {btn}")
    
    # Also check the label for email field
    print("\n=== Labels near email input ===")
    labels = p.evaluate("""() => {
        const labels = document.querySelectorAll('label');
        return Array.from(labels).map(l => ({
            htmlFor: l.getAttribute('for') || '',
            text: (l.innerText || '').trim(),
            visible: l.offsetParent !== null,
        }));
    }""")
    for l in labels:
        print(f"  {l}")
    
    # Try clicking with different approaches
    print("\n=== Trying direct click on 'Continuer' button ===")
    
    # Approach 1: click by text
    try:
        btn = p.locator('button:has-text("Continuer")').first
        btn.click(force=True)
        time.sleep(3)
        print("  Force click succeeded")
        body = p.evaluate("() => document.body.innerText")
        print(f"  After force click[:400]: {body[:400]}")
    except Exception as e:
        print(f"  Force click failed: {e}")
    
    b.close()
