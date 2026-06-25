#!/usr/bin/env python3
"""
X.com community engagement for Embir via Mac Chrome (connected session).
Uses AppleScript over SSH to execute JS in the connected Chrome.
"""
import subprocess, time, random, json, os, sys

SSH = ["ssh", "-i", "/root/.ssh/ark_mac_key", "-o", "ConnectTimeout=10",
       "dalilrhasrhass@100.125.175.17"]

REPLIED_FILE = "/root/embyr/x_replied.json"
REPLIED = set()
if os.path.exists(REPLIED_FILE):
    try:
        with open(REPLIED_FILE) as f:
            data = json.load(f)
            REPLIED = set(data.get("replied", []))
    except:
        REPLIED = set()

def save_replied():
    os.makedirs(os.path.dirname(REPLIED_FILE), exist_ok=True)
    with open(REPLIED_FILE, "w") as f:
        json.dump({"replied": list(REPLIED), "last_run": time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())}, f)

def mac_osascript(script_text):
    """Execute an AppleScript on the Mac."""
    r = subprocess.run(SSH + ["osascript", "-e", script_text],
                       capture_output=True, text=True, timeout=30)
    return r.stdout.strip(), r.stderr.strip(), r.returncode

def mac_write_file(path, content):
    """Write a file to the Mac via SSH."""
    r = subprocess.run(SSH + ["cat", ">", path],
                       input=content, capture_output=True, text=True, timeout=15)
    return r.returncode == 0

def mac_run_js(js_file):
    """Execute a JS file in the active Chrome tab and get the result."""
    script = f'tell application "Google Chrome"\nset r to execute active tab of front window javascript (do shell script "cat {js_file}")\nreturn r\nend tell'
    return mac_osascript(script)

def navigate(url, delay=4):
    """Navigate the Mac's active Chrome tab."""
    script = f'tell application "Google Chrome"\nset URL of active tab of front window to "{url}"\ndelay {delay}\nreturn "OK"\nend tell'
    return mac_osascript(script)

# Reply templates — natural, ambassador tone
REPLIES_NATURAL = [
    "grave… c'est exactement pour ça qu'on a lancé Embir. gratuit, sans pub, sans abonnement. premier réseau gay qui respecte ses utilisateurs. embir.xyz",
    "on a fait le même constat avec un pote. du coup on a codé Embir. gratuit, matching IA, 25 langues, zéro pub. embir.xyz",
    "c'est dingue le prix que Grindr demande aujourd'hui. on a lancé Embir pour offrir une alternative vraiment gratuite. embir.xyz",
    "totalement. j'ai découvert Embir et la différence est flagrante. communauté saine, profils vérifiés, tout gratuit. embir.xyz",
    "on a construit Embir exactement pour ça. gratuit au lancement, toutes les features débloquées. les premiers inscrits sont fondateurs à vie. embir.xyz",
    "trop cher et rempli de bots… Embir est gratuit et vérifie chaque profil par selfie. ça change tout. embir.xyz",
    "pareil. avec un pote dev on a lancé Embir — gratuit, safe, sans pubs, 25 langues. viens jeter un œil embir.xyz",
    "le pire c'est que le modèle économique des apps gay c'est de nous faire payer pour exister. Embir est gratuit, point. embir.xyz",
    "grave. Embir est 100% gratuit, pas de pubs, pas d'abonnement, traduction auto, matching IA. on construit ça proprement. embir.xyz",
    "on a lancé Embir à Paris justement pour ça. gratuit, vérifié, communauté saine. ça commence à bouger. embir.xyz",
    "j'ai quitté Grindr pour Embir et honnêtement l'ambiance est complètement différente. des vrais profils, des vraies conversations. embir.xyz",
    "on est passé par là aussi. du coup on a codé notre propre app : Embir. gratuit, pas de pub, pas de compte premium. embir.xyz",
]

SEARCH_QUERIES = [
    "marre de Grindr",
    "Grindr trop cher",
    "appli rencontre gay",
    "rencontre gay Paris",
    "célibataire gay Paris",
    "dating gay",
    "alternative Grindr",
    "appli gay gratuite",
]

def extract_tweet_link_from_search():
    """Extract the first replyable tweet URL from the current search page.
    Returns a URL string or empty string if none found."""
    # Use outerHTML of time's parent <a> tag which contains the href
    rt, err, code = mac_run_js("/tmp/x_get_link.js")
    if rt and rt.startswith("http"):
        return rt
    return ""

