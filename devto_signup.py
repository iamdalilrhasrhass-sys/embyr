"""
S'inscrire sur Dev.to via GitHub OAuth
Le navigateur est sur le VPS mais GitHub OAuth ne devrait pas nécessiter d'IP propre
"""
import asyncio, sys
from playwright.async_api import async_playwright

# GitHub token from GH CLI
GH_TOKEN = ""  # from env

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        print("=== DEV.TO GITHUB LOGIN ===")
        
        # Step 1: Go to Dev.to enter page
        await page.goto("https://dev.to/enter", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(3)
        print(f"1. URL: {page.url}")
        await page.screenshot(path="/tmp/devto_1.png")
        
        # Step 2: Click "Continue with GitHub"
        gh_btn = await page.query_selector("a[href*='github'], button:has-text('GitHub'), [data-provider='github']")
        if not gh_btn:
            gh_btn = await page.query_selector("a[href*='github']")
        
        if gh_btn:
            await gh_btn.click()
            print("2. Clicked GitHub login")
            await asyncio.sleep(5)
            print(f"3. URL: {page.url}")
            await page.screenshot(path="/tmp/devto_2_github.png")
        else:
            # List all links
            print("2. GitHub button not found. Listing links:")
            links = await page.query_selector_all("a")
            for l in links:
                try:
                    href = await l.get_attribute("href") or ""
                    txt = (await l.text_content() or "").strip()
                    if href and txt:
                        print(f"   {txt[:30]} -> {href[:80]}")
                except: pass
        
        # Step 3: Check if we're on GitHub authorization page
        if "github.com" in page.url:
            print("4. On GitHub authorization page!")
            await page.screenshot(path="/tmp/devto_3_gh_auth.png")
            
            # Check if we're already logged in on GitHub
            body_text = await page.text_content("body")
            has_authorize = "authorize" in (body_text or "").lower()
            print(f"5. Has authorize button: {has_authorize}")
            
            if has_authorize:
                # Click authorize
                auth_btn = await page.query_selector("button:has-text('Authorize'), button:has-text('Authorize')")
                if auth_btn:
                    await auth_btn.click()
                    print("6. Authorized!")
                    await asyncio.sleep(5)
                    print(f"7. Final URL: {page.url}")
                    await page.screenshot(path="/tmp/devto_4_done.png")
                else:
                    print("6. Authorize button not found, trying Enter")
                    await page.keyboard.press("Enter")
                    await asyncio.sleep(5)
                    print(f"7. Final URL: {page.url}")
            else:
                # Need to log in to GitHub first
                print("5. Not logged in to GitHub. Need to authenticate.")
                
                # Fill login form
                login_input = await page.query_selector("input[name=login], input[id=login_field]")
                pass_input = await page.query_selector("input[type=password]")
                
                if login_input and pass_input:
                    await login_input.fill("embirdating")
                    await pass_input.fill(GH_TOKEN)
                    print("6. Filled login (using token as password - might not work)")
                    
                    # Click sign in
                    signin_btn = await page.query_selector("button:has-text('Sign in'), input[type=submit]")
                    if signin_btn:
                        await signin_btn.click()
                        await asyncio.sleep(5)
                        print(f"7. URL after login: {page.url}")
                        await page.screenshot(path="/tmp/devto_5_postlogin.png")
        
        # Check final state
        await asyncio.sleep(3)
        final_text = await page.text_content("body") or ""
        if "dashboard" in page.url.lower() or "dev.to" in page.url:
            print(f"8. Final URL: {page.url}")
            await page.screenshot(path="/tmp/devto_final.png")
        else:
            print(f"8. Not on Dev.to: {page.url}")
        
        await browser.close()

asyncio.run(main())
