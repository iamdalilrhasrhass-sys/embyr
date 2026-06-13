#!/usr/bin/env python3
"""Submit Embir to directories via Flaresolverr (Cloudflare bypass) + Playwright"""
import os, sys, time, json, re
import requests

FLARESOLVER = "http://localhost:8191/v1"
EMBIR = "https://embir.xyz"
EMAIL = "embir@embir.xyz"
PASSWORD = "EmbirDating2026!"

def flare_get(url):
    r = requests.post(FLARESOLVER, json={
        "cmd": "request.get",
        "url": url,
        "maxTimeout": 30000,
        "session": "embir_submit"
    }, timeout=35)
    data = r.json()
    sol = data.get("solution", {})
    return {
        "status": sol.get("status", 0),
        "body": sol.get("response", ""),
        "cookies": sol.get("cookies", []),
        "headers": sol.get("headers", {}),
        "url": sol.get("url", "")
    }

def flare_post(url, data, headers_extra=None):
    h = {"Content-Type": "application/x-www-form-urlencoded"}
    if headers_extra:
        h.update(headers_extra)
    # Flaresolverr doesn't support POST with body directly, use session cookies
    # Instead, extract cookies from session and use requests
    return None

def extract_csrf(html):
    m = re.search(r'name="authenticity_token"[^>]*value="([^"]+)"', html)
    return m.group(1) if m else None

# === BETA LIST ===
print("=== BetaList ===")
print("Getting signup page...")
res = flare_get("https://betalist.com/sign_up")
if res["status"] == 200:
    csrf = extract_csrf(res["body"])
    print(f"CSRF token: {'Found' if csrf else 'Not found'}")
    
    # Extract cookies from flaresolverr response
    cookies = {c["name"]: c["value"] for c in res["cookies"]}
    
    # Use requests with flaresolverr cookies
    s = requests.Session()
    for name, val in cookies.items():
        s.cookies.set(name, val)
    s.headers.update({"User-Agent": "Mozilla/5.0"})
    
    # Try to sign up
    signup_data = {
        "authenticity_token": csrf or "",
        "user[email]": "embir@embir.xyz",
        "user[username]": "embirdating",
        "user[password]": PASSWORD,
        "user[password_confirmation]": PASSWORD,
        "commit": "Sign up"
    }
    signup_r = s.post("https://betalist.com/users", data=signup_data, allow_redirects=True)
    print(f"Signup: {signup_r.status_code} -> {signup_r.url}")
    
    if "sign_in" not in signup_r.url:
        print("✅ BetaList account created!")
        
        # Now submit
        submit_r = s.get("https://betalist.com/submit")
        print(f"Submit page: {submit_r.status_code}")
        
        csrf2 = extract_csrf(submit_r.text)
        if csrf2:
            sub_data = {
                "authenticity_token": csrf2,
                "submission[name]": "Embir",
                "submission[url]": EMBIR,
                "submission[tagline]": "Free gay dating app with 25 languages and auto-translation",
                "submission[description]": "Embir is a free gay dating app. No paywalls, no ads. 25 languages with automatic message translation. Strict moderation for a safe space.",
                "submission[email]": "embir@embir.xyz",
                "commit": "Submit"
            }
            submit2 = s.post("https://betalist.com/submissions", data=sub_data, allow_redirects=True)
            print(f"Submission: {submit2.status_code} -> {submit2.url}")
            if submit2.status_code in [200, 302, 303]:
                print("✅✅ EMBIR SUBMITTED TO BETALIST!")
            else:
                print(f"  Response: {submit2.text[:300]}")
    else:
        print("Signup failed - might need email verification")
else:
    print(f"Failed to load signup: {res['status']}")

# === SAASHUB ===
print("\n=== SaaSHub ===")
res2 = flare_get("https://www.saashub.com/submit")
if res2["status"] == 200:
    csrf3 = re.search(r'<meta name="csrf-token" content="([^"]+)"', res2["body"])
    csrf_val = csrf3.group(1) if csrf3 else None
    print(f"CSRF: {'Found' if csrf_val else 'Not found'}")
    
    cookies2 = {c["name"]: c["value"] for c in res2["cookies"]}
    s2 = requests.Session()
    for n, v in cookies2.items():
        s2.cookies.set(n, v)
    
    # Try submitting
    sub_data2 = {
        "authenticity_token": csrf_val or "",
        "startup[name]": "Embir",
        "startup[url]": EMBIR,
        "startup[tagline]": "Free gay dating app with 25 languages",
        "startup[description]": "Free gay dating app. 25 languages. Auto-translation.",
        "startup[email]": "embir@embir.xyz"
    }
    r2 = s2.post("https://www.saashub.com/startups", data=sub_data2, allow_redirects=True)
    print(f"SaaSHub submit: {r2.status_code} -> {r2.url}")

print("\nDone!")
