#!/usr/bin/env python3
"""
Reddit + X.com account creation for Embyr brand.
Uses Playwright with chromium - resilient version.
"""

import json
import os
import re
import time
from datetime import datetime, timezone

from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout

CREDS_PATH = "/root/embyr/.social_creds.json"
EMAIL = "embirparis2026@web-library.net"
PASSWORD = "EmbyrParis2026!"
REDDIT_USERNAME = "EmbyrDating"

creds = {
    "reddit": {"username": REDDIT_USERNAME, "email": EMAIL, "password": PASSWORD, "script_app": {}},
    "xcom": {"email": EMAIL, "password": PASSWORD, "status": "not_attempted"},
    "last_updated": datetime.now(timezone.utc).isoformat()
}

def save_creds():
    os.makedirs(os.path.dirname(CREDS_PATH), exist_ok=True)
    with open(CREDS_PATH, "w") as f:
        json.dump(creds, f, indent=2)
    print(f"[+] Credentials saved to {CREDS_PATH}")

def safe_goto(page, url, timeout=30000):
    """Navigate with fallback timeout handling."""
    try:
        page.goto(url, timeout=timeout, wait_until="domcontentloaded")
        return True
    except Exception as e:
        print(f"[!] goto warning ({url}): {e}")
        return False

def safe_wait(page, selector, timeout=8000):
    """Try to wait for a selector, return element or None."""
    try:
        return page.wait_for_selector(selector, timeout=timeout)
    except:
        return None

def save_snapshot(page, name):
    """Save a screenshot for debugging."""
    os.makedirs("/root/embyr/screenshots", exist_ok=True)
    try:
        page.screenshot(path=f"/root/embyr/screenshots/{name}.png", full_page=False)
        print(f"[*] Screenshot saved: {name}.png")
    except Exception as e:
        print(f"[!] Screenshot failed: {e}")

def fill_field(page, selectors, value):
    """Try multiple selectors to fill a field."""
    for sel in selectors:
        try:
            el = page.wait_for_selector(sel, timeout=3000)
            if el and el.is_visible():
                el.fill(value)
                print(f"[+] Filled '{value[:15]}...' using: {sel}")
                return True
        except:
            continue
    return False

def click_any(page, selectors_list, timeout=4000):
    """Try multiple selectors/predicates to click something."""
    for item in selectors_list:
        try:
            if isinstance(item, re.Pattern):
                # Regex pattern - use get_by_role
                btn = page.get_by_role("button", name=item)
                if btn.count() > 0 and btn.first.is_visible():
                    btn.first.click()
                    print(f"[+] Clicked button matching pattern: {item.pattern}")
                    return True
            elif isinstance(item, str):
                if item.startswith("css:"):
                    css = item[4:]
                    el = page.wait_for_selector(css, timeout=2000)
                    if el and el.is_visible():
                        el.click()
                        print(f"[+] Clicked: {css}")
                        return True
                elif item.startswith("text:"):
                    txt = item[5:]
                    el = page.locator(f"text={txt}").first
                    if el and el.is_visible():
                        el.click()
                        print(f"[+] Clicked text: {txt}")
                        return True
                else:
                    el = page.locator(item).first
                    if el and el.is_visible():
                        el.click()
                        print(f"[+] Clicked: {item}")
                        return True
        except:
            pass
    return False


