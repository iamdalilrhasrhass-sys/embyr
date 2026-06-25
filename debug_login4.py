#!/usr/bin/env python3
"""Debug login with careful DOM interaction."""
from playwright.sync_api import sync_playwright
import time

E = 'iamdalilrhasrhass@gmail.com'
PWD = 'Champigny-89'

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = b.new_context(locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(60000)
    
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
    time.sleep(5)
    
    # Count articles/forms to understand the layout
    layout = p.evaluate("""() => {
        // Get the structure
        const divs = document.querySelectorAll('div.css-175oi2r');
        for (let i = 0; i < Math.min(divs.length, 20); i++) {
            const d = divs[i];
            const style = window.getComputedStyle(d);
            if (d.offsetWidth > 100 && d.offsetHeight > 100) {
                console.log(`Div ${i}: w=${d.offsetWidth} h=${d.offsetHeight} children=${d.children.length}`);
            }
        }
        // Also get the forms
        const forms = document.querySelectorAll('form');
        console.log(`Forms found: ${forms.length}`);
        for (let f of forms) {
            const rect = f.getBoundingClientRect();
            console.log(`Form: w=${rect.width} h=${rect.height} top=${rect.top} inputs=${f.querySelectorAll('input').length}`);
            const inputs = f.querySelectorAll('input[name="username_or_email"]');
            for (let inp of inputs) {
                console.log(`  Input: w=${inp.offsetWidth} h=${inp.offsetHeight} visible=${inp.offsetParent !== null}`);
            }
            const btns = f.querySelectorAll('button[type="submit"]');
            for (let btn of btns) {
                console.log(`  Submit btn: w=${btn.offsetWidth} h=${btn.offsetHeight} visible=${btn.offsetParent !== null} text='${(btn.textContent || '').trim()}'`);}
        }
        
        // Try direct DOM manipulation - fire events on the input
        const emailInput = document.querySelector('input[name="username_or_email"]');
        if (emailInput) {
            // Check if there's a form ancestor
            const form = emailInput.closest('form');
            console.log(`Email input form: ${form ? 'has form' : 'no form'}`);
            
            // Try different approaches to submit
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(emailInput, '${E}');
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            emailInput.dispatchEvent(new Event('change', { bubbles: true }));
            emailInput.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log('Native setter called on email input');
        }
        
        return 'done';
    }""")
    
    time.sleep(2)
    
    # Now try to find the submit button that's actually in the right form
    print("\n=== Find the submit buttons in visible forms ===")
    result = p.evaluate("""() => {
        const forms = document.querySelectorAll('form');
        const results = [];
        for (let f of forms) {
            if (f.offsetParent !== null && f.offsetWidth > 100) {
                const btn = f.querySelector('button[type="submit"]');
                if (btn) {
                    results.push({
                        formW: f.offsetWidth,
                        formH: f.offsetHeight,
                        formTop: f.getBoundingClientRect().top,
                        btnText: (btn.textContent || '').trim(),
                        btnVisible: btn.offsetParent !== null,
                        btnW: btn.offsetWidth,
                        btnH: btn.offsetHeight,
                    });
                }
            }
        }
        return results;
    }""")
    for r in result:
        print(f"  {r}")
    
    # Click the submit button in the visible form using DOM events
    print("\n=== Click submit via DOM ===")
    result = p.evaluate("""() => {
        const forms = document.querySelectorAll('form');
        for (let f of forms) {
            if (f.offsetParent !== null && f.offsetWidth > 100) {
                const btn = f.querySelector('button[type="submit"]');
                if (btn && btn.offsetParent !== null) {
                    // Use React's synthetic event system
                    btn.click();
                    return `Clicked button in form at top=${f.getBoundingClientRect().top}`;
                }
            }
        }
        return 'No visible form with submit found';
    }""")
    print(f"  {result}")
    time.sleep(5)
    
    body = p.evaluate("() => document.body.innerText")
    print(f"\n=== After submit click (body[:600]) ===")
    print(body[:600])
    
    b.close()
