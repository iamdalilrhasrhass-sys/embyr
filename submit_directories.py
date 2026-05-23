"""
Soumission automatisée aux annuaires gratuits
"""
import asyncio, json, sys, time
from playwright.async_api import async_playwright

DIRECTORIES = [
    {
        "name": "BetaList",
        "url": "https://betalist.com/submissions/new",
        "title": "Embyr - Free Grindr Alternative",
        "desc": "Embyr is a free dating app for gay men. No ads, no paywalls, no sponsored profiles. Built as a real alternative to Grindr.",
        "tagline": "The dating app for gay men that actually respects you",
        "tags": "dating, lgbtq, gay, social, mobile"
    },
    {
        "name": "Launched.io",
        "url": "https://launched.io/SubmitStartup",
        "title": "Embyr",
        "desc": "Free alternative to Grindr for gay dating. Built because Grindr has 950k 1-star reviews.",
        "tagline": "Dating Without The BS",
        "tags": "dating, lgbtq"
    },
]

async def main():
    async with p.chromium.launch(headless=True) as browser:
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 800}
        )
        
        for d in DIRECTORIES:
            page = await context.new_page()
            print(f"\n=== {d['name']} ===")
            try:
                await page.goto(d['url'], timeout=20000, wait_until="domcontentloaded")
                await asyncio.sleep(3)
                await page.screenshot(path=f"/tmp/{d['name'].lower()}.png")
                print(f"Page loaded: {page.url}")
                
                # Try to find form fields
                inputs = await page.query_selector_all("input:not([type=hidden]), textarea")
                print(f"Form fields: {len(inputs)}")
                for inp in inputs[:10]:
                    try:
                        name = await inp.get_attribute("name") or ""
                        ph = await inp.get_attribute("placeholder") or ""
                        typ = await inp.get_attribute("type") or ""
                        print(f"  [{name}] [{ph}] [{typ}]")
                    except: pass
                        
            except Exception as e:
                print(f"Error: {e}")
            
            await page.close()
            await asyncio.sleep(2)
        
        await browser.close()

if __name__ == "__main__":
    import playwright.async_api as p
    asyncio.run(main())
