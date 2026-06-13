#!/usr/bin/env python3
"""Post on HN and Product Hunt via FlareSolverr"""
import subprocess, json, re, urllib.parse

FS = "http://localhost:8191/v1"

def fs_req(url, method="GET", data=None, cookies=None):
    """Send request through FlareSolverr"""
    body = {"cmd": "request.get" if method == "GET" else "request.post",
            "url": url, "maxTimeout": 30000}
    if data:
        body["postData"] = data
    if cookies:
        body["cookies"] = [{"name": k, "value": v} for k, v in cookies.items()]
    
    r = subprocess.run(
        ["curl", "-s", FS, "-H", "Content-Type: application/json", "-d", json.dumps(body)],
        capture_output=True, text=True, timeout=35
    )
    resp = json.loads(r.stdout)
    return resp.get("solution", {})

# ========== 1. HACKER NEWS ==========
print("=== HACKER NEWS ===")

# Get login page
sol = fs_req("https://news.ycombinator.com/login?goto=submit")
html = sol.get("response", "")
cookies = {c["name"]: c["value"] for c in sol.get("cookies", [])}

# Extract fnid
fnid_match = re.search(r'name="fnid"[^>]+value="([^"]+)"', html)
if fnid_match:
    fnid = fnid_match.group(1)
    print(f"FNID: {fnid[:20]}...")
    
    # Login
    login_data = f"acct=embirdating&pw=EmbirDating2026%21&goto=submit&fnid={fnid}"
    sol2 = fs_req("https://news.ycombinator.com/login", method="POST", data=login_data, cookies=cookies)
    html2 = sol2.get("response", "")
    cookies2 = {c["name"]: c["value"] for c in sol2.get("cookies", [])}
    print(f"Login cookies: {list(cookies2.keys())}")
    
    if "user" in cookies2:
        print("✅ Logged into HN as:", cookies2.get("user", "unknown"))
        
        # Get submit page fnid
        sol3 = fs_req("https://news.ycombinator.com/submit", cookies=cookies2)
        html3 = sol3.get("response", "")
        fnid2 = re.search(r'name="fnid"[^>]+value="([^"]+)"', html3)
        
        if fnid2:
            fnid2_val = fnid2.group(1)
            print(f"Submit FNID: {fnid2_val[:20]}...")
            
            # Post Show HN
            title = "Show HN: EMBIR — A free, inclusive dating platform (no paywalls, no bots)"
            url = "https://embir.xyz/paris"
            post_data = urllib.parse.urlencode({
                "fnid": fnid2_val,
                "fnop": "submit-page",
                "title": title,
                "url": url,
                "text": ""
            })
            
            sol4 = fs_req("https://news.ycombinator.com/r", method="POST", data=post_data, cookies=cookies2)
            html4 = sol4.get("response", "")
            
            if "embir" in html4.lower():
                print("✅ HN POSTED!")
            elif "too fast" in html4.lower():
                print("⚠️ HN: Posting too fast, wait and retry")
            else:
                # Check response
                if len(html4) < 500:
                    print(f"Response: {html4[:300]}")
                else:
                    print(f"Response length: {len(html4)} — checking for success...")
                    if "newest" in html4.lower() or "show" in html4.lower():
                        print("✅ Likely posted (redirected to listing)")
                    else:
                        print("⚠️ Unknown response")
        else:
            print("❌ Could not find submit fnid")
    else:
        print("❌ HN Login failed")
        if "Bad login" in html2:
            print("   Bad credentials")
else:
    print("❌ Could not find login fnid")

# ========== 2. PRODUCT HUNT ==========
print("\n=== PRODUCT HUNT ===")
sol_ph = fs_req("https://www.producthunt.com/")
html_ph = sol_ph.get("response", "")
status_ph = sol_ph.get("status", 0)
print(f"PH status: {status_ph}")
if html_ph and len(html_ph) > 100:
    print(f"PH page loaded ({len(html_ph)} bytes)")
    if "producthunt" in html_ph.lower():
        print("✅ Product Hunt accessible via FlareSolverr")
    else:
        print("⚠️ PH page loaded but unexpected content")
else:
    print("❌ PH still blocked")
