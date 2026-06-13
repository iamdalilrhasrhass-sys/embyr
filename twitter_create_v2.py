#!/usr/bin/env python3
"""
Targeted X.com account creation script.
"""
import asyncio
import json, os, re, time, urllib.request
from datetime import datetime

EMAIL = "embirparis2026@web-library.net"
NAME = "EMBIR"
USERNAME = "EMBIR_APP"
PASSWORD = "EmbyrX2026!Secure"
CREDS_PATH = "/root/embyr/.x_creds.json"
EMAIL_TOKEN = os.environ.get("EMBIR_EMAIL_TOKEN", "")

def mail_api(method="GET", path="/messages", data=None):
    url = f"https://api.mail.tm{path}"
    headers = {"Accept": "application/json", "Authorization": f"Bearer {EMAIL_TOKEN}"}
    if data:
        headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method=method)
    else:
        req = urllib.request.Request(url, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            if method == "DELETE":
                return resp.status
            return json.loads(resp.read().decode())
    except:
        return None

def check_email_code(max_attempts=30, delay=5):
    print(f"  📧 Polling email for code...")
    for i in range(max_attempts):
        msgs = mail_api("GET", "/messages")
        if msgs and len(msgs) > 0:
            for msg in msgs:
                msg_id = msg.get("@id", "").split("/")[-1] if msg.get("@id") else ""
                if msg_id:
                    detail = mail_api("GET", f"/messages/{msg_id}")
                    if detail:
                        subject = detail.get("subject", "")
                        html = detail.get("html", [""])[0] if detail.get("html") else ""
                        text = detail.get("text", "")
                        print(f"  📨 Email: '{subject}'")
                        full = subject + " " + html + " " + text
                        # X codes: 6 digits
                        code_match = re.search(r'(?:confirmation|verification|code|is)\s*:?\s*(\d{6})', full, re.IGNORECASE)
                        if code_match:
                            code = code_match.group(1)
                            print(f"  ✅ Found code: {code}")
                            return code
                        # Just any 6-digit number
                        codes = re.findall(r'\b(\d{6})\b', full)
                        if codes:
                            print(f"  ✅ Found code: {codes[0]}")
                            return codes[0]
                        mail_api("DELETE", f"/messages/{msg_id}")
        if i < max_attempts - 1:
            print(f"  ⏳ [{i+1}/{max_attempts}] waiting {delay}s...")
            time.sleep(delay)
    return None

def delete_all_emails():
    msgs = mail_api("GET", "/messages")
    if msgs:
        for msg in msgs:
            msg_id = msg.get("@id", "").split("/")[-1] if msg.get("@id") else ""
            if msg_id:
                mail_api("DELETE", f"/messages/{msg_id}")

async def main():
    print("="*60)
    print("X.COM SIGNUP FOR EMBIR_APP")
    print("="*60)
    
    delete_all_emails()
    
    from playwright.async_api import async_playwright
    
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            executable_path="/usr/bin/chromium-browser",
            headless=True,
            args=['--no-sandbox', '--disable-blink-features=AutomationControlled']
        )
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        page = await context.new_page()
        
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
        """)
        
        print("\n[1] Go to signup...")
        await page.goto("https://x.com/i/flow/signup", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(3)
        print(f"  URL: {page.url}")
        
        # Let's check what's actually visible
        vis = await page.evaluate("""
            () => {
                const els = [];
                document.querySelectorAll('input, button[type=button], div[role=button]').forEach(el => {
                    if (el.offsetParent !== null) {
                        els.push({
                            tag: el.tagName,
                            role: el.getAttribute('role'),
                            type: el.getAttribute('type'),
                            name: el.getAttribute('name'),
                            placeholder: el.getAttribute('placeholder'),
                            text: (el.textContent || '').trim().substring(0, 40),
                            aria: el.getAttribute('aria-label'),
                            data_testid: el.getAttribute('data-testid'),
                        });
                    }
                });
                return els;
            }
        """)
        print(f"  Visible elements:")
        for v in vis:
            print(f"    tag={v['tag']} role={v['role']} type={v['type']} name={v['name']} text='{v['text']}' aria='{v['aria']}' testid='{v['data_testid']}'")
        
        # The page has "Email or username" input and also password.
        # This might be the login/signup hybrid. Let's try to fill the email
        # and then look for "Continue" or "Next" button.
        
        # Fill email - use first visible input
        email_input = page.locator('input[name="username_or_email"]').first
        if await email_input.count() > 0:
            await email_input.fill(EMAIL)
            await asyncio.sleep(1)
            print("  ✅ Email filled")
        else:
            print("  ❌ No email input found")
            await page.screenshot(path="/tmp/x_err1.png")
            await browser.close()
            return
        
        # Check for the Continue button - might be a span/div inside a button
        # Try clicking by text
        for attempt in range(3):
            clicked = await page.evaluate("""
                () => {
                    // Find elements containing "Continue" or "Next"
                    const selectors = [
                        'button:has-text("Continue")',
                        'div[role="button"]:has-text("Continue")',
                        'button:has-text("Next")',
                        'div[role="button"]:has-text("Next")',
                        '[data-testid="signup-dialog-next"]',
                        '[data-testid="ocfNext"]'
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el && el.offsetParent !== null) {
                            el.click();
                            return 'CLICKED_' + sel;
                        }
                    }
                    return 'NOT_FOUND';
                }
            """)
            print(f"  Click attempt {attempt+1}: {clicked}")
            if 'CLICKED' in clicked:
                break
            await asyncio.sleep(1)
        
        await asyncio.sleep(3)
        print(f"  URL after click: {page.url}")
        await page.screenshot(path="/tmp/x_a1.png")
        
        # === MULTI-STEP SIGNUP LOOP ===
        for step in range(20):
            # Get current page state
            state = await page.evaluate("""
                () => {
                    const inputs = [];
                    document.querySelectorAll('input').forEach(inp => {
                        if (inp.offsetParent !== null) {
                            inputs.push({
                                name: inp.name,
                                type: inp.type,
                                placeholder: inp.placeholder,
                                autocomplete: inp.autocomplete,
                                value: inp.value || '',
                                aria: inp.getAttribute('aria-label') || '',
                                testid: inp.getAttribute('data-testid') || '',
                            });
                        }
                    });
                    const buttons = [];
                    document.querySelectorAll('button, div[role="button"]').forEach(btn => {
                        if (btn.offsetParent !== null) {
                            const txt = (btn.textContent || '').trim().substring(0, 40);
                            if (txt) buttons.push({
                                text: txt,
                                testid: btn.getAttribute('data-testid') || '',
                                aria: btn.getAttribute('aria-label') || '',
                            });
                        }
                    });
                    return { inputs, buttons, url: window.location.href };
                }
            """)
            
            print(f"\n--- Step {step} ---")
            print(f"  URL: {state['url']}")
            for inp in state['inputs']:
                print(f"  INPUT: name={inp['name']} type={inp['type']} placeholder={inp['placeholder']} value='{inp['value'][:20]}'")
            for btn in state['buttons']:
                print(f"  BTN: '{btn['text']}' testid={btn['testid']}")
            
            if not state['inputs'] and not state['buttons']:
                print("  ⚠️ No interactive elements. Breaking.")
                break
            
            # Check for home/onboarding success
            if 'home' in state['url'].lower():
                print("\n 🎉🎉🎉 ON HOME PAGE!")
                break
            
            # Process inputs
            for inp in state['inputs']:
                name = inp['name'].lower()
                pl = inp['placeholder'].lower()
                auto = inp['autocomplete'].lower()
                itype = inp['type'].lower()
                val = inp['value']
                
                # Email
                if 'email' in name or 'email' in pl or 'email' in auto:
                    if not val:
                        await page.locator(f'input[name="{inp["name"]}"]').first.fill(EMAIL)
                        print(f"  ✅ Filled email")
                
                # Name
                elif 'name' in name or 'name' in auto or 'full' in pl:
                    if not val:
                        await page.locator(f'input[name="{inp["name"]}"]').first.fill(NAME)
                        print(f"  ✅ Filled name: {NAME}")
                
                # Username
                elif 'username' in name or 'username' in auto or 'username' in pl:
                    if not val:
                        await page.locator(f'input[name="{inp["name"]}"]').first.fill(USERNAME)
                        print(f"  ✅ Filled username: {USERNAME}")
                
                # Password
                elif itype == 'password':
                    if not val:
                        await page.locator(f'input[name="{inp["name"]}"]').first.fill(PASSWORD)
                        print(f"  ✅ Filled password")
                
                # Phone (skip - we use email)
                elif 'phone' in name or 'phone' in auto:
                    print(f"  ⏭️ Skipping phone field")
                
                # Birthday fields
                elif 'month' in name or 'day' in name or 'year' in name:
                    if not val:
                        if 'month' in name:
                            await page.locator(f'input[name="{inp["name"]}"]').first.fill('June')
                        elif 'day' in name:
                            await page.locator(f'input[name="{inp["name"]}"]').first.fill('15')
                        elif 'year' in name:
                            await page.locator(f'input[name="{inp["name"]}"]').first.fill('1990')
                        print(f"  ✅ Filled birthday field: {name}")
                
                # Code/verification
                elif 'code' in name or 'code' in pl or 'verification' in name:
                    print(f"  🔑 Verification code input! Checking email...")
                    code = check_email_code(max_attempts=20, delay=4)
                    if code:
                        await page.locator(f'input[name="{inp["name"]}"]').first.fill(code)
                        print(f"  ✅ Filled code: {code}")
                        await asyncio.sleep(2)
                    else:
                        print("  ❌ No code received")
            
            await asyncio.sleep(1)
            
            # Find and click the right button
            btn_clicked = False
            for btn in state['buttons']:
                btext = btn['text'].lower()
                testid = btn['testid'] or ''
                
                # Skip login/phone/apple buttons
                if any(x in btext for x in ['log in', 'sign in', 'already', 'apple', 'phone', 'google']):
                    continue
                
                # Priority buttons to click
                if any(x in btext for x in ['next', 'continue', 'sign up', 'create', 'register', 'submit', 'done']):
                    try:
                        await page.click(f'button:has-text("{btn["text"]}")')
                        print(f"  👆 Clicked: '{btn['text']}'")
                        btn_clicked = True
                        await asyncio.sleep(2)
                        break
                    except:
                        pass
            
            if not btn_clicked:
                # Try clicking by data-testid
                testid_clicked = await page.evaluate("""
                    () => {
                        const testids = ['signup-dialog-next', 'ocfNext', 'ocfSubmit', 'create_account', 'signup_submit'];
                        for (const tid of testids) {
                            const el = document.querySelector(`[data-testid="${tid}"]`);
                            if (el && el.offsetParent !== null) {
                                el.click();
                                return 'CLICKED_' + tid;
                            }
                        }
                        return 'NOTHING_CLICKED';
                    }
                """)
                print(f"  👆 Testid click: {testid_clicked}")
            
            if step >= 19:
                print("  ⚠️ Max steps!")
            
            await asyncio.sleep(2)
        
        # Final state
        await page.screenshot(path="/tmp/x_final.png", full_page=True)
        final_url = page.url
        
        print(f"\n{'='*60}")
        print(f"Final URL: {final_url}")
        
        # Check success
        if 'home' in final_url.lower():
            print("🎉🎉🎉 ACCOUNT CREATED!")
            
            cookies = await context.cookies()
            creds = {
                "platform": "x.com",
                "email": EMAIL,
                "username": USERNAME,
                "password": PASSWORD,
                "display_name": NAME,
                "url": f"https://x.com/{USERNAME}",
                "created_at": datetime.now().isoformat(),
                "cookies": [{"name": c["name"], "value": c["value"], "domain": c["domain"]} for c in cookies if c.get("name")],
                "status": "created"
            }
        else:
            print("❌ Account not fully created")
            creds = {
                "platform": "x.com",
                "email": EMAIL,
                "username": USERNAME,
                "password": PASSWORD,
                "display_name": NAME,
                "created_at": datetime.now().isoformat(),
                "status": "incomplete",
                "last_url": final_url
            }
        
        os.makedirs(os.path.dirname(CREDS_PATH), exist_ok=True)
        with open(CREDS_PATH, 'w') as f:
            json.dump(creds, f, indent=2)
        print(f"✅ Saved to {CREDS_PATH}")
        
        await browser.close()

asyncio.run(main())