def main():
    print("=" * 60)
    print("🔍 Embir X Community Engagement (Mac Chrome)")
    print(f"📁 Already replied: {len(REPLIED)} tweets")
    print("=" * 60)

    # Verify login state
    r, e, _ = navigate("https://x.com/home", 5)
    
    # Check if logged in
    mac_write_file("/tmp/x_check_login.js", 
        'var btn=document.querySelector("[data-testid=loginButton]");"STATE:"+(btn?"LOGIN_PAGE":"LOGGED_IN")')
    rt, _, _ = mac_run_js("/tmp/x_check_login.js")
    print(f"📡 X State: {rt}")
    
    if "LOGIN_PAGE" in rt:
        print("❌ Not logged in on Mac Chrome. Aborting.")
        return False
    
    print("✅ Logged in as @EMBIR_APP")
    
    # Write the link extraction JS once
    mac_write_file("/tmp/x_get_link.js",
        'var t=document.querySelector("article[data-testid=tweet] time");'
        'if(t){t.parentElement.outerHTML}else{"no_article"}')
    
    replies_sent = 0
    max_replies = 10
    
    for query in SEARCH_QUERIES:
        if replies_sent >= max_replies:
            break
        
        print(f"\n🔎 Searching: \"{query}\"")
        
        encoded = query.replace(" ", "%20")
        url = f"https://x.com/search?q={encoded}&f=live&src=typed_query"
        
        r, e, _ = navigate(url, 5)
        time.sleep(2)
        
        # Get article text to see what's there
        mac_write_file("/tmp/x_get_articles.js",
            'var as=document.querySelectorAll("article[data-testid=tweet]");'
            'var r="";for(var i=0;i<as.length&&i<3;i++){r=r+as[i].innerText.substring(0,80)+"|||"} r')
        rt, _, _ = mac_run_js("/tmp/x_get_articles.js")
        
        if not rt or rt == "missing value":
            print("  ⚠️ No articles found")
            continue
        
        # Extract tweet URL from search
        tweet_url = extract_tweet_link_from_search()
        if not tweet_url or tweet_url == "missing value" or "no_article" in tweet_url:
            print("  ⚠️ Could not extract tweet link")
            continue
        
        # Parse the actual URL from outerHTML
        # outerHTML will have href="/user/status/123" - need to construct full URL
        import re
        href_match = re.search(r'href="([^"]*/status/[^"]*)"', tweet_url)
        if not href_match:
            print(f"  ⚠️ No href found in: {tweet_url[:100]}")
            continue
        
        full_url = "https://x.com" + href_match.group(1)
        
        if full_url in REPLIED:
            print(f"  ⏭️ Already replied to: {full_url}")
            continue
        
        tweet_text = re.search(r'aria-label="([^"]*)"', tweet_url)
        tweet_preview = tweet_text.group(1) if tweet_text else "?"
        
        # Pick reply
        reply = random.choice(REPLIES_NATURAL)
        REPLY_POOL = [r for r in REPLIES_NATURAL if r != reply]
        if REPLY_POOL:
            REPLY_POOL = REPLIES_NATURAL[:]  # Reset pool
            REPLY_POOL.remove(reply)
        
        print(f"\n  💬 Replying to: {full_url}")
        print(f"  📝 Preview: \"{tweet_preview}\"")
        print(f"  📝 Reply: \"{reply[:60]}...\"")
        
        # Navigate to tweet
        r, e, code = navigate(full_url, 4)
        if code != 0:
            print(f"  ⚠️ Navigation error")
            continue
        
        time.sleep(2)
        
        # Click reply button
        mac_write_file("/tmp/x_click_reply.js",
            'var b=document.querySelector("[data-testid=reply]");if(b){b.click();"clicked"}else{"no_reply_btn"}')
        rt, _, _ = mac_run_js("/tmp/x_click_reply.js")
        
        if rt != "clicked":
            print(f"  ⚠️ No reply button (or missing value)")
            continue
        
        time.sleep(2)
        
        # Type reply using execCommand
        # Escape single quotes for JS
        escaped_reply = reply.replace("'", "\\'")
        type_js = (
            'var el=document.querySelector("[data-testid=tweetTextarea_0]")'
            '||document.querySelector("[role=textbox]");'
            f'if(el){{el.focus();document.execCommand("insertText",false,"{escaped_reply}");"typed"}}else{{"no_textarea"}}'
        )
        mac_write_file("/tmp/x_type_reply.js", type_js)
        rt, _, _ = mac_run_js("/tmp/x_type_reply.js")
        
        if rt != "typed":
            print(f"  ⚠️ Could not type: {rt}")
            continue
        
        time.sleep(2)
        
        # Click send
        mac_write_file("/tmp/x_send_reply.js",
            'var b=document.querySelector("[data-testid=tweetButton]")'
            '||document.querySelector("[data-testid=tweetButtonInline]");'
            'if(b){b.click();"sent"}else{"no_send_btn"}')
        rt, _, _ = mac_run_js("/tmp/x_send_reply.js")
        
        if rt == "sent":
            replies_sent += 1
            REPLIED.add(full_url)
            save_replied()
            print(f"  ✅ REPLY #{replies_sent}/{max_replies} SENT!")
        else:
            print(f"  ❌ Send failed: {rt}")
            continue
        
        if replies_sent < max_replies:
            wait = random.randint(30, 90)
            print(f"  ⏳ Waiting {wait}s...")
            time.sleep(wait)
    
    # Navigate back to home
    navigate("https://x.com/home", 3)
    
    print(f"\n{'=' * 60}")
    if replies_sent > 0:
        print(f"🔥 {replies_sent} replies sent this session")
    else:
        print("ℹ️ No replies sent this session")
    print(f"📁 Total in replied file: {len(REPLIED)}")
    print(f"{'=' * 60}")
    
    return replies_sent > 0

if __name__ == "__main__":
    try:
        result = main()
    except Exception as e:
        print(f"❌ Error: {e}")
    sys.exit(0)
