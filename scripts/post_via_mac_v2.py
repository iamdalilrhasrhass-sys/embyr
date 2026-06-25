#!/usr/bin/env python3
"""Post on Reddit via Mac SOCKS proxy using Playwright - v2 (new.reddit.com)"""
import asyncio, sys
from playwright.async_api import async_playwright

REDDIT_USER = "EmbirDating"
REDDIT_PASS = "EmbirParis2026!"
SOCKS_PROXY = "socks5://localhost:1080"

POSTS = [
    {
        "subreddit": "gaydating",
        "title": "J'ai créé Embir — une app de rencontre gay 100% gratuite, sans pub, sans limite",
        "body": """Les gars, parlons franchement.

Grindr te prend 30€/mois pour voir qui t'a liké. Tinder te cache les mecs derrière un paywall à 25€. Les pubs ? 3 par minute.

J'ai construit **Embir** → https://embir.xyz

🔥 100% gratuit en ce moment. Tout débloqué.
💰 Premium bientôt, 5x moins cher que Grindr.
🌍 25 langues. Traduction auto intégrée.
🛡️ Safe. Pas de dick pics en page d'accueil.

On est encore petits. Venez tester, critiquer, construire avec nous.

— L'équipe Embir"""
    },
]

async def main():
    print("=== EMBIR REDDIT POST (via Mac SOCKS) v2 ===", flush=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            proxy={"server": SOCKS_PROXY},
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
            ]
        )
        
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US",
            timezone_id="Europe/Paris",
        )
        
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
        """)
        
        page = await context.new_page()
        
        try:
            # Go to new.reddit.com which is less strict
            print("[1] Navigating to new.reddit.com...", flush=True)
            await page.goto("https://new.reddit.com/login", wait_until="networkidle", timeout=30000)
            await asyncio.sleep(3)
            print(f"  URL: {page.url[:100]}", flush=True)
            
            # Check if we're blocked
            body = await page.inner_text("body")
            if "blocked" in body.lower()[:200]:
                print("  ❌ Blocked!", flush=True)
                await browser.close()
                return
            
            # Try login
            print("[2] Trying to login...", flush=True)
            
            # new.reddit.com login - find inputs
            user_input = await page.query_selector('input[name="username"]')
            if not user_input:
                user_input = await page.query_selector('input[id*="user"]')
            if not user_input:
                user_input = await page.query_selector('input[autocomplete="username"]')
            
            if user_input:
                print("  Filling username...", flush=True)
                await user_input.click()
                await asyncio.sleep(0.5)
                await user_input.fill(REDDIT_USER)
                await asyncio.sleep(1)
            else:
                print(f"  No username input found. Body: {body[:400]}", flush=True)
                await browser.close()
                return
            
            pass_input = await page.query_selector('input[name="password"]')
            if pass_input:
                print("  Filling password...", flush=True)
                await pass_input.click()
                await asyncio.sleep(0.5)
                await pass_input.fill(REDDIT_PASS)
                await asyncio.sleep(1)
            
            # Click login button
            login_btn = await page.query_selector('button[type="submit"]')
            if not login_btn:
                login_btn = await page.query_selector('button:has-text("Log In")')
            if not login_btn:
                login_btn = await page.query_selector('button:has-text("Se connecter")')
            
            if login_btn:
                await login_btn.click()
                print("  Login submitted...", flush=True)
                await asyncio.sleep(3)
                
                # Wait for navigation
                try:
                    await page.wait_for_url("https://new.reddit.com/", timeout=10000)
                except:
                    pass
                
                print(f"  After login URL: {page.url[:100]}", flush=True)
                
                # Check if still on login
                if "login" in page.url.lower():
                    print("  ❌ Still on login page", flush=True)
                else:
                    print("  ✅ Logged in!", flush=True)
                    
                    # Post
                    print("\n[3] Posting...", flush=True)
                    submit_url = "https://new.reddit.com/r/gaydating/submit"
                    await page.goto(submit_url, wait_until="networkidle", timeout=20000)
                    await asyncio.sleep(3)
                    print(f"  Submit URL: {page.url[:100]}", flush=True)
                    
                    # Try filling title
                    title_el = await page.query_selector('textarea[placeholder*="title"]')
                    if not title_el:
                        title_el = await page.query_selector('textarea:first-of-type')
                    if not title_el:
                        title_el = await page.query_selector('div[contenteditable="true"]:first-of-type')
                    
                    if title_el:
                        tag = title_el.tag_name if hasattr(title_el, 'tag_name') else 'unknown'
                        print(f"  Title element: {tag}", flush=True)
                        await title_el.click()
                        await asyncio.sleep(0.5)
                        await title_el.fill(POSTS[0]["title"])
                        print("    Title ✓", flush=True)
                        await asyncio.sleep(1)
                    else:
                        print("  ❌ No title field", flush=True)
                        body = await page.inner_text("body")
                        print(f"  Body: {body[:500]}", flush=True)
                        await browser.close()
                        return
                    
                    # Fill body
                    body_el = await page.query_selector('div[contenteditable="true"]')
                    if not body_el:
                        body_el = await page.query_selector('.public-DraftEditor-content')
                    if not body_el:
                        body_el = await page.query_selector('textarea:last-of-type')
                    
                    if body_el:
                        await body_el.click()
                        await asyncio.sleep(0.5)
                        await body_el.fill(POSTS[0]["body"])
                        print("    Body ✓", flush=True)
                        await asyncio.sleep(1)
                    else:
                        print("  ❌ No body field", flush=True)
                        await browser.close()
                        return
                    
                    # Submit
                    submit_btn = await page.query_selector('button[type="submit"]')
                    if not submit_btn:
                        submit_btn = await page.query_selector('button:has-text("Post")')
                    if not submit_btn:
                        submit_btn = await page.query_selector('button:has-text("Submit")')
                    
                    if submit_btn:
                        await submit_btn.click()
                        await asyncio.sleep(5)
                        print(f"  Final URL: {page.url[:100]}", flush=True)
                        if '/comments/' in page.url:
                            print(f"  ✅ POSTED: {page.url}", flush=True)
                        else:
                            body_after = await page.inner_text("body")
                            print(f"  After submit body: {body_after[:400]}", flush=True)
                    else:
                        print("  ❌ No submit button", flush=True)
            else:
                print("  ❌ No login button found", flush=True)
                body = await page.inner_text("body")
                print(f"  Body: {body[:500]}", flush=True)
        
        except Exception as e:
            print(f"\n❌ ERROR: {e}", flush=True)
            import traceback
            traceback.print_exc()
        
        finally:
            await browser.close()

asyncio.run(main())
