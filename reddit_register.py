"""
Crée un compte Reddit via Playwright + proxy + stealth
"""
import asyncio, json, sys, re, time
from playwright.async_api import async_playwright

PROXY = "http://174.137.134.182:2999"
EMAIL = "embirpromo1779557374@wshu.net"
PASSWORD = "EmbirPromo2026!"
USERNAME = "EmbirDating"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            proxy={"server": PROXY}
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="en-US"
        )
        page = await context.new_page()
        
        print("[1] Navigation vers Reddit...")
        try:
            await page.goto("https://www.reddit.com/register/", timeout=30000, wait_until="networkidle")
        except Exception as e:
            print(f"[!] Navigation error: {e}")
            await page.screenshot(path="/tmp/reddit_err1.png")
        
        await asyncio.sleep(3)
        print(f"[2] URL: {page.url}")
        print(f"[3] Titre: {await page.title()}")
        
        # Screenshot
        await page.screenshot(path="/tmp/reddit_register.png", full_page=True)
        
        # Check for CAPTCHA
        content = await page.content()
        captcha_indicators = ["captcha", "recaptcha", "h-captcha", "cf-turnstile", "g-recaptcha", "data-sitekey"]
        has_captcha = any(x in content.lower() for x in captcha_indicators)
        print(f"[4] CAPTCHA détecté: {has_captcha}")
        
        if has_captcha:
            # Extract the HTML around CAPTCHA for debugging
            for ind in captcha_indicators:
                if ind in content.lower():
                    idx = content.lower().find(ind)
                    print(f"[!] {ind} trouvé à position {idx}")
                    print(f"[!] Contexte: ...{content[max(0,idx-200):idx+200]}...")
                    print("---")
        
        # Try to find and fill the registration form
        forms = await page.query_selector_all("form, input[type=email], input[name=email]")
        print(f"[5] Éléments formulaire: {len(forms)}")
        
        for i, el in enumerate(forms[:10]):
            try:
                tag = await el.evaluate("el => el.tagName + (el.className ? '.' + el.className.slice(0,30) : '') + (el.name ? '[name='+el.name+']' : '')")
                print(f"  [{i}] {tag}")
            except:
                pass
        
        await asyncio.sleep(2)
        
        # Try typing email into email field
        try:
            email_field = await page.query_selector("input[name=email], input[type=email], input[id*=email]")
            if email_field:
                await email_field.fill(EMAIL)
                print("[6] Email rempli ✅")
            else:
                print("[6] Champ email non trouvé ❌")
        except Exception as e:
            print(f"[6] Erreur email: {e}")
        
        await page.screenshot(path="/tmp/reddit_filled.png", full_page=True)
        
        # Print visible text
        visible = await page.evaluate("""
            () => {
                const els = document.querySelectorAll('body *:not(script):not(style)');
                const texts = [];
                for (const el of els) {
                    if (el.children.length === 0 && el.textContent.trim()) {
                        texts.push(el.textContent.trim().slice(0,100));
                    }
                }
                return texts.join('\\n');
            }
        """)
        print(f"[7] Visible text:\n{visible[:2000]}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
