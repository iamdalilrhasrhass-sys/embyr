#!/usr/bin/env python3
"""Debug X.com login page to find the right selectors."""
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = b.new_context(locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(60000)
    
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
    time.sleep(6)
    
    # Get the full page snapshot
    print("=== PAGE TITLE ===")
    print(p.title())
    
    print("\n=== ALL INPUTS ===")
    inputs = p.evaluate("""() => {
        const all = document.querySelectorAll('input');
        return Array.from(all).map(i => ({
            name: i.getAttribute('name'),
            type: i.getAttribute('type'),
            autocomplete: i.getAttribute('autocomplete'),
            placeholder: i.getAttribute('placeholder'),
            class: i.className.substring(0, 80),
            id: i.getAttribute('id'),
            visible: i.offsetParent !== null,
            rect: i.getBoundingClientRect ? JSON.stringify({t:i.getBoundingClientRect().top,l:i.getBoundingClientRect().left,w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height}) : ''
        }));
    }""")
    for inp in inputs:
        if inp.get('visible'):
            print(f"  VISIBLE: {inp}")
        else:
            print(f"  hidden: {inp}")
    
    print("\n=== ALL BUTTONS (visible) ===")
    btns = p.evaluate("""() => {
        const all = document.querySelectorAll('button');
        return Array.from(all).filter(b => b.offsetParent !== null).map(b => ({
            text: (b.innerText || '').trim().substring(0, 50),
            testid: b.getAttribute('data-testid') || '',
            role: b.getAttribute('role') || '',
        }));
    }""")
    for b in btns:
        print(f"  {b}")
    
    print("\n=== PAGE BODY (first 1500 chars) ===")
    body = p.evaluate("() => document.body.innerText")
    print(body[:1500])
    
    b.close()
