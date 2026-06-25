#!/usr/bin/env python3
"""Post on Reddit via Mac SOCKS proxy using Playwright"""
import asyncio, random, sys, os
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
    print("=== EMBIR REDDIT POST (via Mac SOCKS) ===", flush=True)
    print(f"User: u/{REDDIT_USER}", flush=True)
    print(f"Proxy: {SOCKS_PROXY}", flush=True)
    
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
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="fr-FR",
            timezone_id="Europe/Paris",
        )
        
        # Add stealth script
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
            Object.defineProperty(navigator, 'languages', {get: () => ['fr-FR', 'fr', 'en-US', 'en']});
        """)
        
        page = await context.new_page()
        
        try:
            # 1. Navigate to login
            print("\n[1/3] Navigating to Reddit login...", flush=True)
            await page.goto("https://old.reddit.com/login", wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(3)
            print(f"  Page: {await page.title()}", flush=True)
            print(f"  URL: {page.url}", flush=True)
            
            # 2. Login via old.reddit.com (less bot detection)
            print("[2/3] Attempting login on old.reddit.com...", flush=True)
            
            username_el = await page.query_selector('input[name="user"]')
            if not username_el:
                username_el = await page.query_selector('input[name="username"]')
            
            if username_el:
                print("  Filling credentials...", flush=True)
                await username_el.fill(REDDIT_USER)
                await asyncio.sleep(1)
                
                pass_el = await page.query_selector('input[name="passwd"]')
                if not pass_el:
                    pass_el = await page.query_selector('input[name="password"]')
                if pass_el:
                    await pass_el.fill(REDDIT_PASS)
                    await asyncio.sleep(1)
                
                # Click submit
                submit = await page.query_selector('button[type="submit"]')
                if not submit:
                    submit = await page.query_selector('#login-form input[type="submit"]')
                if submit:
                    await submit.click()
                    print("  Login submitted, waiting...", flush=True)
                    await asyncio.sleep(5)
                    print(f"  After login URL: {page.url}", flush=True)
                    print(f"  After login title: {await page.title()}", flush=True)
                else:
                    print("  ❌ Submit button not found", flush=True)
            else:
                print("  ❌ Username field not found", flush=True)
                # Check page content
                body = await page.inner_text("body")
                print(f"  Body preview: {body[:300]}", flush=True)
            
            # Check if login succeeded
            page_content = await page.content()
            if "login" in page.url.lower() and "password" in page_content.lower():
                print("  ❌ Still on login page — auth failed or CAPTCHA", flush=True)
                # Try new.reddit.com as fallback
                print("\n  Retrying on new.reddit.com...", flush=True)
                await page.goto("https://www.reddit.com/login/", wait_until="domcontentloaded", timeout=30000)
                await asyncio.sleep(4)
                print(f"  URL: {page.url}", flush=True)
                
                # Try new-style login
                user_input = await page.query_selector('input[name="username"]')
                if user_input:
                    print("  Filling username (new)...", flush=True)
                    await user_input.fill(REDDIT_USER)
                    await asyncio.sleep(1)
                    pass_input = await page.query_selector('input[name="password"]')
                    if pass_input:
                        await pass_input.fill(REDDIT_PASS)
                        await asyncio.sleep(1)
                    btn = await page.query_selector('button[type="submit"]')
                    if btn:
                        await btn.click()
                        print("  Submitted, waiting...", flush=True)
                        await asyncio.sleep(6)
                        print(f"  URL after: {page.url}", flush=True)
                
                if "login" in page.url.lower():
                    print("  ❌ Still on login — CAPTCHA likely", flush=True)
                    await browser.close()
                    return
            
            # 3. Post
            print("\n[3/3] Posting...", flush=True)
            
            target = sys.argv[1] if len(sys.argv) > 1 else "r/gaydating"
            if not target.startswith("r/"):
                target = f"r/{target}"
            
            post_data = next((p for p in POSTS if target.lower() in [f"r/{p['subreddit']}".lower(), p['subreddit'].lower()]), POSTS[0])
            subreddit_name = post_data['subreddit'] if target.lower() == f"r/{post_data['subreddit']}".lower() else target.replace("r/", "")
            
            submit_url = f"https://www.reddit.com/r/{subreddit_name}/submit"
            print(f"  Posting to {submit_url}...", flush=True)
            await page.goto(submit_url, wait_until="domcontentloaded", timeout=20000)
            await asyncio.sleep(4)
            print(f"  Page: {await page.title()}", flush=True)
            
            # Try old.reddit.com submit
            if "old.reddit.com" not in page.url:
                await page.goto(f"https://old.reddit.com/r/{subreddit_name}/submit", wait_until="domcontentloaded", timeout=20000)
                await asyncio.sleep(3)
                print(f"  Trying old: {page.url}", flush=True)
            
            # Fill title
            title_el = await page.query_selector('textarea[name="title"]')
            if not title_el:
                title_el = await page.query_selector('input[name="title"]')
            if not title_el:
                title_el = await page.query_selector('textarea[placeholder*="title"]')
            
            if title_el:
                await title_el.fill(post_data["title"])
                print("    Title ✓", flush=True)
                await asyncio.sleep(1)
            else:
                print("    ❌ Title field not found", flush=True)
                # debug
                body_text = await page.inner_text("body")
                print(f"    Body: {body_text[:400]}", flush=True)
                await browser.close()
                return
            
            # Fill body
            body_el = await page.query_selector('textarea[name="text"]')
            if not body_el:
                body_el = await page.query_selector('div[contenteditable="true"]')
            if not body_el:
                body_el = await page.query_selector('.public-DraftEditor-content')
            
            if body_el:
                await body_el.click()
                await asyncio.sleep(0.5)
                await body_el.fill(post_data["body"])
                print("    Body ✓", flush=True)
                await asyncio.sleep(1)
            else:
                print("    ❌ Body field not found", flush=True)
                await browser.close()
                return
            
            # Submit
            submit_btn = await page.query_selector('button[type="submit"]')
            if not submit_btn:
                submit_btn = await page.query_selector('text=Submit')
            if not submit_btn:
                submit_btn = await page.query_selector('text=Post')
            
            if submit_btn:
                await submit_btn.click()
                await asyncio.sleep(5)
                
                current_url = page.url
                if '/comments/' in current_url or 'reddit.com/r/' in current_url:
                    print(f"    ✅ POSTED: {current_url[:100]}", flush=True)
                else:
                    print(f"    ⚠️ After submit URL: {current_url[:100]}", flush=True)
                    body_after = await page.inner_text("body")
                    print(f"    Body: {body_after[:300]}", flush=True)
            else:
                print("    ❌ Submit button not found", flush=True)
            
            print("\n=== POSTING COMPLETE ===", flush=True)
        
        except Exception as e:
            print(f"\n❌ ERROR: {e}", flush=True)
            import traceback
            traceback.print_exc()
        
        finally:
            await browser.close()

asyncio.run(main())
