#!/usr/bin/env python3
"""Login to X.com via Playwright and try to find posts to engage with."""
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

def type_text(page, selector, text):
    """Type text into an element using Playwright's fill method."""
    el = page.wait_for_selector(selector, timeout=15000)
    if el:
        el.fill("")
        page.wait_for_timeout(500)
        el.type(text, delay=random.randint(30, 80))
        return True
    return False

def main():
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage'])
        ctx = b.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            locale='fr-FR')
        p = ctx.new_page()
        p.set_default_timeout(60000)

        # Go to login page directly
        print("🌐 Navigation vers la page de login...")
        p.goto('https://x.com/i/flow/login', wait_until='domcontentloaded', timeout=60000)
        p.wait_for_timeout(6000)

        # Check if already logged in
        cookies = ctx.cookies()
        auth_token = None
        for c in cookies:
            if c.get('name') == 'auth_token':
                auth_token = c['value']
                break

        if auth_token:
            print(f"✅ Déjà connecté!")
        else:
            # Fill email/username
            print("📧 Remplissage email...")
            # The input has id='jf-input-username_or_email' or name='username_or_email'
            email_input = p.locator('input[name="username_or_email"]').first
            if email_input.is_visible(timeout=10000):
                email_input.fill(E)
                p.wait_for_timeout(1500)
                
                # Click Next/Continue
                next_btn = p.locator('button:has-text("Continuer")').first
                if next_btn.is_visible(timeout=5000):
                    next_btn.click()
                    p.wait_for_timeout(4000)
                else:
                    print("❌ Bouton 'Continuer' non trouvé")
                    b.close()
                    return False
                
                # Fill password
                pwd_input = p.locator('input[name="password"]').first
                if pwd_input.is_visible(timeout=10000):
                    pwd_input.fill(PWD)
                    p.wait_for_timeout(1000)
                    
                    # Click Log in
                    login_btn = p.locator('button:has-text("Se connecter")').first
                    if login_btn.is_visible(timeout=5000):
                        login_btn.click()
                        p.wait_for_timeout(8000)
                    else:
                        print("❌ Bouton 'Se connecter' non trouvé")
                        b.close()
                        return False
            else:
                print("❌ Impossible de trouver le champ email (name='username_or_email')")
                b.close()
                return False

        # Verify login
        cookies = ctx.cookies()
        auth_token = None
        for c in cookies:
            if c.get('name') == 'auth_token':
                auth_token = c['value']
                break

        if not auth_token:
            body_text = p.evaluate("() => document.body.innerText")[:500]
            if 'limité' in body_text.lower():
                print("❌ LOGIN LIMITÉ")
            else:
                print(f"❌ Login échoué: {body_text}")
            b.close()
            return False

        print(f"✅ Connecté!")
        
        # Save storage state for future runs
        ctx.storage_state(path="/root/embyr/x_storage.json")
        print("✅ Storage state saved")

        # Verify we're on X.com properly
        p.goto('https://x.com/home', wait_until='domcontentloaded', timeout=60000)
        p.wait_for_timeout(5000)
        
        replies_sent = 0
        
        for search_term in SEARCHES:
            if replies_sent >= 12:
                break
            
            try:
                url = f"https://x.com/search?q={search_term.replace(' ', '%20')}&f=live&src=typed_query"
                print(f"\n🔍 Recherche: {search_term}")
                p.goto(url, wait_until='domcontentloaded', timeout=60000)
                p.wait_for_timeout(5000)
                p.evaluate("window.scrollBy(0, 500)")
                p.wait_for_timeout(2000)
                
                # Find post links
                posts = p.evaluate("""() => {
                    const articles = document.querySelectorAll('article[data-testid="tweet"]');
                    const results = [];
                    for (let a of articles) {
                        const text = (a.innerText || '').substring(0, 300);
                        const replyBtn = a.querySelector('[data-testid="reply"]');
                        const link = a.querySelector('a[href*="/status/"]');
                        if (replyBtn && link) {
                            // Get time element to check recency
                            const timeEl = a.querySelector('time');
                            const href = link.getAttribute('href');
                            let postId = '';
                            if (href) {
                                const match = href.match(/\\/status\\/(\\d+)/);
                                if (match) postId = match[1];
                            }
                            results.push({
                                text: text,
                                postId: postId,
                            });
                        }
                        if (results.length >= 2) break;
                    }
                    return results;
                }""")
                
                for post in posts:
                    if replies_sent >= 12:
                        break
                    
                    post_id = post.get('postId', '')
                    if not post_id or post_id in REPLIED:
                        continue
                    
                    print(f"  Réponse à: {post['text'][:100]}...")
                    
                    # Navigate to the post
                    p.goto(f"https://x.com/i/status/{post_id}", wait_until='domcontentloaded', timeout=60000)
                    p.wait_for_timeout(4000)
                    
                    # Click reply button
                    reply_btn = p.locator('[data-testid="reply"]').first
                    if reply_btn.is_visible(timeout=5000):
                        reply_btn.click()
                        p.wait_for_timeout(2000)
                    else:
                        print(f"  ⚠️ Bouton reply non trouvé pour {post_id}")
                        continue
                    
                    # Type the reply
                    reply_text = random.choice(REPLIES)
                    textbox = p.locator('[role="textbox"]').first
                    if textbox.is_visible(timeout=5000):
                        textbox.fill(reply_text)
                        p.wait_for_timeout(1500)
                    else:
                        print(f"  ⚠️ Textbox non trouvé")
                        continue
                    
                    # Send the reply
                    send_btn = p.locator('[data-testid="tweetButton"]').first
                    if send_btn.is_visible(timeout=3000):
                        send_btn.click()
                        p.wait_for_timeout(5000)
                    else:
                        print(f"  ⚠️ Bouton send non trouvé")
                        continue
                    
                    # Check if reply was sent (look for the reply in the page)
                    page_text = p.evaluate("() => document.body.innerText")
                    attempt_remaining = 'tentative' in page_text.lower() or 'limit' in page_text.lower()
                    if attempt_remaining and replies_sent == 0:
                        print(f"  ⚠️ Rate limit détecté")
                        # Save what we have and exit
                        save_replied()
                        b.close()
                        return replies_sent > 0
                    
                    REPLIED.add(post_id)
                    save_replied()
                    replies_sent += 1
                    print(f"  ✅ Réponse {replies_sent}/12 envoyée")
                    
                    if replies_sent < 12:
                        wait = random.randint(30, 90)
                        print(f"  ⏳ Attente {wait}s...")
                        p.wait_for_timeout(wait * 1000)
                
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
        print("Session échouée")
        sys.exit(1)
