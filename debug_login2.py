#!/usr/bin/env python3
"""Debug login step by step."""
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
    
    print("=== STEP 1: Navigate to login ===")
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
    time.sleep(6)
    
    print("=== STEP 2: Fill email ===")
    email_input = p.locator('input[name="username_or_email"]').first
    if email_input.is_visible(timeout=10000):
        email_input.fill(E)
        time.sleep(1)
        print("  Email filled")
    
    print("=== STEP 3: Click Continue ===")
    next_btn = p.locator('button:has-text("Continuer")').first
    if next_btn.is_visible(timeout=5000):
        next_btn.click()
        time.sleep(5)
        print("  Clicked Continue")
    
    print("=== STEP 4: Check page after Continue ===")
    body = p.evaluate("() => document.body.innerText")
    print(f"  Body[:800]: {body[:800]}")
    
    print("\n=== Visible inputs after Continue ===")
    inputs = p.evaluate("""() => {
        const all = document.querySelectorAll('input');
        return Array.from(all).filter(i => i.offsetParent !== null).map(i => ({
            name: i.getAttribute('name'),
            type: i.getAttribute('type'),
            placeholder: i.getAttribute('placeholder'),
            autocomplete: i.getAttribute('autocomplete'),
        }));
    }""")
    for inp in inputs:
        print(f"  {inp}")
    
    print("\n=== Visible buttons after Continue ===")
    btns = p.evaluate("""() => {
        const all = document.querySelectorAll('button');
        return Array.from(all).filter(b => b.offsetParent !== null).map(b => ({
            text: (b.innerText || '').trim().substring(0, 60),
            testid: b.getAttribute('data-testid') || '',
        }));
    }""")
    for btn in btns:
        print(f"  {btn}")
    
    b.close()
