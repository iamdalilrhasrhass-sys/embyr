#!/usr/bin/env python3
"""Check X.com login status via Playwright."""
from playwright.sync_api import sync_playwright
import json, os, time

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    
    ctx = b.new_context(locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(60000)
    
    p.goto('https://x.com/home', wait_until='domcontentloaded', timeout=30000)
    time.sleep(5)
    
    body = p.evaluate("() => document.body.innerText")
    cookies = ctx.cookies()
    auth_token = None
    for c in cookies:
        if c.get('name') == 'auth_token':
            auth_token = c['value']
            break
    
    print(f"auth_token: {'✓' if auth_token else '✗'}")
    print(f"cookies_count: {len(cookies)}")
    limited = 'limité' in body.lower() or 'limit' in body.lower()
    login_elements = 'se connecter' in body.lower() or 'log in' in body.lower()
    print(f"limited: {limited}")
    print(f"login_page: {login_elements}")
    print(f"body_first_300: {body[:300]}")
    
    b.close()
