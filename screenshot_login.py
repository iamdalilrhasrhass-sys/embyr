#!/usr/bin/env python3
"""Take screenshot of X login page"""
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    
    ctx = b.new_context(
        viewport={'width': 1280, 'height': 800},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(30000)
    
    p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=30000)
    time.sleep(8)
    
    p.screenshot(path='/tmp/x_login.png')
    print('Screenshot saved!')
    print('URL:', p.url)
    
    b.close()
