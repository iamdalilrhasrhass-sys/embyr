#!/usr/bin/env python3
"""X.com community engagement — search recent gay dating posts, reply naturally"""
from playwright.sync_api import sync_playwright
import time, random, json, os

TOR = "socks5://127.0.0.1:9050"
E = 'iamdalilrhasrhass@gmail.com'
PWD = 'Champigny-89'

SEARCHES = [
    "Grindr cher",
    "marre de Grindr",
    "marre de Tinder",
    "appli rencontre gay",
    "rencontre gay Paris",
    "Grindr trop cher",
    "alternative Grindr",
    "appli gay gratuite",
    "dating gay Paris",
    "célibataire gay Paris",
]

REPLIES = [
    "Grave. C'est pour ça qu'on a lancé Embir — gratuit au lancement, sans pubs, sans paywalls. Viens tester 👉 embir.xyz/paris",
    "Tellement. On a construit Embir pour ça : gratuit, 25 langues, matching IA, 0 pub. embir.xyz",
    "On est d'accord. Embir est gratuit, tout est débloqué. Les premiers inscrits sont fondateurs à vie. embir.xyz/paris",
    "Pareil. J'ai fini par coder mon app : Embir. Gratuit. Sans pub. Matching IA. Viens voir embir.xyz",
    "C'est exactement ce qu'on veut résoudre avec Embir — gratuit, safe, sans pubs. embir.xyz/paris",
    "Tu devrais jeter un œil à Embir — gratuit au lancement, vérifié par selfie, 25 langues. embir.xyz",
    "On lance Embir à Paris. Gratuit. Profils vérifiés. Pas de faux compteurs. embir.xyz/paris",
    "Check Embir — app gay gratuite, 25 langues, traduction auto. On construit une vraie communauté. embir.xyz",
]

REPLIED_FILE = "/root/embyr/x_replied.json"
REPLIED = set(json.load(open(REPLIED_FILE))["replied"]) if os.path.exists(REPLIED_FILE) else set()

def save_replied():
    json.dump({"replied": list(REPLIED)}, open(REPLIED_FILE, "w"))

