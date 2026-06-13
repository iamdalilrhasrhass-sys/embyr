#!/usr/bin/env python3
"""Reddit login + script app creation via SOCKS proxy. Fixed version."""
import os, sys, time, re, json
from playwright.sync_api import sync_playwright

SOCKS = "socks5://localhost:1080"
USERNAME = "EmbyrDating"
PASSWORD = "EmbyrParis2026!"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            proxy={"server": SOCKS}
        )
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = ctx.new_page()
        
        print("[1] Login...")
        page.goto("https://www.reddit.com/login/", timeout=60000)
        time.sleep(4)
        page.screenshot(path="/tmp/rl1.png")
        
        # Try old.reddit.com login which is simpler
        page.goto("https://old.reddit.com/login", timeout=60000)
        time.sleep(3)
        page.screenshot(path="/tmp/rl_old.png")
        print(f"  Old Reddit: {page.title()}")
        
        # Fill on old.reddit
        try:
            page.locator('#user_login').first.fill(USERNAME)
            page.locator('#passwd_login').first.fill(PASSWORD)
            page.locator('button[type="submit"]').first.click()
            time.sleep(5)
            print(f"  Old Reddit after login: {page.url}")
            page.screenshot(path="/tmp/rl_old2.png")
        except Exception as e:
            print(f"  Old Reddit fill error: {e}")
        
        # If old.reddit worked, use it for API app
        if "login" not in page.url.lower():
            print("[2] Login SUCCESS via old.reddit")
            
            # Go to apps on new Reddit
            page.goto("https://www.reddit.com/prefs/apps", timeout=60000)
            time.sleep(4)
            page.screenshot(path="/tmp/rl_apps.png")
            print(f"  Apps page: {page.title()}")
            
            content = page.content()
            existing = re.findall(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', content)
            if existing:
                cid = existing[0]
                sec_match = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', content)
                sec = sec_match.group(1) if sec_match else ""
                print(f"  EXISTING APP: {cid}:{sec}")
                save_creds(cid, sec)
                browser.close()
                return True
            
            print("[3] Creating app...")
            try:
                # Look for "create app" or "create another app" link/button
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(1)
                
                # Try all possible selectors
                for text in ["create app", "create another app", "create an app"]:
                    for tag in ['a', 'button']:
                        try:
                            el = page.locator(f'{tag}:has-text("{text}")').first
                            if el.is_visible(timeout=1000):
                                el.click()
                                print(f"  Clicked {tag}: {text}")
                                break
                        except:
                            pass
                
                time.sleep(3)
                page.screenshot(path="/tmp/rl_form.png")
                
                # Fill form fields by label/text
                page.locator('input[name="name"]').first.fill("EmbyrBot")
                print("  Filled name")
                time.sleep(0.5)
                
                # Try to select radio by clicking its label
                page.locator('label:has-text("script")').first.click()
                print("  Selected script")
                time.sleep(0.5)
                
                page.locator('textarea[name="description"]').first.fill("Automation for Embyr dating app - embir.xyz")
                print("  Filled desc")
                time.sleep(0.5)
                
                page.locator('input[name="about_url"]').first.fill("https://embir.xyz")
                print("  Filled about")
                time.sleep(0.5)
                
                page.locator('input[name="redirect_uri"]').first.fill("http://localhost:8080")
                print("  Filled redirect")
                time.sleep(0.5)
                
                # Submit - try Enter key or find submit
                page.keyboard.press("Tab")
                time.sleep(0.5)
                page.keyboard.press("Tab")
                time.sleep(0.5)
                page.keyboard.press("Enter")
                time.sleep(5)
                page.screenshot(path="/tmp/rl_created.png")
                
                # Extract credentials
                content2 = page.content()
                cid_match = re.findall(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', content2)
                sec_match = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', content2)
                
                if cid_match:
                    print(f"  APP CREATED! CID: {cid_match[0]}")
                    save_creds(cid_match[0], sec_match.group(1) if sec_match else "")
                else:
                    print("  Created but couldn't extract creds, reloading...")
                    page.reload()
                    time.sleep(3)
                    content3 = page.content()
                    cid_match = re.findall(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', content3)
                    if cid_match:
                        sec_match = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', content3)
                        print(f"  Found after reload: {cid_match[0]}")
                        save_creds(cid_match[0], sec_match.group(1) if sec_match else "")
            except Exception as e:
                print(f"  Create error: {e}")
                import traceback; traceback.print_exc()
        else:
            print("  Login FAILED - trying new Reddit login...")
            # Try new Reddit login directly
            page.goto("https://www.reddit.com/login/", timeout=60000)
            time.sleep(3)
            
            try:
                # Wait for form to be ready
                page.wait_for_selector('input[name="username"], #login-username', timeout=15000)
                
                # Fill using JS for better compatibility
                page.evaluate(f"document.querySelector('input[name=\"username\"]') ? document.querySelector('input[name=\"username\"]').value = '{USERNAME}' : ''")
                time.sleep(0.5)
                page.evaluate(f"document.querySelector('input[name=\"password\"]') ? document.querySelector('input[name=\"password\"]').value = '{PASSWORD}' : ''")
                time.sleep(0.5)
                
                page.screenshot(path="/tmp/rl_new_filled.png")
                
                # Click submit
                page.evaluate("document.querySelector('button[type=\"submit\"]') ? document.querySelector('button[type=\"submit\"]').click() : ''")
                time.sleep(5)
                page.screenshot(path="/tmp/rl_new_result.png")
                print(f"  New Reddit result: {page.url}")
            except Exception as e:
                print(f"  New Reddit error: {e}")
        
        browser.close()
        return False

def save_creds(cid, sec):
    data = {"client_id": cid, "client_secret": sec, "username": USERNAME, "password": PASSWORD}
    with open("/root/embyr/.reddit_creds.json", "w") as f:
        json.dump(data, f)
    with open("/root/embyr/.reddit_env", "w") as f:
        f.write(f"REDDIT_CLIENT_ID={cid}\nREDDIT_SECRET={sec}\nREDDIT_USERNAME={USERNAME}\nREDDIT_PASSWORD={PASSWORD}\n")
    print(f"  Credentials saved!")

if __name__ == "__main__":
    ok = main()
    sys.exit(0 if ok else 1)
