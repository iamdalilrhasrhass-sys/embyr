#!/usr/bin/env python3
"""X login fix - handle verification page properly"""
from playwright.sync_api import sync_playwright
import time

TOR = "socks5://127.0.0.1:9050"

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        proxy={'server': TOR},
        args=['--no-sandbox','--disable-dev-shm-usage'])
    ctx = b.new_context(user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")
    p = ctx.new_page()
    
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
    time.sleep(5)
    p.screenshot(path="/tmp/x_step1.png")
    
    body = p.evaluate("() => document.body.innerText.substring(0, 500)")
    print(f"Body: {body[:300]}")
    
    # Accept cookies
    p.evaluate("""() => {
        const btns = document.querySelectorAll('button, [role="button"]');
        for (let b of btns) {
            const txt = (b.textContent||'').toLowerCase();
            if (txt.includes('accept') && (txt.includes('all') || txt.includes('cookie'))) {
                b.click(); return 'CLICKED_ACCEPT';
            }
        }
    }""")
    time.sleep(2)
    
    # Look for ALL clickable elements
    elements = p.evaluate("""() => {
        const all = document.querySelectorAll('div[role="button"], button, a[role="button"], [data-testid]');
        const result = [];
        for (let el of all) {
            const txt = (el.textContent || '').trim().substring(0, 50);
            const testid = el.getAttribute('data-testid') || '';
            const role = el.getAttribute('role') || '';
            if (txt) result.push(role + '|' + testid + '|' + txt);
        }
        return result;
    }""")
    print("\nClickable elements:")
    for el in elements:
        print(f"  {el}")
    
    # Try to find and click "Email or username" option
    result = p.evaluate("""() => {
        // Strategy 1: click the div containing "Email or username"
        const divs = document.querySelectorAll('div');
        for (let d of divs) {
            const txt = (d.textContent||'').trim();
            if (txt === 'Email or username' && d.getAttribute('role')) {
                d.click();
                return 'DIV_CLICKED';
            }
        }
        // Strategy 2: find parent with role=button
        const spans = document.querySelectorAll('span');
        for (let s of spans) {
            if ((s.textContent||'').trim().toLowerCase().includes('email or username')) {
                let p = s;
                while (p && p.tagName !== 'BODY') {
                    if (p.getAttribute('role') === 'button') {
                        p.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, view:window}));
                        return 'PARENT_CLICKED';
                    }
                    p = p.parentElement;
                }
                // Direct click
                s.click();
                return 'SPAN_CLICKED';
            }
        }
        return 'NOT_FOUND';
    }""")
    print(f"\nClick result: {result}")
    
    time.sleep(4)
    p.screenshot(path="/tmp/x_step2.png")
    
    body2 = p.evaluate("() => document.body.innerText.substring(0, 500)")
    print(f"\nAfter click: {body2[:400]}")
    
    # Look for email input
    has_input = p.evaluate("""() => {
        const inp = document.querySelector('input[name="text"], input[name="username_or_email"], input[autocomplete="username"], input[type="email"]');
        if (inp) return 'FOUND:' + (inp.getAttribute('name') || inp.getAttribute('type') || 'unknown');
        return 'NOT_FOUND';
    }""")
    print(f"Input: {has_input}")
    
    b.close()
