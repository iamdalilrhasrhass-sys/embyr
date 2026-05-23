"""
Test d'inscription sur plusieurs plateformes via Playwright
Essaie Twitter, Pinterest, Tumblr, Medium
"""
import asyncio
from playwright.async_api import async_playwright

PLATFORMS = [
    {"name": "Twitter", "url": "https://twitter.com/i/flow/signup"},
    {"name": "Pinterest", "url": "https://www.pinterest.com/"},
    {"name": "Medium", "url": "https://medium.com/m/signin"},
    {"name": "Tumblr", "url": "https://www.tumblr.com/register"},
]

EMAIL = "embyrpromo1779557374@wshu.net"
USERNAME = "EmbyrDating"
PASS = "EmbyrPromo2026!"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        
        for plat in PLATFORMS:
            print(f"\n{'='*50}")
            print(f"=== {plat['name']} ===")
            print(f"{'='*50}")
            
            page = await context.new_page()
            try:
                await page.goto(plat['url'], timeout=25000, wait_until="domcontentloaded")
                await asyncio.sleep(3)
                print(f"URL: {page.url}")
                print(f"Title: {await page.title()}")
                await page.screenshot(path=f"/tmp/{plat['name'].lower()}_1.png")
                
                # Check for CAPTCHA / Cloudflare / block
                content = await page.content()
                cf = "cloudflare" in content.lower() or "cf-ray" in content.lower() or "just a moment" in content.lower()
                captcha = any(x in content.lower() for x in ["captcha", "recaptcha", "h-captcha", "g-recaptcha"])
                print(f"Cloudflare: {cf}")
                print(f"CAPTCHA: {captcha}")
                
                if cf:
                    print("❌ Cloudflare block")
                elif captcha:
                    print("❌ CAPTCHA required")
                else:
                    print("✅ Page loaded cleanly!")
                    
                    # Find form fields
                    inputs = await page.query_selector_all("input:not([type=hidden])")
                    print(f"  Inputs found: {len(inputs)}")
                    for inp in inputs[:8]:
                        try:
                            info = await inp.evaluate("""el => ({
                                type: el.type, name: el.name, 
                                placeholder: el.placeholder || el.getAttribute('aria-label') || '',
                                id: el.id, autocomplete: el.autocomplete
                            })""")
                            print(f"    [{info['type']}] name={info['name']} ph='{info['placeholder']}'")
                        except: pass
                    
                    # Try to find email field and fill it
                    for inp in inputs:
                        try:
                            ph = await inp.get_attribute("placeholder") or ""
                            name = await inp.get_attribute("name") or ""
                            if "email" in (ph + name).lower():
                                await inp.fill(EMAIL)
                                print(f"  ✅ Email filled in {name}")
                                break
                        except: pass
                    
                    await asyncio.sleep(1)
                    await page.screenshot(path=f"/tmp/{plat['name'].lower()}_2_filled.png")
                    
            except Exception as e:
                print(f"❌ Error: {str(e)[:100]}")
            
            await page.close()
            await asyncio.sleep(2)
        
        await browser.close()

asyncio.run(main())
