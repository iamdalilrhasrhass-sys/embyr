#!/usr/bin/env python3
"""Create a new Reddit account + script app for Embir via SOCKS proxy (Mac IP)."""
import os, sys, json, time, re
from playwright.sync_api import sync_playwright

SOCKS_PROXY = "socks5://localhost:1080"
EMAIL = "embirparis2026@web-library.net"
PASSWORD = "EmbirParis2026!"
USERNAME = "EmbirDating"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            proxy={"server": SOCKS_PROXY}
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = context.new_page()

        # Step 1: Create new Reddit account
        print("[1/5] Navigating to Reddit signup...")
        page.goto("https://www.reddit.com/register/", timeout=60000)
        time.sleep(3)
        
        # Check if we're already on the signup form
        page.wait_for_load_state("networkidle")
        
        # Try to fill signup form
        try:
            # Reddit's signup form fields
            email_input = page.locator('input[name="email"]').first()
            if email_input.is_visible(timeout=5000):
                email_input.fill(EMAIL)
                time.sleep(1)
                
                # Click continue
                page.locator('button[type="submit"]').first().click()
                time.sleep(2)
                
                # Fill username
                username_input = page.locator('input[name="username"]').first()
                if username_input.is_visible(timeout=5000):
                    username_input.fill(USERNAME)
                    time.sleep(1)
                    page.locator('button[type="submit"]').first().click()
                    time.sleep(2)
                
                # Fill password
                pwd_input = page.locator('input[name="password"]').first()
                if pwd_input.is_visible(timeout=5000):
                    pwd_input.fill(PASSWORD)
                    time.sleep(1)
                    page.locator('button[type="submit"]').first().click()
                    time.sleep(3)
                    
            print("[2/5] Signup form submitted. Checking result...")
        except Exception as e:
            print(f"  Signup form may vary: {e}")
        
        time.sleep(3)
        page.screenshot(path="/tmp/reddit_signup_result.png")
        print(f"  Screenshot saved to /tmp/reddit_signup_result.png")
        
        # Check current URL
        current_url = page.url
        print(f"  Current URL: {current_url}")
        
        # Step 2: Navigate to apps page
        print("[3/5] Navigating to Reddit apps page...")
        page.goto("https://www.reddit.com/prefs/apps", timeout=60000, wait_until="networkidle")
        time.sleep(3)
        page.screenshot(path="/tmp/reddit_apps_page.png")
        
        # Step 3: Create a script app
        print("[4/5] Looking for create app button...")
        
        # Try different selectors for the create app button
        create_btn = page.locator('a[href*="create-app"], button:has-text("Create App"), button:has-text("create"), a:has-text("Create App")').first()
        if create_btn.is_visible(timeout=3000):
            create_btn.click()
            time.sleep(2)
        else:
            print("  Could not find create app button, trying to scroll...")
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(1)
            page.screenshot(path="/tmp/reddit_apps_scrolled.png")
        
        # Fill app form
        try:
            # Name
            name_input = page.locator('input[name="name"], input[id="name"], input[placeholder*="name"]').first()
            if name_input.is_visible(timeout=3000):
                name_input.fill("EmbirBot")
                time.sleep(1)
            
            # Select script radio
            script_radio = page.locator('input[type="radio"][value="script"], label:has-text("script")').first()
            if script_radio.is_visible(timeout=3000):
                script_radio.click()
                time.sleep(1)
            
            # Description
            desc_input = page.locator('textarea[name="description"], textarea[id="description"]').first()
            if desc_input.is_visible(timeout=3000):
                desc_input.fill("Automation for Embir dating app - embir.xyz")
                time.sleep(1)
            
            # About URL
            about_input = page.locator('input[name="about_url"], input[id="about-url"]').first()
            if about_input.is_visible(timeout=3000):
                about_input.fill("https://embir.xyz")
                time.sleep(1)
            
            # Redirect URI
            redirect_input = page.locator('input[name="redirect_uri"], input[id="redirect-uri"]').first()
            if redirect_input.is_visible(timeout=3000):
                redirect_input.fill("http://localhost:8080")
                time.sleep(1)
            
            # Submit
            submit_btn = page.locator('button[type="submit"]').first()
            if submit_btn.is_visible(timeout=3000):
                submit_btn.click()
                time.sleep(3)
                print("  App creation form submitted")
        except Exception as e:
            print(f"  Form fill error: {e}")
        
        time.sleep(3)
        page.screenshot(path="/tmp/reddit_app_created.png")
        
        # Step 4: Extract client_id and secret
        print("[5/5] Extracting API credentials...")
        
        # Reload apps page to see the created app
        page.goto("https://www.reddit.com/prefs/apps", timeout=60000, wait_until="networkidle")
        time.sleep(3)
        
        content = page.content()
        
        # Try to find app credentials in the page
        # Script apps have format: "personal use script" followed by the ID
        match = re.search(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', content)
        if match:
            client_id = match.group(1)
            print(f"  Client ID: {client_id}")
            
            # Secret is usually nearby
            secret_match = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', content)
            if secret_match:
                secret = secret_match.group(1)
                print(f"  Secret: {secret}")
                
                # Save credentials
                creds = {
                    "client_id": client_id,
                    "client_secret": secret,
                    "username": USERNAME,
                    "password": PASSWORD
                }
                with open("/root/embyr/.reddit_creds.json", "w") as f:
                    json.dump(creds, f)
                print(f"  Credentials saved to /root/embyr/.reddit_creds.json")
            else:
                print("  Could not find secret in page")
        else:
            print("  Could not find app credentials. Page content may not have loaded correctly.")
        
        page.screenshot(path="/tmp/reddit_final.png")
        browser.close()
    
    print("\nDone. Check screenshots in /tmp/reddit_*.png")

if __name__ == "__main__":
    main()
