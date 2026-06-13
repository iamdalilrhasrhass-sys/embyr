#!/usr/bin/env python3
"""Post on X.com via Tor SOCKS5 + Playwright JS dispatchEvent"""
import asyncio
from playwright.sync_api import sync_playwright
import time, json

TOR = "socks5://127.0.0.1:9050"
EMAIL = "iamdalilrhasrhass@gmail.com"
USER = "@EMBIR_APP"
PASS = "Champigny-89"

TWEETS = [
    "EMBIR arrive à Paris. Une app de rencontre gay gratuite, sans pubs, sans paywalls. Les 100 premiers membres sont fondateurs à vie. 👉 embir.xyz/paris",
    "Marre de payer 30€/mois pour voir qui t'a liké ? EMBIR est gratuit. Vraiment. Tout débloqué. 25 langues, traduction auto. embir.xyz",
    "On ne veut pas refaire Grindr. On veut créer une app où l'argent n'est pas une barrière. EMBIR. Gratuit au lancement. embir.xyz",
    "Paris d'abord. 100 vrais profils. Pas de faux compteurs. Pas de pubs. EMBIR — l'app gay gratuite. embir.xyz/paris"
]

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            proxy={"server": TOR},
            args=['--no-sandbox']
        )
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = ctx.new_page()
        
        # Login
        print("[1] Login X.com...")
        page.goto("https://x.com/i/flow/login", timeout=45000, wait_until="domcontentloaded")
        time.sleep(4)
        
        # Fill email via nativeInputValueSetter
        page.evaluate("""
            var emailField = document.querySelector('input[name="text"], input[autocomplete="username"]');
            if (emailField) {
                var s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                s.call(emailField, 'iamdalilrhasrhass@gmail.com');
                emailField.dispatchEvent(new Event('input', {bubbles: true}));
                emailField.dispatchEvent(new Event('change', {bubbles: true}));
                'OK';
            }
        """)
        time.sleep(2)
        
        # Click Next
        page.evaluate("""
            var spans = document.querySelectorAll('span');
            for (var s of spans) {
                if (s.textContent.trim() === 'Suivant' || s.textContent.trim() === 'Next') {
                    s.closest('[role=\"button\"]').click();
                    break;
                }
            }
        """)
        time.sleep(4)
        
        # Fill password
        page.evaluate("""
            var pw = document.querySelector('input[name="password"], input[type="password"]');
            if (pw) {
                var s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                s.call(pw, 'Champigny-89');
                pw.dispatchEvent(new Event('input', {bubbles: true}));
                pw.dispatchEvent(new Event('change', {bubbles: true}));
            }
        """)
        time.sleep(2)
        
        # Click login
        page.evaluate("""
            var spans = document.querySelectorAll('span');
            for (var s of spans) {
                if (s.textContent.trim() === 'Se connecter' || s.textContent.trim() === 'Log in') {
                    s.closest('[role=\"button\"]').click();
                    break;
                }
            }
        """)
        time.sleep(5)
        
        url = page.url
        print(f"  After login: {url[:80]}")
        
        if "home" in url:
            print("✅ LOGGED IN!")
            
            for i, tweet in enumerate(TWEETS):
                print(f"\n[Post {i+1}] {tweet[:60]}...")
                
                # Go to compose
                page.goto("https://x.com/compose/post", timeout=30000)
                time.sleep(3)
                
                # Fill tweet via native setter
                page.evaluate(f"""
                    var editor = document.querySelector('[data-testid="tweetTextarea_0"], [role="textbox"], div[contenteditable="true"]');
                    if (editor) {{
                        editor.focus();
                        editor.textContent = {json.dumps(tweet)};
                        editor.dispatchEvent(new Event('input', {{bubbles: true}}));
                        editor.dispatchEvent(new Event('change', {{bubbles: true}}));
                    }}
                """)
                time.sleep(2)
                
                # Click Post
                page.evaluate("""
                    var spans = document.querySelectorAll('span');
                    for (var s of spans) {
                        if (s.textContent.trim() === 'Poster' || s.textContent.trim() === 'Post') {
                            s.closest('[role="button"]').click();
                            break;
                        }
                    }
                """)
                time.sleep(4)
                print(f"  ✅ Posted!")
                
                if i < len(TWEETS) - 1:
                    print("  Waiting 2min...")
                    time.sleep(120)
            
            print(f"\n🔥 {len(TWEETS)} posts sent!")
        else:
            print(f"  Login failed. URL: {url}")
            page.screenshot(path="/tmp/x_login_fail.png")
        
        browser.close()

if __name__ == "__main__":
    main()
