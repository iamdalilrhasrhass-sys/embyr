"""
Inscription sur ProductHunt via navigateur + vérification de l'état GitHub
"""
import asyncio, json, sys
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        # Étape 1 : Vérifier ProductHunt
        print("=== 1. ProductHunt ===")
        await page.goto("https://www.producthunt.com/", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(2)
        print(f"Title: {await page.title()}")
        print(f"URL: {page.url}")
        await page.screenshot(path="/tmp/ph_1.png", full_page=True)
        
        # Check if there's a "Sign in" or "Get started" button
        content = await page.content()
        has_login = "sign in" in content.lower() or "log in" in content.lower()
        has_github = "github" in content.lower()
        print(f"Login button visible: {has_login}")
        print(f"GitHub OAuth option: {has_github}")
        
        # Try to find and click "Sign in with GitHub"
        github_btn = await page.query_selector("a[href*='github'], button:has-text('GitHub')")
        if not github_btn:
            github_btn = await page.query_selector("[data-test*=github], [class*=github]")
        
        if github_btn:
            print("GitHub button found, clicking...")
            await github_btn.click()
            await asyncio.sleep(5)
            print(f"After click URL: {page.url}")
            await page.screenshot(path="/tmp/ph_github.png", full_page=True)
        else:
            print("GitHub button not found")
            # Look at what buttons are available
            buttons = await page.query_selector_all("a, button")
            for b in buttons[:20]:
                try:
                    txt = await b.text_content()
                    href = await b.get_attribute("href") or ""
                    if txt and txt.strip():
                        print(f"  [{txt.strip()[:30]}] href={href[:50]}")
                except:
                    pass
        
        await asyncio.sleep(2)
        
        # Étape 2 : Vérifier Dev.to
        print("\n=== 2. Dev.to ===")
        await page.goto("https://dev.to/enter", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(2)
        await page.screenshot(path="/tmp/devto_1.png", full_page=True)
        
        gh_btn = await page.query_selector("a[href*='github'], button:has-text('GitHub')")
        if gh_btn:
            print("GitHub button found on Dev.to!")
            await gh_btn.click()
            await asyncio.sleep(5)
            print(f"After click URL: {page.url}")
            await page.screenshot(path="/tmp/devto_github.png", full_page=True)
        else:
            print("GitHub button not found on Dev.to")
            content = await page.content()
            if "github" in content.lower():
                print("GitHub mentioned in page content")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
