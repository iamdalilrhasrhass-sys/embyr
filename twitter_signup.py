"""
Créer un compte Twitter/X
"""
import asyncio, time
from playwright.async_api import async_playwright

EMAIL = "embirpromo1779557374@wshu.net"
USERNAME = "EmbirApp"
PASS = "EmbirPromo2026!"
NAME = "Embir Dating"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("=== TWITTER SIGNUP ===")
        
        # Try the direct signup page
        await page.goto("https://twitter.com/i/flow/signup", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(4)
        print(f"1. URL: {page.url}")
        await page.screenshot(path="/tmp/tw_1.png")
        
        # Check what's on the page
        text = (await page.text_content("body") or "")
        print(f"2. Text preview: {text[:500]}")
        
        # Look for signup/create account buttons
        buttons = await page.query_selector_all("a, button, span, div[role=button]")
        for b in buttons:
            try:
                bt = await b.text_content()
                if bt and ("Sign up" in bt or "Create" in bt or "Register" in bt or "Join" in bt or "Créer" in bt.lower()):
                    print(f"3. Found button: '{bt.strip()[:50]}'")
                    await b.click()
                    print("   Clicked!")
                    await asyncio.sleep(3)
                    print(f"   URL: {page.url}")
                    await page.screenshot(path="/tmp/tw_2.png")
                    break
            except: pass
        
        # Try "Next" buttons
        for attempt in range(5):
            btns = await page.query_selector_all("button, span[role=button], div[role=button]")
            for b in btns:
                try:
                    bt = (await b.text_content() or "").strip()
                    if bt in ["Next", "Next →", "Suivant", "Continue", "Register", "Sign up"]:
                        print(f"4. Found '{bt}', clicking...")
                        await b.click()
                        await asyncio.sleep(2)
                        await page.screenshot(path=f"/tmp/tw_step{attempt}.png")
                        print(f"   URL: {page.url}")
                        break
                except: pass
            
            # Try filling email
            email_input = await page.query_selector("input[type=email], input[autocomplete=email], input[name=email]")
            if email_input:
                await email_input.fill(EMAIL)
                print(f"5. Email filled at step {attempt}")
                await page.screenshot(path=f"/tmp/tw_email{attempt}.png")
            
            # Try filling name
            name_input = await page.query_selector("input[autocomplete=name], input[name=name]")
            if name_input:
                await name_input.fill(NAME)
                print(f"6. Name filled at step {attempt}")
            
            # Try filling username
            user_input = await page.query_selector("input[autocomplete=username], input[name=username]")
            if user_input:
                await user_input.fill(USERNAME)
                print(f"7. Username filled at step {attempt}")
            
            await asyncio.sleep(1)
            
            # Check if we're at the password step
            pass_input = await page.query_selector("input[type=password]")
            if pass_input:
                await pass_input.fill(PASS)
                print(f"8. Password filled!")
                await page.screenshot(path=f"/tmp/tw_done.png")
                # Click sign up
                signup_btns = await page.query_selector_all("button")
                for sb in signup_btns:
                    try:
                        sbt = (await sb.text_content() or "").strip()
                        if "Sign up" in sbt or "Create" in sbt:
                            await sb.click()
                            print("   Signup clicked!")
                            await asyncio.sleep(5)
                            await page.screenshot(path=f"/tmp/tw_final.png")
                            print(f"   Final URL: {page.url}")
                            break
                    except: pass
        
        print("\n===")
        await page.screenshot(path="/tmp/tw_final_state.png", full_page=True)
        
        # Check if we got past signup
        if "home" in page.url.lower() or "onboarding" in page.url.lower() and "step" not in page.url.lower():
            print("🎉 ACCOUNT CREATED!")
        else:
            print("❌ Still on signup page")
        
        await browser.close()

asyncio.run(main())
