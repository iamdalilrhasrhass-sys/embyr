#!/usr/bin/env python3
"""
Attempt X.com community engagement via Playwright login.
Run from cron: python3 /root/embyr/x_engage.py
Exits if login limited or fails.
"""
from playwright.sync_api import sync_playwright
import time, random, json, os, sys

E = 'iamdalilrhasrhass@gmail.com'
PWD = 'Champigny-89'

SEARCHES = [
    "marre de Grindr",
    "Grindr trop cher",
    "appli rencontre gay",
    "rencontre gay Paris",
    "célibataire gay Paris",
    "dating gay Paris",
    "alternative Grindr",
    "appli gay gratuite",
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
    "C'est exactement le problème. Embir est 100% gratuit, sans pubs, sans abonnement. Toute l'app est débloquée. embir.xyz",
    "Franchement, essaye Embir. Gratuit, profils vérifiés, matching IA. Tout ce que Grindr devrait être. embir.xyz/paris",
    "On a construit Embir pour en finir avec les apps payantes. Gratuit, safe, 25 langues. embir.xyz",
    "Clairement. Embir résout ça : gratuit, pas de pubs, matching intelligent. embir.xyz/paris",
]

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
        json.dump({"replied": list(REPLIED)}, f)

def main():
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage'])
        ctx = b.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            locale='fr-FR')
        p = ctx.new_page()
        p.set_default_timeout(45000)

        # Login via JetFuel framework
        p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=30000)
        time.sleep(6)

        # Click email option
        p.evaluate("""() => {
            const containers = document.querySelectorAll('div.jf-element.jf-float-label-container');
            for (let c of containers) {
                const text = (c.textContent || '').toLowerCase();
                if (text.includes('e-mail') || text.includes('email')) {
                    c.click();
                    return true;
                }
            }
            return false;
        }""")
        time.sleep(3)

        # Fill email
        p.evaluate("""(email) => {
            const el = document.querySelector('input[name="username_or_email"]');
            if (el) {
                el.focus();
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(el, email);
                el.dispatchEvent(new Event('input', {bubbles: true}));
                el.dispatchEvent(new Event('change', {bubbles: true}));
                el.dispatchEvent(new Event('blur', {bubbles: true}));
            }
        }""", E)
        time.sleep(1)

        # Click Continue
        p.evaluate("""() => {
            const btns = document.querySelectorAll('button');
            for (let b of btns) {
                const t = (b.textContent || '').trim().toLowerCase();
                if ((t === 'continuer' || t === 'next' || t === 'continue') && b.offsetParent !== null) {
                    b.click();
                    return true;
                }
            }
            return false;
        }""")
        time.sleep(4)

        # Check if limited
        body = p.evaluate("() => document.body.innerText")
        if 'limité' in body.lower() or 'limit' in body.lower() or 'try again' in body.lower():
            print("❌ LOGIN LIMITÉ — le compte X est temporairement bloqué")
            b.close()
            return False

        # Fill password
        p.evaluate("""(pwd) => {
            const el = document.querySelector('input[name="password"]');
            if (el) {
                el.focus();
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(el, pwd);
                el.dispatchEvent(new Event('input', {bubbles: true}));
                el.dispatchEvent(new Event('change', {bubbles: true}));
                el.dispatchEvent(new Event('blur', {bubbles: true}));
            }
        }""", PWD)
        time.sleep(1)

        # Click Log in
        p.evaluate("""() => {
            const btns = document.querySelectorAll('button');
            for (let b of btns) {
                const t = (b.textContent || '').trim().toLowerCase();
                if ((t === 'se connecter' || t === 'log in' || t === 'sign in') && b.offsetParent !== null) {
                    b.click();
                    return true;
                }
            }
            return false;
        }""")
        time.sleep(8)

        # Check auth
        cookies = ctx.cookies()
        auth_token = None
        for c in cookies:
            if c.get('name') == 'auth_token':
                auth_token = c['value']
                break

        if not auth_token:
            body = p.evaluate("() => document.body.innerText")
            if 'limité' in body.lower() or 'limit' in body.lower():
                print("❌ LOGIN LIMITÉ — après remplissage du mot de passe")
            else:
                print(f"❌ LOGIN ÉCHOUÉ: {body[:200]}")
            b.close()
            return False

        print(f"✅ CONNECTÉ en tant que @EMBIR_APP")
        
        # Search and reply
        replies_sent = 0
        for search_term in SEARCHES:
            if replies_sent >= 12:
                break
            
            try:
                url = f"https://x.com/search?q={search_term}&f=live&src=typed_query"
                p.goto(url, wait_until='domcontentloaded', timeout=60000)
                time.sleep(4)
                p.evaluate("window.scrollBy(0, 500)")
                time.sleep(2)

                # Find posts
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
                            });
                        }
                        if (results.length >= 2) break;
                    }
                    return results;
                }""")

                for post in posts:
                    if replies_sent >= 12:
                        break
                    if post['link'] in REPLIED:
                        continue
                    
                    print(f"  Réponse à: {post['text'][:100]}...")
                    
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

                    # Send
                    p.evaluate("""() => {
                        const btn = document.querySelector('[data-testid="tweetButton"]') || document.querySelector('[data-testid="tweetButtonInline"]');
                        if (btn) btn.click();
                    }""")
                    time.sleep(5)

                    REPLIED.add(post['link'])
                    save_replied()
                    replies_sent += 1
                    print(f"  ✅ RÉPONSE {replies_sent}/12: {reply[:60]}...")

                    if replies_sent < 12:
                        wait = random.randint(30, 90)
                        print(f"  Attente {wait}s...")
                        time.sleep(wait)

            except Exception as e:
                print(f"  Erreur sur '{search_term}': {e}")
                continue

        print(f"\n🔥 {replies_sent} réponses envoyées!")
        b.close()
        return replies_sent > 0

if __name__ == "__main__":
    result = main()
    if result:
        print("Session terminée avec succès")
    else:
        print("Session échouée — le compte X est limité ou le login a échoué")
        sys.exit(1)
