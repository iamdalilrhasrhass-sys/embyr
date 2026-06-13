"""
LinkedIn signup - fixed flow: email first, then password + name
"""
import asyncio, re, time, requests
from playwright.async_api import async_playwright

EMAIL = "embyrpromo1779557374@wshu.net"
PASS = "EmbyrPromo2026!"
FIRST = "Embyr"
LAST = "App"

MAIL_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Nzk1NTczODAsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJhZGRyZXNzIjoiZW1ieXJwcm9tbzE3Nzk1NTczNzRAd3NodS5uZXQiLCJpZCI6IjZhMTFlM2ZlZGIxZWU2Y2RjYTBhNDA3YiIsIm1lcmN1cmUiOnsic3Vic2NyaWJlIjpbIi9hY2NvdW50cy82YTExZTNmZWRiMWVlNmNkY2EwYTQwN2IiXX19.POyQVshDJgp6Sx2CyRgBM2s8XmR3IkH0UhCfbDA3gyKs2kD5GY4SebfOSF2QolzKQd9TlZ-Xaz8VRuYamRYiHA"

def check_mail(timeout=60):
    start = time.time()
    try:
        known = len(requests.get("https://api.mail.tm/messages", 
            headers={"Authorization": f"Bearer {MAIL_TOKEN}"}, timeout=10).json().get("hydra:member", []))
    except:
        known = 0
    print(f"[MAIL] Known: {known}")
    
    while time.time() - start < timeout:
        time.sleep(5)
        try:
            msgs = requests.get("https://api.mail.tm/messages",
                headers={"Authorization": f"Bearer {MAIL_TOKEN}"}, timeout=10).json().get("hydra:member", [])
            if len(msgs) > known:
                print(f"[MAIL] New! Total: {len(msgs)}")
                msg = requests.get(f"https://api.mail.tm/messages/{msgs[0]['id']}",
                    headers={"Authorization": f"Bearer {MAIL_TOKEN}"}, timeout=10).json()
                html = msg.get('html', [''])[0] or ''
                text = msg.get('text', '') or ''
                print(f"[MAIL] Subject: {msg.get('subject','')}")
                code = re.search(r'(\d{6})', html + text)
                if code:
                    print(f"[MAIL] Code: {code.group(1)}")
                    return code.group(1)
                link = re.search(r'https?://[^\s"<>]+', html or text or '')
                if link:
                    return link.group(0)
        except:
            pass
        print(f"[MAIL] Still {len(msgs) if 'msgs' in dir() else known}...")
    return None

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("=== LINKEDIN V2 ===")
        
        # Step 1: Go to signup
        await page.goto("https://www.linkedin.com/signup", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)
        await page.screenshot(path="/tmp/li_v2_1.png")
        print(f"1. {page.url}")
        
        # Step 2: Fill email
        email_input = await page.query_selector("input[name=email-address]")
        if email_input:
            await email_input.click()
            await asyncio.sleep(1)
            await email_input.fill(EMAIL)
            print("2. Email filled")
        
        await asyncio.sleep(1)
        
        # Step 3: Click "Agree & Join" or "Continue" button
        submit_btn = await page.query_selector("button[type=submit]")
        if submit_btn:
            btn_text = await submit_btn.text_content() or ""
            print(f"3. Submit button: '{btn_text.strip()}'")
            await submit_btn.click()
            print("   Clicked!")
        else:
            await page.keyboard.press("Enter")
            print("3. Pressed Enter")
        
        await asyncio.sleep(4)
        print(f"4. URL after submit: {page.url}")
        await page.screenshot(path="/tmp/li_v2_2.png")
        
        # Step 4: Now fill password (should be visible)
        pass_input = await page.query_selector("input[name=password]")
        if pass_input:
            await pass_input.fill(PASS)
            print("5. Password filled")
            
            # Check for first/last name
            first_input = await page.query_selector("input[name=first-name]")
            if first_input:
                visible = await first_input.is_visible()
                print(f"6. First name field visible: {visible}")
                if visible:
                    await first_input.fill(FIRST)
                    last_input = await page.query_selector("input[name=last-name]")
                    if last_input:
                        await last_input.fill(LAST)
                    print("7. Names filled")
            
            # Submit again
            submit2 = await page.query_selector("button[type=submit]")
            if submit2:
                await submit2.click()
                print("8. Submit 2 clicked")
            else:
                await page.keyboard.press("Enter")
                print("8. Enter pressed")
            
            await asyncio.sleep(5)
            print(f"9. URL: {page.url}")
            await page.screenshot(path="/tmp/li_v2_3.png")
            
            # Check for verification
            text = await page.text_content("body") or ""
            if "verify" in text.lower() or "code" in text.lower() or "pin" in text.lower():
                print("10. Verification needed!")
                code = await asyncio.get_event_loop().run_in_executor(None, check_mail, 90)
                
                if code and len(str(code)) == 6:
                    print(f"11. Code: {code}")
                    # Find code inputs
                    code_inputs = await page.query_selector_all("input[type=text]")
                    visible_inputs = []
                    for ci in code_inputs:
                        if await ci.is_visible():
                            visible_inputs.append(ci)
                    
                    if visible_inputs:
                        for i, digit in enumerate(str(code)):
                            if i < len(visible_inputs):
                                await visible_inputs[i].fill(digit)
                        print("12. Code entered")
                        await asyncio.sleep(2)
                        await page.keyboard.press("Enter")
                        await asyncio.sleep(5)
                        print(f"13. URL: {page.url}")
                        await page.screenshot(path="/tmp/li_v2_done.png")
            
            # Final check
            if "feed" in page.url or "in/" in page.url:
                print("🎉 LINKEDIN ACCOUNT CREATED!")
            else:
                more_text = await page.text_content("body") or ""
                if "phone" in more_text.lower():
                    print("❌ Phone verification required")
                else:
                    print(f"❌ Still on: {page.url[:80]}")
        else:
            print("5. No password field - might need different approach")
            # What's on the page?
            els = await page.evaluate("""
                () => Array.from(document.querySelectorAll('input, button')).slice(0,15).map(el => ({
                    tag: el.tagName, type: el.type, name: el.name || '', 
                    placeholder: el.placeholder || el.getAttribute('aria-label') || '',
                    visible: el.offsetParent !== null
                }))
            """)
            for el in els:
                v = "V" if el['visible'] else "H"
                print(f"   [{v}] <{el['tag']}> {el['name']} '{el['placeholder']}'")
        
        await page.screenshot(path="/tmp/li_v2_final.png", full_page=True)
        print(f"\nFinal URL: {page.url}")
        await browser.close()

asyncio.run(main())
