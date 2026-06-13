"""
Crée un compte Reddit via Playwright + proxy US + mail.tm vérification
"""
import asyncio, json, sys, re, time, requests
from playwright.async_api import async_playwright

PROXY = "http://174.137.134.182:2999"
EMAIL = "embirpromo1779557374@wshu.net"
PASSWORD = "EmbirPromo2026!"
USERNAME = "EmbirDating"
MAIL_API = "https://api.mail.tm"
MAIL_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Nzk1NTczODAsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJhZGRyZXNzIjoiZW1ieXJwcm9tbzE3Nzk1NTczNzRAd3NodS5uZXQiLCJpZCI6IjZhMTFlM2ZlZGIxZWU2Y2RjYTBhNDA3YiIsIm1lcmN1cmUiOnsic3Vic2NyaWJlIjpbIi9hY2NvdW50cy82YTExZTNmZWRiMWVlNmNkY2EwYTQwN2IiXX19.POyQVshDJgp6Sx2CyRgBM2s8XmR3IkH0UhCfbDA3gyKs2kD5GY4SebfOSF2QolzKQd9TlZ-Xaz8VRuYamRYiHA"

def get_mail_messages():
    """Récupère les messages mail.tm"""
    r = requests.get(f"{MAIL_API}/messages", 
        headers={"Authorization": f"Bearer {MAIL_TOKEN}"},
        timeout=10)
    if r.status_code != 200:
        return []
    data = r.json()
    return data.get("hydra:member", [])

def get_message_content(msg_id):
    """Récupère le contenu d'un message"""
    r = requests.get(f"{MAIL_API}/messages/{msg_id}",
        headers={"Authorization": f"Bearer {MAIL_TOKEN}"},
        timeout=10)
    if r.status_code != 200:
        return None
    return r.json()

async def wait_for_code(page, timeout_sec=60):
    """Attend un email de vérification Reddit"""
    start = time.time()
    known_count = len(get_mail_messages())
    print(f"[MAIL] Messages connus: {known_count}")
    
    while time.time() - start < timeout_sec:
        await asyncio.sleep(5)
        msgs = get_mail_messages()
        if len(msgs) > known_count:
            print(f"[MAIL] Nouveau message trouvé! Total: {len(msgs)}")
            # Get latest message
            msg = get_message_content(msgs[0]['id'])
            if msg:
                html = msg.get('html', [''])[0]
                text = msg.get('text', '')
                subject = msg.get('subject', '')
                print(f"[MAIL] Sujet: {subject}")
                
                # Extract verification code from email
                # Reddit sends codes like "XXXXXX" (6 digits)
                code_match = re.search(r'(\d{6})', html or text or '')
                if code_match:
                    code = code_match.group(1)
                    print(f"[MAIL] Code trouvé: {code}")
                    return code
                
                # Also try to find link
                link_match = re.search(r'https?://[^\s"<>]+verify[^\s"<>]*', html or '')
                if link_match:
                    print(f"[MAIL] Lien vérification: {link_match.group(0)}")
                else:
                    print(f"[MAIL] Contenu brut: {(text or '')[:500]}")
        else:
            print(f"[MAIL] Toujours {len(msgs)} messages...")
    
    return None

async def main():
    # Vider la boîte mail d'abord
    msgs = get_mail_messages()
    for m in msgs:
        requests.delete(f"{MAIL_API}/messages/{m['id']}",
            headers={"Authorization": f"Bearer {MAIL_TOKEN}"})
    print(f"[MAIL] Boîte vidée ({len(msgs)} messages supprimés)")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            proxy={"server": PROXY}
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="en-US"
        )
        page = await context.new_page()
        
        print("\n[1] Navigation vers Reddit register...")
        await page.goto("https://www.reddit.com/register/", timeout=30000, wait_until="domcontentloaded")
        await asyncio.sleep(3)
        await page.screenshot(path="/tmp/reddit_1.png", full_page=True)
        print(f"    URL: {page.url}")
        
        # Step 1: Fill email
        print("\n[2] Remplir email...")
        email_field = await page.query_selector("input[name=email]")
        if not email_field:
            email_field = await page.query_selector("input[type=email]")
        if email_field:
            await email_field.fill(EMAIL)
            print("    Email rempli ✅")
        else:
            print("    Email field NOT FOUND ❌")
            await page.screenshot(path="/tmp/reddit_noemail.png")
            await browser.close()
            return
        
        # Click Continue
        await asyncio.sleep(1)
        continue_btn = await page.query_selector("button:has-text('Continue'), a:has-text('Continue')")
        if continue_btn:
            await continue_btn.click()
            print("    Continue cliqué ✅")
        else:
            # Try pressing Enter
            await page.keyboard.press("Enter")
            print("    Enter pressé (fallback)")
        
        await asyncio.sleep(3)
        await page.screenshot(path="/tmp/reddit_2.png", full_page=True)
        print(f"    URL: {page.url}")
        
        # Step 2: Wait for verification code
        print("\n[3] Attente du code de vérification...")
        code = await wait_for_code(page, 120)
        
        if code:
            print(f"\n[4] Code reçu: {code}")
            
            # Find code input field
            code_inputs = await page.query_selector_all("input[type=text], input[autocomplete=one-time-code]")
            print(f"    Champs trouvés: {len(code_inputs)}")
            
            for ci in code_inputs[:6]:
                try:
                    await ci.fill("")
                except:
                    pass
            
            # Type the code digit by digit
            for i, digit in enumerate(code):
                if i < len(code_inputs):
                    await code_inputs[i].fill(digit)
                else:
                    # Type remaining
                    if i == 0:
                        await page.keyboard.type(code)
                    break
            
            await asyncio.sleep(2)
            await page.screenshot(path="/tmp/reddit_3.png", full_page=True)
            
            # Step 3: Fill username and password
            print("\n[5] Remplir username + password...")
            
            # Wait for username field to appear
            for attempt in range(10):
                username_field = await page.query_selector("input[name=username], input[id*=username]")
                if username_field:
                    break
                await asyncio.sleep(2)
            
            if username_field:
                await username_field.fill(USERNAME)
                print(f"    Username '{USERNAME}' rempli ✅")
            else:
                print("    Username field NOT FOUND ❌")
            
            # Password
            password_field = await page.query_selector("input[name=password], input[type=password]")
            if password_field:
                await password_field.fill(PASSWORD)
                print("    Password rempli ✅")
            
            await asyncio.sleep(1)
            
            # Click final continue/signup
            signup_btn = await page.query_selector("button:has-text('Continue'), button:has-text('Sign Up'), button:has-text('Create')")
            if signup_btn:
                await signup_btn.click()
                print("    Signup cliqué ✅")
            else:
                await page.keyboard.press("Enter")
                print("    Enter pressé (fallback)")
            
            await asyncio.sleep(5)
            await page.screenshot(path="/tmp/reddit_4_done.png", full_page=True)
            print(f"\n[6] Final URL: {page.url}")
            
            # Check result
            if "register" not in page.url.lower():
                print("\n🎉 COMPTE CRÉÉ AVEC SUCCÈS!")
            else:
                # Check for errors
                error_el = await page.query_selector("[role=alert], .error, .ErrorMessage")
                if error_el:
                    error_text = await error_el.text_content()
                    print(f"\n❌ Erreur: {error_text}")
                else:
                    print("\n⚠️ Page toujours register, vérifier screenshot")
        else:
            print("\n❌ Aucun code reçu après 120s")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
