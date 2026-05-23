"""
Test d'inscription sur LinkedIn, Instagram, Facebook
"""
import asyncio
from playwright.async_api import async_playwright

EMAIL = "embyrpromo1779557374@wshu.net"
PASS = "EmbyrPromo2026!"
NAME = "Embyr Dating"

PLATFORMS = [
    {"name": "LinkedIn", "url": "https://www.linkedin.com/signup"},
    {"name": "Instagram", "url": "https://www.instagram.com/accounts/emailsignup/"},
    {"name": "Facebook", "url": "https://www.facebook.com/r.php"},
]

async def test_platform(platform):
    print(f"\n{'='*50}")
    print(f"=== {platform['name']} ===")
    print(f"{'='*50}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            await page.goto(platform['url'], timeout=25000, wait_until="domcontentloaded")
            await asyncio.sleep(4)
            print(f"URL: {page.url}")
            print(f"Title: {await page.title()}")
            await page.screenshot(path=f"/tmp/{platform['name'].lower()}_page.png")
            
            # Check for blocks
            text = await page.text_content("body") or ""
            cf = "cloudflare" in text.lower() or "just a moment" in text.lower()
            captcha = any(x in text.lower() for x in ["captcha", "recaptcha", "h-captcha"])
            
            if cf:
                print("❌ Cloudflare block")
            elif captcha:
                print("❌ CAPTCHA on page")
            else:
                print("✅ Page loaded!")
                
                # List input fields
                inputs = await page.query_selector_all("input:not([type=hidden])")
                print(f"Inputs: {len(inputs)}")
                for inp in inputs[:8]:
                    info = await inp.evaluate("""el => ({
                        name: el.name || '',
                        type: el.type || '',
                        ph: el.placeholder || el.getAttribute('aria-label') || '',
                        id: el.id || ''
                    })""")
                    print(f"  [{info['name']}] type={info['type']} ph='{info['ph']}'")
                
                # Try to fill email
                for inp in inputs:
                    try:
                        name = await inp.get_attribute("name") or ""
                        ph = await inp.get_attribute("placeholder") or ""
                        aria = await inp.get_attribute("aria-label") or ""
                        field_type = await inp.get_attribute("type") or ""
                        
                        if "email" in (name + ph + aria).lower() and "email" in field_type:
                            await inp.fill(EMAIL)
                            print(f"✅ Email filled in '{name}'")
                            break
                    except: pass
                
                await page.screenshot(path=f"/tmp/{platform['name'].lower()}_filled.png")
                
        except Exception as e:
            print(f"❌ Error: {str(e)[:100]}")
        
        await browser.close()

async def main():
    for plat in PLATFORMS:
        await test_platform(plat)

asyncio.run(main())