def create_reddit_account(page):
    """Step 1: Create Reddit account."""
    print("[*] Step 1: Creating Reddit account...")
    safe_goto(page, "https://www.reddit.com/register/")
    page.wait_for_load_state("load", timeout=15000)
    time.sleep(3)
    save_snapshot(page, "reddit_register")

    # Fill email
    fill_field(page, [
        '#regEmail', 'input[name="email"]', 'input[type="email"]',
        'input[autocomplete="email"]', 'input[id*="email"]'
    ], EMAIL)

    # Click Continue
    click_any(page, [
        re.compile(r"continue", re.I),
        re.compile(r"next", re.I),
        re.compile(r"sign up", re.I),
        re.compile(r"create account", re.I),
        "css:button[type='submit']",
        "text:Continue",
    ])
    time.sleep(3)
    save_snapshot(page, "reddit_register_step2")

    # Fill username
    fill_field(page, [
        '#regUsername', 'input[name="username"]', 'input[id*="username"]'
    ], REDDIT_USERNAME)

    # Fill password
    fill_field(page, [
        '#regPassword', 'input[name="password"]', 'input[type="password"]', 'input[id*="password"]'
    ], PASSWORD)

    time.sleep(1)
    save_snapshot(page, "reddit_register_filled")

    # Click sign up
    click_any(page, [
        re.compile(r"sign up", re.I),
        re.compile(r"create account", re.I),
        re.compile(r"continue", re.I),
        "css:button[type='submit']",
    ])
    time.sleep(4)
    save_snapshot(page, "reddit_register_result")
    print("[*] Reddit registration step done.")


def login_reddit(page):
    """Log in to Reddit to access prefs/apps."""
    print("[*] Logging into Reddit...")
    safe_goto(page, "https://www.reddit.com/login/")
    time.sleep(2)
    save_snapshot(page, "reddit_login")

    fill_field(page, [
        '#login-username', 'input[name="username"]', 'input[autocomplete="username"]',
        'input[type="text"]', 'input[id*="user"]'
    ], REDDIT_USERNAME)

    fill_field(page, [
        '#login-password', 'input[name="password"]', 'input[type="password"]'
    ], PASSWORD)

    time.sleep(1)

    click_any(page, [
        re.compile(r"log in", re.I),
        re.compile(r"sign in", re.I),
        re.compile(r"continue", re.I),
        "css:button[type='submit']",
    ])
    time.sleep(4)
    save_snapshot(page, "reddit_login_result")
    print(f"[*] After login URL: {page.url}")


