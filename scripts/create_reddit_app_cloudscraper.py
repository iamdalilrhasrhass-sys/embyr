#!/usr/bin/env python3
"""
Create Reddit Script App using cloudscraper to bypass Cloudflare.
"""
import cloudscraper
import re
import json
import sys

SOCKS = "socks5://localhost:1080"
USERNAME = "EmbirDating"
PASSWORD = "EmbirParis2026!"

scraper = cloudscraper.create_scraper(
    browser={
        'browser': 'chrome',
        'platform': 'darwin',
        'mobile': False,
    },
)
scraper.proxies.update({"http": SOCKS, "https": SOCKS})

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
    log("Accessing old.reddit.com/login...")
    r = scraper.get("https://old.reddit.com/login", timeout=30)
    log(f"Status: {r.status_code}, URL: {r.url}")
    
    if "login" not in r.url.lower():
        log(f"Already logged in! URL: {r.url}")
    else:
        log("Submitting login...")
        r = scraper.post(
            "https://old.reddit.com/api/login",
            data={"user": USERNAME, "passwd": PASSWORD, "op": "login"},
            timeout=30,
        )
        log(f"Login response: HTTP {r.status_code}")
        r = scraper.get("https://old.reddit.com/prefs/apps", timeout=30)
        log(f"Apps page: HTTP {r.status_code}, URL: {r.url}")
    
    if "login" in r.url.lower():
        print("ERROR: Could not login")
        # Check if blocked
        if "blocked" in r.text[:500].lower():
            print("Blocked by Cloudflare")
        return False
    
    log("SUCCESS: Logged in!")
    
    # Check for existing apps
    existing_cid = re.search(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    existing_sec = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    
    if existing_cid:
        log(f"Found existing app! CID: {existing_cid.group(1)}")
        save_creds(existing_cid.group(1), existing_sec.group(1) if existing_sec else "")
        return True
    
    # Try new Reddit apps page
    log("Trying new Reddit apps page...")
    r = scraper.get("https://www.reddit.com/prefs/apps", timeout=30)
    log(f"New Reddit: HTTP {r.status_code}, URL: {r.url}")
    
    existing_cid = re.search(r'personal use script[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
    if existing_cid:
        existing_sec = re.search(r'secret[^<]*<code>([a-zA-Z0-9_-]+)</code>', r.text)
        log(f"Found existing app on new Reddit! CID: {existing_cid.group(1)}")
        save_creds(existing_cid.group(1), existing_sec.group(1) if existing_sec else "")
        return True
    
    print("No existing app found. App creation requires JavaScript.")
    print("Please create a script app at https://www.reddit.com/prefs/apps manually,")
    print("then re-run this script.")
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
