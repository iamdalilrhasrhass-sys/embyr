#!/usr/bin/env python3
"""Login to X.com using the new JetFuel framework"""
from playwright.sync_api import sync_playwright
import time

E = 'iamdalilrhasrhass@gmail.com'
PWD = 'Champigny-89'

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    
    ctx = b.new_context(
        viewport={'width': 1280, 'height': 800},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(45000)
    
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=30000)
    time.sleep(6)
    
    # Find and click on the "E-mail ou nom d'utilisateur" label using a more precise selector
    # The jf-float-label-container is the clickable element
    clickable = p.evaluate("""() => {
        // Find the label container div
        const containers = document.querySelectorAll('div.jf-element.jf-float-label-container');
        for (let c of containers) {
            const text = (c.textContent || '').toLowerCase();
            if (text.includes('e-mail') || text.includes('email')) {
                // This is the one - click it
                c.click();
                return 'clicked label container';
            }
        }
        // Try the input field directly
        const inputs = document.querySelectorAll('input[name="username_or_email"]');
        for (let inp of inputs) {
            if (inp.offsetParent !== null) {
                inp.focus();
                inp.click();
                return 'clicked input directly';
            }
        }
        return 'not found';
    }""")
    print('Click result:', clickable)
    time.sleep(3)
    
    # Now fill in the email
    p.evaluate("""(email) => {
        const el = document.querySelector('input[name="username_or_email"]');
        if (el) {
            el.focus();
            el.value = '';
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeSetter.call(el, email);
            el.dispatchEvent(new Event('input', {bubbles: true}));
            el.dispatchEvent(new Event('change', {bubbles: true}));
            el.dispatchEvent(new Event('blur', {bubbles: true}));
        }
    }""", E)
    time.sleep(1)
    print('Email filled')
    
    # Check if we need to click Continue next
    body = p.evaluate("() => document.body.innerText")
    print('Body after email:', body[:300])
    
    # Try clicking the Continue button
    continue_clicked = p.evaluate("""() => {
        const btns = document.querySelectorAll('button');
        for (let b of btns) {
            const t = (b.textContent || '').trim().toLowerCase();
            if (t === 'continuer' || t === 'next' || t === 'continue') {
                if (b.offsetParent !== null) {
                    b.click();
                    return 'clicked: ' + t;
                }
            }
        }
        return 'not found';
    }""")
    print('Continue click:', continue_clicked)
    time.sleep(4)
    
    print('URL:', p.url)
    body = p.evaluate("() => document.body.innerText")
    print('Body after continue:', body[:400])
    
    # Check for password field
    has_pwd = p.evaluate("() => document.querySelector('input[name=\"password\"]') !== null")
    if has_pwd:
        print('Password field found!')
        
        # Check if we need to go through email verification first
        if 'vérifier' in body.lower() or 'verify' in body.lower() or 'code' in body.lower() or 'email' in body.lower():
            print('VERIFICATION CODE REQUIRED - cannot automate further')
            b.close()
            exit(1)
        
        # Fill password
        p.evaluate("""(pwd) => {
            const el = document.querySelector('input[name="password"]');
            if (el) {
                el.focus();
                el.value = '';
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeSetter.call(el, pwd);
                el.dispatchEvent(new Event('input', {bubbles: true}));
                el.dispatchEvent(new Event('change', {bubbles: true}));
                el.dispatchEvent(new Event('blur', {bubbles: true}));
            }
        }""", PWD)
        time.sleep(1)
        print('Password filled')
        
        # Click login
        login_clicked = p.evaluate("""() => {
            const btns = document.querySelectorAll('button');
            for (let b of btns) {
                const t = (b.textContent || '').trim().toLowerCase();
                if (t === 'se connecter' || t === 'log in' || t === 'sign in') {
                    if (b.offsetParent !== null) {
                        b.click();
                        return 'clicked: ' + t;
                    }
                }
            }
            return 'not found';
        }""")
        print('Login click:', login_clicked)
        time.sleep(8)
        
        print('Final URL:', p.url)
        body = p.evaluate("() => document.body.innerText")
        print('Final body:', body[:300])
        
        # Check cookies
        cookies = ctx.cookies()
        for c in cookies:
            if c.get('name') == 'auth_token':
                print('✅ auth_token found:', c['value'][:20])
                break
        else:
            print('❌ No auth_token cookie')
            x_cookies = [(c['name'], c.get('value','')[:20]) for c in cookies if 'x.com' in c.get('domain', '') and c.get('name') in ['auth_token', 'ct0']]
            print('X auth cookies:', x_cookies)
    else:
        print('Password field not found')
        body = p.evaluate("() => document.body.innerText")
        print('Full body:', body[:500])
    
    b.close()
