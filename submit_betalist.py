"""
Soumission à BetaList — le plus impactant des annuaires (newsletter 50k+)
"""
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        page = await context.new_page()
        
        print("=== BetaList ===")
        await page.goto("https://betalist.com/submissions/new", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(4)
        print(f"URL: {page.url}")
        await page.screenshot(path="/tmp/betalist_1.png")
        
        # Get all form fields
        fields = await page.query_selector_all("input, textarea, select, button, [role=combobox], [contenteditable=true]")
        print(f"\nInteractive elements: {len(fields)}")
        for f in fields:
            try:
                tag = await f.evaluate("""el => ({
                    tag: el.tagName,
                    type: el.type || '',
                    name: el.name || '',
                    placeholder: el.placeholder || el.getAttribute('aria-label') || '',
                    id: el.id || '',
                    class: (el.className || '').slice(0,40),
                    text: (el.textContent || '').trim().slice(0,40)
                })""")
                if tag['text'] or tag['placeholder'] or tag['name']:
                    print(f"  <{tag['tag']}> type={tag['type']} name={tag['name']} ph='{tag['placeholder']}' id={tag['id']} txt='{tag['text']}'")
            except: pass
        
        # Try to find email signup form (if not logged in)
        print("\n=== Checking login status ===")
        body = await page.text_content("body")
        if "sign in" in (body or "").lower():
            print("Need to sign in first")
        if "log in" in (body or "").lower():
            print("Log in option available")
        
        await browser.close()

asyncio.run(main())
