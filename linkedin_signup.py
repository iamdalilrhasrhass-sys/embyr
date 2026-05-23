"""
Création compte LinkedIn + page entreprise Embyr
"""
import asyncio, re, time, requests
from playwright.async_api import async_playwright

EMAIL = "embyrpromo1779557374@wshu.net"
PASS = "EmbyrPromo2026!"
FIRST = "Embyr"
LAST = "Dating"

# mail.tm credentials
MAIL_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Nzk1NTczODAsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJhZGRyZXNzIjoiZW1ieXJwcm9tbzE3Nzk1NTczNzRAd3NodS5uZXQiLCJpZCI6IjZhMTFlM2ZlZGIxZWU2Y2RjYTBhNDA3YiIsIm1lcmN1cmUiOnsic3Vic2NyaWJlIjpbIi9hY2NvdW50cy82YTExZTNmZWRiMWVlNmNkY2EwYTQwN2IiXX19.POyQVshDJgp6Sx2CyRgBM2s8XmR3IkH0UhCfbDA3gyKs2kD5GY4SebfOSF2QolzKQd9TlZ-Xaz8VRuYamRYiHA"

def check_mail(timeout=60):
    """Check mail.tm inbox for verification code"""
    start = time.time()
    known = len(requests.get("https://api.mail.tm/messages", 
        headers={"Authorization": f"Bearer {MAIL_TOKEN}"}).json().get("hydra:member", []))
    print(f"[MAIL] Known messages: {known}")
    
    while time.time() - start < timeout:
        time.sleep(5)
        msgs = requests.get("https://api.mail.tm/messages",
            headers={"Authorization": f"Bearer {MAIL_TOKEN}"}).json().get("hydra:member", [])
        if len(msgs) > known:
            print(f"[MAIL] New message! Total: {len(msgs)}")
            msg = requests.get(f"https://api.mail.tm/messages/{msgs[0]['id']}",
                headers={"Authorization": f"Bearer {MAIL_TOKEN}"}).json()
            html = msg.get('html', [''])[0]
            text = msg.get('text', '')
            print(f"[MAIL] Subject: {msg.get('subject','')}")
            
            # Extract verification code
            code = re.search(r'(\d{6})', html or text or '')
            if code:
                print(f"[MAIL] Code: {code.group(1)}")
                return code.group(1)
            
            # Check for links
            link = re.search(r'https?://[^\s"<>]+', html or text or '')
            if link:
                print(f"[MAIL] Link: {link.group(0)}")
                return link.group(0)
        
        print(f"[MAIL] Still {len(msgs)} messages...")
    return None

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        page = await context.new_page()
        
        print("=== LINKEDIN SIGNUP ===")
        
        # Step 1: Go to signup
        await page.goto("https://www.linkedin.com/signup", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)
        print(f"1. URL: {page.url}")
        
        # Step 2: Fill email
        email_input = await page.query_selector("input[name=email-address], input#email-address, input[type=email]")
        if email_input:
            await email_input.fill(EMAIL)
            print("2. Email filled ✅")
            await page.screenshot(path="/tmp/li_1_email.png")
        
        # Step 3: Click Continue (or press Enter)
        await page.keyboard.press("Enter")
        await asyncio.sleep(3)
        print(f"3. URL: {page.url}")
        await page.screenshot(path="/tmp/li_2.png")
        
        # Check for password field
        pass_input = await page.query_selector("input[name=password], input[type=password]")
        if pass_input:
            await pass_input.fill(PASS)
            print("4. Password filled ✅")
            
            # Scroll to find hidden fields
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(1)
            
            # Check for first/last name - wait for them
            first_input = await page.wait_for_selector("input[name=first-name]", timeout=5000)
            last_input = await page.wait_for_selector("input[name=last-name]", timeout=5000)
            if first_input:
                await first_input.scroll_into_view_if_needed()
                await first_input.fill(FIRST)
            if last_input:
                await last_input.scroll_into_view_if_needed()
                await last_input.fill(LAST)
            print("5. Names filled ✅")
            
            # Scroll to see submit button, then click
            submit_btn = await page.query_selector("button[type=submit]")
            if submit_btn:
                await submit_btn.scroll_into_view_if_needed()
                await asyncio.sleep(1)
                await submit_btn.click()
            else:
                await page.keyboard.press("Enter")
            await asyncio.sleep(5)
            print(f"6. URL: {page.url}")
            await page.screenshot(path="/tmp/li_3_verification.png")
            
            # Step 4: Check for email verification
            text = await page.text_content("body") or ""
            if "verify" in text.lower() or "code" in text.lower() or "pin" in text.lower():
                print("7. Verification code requested")
                
                code = await asyncio.get_event_loop().run_in_executor(None, check_mail, 90)
                
                if code and len(code) == 6 and code.isdigit():
                    print(f"8. Verification code: {code}")
                    
                    # Type the code
                    code_inputs = await page.query_selector_all("input[type=text]")
                    if code_inputs:
                        for i, digit in enumerate(code):
                            if i < len(code_inputs):
                                await code_inputs[i].fill(digit)
                        print("9. Code entered ✅")
                    else:
                        # Single input
                        single_input = await page.query_selector("input[autocomplete=one-time-code]")
                        if single_input:
                            await single_input.fill(code)
                            print("9. Code entered in single input ✅")
                        else:
                            await page.keyboard.type(code)
                            print("9. Code typed ✅")
                    
                    await asyncio.sleep(3)
                    await page.keyboard.press("Enter")
                    await asyncio.sleep(5)
                    print(f"10. URL: {page.url}")
                    await page.screenshot(path="/tmp/li_4_done.png")
                    
                    # Check if we're on LinkedIn now
                    if "linkedin.com/feed" in page.url or "linkedin.com/in" in page.url:
                        print("🎉 LINKEDIN ACCOUNT CREATED!")
                    else:
                        print(f"11. Final page: {page.url}")
                        
                        # Check for more steps
                        more_text = await page.text_content("body") or ""
                        if "phone" in more_text.lower():
                            print("❌ Phone verification requested - blocked")
                        elif "photo" in more_text.lower() or "profile" in more_text.lower():
                            print("✅ Account created, needs profile setup")
                        elif "checkpoint" in page.url.lower():
                            print("❌ Security checkpoint")
                else:
                    print(f"❌ No code received (got: {code})")
            elif "feed" in page.url:
                print("🎉 LINKEDIN ACCOUNT CREATED (no verification needed)!")
        
        await page.screenshot(path="/tmp/li_final.png", full_page=True)
        print(f"\nFinal URL: {page.url}")
        
        await browser.close()

asyncio.run(main())
