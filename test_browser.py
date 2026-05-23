"""
Simple test: Can we load Twitter signup page?
"""
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Loading...")
        await page.goto("https://twitter.com/i/flow/signup", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(3)
        
        print(f"URL: {page.url}")
        print(f"Title: {await page.title()}")
        
        html_content = await page.content()
        cf = "cloudflare" in html_content[:5000].lower()
        captcha = "captcha" in html_content[:5000].lower() or "recaptcha" in html_content[:5000].lower()
        print(f"Cloudflare: {cf}")
        print(f"CAPTCHA: {captcha}")
        
        await page.screenshot(path="/tmp/test_browser.png")
        
        if not cf and not captcha:
            # Fill email
            email_input = await page.query_selector("input[type=email], input[name=email], input[autocomplete=email]")
            if email_input:
                await email_input.fill("embyrpromo1779557374@wshu.net")
                print("Email filled!")
                await page.screenshot(path="/tmp/twitter_filled.png")
            else:
                print("No email input found")
                # List all inputs
                inputs = await page.query_selector_all("input")
                for inp in inputs:
                    info = await inp.evaluate("""el => ({
                        type: el.type, name: el.name, placeholder: el.placeholder,
                        aria: el.getAttribute('aria-label'), id: el.id, class: (el.className||'').slice(0,30)
                    })""")
                    print(f"  input: {info}")
        else:
            print("BLOCKED by anti-bot")
        
        await browser.close()

asyncio.run(main())
