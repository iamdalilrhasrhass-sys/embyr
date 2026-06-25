#!/usr/bin/env python3
"""
Create Reddit Script App via old.reddit.com API directly (no browser).
Uses SOCKS5 proxy through Mac to avoid VPS IP blocks.
"""
import requests
import re
import json
import os
import sys

SOCKS = "socks5://localhost:1080"
proxies = {"http": SOCKS, "https": SOCKS}

USERNAME = "EmbirDating"
PASSWORD = "EmbirParis2026!"

session = requests.Session()
session.proxies.update(proxies)
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
})

def log(msg):
    print(f"[*] {msg}")

def save_creds(cid, sec):
    data = {"client_id": cid, "client_secret": sec, "username": USERNAME, "password": PASSWORD}
    with open("/root/embyr/.reddit_creds.json", "w") as f:
        json.dump(data, f)
    with open("/root/embyr/.reddit_env", "w") as f:
        f.write(f"REDDIT_CLIENT_ID={cid}\nREDDIT_SECRET={sec}\nREDDIT_USERNAME={USERNAME}\nREDDIT_PASSWORD={PASSWORD}\n")
    log(f"Credentials saved! CID={cid}")

def main():
    # Step 1: Get login form
    log("Getting login page...")
    r = session.get("https://old.reddit.com/login", timeout=30)
    if "login" not in r.url.lower():
        log(f"Already logged in? Redirected to: {r.url}")
    else:
        # Find CSRF token if any
        csrf_match = re.search(r'name="csrf_token"\s+value="([^"]+)"', r.text)
        csrf = csrf_match.group(1) if csrf_match else ""
        log(f"CSRF token: {csrf[:20] if csrf else 'none'}...")
        
        # Find op (operation) value
        op_match = re.search(r'name="op"\s+(?:type="hidden"\s+)?value="([^"]+)"', r.text)
        op = op_match.group(1) if op_match else "login"
        log(f"op: {op}")
        
        # Submit login
        log("Submitting login...")
        data = {
            "user": USERNAME,
            "passwd": PASSWORD,
            "op": "login-main",
        }
        if csrf:
            data["csrf_token"] = csrf
        
        r = session.post(
            "https://old.reddit.com/api/login",
            data=data,
            timeout=30,
        )
        log(f"Login response: HTTP {r.status_code}, URL: {r.url}")
        
        # Also try the POST login
        r = session.post(
            "https://old.reddit.com/api/login/",
            data={"user": USERNAME, "passwd": PASSWORD},
            timeout=30,
        )
        log(f"Login2 response: HTTP {r.status_code}, URL: {r.url}")
    
    # Step 2: Navigate to apps page
    log("\nNavigating to apps page...")
    r = session.get("https://old.reddit.com/prefs/apps", timeout=30)
    log(f"Apps page: HTTP {r.status_code}, URL: {r.url}")
    
    # Check if logged in
    if "login" in r.url.lower():
        print("ERROR: Not logged in. Can't access apps page.")
        # Save debug info
        with open("/tmp/reddit_debug.html", "w") as f:
            f.write(r.text)
        print("Saved debug HTML to /tmp/reddit_debug.html")
        return False
    
    log(f"SUCCESS! Logged in. Page title check...")
    
    # Check for existing apps
    existing_cid = re.search(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    existing_sec = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    
    if existing_cid:
        log(f"Found existing app! CID: {existing_cid.group(1)}")
        save_creds(existing_cid.group(1), existing_sec.group(1) if existing_sec else "")
        return True
    
    # Step 3: Get the new Reddit apps page (the one with the create app form)
    log("Switching to new Reddit for app creation page...")
    r = session.get("https://www.reddit.com/prefs/apps", timeout=30)
    log(f"New Reddit apps: HTTP {r.status_code}, URL: {r.url}")
    
    if "prefs/apps" not in r.url.lower():
        print(f"Redirected away from apps page: {r.url}")
        return False
    
    # Check again for existing apps
    existing_cid = re.search(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    existing_sec = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    
    if existing_cid:
        log(f"Found existing app on new Reddit! CID: {existing_cid.group(1)}")
        save_creds(existing_cid.group(1), existing_sec.group(1) if existing_sec else "")
        return True
    
    log("No existing app found. Need to create one.")
    log("This requires the new Reddit interface with JavaScript.")
    print("\n⚠️  Cannot create app automatically — Reddit requires JavaScript for the creation form.")
    print("Please create a script app manually at: https://www.reddit.com/prefs/apps")
    print("Then re-run this script to extract credentials.")
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
