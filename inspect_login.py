#!/usr/bin/env python3
"""X.com login - focus on the jf login widget"""
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'])
    
    ctx = b.new_context(
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        locale='fr-FR')
    p = ctx.new_page()
    p.set_default_timeout(30000)
    
    p.goto('https://x.com/i/flow/login', wait_until='load', timeout=30000)
    time.sleep(8)
    
    # Get ALL elements inside the jf container
    structure = p.evaluate("""() => {
        // Get the main jetfuel container
        const root = document.querySelector('.jf-element.jetfuel-style-root') || document.body;
        
        function getTree(el, depth) {
            if (depth > 5) return {tag: el.tagName, text: (el.textContent||'').trim().substring(0, 40)};
            const children = [];
            for (let c of el.children) {
                const info = getTree(c, depth + 1);
                if (info.tag || info.text || info.children?.length) {
                    children.push(info);
                }
            }
            return {
                tag: el.tagName,
                id: el.id || '',
                cls: (el.className || '').substring(0, 40),
                text: (el.textContent||'').trim().substring(0, 40),
                type: el.getAttribute('type') || '',
                name: el.getAttribute('name') || '',
                placeholder: el.getAttribute('placeholder') || '',
                'data-testid': el.getAttribute('data-testid') || '',
                role: el.getAttribute('role') || '',
                children: children.length > 0 ? children : undefined
            };
        }
        
        return getTree(root, 0);
    }""")
    
    import json
    print(json.dumps(structure, indent=2, ensure_ascii=False)[:3000])
    
    b.close()