def create_script_app(page):
    """Create a Reddit script app and get client_id + secret."""
    print("[*] Creating Reddit script app...")
    safe_goto(page, "https://www.reddit.com/prefs/apps")
    time.sleep(3)
    save_snapshot(page, "reddit_apps")

    # Try to find and click "create app" / "developer" button
    click_any(page, [
        re.compile(r"create.*app", re.I),
        re.compile(r"developer", re.I),
        re.compile(r"create another", re.I),
    ])

    # If not found, maybe we need to scroll
    if "create" not in page.content().lower():
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1)
        save_snapshot(page, "reddit_apps_scrolled")
        click_any(page, [
            re.compile(r"create.*app", re.I),
            re.compile(r"developer", re.I),
        ])

    time.sleep(3)
    save_snapshot(page, "reddit_app_form")

    # Fill form
    fill_field(page, [
        'input[name="name"]', 'input[id*="name"]', 'input[placeholder*="name"]'
    ], "EmbyrBot")

    # Try to select 'script' radio
    try:
        script_radio = page.locator('input[type="radio"][value="script"]')
        if script_radio.count() > 0:
            script_radio.first.click()
            print("[+] Selected script radio")
        else:
            # Try label for script
            script_label = page.locator('label:has-text("script")')
            if script_label.count() > 0:
                script_label.first.click()
                print("[+] Clicked script label")
    except:
        pass

    # Check if we need to deselect other radio first
    try:
        # Reddit sometimes has a select/dropdown for app type
        select_el = page.locator('select[name*="type"], select[id*="type"]')
        if select_el.count() > 0:
            select_el.first.select_option("script")
            print("[+] Selected script from dropdown")
    except:
        pass

    fill_field(page, [
        'input[name="redirect_uri"]', 'input[placeholder*="redirect"]', 'input[id*="redirect"]'
    ], "http://localhost:8080")

    fill_field(page, [
        'textarea[name="description"]', 'textarea[placeholder*="description"]'
    ], "Embyr Dating - Reddit integration bot")

    time.sleep(1)
    save_snapshot(page, "reddit_form_filled")

    # Submit
    click_any(page, [
        re.compile(r"create app", re.I),
        "css:button[type='submit']",
    ])
    time.sleep(5)
    save_snapshot(page, "reddit_app_created")

    # Extract client_id and secret
    time.sleep(2)
    
    # Use JavaScript to find app info
    try:
        page_info = page.evaluate("""() => {
            const body = document.body;
            // Look for text containing 'personal use script' or app info
            const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            let results = [];
            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                if (text.length > 5 && text.length < 100) {
                    results.push(text);
                }
            }
            return results.join('\\n');
        }""")
        print(f"[*] Page text scan results (first 2000 chars):")
        print(page_info[:2000])
    except Exception as e:
        print(f"[!] JS scan error: {e}")

    # Try regex extraction from full page
    full_text = page.content()
    client_id = None
    client_secret = None

    # Reddit shows: "personal use script [CLIENT_ID]" in the app card
    m = re.search(r'personal use script[\s:]*([a-zA-Z0-9_-]{10,})', full_text, re.I)
    if m:
        client_id = m.group(1).strip()
        print(f"[+] Found client_id: {client_id}")

    if not client_id:
        # Try broad pattern - Reddit client IDs look like random 20+ char strings
        # Usually preceded by some text
        m = re.search(r'EmbyrBot.*?([a-zA-Z0-9_-]{14,})', full_text, re.I)
        if m:
            client_id = m.group(1).strip()
            print(f"[+] Found client_id (via EmbyrBot context): {client_id}")

    # Secret is usually shown as "secret: [SECRET]"
    m = re.search(r'(?:secret|app secret)[\s:]*([a-zA-Z0-9_-]{10,})', full_text, re.I)
    if m:
        client_secret = m.group(1).strip()
        print(f"[+] Found secret: {client_secret[:8]}...")

    if not client_secret:
        m = re.search(r'EmbyrBot.*?secret[\s:]*([a-zA-Z0-9_-]{10,})', full_text, re.I | re.DOTALL)
        if m:
            client_secret = m.group(1).strip()
            print(f"[+] Found secret (via EmbyrBot context): {client_secret[:8]}...")

    return client_id, client_secret


