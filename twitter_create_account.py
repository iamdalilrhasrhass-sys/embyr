#!/usr/bin/env python3
"""
Create X.com (Twitter) account for EMBIR_APP brand via Playwright.
Uses chromium-browser directly. Checks email via mail.tm API for verification.
"""
import asyncio
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime

# === CONFIG ===
EMAIL = "embirparis2026@web-library.net"
NAME = "EMBIR"
USERNAME = "EMBIR_APP"
PASSWORD = "EmbirX2026!Secure"
EMAIL_TOKEN = os.environ.get("EMBIR_EMAIL_TOKEN", "")
CREDS_PATH = "/root/embyr/.x_creds.json"
BROWSER_PATH = "/usr/bin/chromium-browser"

# === email helpers ===
def mail_api(method="GET", path="/messages", data=None):
    """Call mail.tm API"""
    url = f"https://api.mail.tm{path}"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {EMAIL_TOKEN}"
    }
    if data:
        headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method=method)
    else:
        req = urllib.request.Request(url, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"  [MAIL API ERROR] {e}")
        return None

def check_email_code(max_attempts=30, delay=5):
    """Poll email inbox for X verification code"""
    print(f"\n  Polling email for X code... (max {max_attempts * delay}s)")
    for i in range(max_attempts):
        msgs = mail_api("GET", "/messages")
        if msgs and len(msgs) > 0:
            for msg in msgs:
                # Get full message
                msg_id = msg.get("@id", "").split("/")[-1] if msg.get("@id") else ""
                if msg_id:
                    detail = mail_api("GET", f"/messages/{msg_id}")
                    if detail:
                        subject = detail.get("subject", "")
                        html = detail.get("html", [""])[0] if detail.get("html") else ""
                        text = detail.get("text", "")
                        print(f"  Got email: subject='{subject}'")
                        print(f"  From: {detail.get('from', {})}")
                        
                        # Look for X verification code patterns
                        full_text = subject + " " + html + " " + text
                        
                        # X.com verification code: usually 6 digits
                        codes_6 = re.findall(r'\b(\d{6})\b', full_text)
                        for code in codes_6:
                            print(f"  Found potential verification code: {code}")
                            return code
                        
                        # Also check for longer patterns like "Your X confirmation code is XXXXXX"
                        code_match = re.search(r'(?:confirmation|verification|code).{0,20}?(\d{6})', full_text, re.IGNORECASE)
                        if code_match:
                            code = code_match.group(1)
                            print(f"  Found verification code from context: {code}")
                            return code
                        
                        # Delete processed message
                        mail_api("DELETE", f"/messages/{msg_id}")
        
        if i < max_attempts - 1:
            print(f"  [{i+1}/{max_attempts}] No X code yet, waiting {delay}s...")
            time.sleep(delay)
    
    print("  ❌ No verification code received within timeout")
    return None

def delete_all_emails():
    """Clean up inbox"""
    msgs = mail_api("GET", "/messages")
    if msgs:
        for msg in msgs:
            msg_id = msg.get("@id", "").split("/")[-1] if msg.get("@id") else ""
            if msg_id:
                mail_api("DELETE", f"/messages/{msg_id}")