def main():
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True,
            proxy={'server': TOR},
            args=['--no-sandbox','--disable-dev-shm-usage'])
        ctx = b.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")
        p = ctx.new_page()
        p.set_default_timeout(45000)

        # Login
        p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
        time.sleep(5)
        
        # Accept cookies
        p.evaluate("""() => {
            const btns = document.querySelectorAll('button');
            for (let b of btns) {
                if ((b.textContent||'').toLowerCase().includes('accept all')) {
                    b.dispatchEvent(new MouseEvent('click', {bubbles:true}));
                    return 'OK';
                }
            }
        }""")
        time.sleep(2)
        
        # Handle verification page: click "Email or username" if shown
        body_check = p.evaluate("() => document.body.innerText.substring(0, 500)")
        if "email or username" in body_check.lower():
            print("  Verification page — selecting Email...")
            # Click the div containing "Email or username" text
            p.evaluate("""() => {
                const spans = document.querySelectorAll('span');
                for (let s of spans) {
                    if ((s.textContent||'').trim().toLowerCase().includes('email or username')) {
                        s.click();
                        return;
                    }
                }
            }""")
            time.sleep(3)
        
        # Fill email — input is always there but may be invisible
        has_input = p.evaluate("() => document.querySelector('input[name=\"username_or_email\"]') !== null")
        if has_input:
            p.evaluate(f'(v)=>{{const e=document.querySelector(\'input[name="username_or_email"]\');if(e){{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;s.call(e,v);e.dispatchEvent(new Event("input",{{bubbles:true}}));e.dispatchEvent(new Event("change",{{bubbles:true}}));}}}}', E)
            time.sleep(0.5)
            print("  Email filled")
        else:
            print("  No email input found")
            b.close()
            return False
        
        # Click Continue button
        p.evaluate("""() => {
            const btns = document.querySelectorAll('[role="button"], button');
            for (let b of btns) {
                const txt = (b.textContent||'').toLowerCase().trim();
                if (txt === 'continue' || txt === 'suivant' || txt === 'next') {
                    b.dispatchEvent(new MouseEvent('click', {bubbles:true}));
                    return;
                }
            }
        }""")
        time.sleep(4)

        # Check for unusual activity / verification after Continue
        body2 = p.evaluate("() => document.body.innerText.substring(0, 300)")
        if "unusual" in body2.lower() or "verify" in body2.lower() or "phone" in body2.lower() or "confirmation" in body2.lower():
            print(f"  VERIFICATION STEP: {body2[:200]}")
            # Try to skip/close if possible
            b.close()
            return False

        # Now we should be on password screen or have password input
        # Fill password
        p.evaluate("""() => {
            const btns = document.querySelectorAll('[role="button"]');
            for (let b of btns) {
                for (let s of b.querySelectorAll('span')) {
                    if ((s.textContent||'').trim() === 'Suivant' || (s.textContent||'').trim() === 'Next') {
                        b.click(); return;
                    }
                }
            }
        }""")
        time.sleep(4)
        
        # Maybe verification step (unusual activity)
        body = p.evaluate("() => document.body.innerText")
        if "unusual" in body.lower() or "verify" in body.lower() or "phone" in body.lower():
            print(f"VERIFICATION REQUIRED: {body[:300]}")
            b.close()
            return False
        
        # Fill password
        p.evaluate(f'(v)=>{{const e=document.querySelector(\'input[name="password"]\');if(e){{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;s.call(e,v);e.dispatchEvent(new Event("input",{{bubbles:true}}));}}}}', PWD)
        time.sleep(1)
        
        # Click login
        p.evaluate("""() => {
            const btns = document.querySelectorAll('[role="button"]');
            for (let b of btns) {
                for (let s of b.querySelectorAll('span')) {
                    const t = (s.textContent||'').trim();
                    if (t === 'Se connecter' || t === 'Log in') { b.click(); return; }
                }
            }
        }""")
        time.sleep(6)
        
        # Check if logged in
        cookies = ctx.cookies()
        xc = {c['name']:c['value'] for c in cookies if '.x.com' in c.get('domain','')}
        
        if 'auth_token' not in xc:
            body = p.evaluate("() => document.body.innerText")
            if 'limited' in body.lower() or 'try again' in body.lower():
                print("RATE LIMITED")
            else:
                print(f"LOGIN FAILED: {body[:200]}")
            b.close()
            return False
        
        print(f"✅ LOGGED IN — searching {len(SEARCHES)} topics...")
        
        replies_sent = 0
        for search_term in SEARCHES:
            if replies_sent >= 12:
                break
            
            try:
                url = f"https://x.com/search?q={search_term}&f=live&src=typed_query"
                p.goto(url, wait_until='domcontentloaded', timeout=60000)
                time.sleep(4)
                
                # Scroll a bit
                p.evaluate("window.scrollBy(0, 500)")
                time.sleep(2)
                
                # Find reply buttons on posts
                posts = p.evaluate("""() => {
                    const articles = document.querySelectorAll('article[data-testid="tweet"]');
                    const results = [];
                    for (let a of articles) {
                        const text = (a.innerText || '').substring(0, 300);
                        const replyBtn = a.querySelector('[data-testid="reply"]');
                        const timeEl = a.querySelector('time');
                        const link = a.querySelector('a[href*="/status/"]');
                        if (replyBtn && link) {
                            results.push({
                                text: text,
                                link: link.href,
                                hasReplyBtn: !!replyBtn
                            });
                        }
                        if (results.length >= 3) break;
                    }
                    return results;
                }""")
                
                for post in posts:
                    if replies_sent >= 12:
                        break
                    if post['link'] in REPLIED:
                        continue
                    
                    print(f"  Replying to: {post['text'][:100]}...")
                    
                    # Click reply button
                    p.goto(post['link'], wait_until='domcontentloaded', timeout=60000)
                    time.sleep(3)
                    
                    # Click reply
                    p.evaluate("""() => {
                        const btn = document.querySelector('[data-testid="reply"]');
                        if (btn) btn.click();
                    }""")
                    time.sleep(2)
                    
                    # Type reply
                    reply = random.choice(REPLIES)
                    p.evaluate(f'(t)=>{{const el=document.querySelector(\'[role="textbox"]\')||document.querySelector(\'[data-testid="tweetTextarea_0"]\');if(el){{el.focus();document.execCommand("insertText",false,t);}}}}', reply)
                    time.sleep(1.5)
                    
                    # Click send
                    p.evaluate("""() => {
                        const btn = document.querySelector('[data-testid="tweetButton"]') || document.querySelector('[data-testid="tweetButtonInline"]');
                        if (btn) btn.click();
                    }""")
                    time.sleep(5)
                    
                    REPLIED.add(post['link'])
                    save_replied()
                    replies_sent += 1
                    print(f"  ✅ REPLY {replies_sent}/12: {reply[:60]}...")
                    
                    # Random wait 30-90s between replies
                    wait = random.randint(30, 90)
                    time.sleep(wait)
                    
            except Exception as e:
                print(f"  Error on search '{search_term}': {e}")
                continue
        
        print(f"\n🔥 DONE — {replies_sent} replies sent!")
        b.close()
        return True

if __name__ == "__main__":
    if os.system('curl -x socks5://127.0.0.1:9050 -s -o /dev/null -w "%{http_code}" https://check.torproject.org 2>/dev/null | grep -q 200') != 0:
        os.system('tor --SocksPort 9050 2>/dev/null &')
        time.sleep(10)
    main()