def try_xcom_registration(page):
    """Attempt to create an X.com account."""
    print("\n[*] Trying X.com registration...")
    creds["xcom"]["status"] = "attempted"

    safe_goto(page, "https://x.com/signup")
    time.sleep(3)
    save_snapshot(page, "xcom_signup")

    # Check what we see
    page_text = page.content()

    # X.com flow varies. Let's try the most common path:
    # 1. Name, 2. Email, 3. DOB, 4. Verification

    # Name
    fill_field(page, [
        'input[name="name"]', 'input[autocomplete="name"]',
        'input[data-testid*="name"]', 'input[placeholder*="name"]'
    ], "Embyr")

    time.sleep(1)
    click_any(page, [
        re.compile(r"next", re.I),
        re.compile(r"continue", re.I),
        "css:button[role='button']:has-text('Next')",
    ])
    time.sleep(2)
    save_snapshot(page, "xcom_step2")

    # Email
    fill_field(page, [
        'input[name="email"]', 'input[type="email"]',
        'input[autocomplete="email"]', 'input[data-testid*="email"]'
    ], EMAIL)

    time.sleep(1)
    click_any(page, [
        re.compile(r"next", re.I),
        re.compile(r"continue", re.I),
        "css:button[role='button']:has-text('Next')",
    ])
    time.sleep(2)
    save_snapshot(page, "xcom_step3")

    # Some X.com flows ask for phone or have a "use email instead" link
    page_text2 = page.content().lower()
    if "phone" in page_text2 and "use email" in page_text2:
        print("[*] X.com wants phone - trying 'use email instead'")
        try:
            use_email = page.locator('text=use email instead, text=Sign up with email')
            if use_email.count() > 0:
                use_email.first.click()
                print("[+] Clicked 'use email instead'")
                time.sleep(2)
                fill_field(page, ['input[type="email"]', 'input[name="email"]'], EMAIL)
                time.sleep(1)
                click_any(page, [re.compile(r"next", re.I), "css:button[role='button']:has-text('Next')"])
                time.sleep(2)
                save_snapshot(page, "xcom_step3_email")
        except:
            pass

    # Date of birth (if asked)
    dob_fields = ['input[name="birth_date"]', 'input[placeholder*="birth"]',
                  'select[name*="month"]', 'select[name*="day"]', 'select[name*="year"]']
    month_sel = page.locator('select[id*="month"], select[name*="month"]')
    day_sel = page.locator('select[id*="day"], select[name*="day"]')
    year_sel = page.locator('select[id*="year"], select[name*="year"]')

    if month_sel.count() > 0:
        print("[*] X.com asking for date of birth")
        try:
            month_sel.first.select_option("1")  # January
            day_sel.first.select_option("15")   # 15th
            year_sel.first.select_option("1990") # 1990
            print("[+] Filled DOB (Jan 15, 1990)")
            time.sleep(1)
            click_any(page, [re.compile(r"next", re.I), "css:button[role='button']:has-text('Next')"])
            time.sleep(2)
            save_snapshot(page, "xcom_step4")
        except:
            pass

    time.sleep(2)
    save_snapshot(page, "xcom_final")

    # Check status
    page_text_final = page.content().lower()
    if "verify" in page_text_final or "code" in page_text_final or "confirm" in page_text_final:
        creds["xcom"]["status"] = "needs_verification"
        creds["xcom"]["note"] = "Email/phone verification code required"
        print("[!] X.com requires verification - cannot complete without access to email")
    elif "already" in page_text_final and "used" in page_text_final:
        creds["xcom"]["status"] = "email_taken"
        creds["xcom"]["note"] = "Email already registered"
        print("[!] X.com: Email already in use")
    elif "signup" in page_text_final or "create" in page_text_final:
        creds["xcom"]["status"] = "still_on_form"
        print("[!] X.com: Still on registration form, something field didn't work")
    else:
        creds["xcom"]["status"] = "submitted"
        print("[*] X.com registration submitted (likely needs verification)")

    save_creds()


def main():
    print("=" * 60)
    print("Reddit + X.com Account Creation for Embyr")
    print("=" * 60)
    print(f"Email: {EMAIL}")
    print(f"Reddit Username: {REDDIT_USERNAME}")
    print()

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="/root/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome",
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        # === REDDIT ===
        create_reddit_account(page)
        time.sleep(3)

        client_id, client_secret = None, None
        try:
            login_reddit(page)
            time.sleep(2)
            client_id, client_secret = create_script_app(page)
        except Exception as e:
            print(f"[!] Error during Reddit app creation: {e}")

        if client_id:
            creds["reddit"]["script_app"]["client_id"] = client_id
        if client_secret:
            creds["reddit"]["script_app"]["client_secret"] = client_secret
        creds["reddit"]["script_app"]["name"] = "EmbyrBot"
        creds["reddit"]["script_app"]["type"] = "script"
        creds["reddit"]["script_app"]["redirect_uri"] = "http://localhost:8080"
        save_creds()

        # === X.COM ===
        try:
            try_xcom_registration(page)
        except Exception as e:
            print(f"[!] Error during X.com registration: {e}")
            creds["xcom"]["status"] = "error"
            creds["xcom"]["error"] = str(e)

        browser.close()

    print("\n" + "=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)
    with open(CREDS_PATH) as f:
        print(f.read())
    print("=" * 60)


if __name__ == "__main__":
    main()