async def main():
    print("=" * 60)
    print("CREATING X.COM ACCOUNT FOR EMBIR_APP")
    print("=" * 60)
    print(f"Email: {EMAIL}")
    print(f"Username: {USERNAME}")
    print(f"Name: {NAME}")
    print(f"Time: {datetime.now().isoformat()}")
    print()
    
    # Clean inbox first
    print("[1/5] Cleaning inbox...")
    delete_all_emails()
    
    print("[2/5] Launching browser...")
    from playwright.async_api import async_playwright
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=BROWSER_PATH,
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
            ]
        )
        
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 900},
            user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        
        page = await context.new_page()
        
        # Stealth: override webdriver detection
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        """)
        
        print("[3/5] Navigating to X.com signup...")
        
        # Method 1: Try the direct signup flow
        await page.goto("https://x.com/signup", timeout=45000, wait_until="domcontentloaded")
        await asyncio.sleep(3)
        
        # Take initial screenshot
        await page.screenshot(path="/tmp/x_signup_1.png")
        print(f"  URL: {page.url}")
        
        # Let's see what's on the page
        page_text = await page.evaluate("() => document.body?.innerText?.substring(0, 1000) || 'NO TEXT'")
        print(f"  Page text: {page_text[:300]}")
        
        # Check if we see "Create your account" or similar
        # Try clicking "Sign up with email or phone" if present
        try:
            # Look for various buttons
            buttons_text = await page.evaluate("""
                () => Array.from(document.querySelectorAll('button, div[role="button"], a, span'))
                    .filter(el => el.textContent?.trim())
                    .map(el => el.textContent?.trim()?.substring(0, 60))
                    .slice(0, 20)
            """)
            print(f"  Buttons: {buttons_text}")
        except:
            pass
        
        # Try to find and fill the email field
        email_filled = await page.evaluate(f"""
            () => {{
                const inputs = document.querySelectorAll('input');
                for (const inp of inputs) {{
                    const type = (inp.type || '').toLowerCase();
                    const name = (inp.name || '').toLowerCase();
                    const placeholder = (inp.placeholder || '').toLowerCase();
                    const autocomplete = (inp.autocomplete || '').toLowerCase();
                    
                    if (type === 'email' || type === 'text' || 
                        name.includes('email') || name.includes('user') ||
                        placeholder.includes('email') || placeholder.includes('phone') ||
                        placeholder.includes('user') ||
                        autocomplete.includes('email')) {{
                        inp.focus();
                        inp.select();
                        const nativeSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype, 'value'
                        ).set;
                        nativeSetter.call(inp, '{EMAIL}');
                        inp.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        inp.dispatchEvent(new Event('change', {{ bubbles: true }}));
                        inp.dispatchEvent(new Event('keyup', {{ bubbles: true }}));
                        return 'FILLED_' + (inp.name || inp.placeholder || 'unknown');
                    }}
                }}
                return 'NO_EMAIL_INPUT';
            }}
        """)
        print(f"  Email fill result: {email_filled}")
        
        await asyncio.sleep(1)
        
        # Try clicking Next/Continue buttons
        clicked = await page.evaluate("""
            () => {
                const texts = ['Next', 'Continue', 'Suivant', 'Next →', 'Sign up with email', 'Use email', 'Register', 'Create account', 'Sign up'];
                const elements = document.querySelectorAll('button, div[role="button"], a[role="button"]');
                for (const el of elements) {
                    const txt = (el.textContent || '').trim();
                    for (const t of texts) {
                        if (txt === t || txt.includes(t)) {
                            el.click();
                            return 'CLICKED_' + t;
                        }
                    }
                }
                return 'NO_MATCH';
            }
        """)
        print(f"  Click result: {clicked}")
        
        await asyncio.sleep(3)
        await page.screenshot(path="/tmp/x_signup_2.png")
        print(f"  URL after click: {page.url}")
        
        # === HANDLE MULTI-STEP SIGNUP ===
        # X.com signup can have many steps. Let's handle them all.
        
        for step in range(15):
            print(f"\n--- Step {step} ---")
            await page.screenshot(path=f"/tmp/x_step_{step}.png")
            
            url = page.url
            body_text = await page.evaluate("() => document.body?.innerText?.substring(0, 800) || ''")
            print(f"  URL: {url}")
            print(f"  Text: {body_text[:200]}")
            
            # Check for inputs
            inputs_info = await page.evaluate("""
                () => Array.from(document.querySelectorAll('input')).map(i => ({
                    name: i.name,
                    type: i.type,
                    placeholder: i.placeholder,
                    autocomplete: i.autocomplete,
                    id: i.id
                }))
            """)
            print(f"  Inputs: {json.dumps(inputs_info)}")
            
            # Check buttons
            btns = await page.evaluate("""
                () => Array.from(document.querySelectorAll('button, div[role="button"]'))
                    .filter(el => el.offsetParent !== null)
                    .map(el => (el.textContent || '').trim().substring(0, 40))
                    .filter(t => t)
            """)
            print(f"  Buttons: {btns}")
            
            # --- Fill email field ---
            for inp in inputs_info:
                name = inp.get('name', '')
                placeholder = inp.get('placeholder', '')
                autocomplete = inp.get('autocomplete', '')
                inp_type = inp.get('type', '')
                
                if 'email' in name.lower() or 'email' in placeholder.lower() or 'email' in autocomplete.lower():
                    if inp_type in ['email', 'text'] or not inp_type:
                        await page.fill(f'input[name="{name}"]', EMAIL)
                        print(f"  ✅ Filled email: {name}")
                
                # --- Fill name ---
                if 'name' in name.lower() or 'name' in autocomplete.lower() or 'full' in placeholder.lower():
                    if not inp.get('value'):
                        await page.fill(f'input[name="{name}"]', NAME)
                        print(f"  ✅ Filled name: {name}")
                
                # --- Fill username ---
                if 'username' in name.lower() or 'username' in autocomplete.lower() or 'username' in placeholder.lower():
                    if not inp.get('value'):
                        await page.fill(f'input[name="{name}"]', USERNAME)
                        print(f"  ✅ Filled username: {name}")
                
                # --- Fill password ---
                if inp_type == 'password':
                    await page.fill(f'input[name="{name}"]', PASSWORD)
                    print(f"  ✅ Filled password: {name}")
                
                # --- Fill verification code ---
                if 'code' in name.lower() or 'verification' in name.lower() or 'code' in placeholder.lower():
                    print("  🔑 Verification code input detected!")
                    code = check_email_code(max_attempts=15, delay=4)
                    if code:
                        await page.fill(f'input[name="{name}"]', code)
                        print(f"  ✅ Filled verification code: {code}")
                        # Wait a moment for auto-advance
                        await asyncio.sleep(3)
            
            # --- Click appropriate button ---
            for btn_text in btns:
                btn_lower = btn_text.lower()
                
                # Which button to press?
                # Skip if it's something we shouldn't click
                if any(skip in btn_lower for skip in ['log in', 'sign in', 'already']):
                    continue
                
                # Find the button element and click it
                if any(action in btn_lower for action in ['next', 'continue', 'sign up', 'create', 'submit', 'register', 'done']):
                    try:
                        btn = await page.query_selector(f'button:has-text("{btn_text}"), div[role="button"]:has-text("{btn_text}")')
                        if btn:
                            await btn.click()
                            print(f"  👆 Clicked: '{btn_text}'")
                            await asyncio.sleep(2)
                            break
                    except:
                        pass
            
            # Check if we've completed signup
            if 'home' in url.lower():
                print("\n✅✅✅ SUCCESS! On home page!")
                break
            
            if step >= 14:
                print("\n⚠️ Max steps reached")
            
            await asyncio.sleep(2)
        
        # === FINAL STATE ===
        await page.screenshot(path="/tmp/x_final.png", full_page=True)
        final_url = page.url
        final_text = await page.evaluate("() => document.body?.innerText?.substring(0, 1500) || ''")
        
        print(f"\n{'='*60}")
        print(f"Final URL: {final_url}")
        print(f"Final text: {final_text[:500]}")
        
        # Check if account was created
        if 'home' in final_url.lower():
            print("\n🎉🎉🎉 ACCOUNT CREATED SUCCESSFULLY!")
            
            # Get cookies for future use
            cookies = await context.cookies()
            
            # Save credentials
            creds = {
                "platform": "x.com",
                "email": EMAIL,
                "username": USERNAME,
                "password": PASSWORD,
                "display_name": NAME,
                "url": f"https://x.com/{USERNAME}",
                "created_at": datetime.now().isoformat(),
                "cookies": [{"name": c["name"], "value": c["value"], "domain": c["domain"]} for c in cookies],
                "status": "created"
            }
            
            os.makedirs(os.path.dirname(CREDS_PATH), exist_ok=True)
            with open(CREDS_PATH, 'w') as f:
                json.dump(creds, f, indent=2)
            print(f"\n✅ Credentials saved to {CREDS_PATH}")
            
            # Also try to get profile info via page
            try:
                profile = await page.evaluate("""
                    () => {
                        const spans = document.querySelectorAll('span');
                        for (const s of spans) {
                            if (s.textContent?.includes('@')) return s.textContent;
                        }
                        return '';
                    }
                """)
                print(f"  Profile handle: {profile}")
            except:
                pass
            
        else:
            print(f"\n❌ Account not fully created. Check screenshots in /tmp/x_*.png")
            
            # Save what we have
            creds = {
                "platform": "x.com",
                "email": EMAIL,
                "username": USERNAME,
                "password": PASSWORD,
                "display_name": NAME,
                "created_at": datetime.now().isoformat(),
                "status": "incomplete",
                "last_url": final_url,
                "last_text": final_text[:500]
            }
            os.makedirs(os.path.dirname(CREDS_PATH), exist_ok=True)
            with open(CREDS_PATH, 'w') as f:
                json.dump(creds, f, indent=2)
            print(f"  Partial state saved to {CREDS_PATH}")
        
        await browser.close()
    
    print(f"\n{'='*60}")
    print("DONE")
    print(f"{'='*60}")

if __name__ == "__main__":
    asyncio.run(main())
