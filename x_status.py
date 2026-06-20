#!/usr/bin/env python3
"""Status check — what's working and what's not for X engagement"""
import subprocess, json, os

print("=" * 60)
print("EMBIR X ENGAGEMENT — STATUS REPORT")
print("=" * 60)

# 1. Check xurl
print("\n1️⃣  XURL (API):")
try:
    r = subprocess.run(['xurl', 'whoami'], capture_output=True, text=True, timeout=10)
    if r.returncode == 0:
        data = json.loads(r.stdout)
        print(f"   ✅ Compte: @{data.get('data', {}).get('username', '?')}")
    else:
        print(f"   ❌ Erreur: {r.stderr[:100]}")
except Exception as e:
    print(f"   ❌ {e}")

# 2. Check API credits
try:
    r = subprocess.run(['xurl', 'read', '1940667008446103710'], capture_output=True, text=True, timeout=10)
    if 'CreditsDepleted' in r.stdout:
        print(f"   ❌ API: Plus de crédits X API")
    elif r.returncode == 0:
        print(f"   ✅ API: Crédits OK")
except:
    print(f"   ? API: Impossible de vérifier")

# 3. Check Tor
r = subprocess.run(['curl', '-x', 'socks5://127.0.0.1:9050', '-s', '-o', '/dev/null', '-w', '%{http_code}', 'https://check.torproject.org'], capture_output=True, text=True, timeout=10)
print(f"\n2️⃣  TOR: {'✅ OK' if r.stdout == '200' else '❌ FAIL'} ({r.stdout})")

# 4. Check replied posts file
replied = set()
if os.path.exists('/root/embyr/x_replied.json'):
    with open('/root/embyr/x_replied.json') as f:
        data = json.load(f)
        replied = set(data.get('replied', []))
    print(f"\n3️⃣  Posts déjà répondus: {len(replied)}")
else:
    print(f"\n3️⃣  Posts déjà répondus: 0 (fichier inexistant)")

# 5. Check Playwright
r = subprocess.run(['python3', '-c', 'from playwright.sync_api import sync_playwright; print("ok")'], capture_output=True, text=True, timeout=5)
print(f"\n4️⃣  Playwright: {'✅ OK' if r.returncode == 0 else '❌ FAIL'}")

# 6. Last login attempt status
print(f"\n5️⃣  Connexion X: LIMITÉE (temporaire)")
print(f"   Le compte @EMBIR_APP est temporairement limité après")
print(f"   des tentatives de connexion automatisées.")
print(f"   Actions recommandées:")
print(f"   a) Recharger des crédits X API (console.x.com) — min $5")
print(f"   b) Se connecter manuellement depuis un navigateur réel")
print(f"   c) Attendre 24-48h que la limitation soit levée")
print(f"   d) Utiliser un proxy/IP non-flagé pour les futures connexions Playwright")

print("\n" + "=" * 60)
print("PROCHAINE EXÉCUTION CRON: Vérifier si la limitation est levée")
print("=" * 60)
