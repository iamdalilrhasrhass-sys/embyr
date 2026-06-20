#!/usr/bin/env python3
"""Reddit login + script app creation via SOCKS proxy. Uses playwright-stealth."""
import os, sys, time, re, json
from playwright.sync_api import sync_playwright
from playwright_stealth.stealth import Stealth

SOCKS = "socks5://localhost:1080"
USERNAME = "EmbirDating"
PASSWORD = "EmbirParis2026!"

def save_creds(cid, sec):
    data = {"client_id": cid, "client_secret": sec, "username": USERNAME, "password": PASSWORD}
    with open("/root/embyr/.reddit_creds.json", "w") as f:
        json.dump(data, f)
    with open("/root/embyr/.reddit_env", "w") as f:
        f.write(f"REDDIT_CLIENT_ID={cid}\nREDDIT_SECRET={sec}\nREDDIT_USERNAME={USERNAME}\nREDDIT_PASSWORD={PASSWORD}\n")
    print(f"  Credentials saved!")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            proxy={"server": SOCKS},
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
        )
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US",
            timezone_id="Europe/Paris"
        )
        page = ctx.new_page()
        
        # Apply stealth
        stealth = Stealth()
        stealth.apply_stealth_sync(page)
        
        print("[1] Login via old.reddit.com...")
        page.goto("https://old.reddit.com/login", timeout=60000, wait_until="networkidle")
        time.sleep(3)
        page.screenshot(path="/tmp/rl_stealth_old.png")
        print(f"  Title: {page.title()}")
        
        # Fill on old.reddit
        try:
            page.locator('#user_login').first.fill(USERNAME)
            time.sleep(1)
            page.locator('#passwd_login').first.fill(PASSWORD)
            time.sleep(1)
            page.locator('button[type="submit"]').first.click()
            time.sleep(5)
            print(f"  After login: {page.url}")
            page.screenshot(path="/tmp/rl_stealth_old2.png")
        except Exception as e:
            print(f"  Old Reddit fill error: {e}")
        
        # If old.reddit worked
        if "login" not in page.url.lower():
            print("[2] Login SUCCESS via old.reddit")
            
            # Go to apps on new Reddit
            page.goto("https://www.reddit.com/prefs/apps", timeout=60000)
            time.sleep(4)
            page.screenshot(path="/tmp/rl_stealth_apps.png")
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
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(1)
                
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
                page.screenshot(path="/tmp/rl_stealth_form.png")
                
                page.locator('input[name="name"]').first.fill("EmbirBot")
                time.sleep(0.5)
                page.locator('label:has-text("script")').first.click()
                time.sleep(0.5)
                page.locator('textarea[name="description"]').first.fill("Automation for Embir dating app - embir.xyz")
                time.sleep(0.5)
                page.locator('input[name="about_url"]').first.fill("https://embir.xyz")
                time.sleep(0.5)
                page.locator('input[name="redirect_uri"]').first.fill("http://localhost:8080")
                time.sleep(0.5)
                
                page.keyboard.press("Tab")
                time.sleep(0.5)
                page.keyboard.press("Tab")
                time.sleep(0.5)
                page.keyboard.press("Enter")
                time.sleep(5)
                page.screenshot(path="/tmp/rl_stealth_created.png")
                
                content2 = page.content()
                cid_match = re.findall(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', content2)
                sec_match = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', content2)
                
                if cid_match:
                    print(f"  APP CREATED! CID: {cid_match[0]}")
                    save_creds(cid_match[0], sec_match.group(1) if sec_match else "")
                    browser.close()
                    return True
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
                        browser.close()
                        return True
            except Exception as e:
                print(f"  Create error: {e}")
                import traceback; traceback.print_exc()
        else:
            print("  Old Reddit login FAILED - trying new Reddit...")
            page.goto("https://www.reddit.com/login/", timeout=60000, wait_until="networkidle")
            time.sleep(3)
            
            try:
                page.wait_for_selector('input[name="username"], #login-username', timeout=15000)
                page.evaluate(f"document.querySelector('input[name=\\\"username\\\"]') ? document.querySelector('input[name=\\\"username\\\"]').value = '{USERNAME}' : ''")
                time.sleep(0.5)
                page.evaluate(f"document.querySelector('input[name=\\\"password\\\"]') ? document.querySelector('input[name=\\\"password\\\"]').value = '{PASSWORD}' : ''")
                time.sleep(0.5)
                page.screenshot(path="/tmp/rl_stealth_new_filled.png")
                page.evaluate("document.querySelector('button[type=\\\"submit\\\"]') ? document.querySelector('button[type=\\\"submit\\\"]').click() : ''")
                time.sleep(5)
                page.screenshot(path="/tmp/rl_stealth_new_result.png")
                print(f"  New Reddit result: {page.url}")
            except Exception as e:
                print(f"  New Reddit error: {e}")
        
        browser.close()
        return False

if __name__ == "__main__":
    ok = main()
    sys.exit(0 if ok else 1)
