#!/usr/bin/env python3
"""
Reddit Poster via Mac SOCKS Proxy
Poste sur Reddit depuis l'IP résidentielle de Dalil (via SSH tunnel Mac)
Contourne le 403 du VPS en routant le trafic via le Mac (Free, Paris)

Usage:
  python3 reddit_proxy_post.py            # Poste sur r/gaydating (premier post)
  python3 reddit_proxy_post.py --all       # Poste en rafale sur 5 subreddits
  python3 reddit_proxy_post.py r/grindr    # Poste sur un sub spécifique
"""

import praw
import socks
import socket
import sys
import os
import json
import subprocess
import time

SOCKS_PORT = 1080
USER_AGENT = "EmbirDatingBot/1.0 (by u/EmbirDating)"

# Messages prêts à poster (variés pour éviter spam detection)
POSTS = {
    "r/gaydating": {
        "title": "J'ai créé Embir — une app de rencontre gay 100% gratuite, sans pub, sans limite",
        "body": """Les gars, parlons franchement.

Grindr te prend 30€/mois pour voir qui t'a liké. Tinder te cache les mecs derrière un paywall à 25€. Les pubs ? 3 par minute.

J'ai construit **Embir** → https://embir.xyz

🔥 100% gratuit en ce moment. Tout débloqué.
💰 Premium bientôt, 5x moins cher que Grindr.
🌍 25 langues. Traduction auto intégrée.
🛡️ Safe. Pas de dick pics en page d'accueil.

On est encore petits. Venez tester, critiquer, construire avec nous.

— L'équipe Embir"""
    },
    "r/grindr": {
        "title": "Vous en avez pas marre de payer 30 balles par mois pour une app de rencontre ?",
        "body": """Sérieusement, Grindr c'est 360€/an. Pour du like et des messages.

J'ai codé Embir. Gratuit. Zéro pub. Zéro limite.

embir.xyz

Venez casser votre putain de téléphone.""",
        "flair": "Discussion"
    },
    "r/gaybros": {
        "title": "Un pote dev a codé une app de rencontre gratuite, je vous partage",
        "body": """Un pote en avait tellement marre de payer pour voir ses matchs qu'il a codé sa propre app.

Embir → https://embir.xyz

100% gratuite. Pas de comptes premium à 30 balles. Pas de pubs toutes les 20 secondes. 25 langues.

Il est tout fier, allez lui faire des retours."""
    },
    "r/askgaybros": {
        "title": "Combien vous dépensez par mois en apps de rencontre ?",
        "body": """Je viens de calculer : Grindr = 30€/mois, Tinder = 25€, Scruff = 20€... Ça monte vite.

Du coup j'ai codé Embir (https://embir.xyz) — 100% gratuite. Premium à venir mais 5x moins cher.

J'aimerais vos avis : c'est quoi le juste prix pour une app de rencontre gay selon vous ?"""
    },
    "r/lgbt": {
        "title": "On a créé une app de rencontre gay gratuite — pour que l'argent ne soit plus une barrière",
        "body": """La communauté LGBT+ mérite mieux que des apps qui facturent 30€/mois pour des fonctionnalités de base.

On a construit **Embir** :
✅ 100% gratuit (pour toujours ? On espère)
✅ 25 langues, traduction auto
✅ Safe, pas de cyberharcèlement
✅ Par et pour la communauté

embir.xyz

On est en lancement, on veut vos retours ! ❤️🏳️‍🌈"""
    }
}

def check_mac_online():
    """Vérifie si le Mac est joignable via SSH"""
    r = subprocess.run(
        ["ssh", "-o", "ConnectTimeout=3", "-o", "BatchMode=yes",
         "-i", "/root/.ssh/ark_mac_key",
         "dalilrhasrhass@100.125.175.17", "echo ALIVE"],
        capture_output=True, text=True, timeout=10
    )
    return "ALIVE" in r.stdout

def start_socks_proxy():
    """Démarre le tunnel SOCKS via le Mac"""
    r = subprocess.run(
        ["ssh", "-o", "ExitOnForwardFailure=yes", "-f", "-N",
         "-D", str(SOCKS_PORT), "-i", "/root/.ssh/ark_mac_key",
         "dalilrhasrhass@100.125.175.17"],
        capture_output=True, text=True, timeout=10
    )
    # Wait for proxy to be ready
    time.sleep(2)
    return True

def post_to_reddit(subreddit, post_data):
    """Poste sur Reddit via le proxy SOCKS"""
    # Configure SOCKS proxy
    socks.set_default_proxy(socks.SOCKS5, "localhost", SOCKS_PORT)
    socket.socket = socks.socksocket

    reddit = praw.Reddit(
        client_id=os.environ.get("REDDIT_CLIENT_ID", ""),
        client_secret=os.environ.get("REDDIT_SECRET", ""),
        username="EmbirDating",
        password="EmbirParis2026!",
        user_agent=USER_AGENT
    )

    sub = reddit.subreddit(subreddit.replace("r/", ""))
    flair_id = post_data.get("flair_id")
    
    if flair_id:
        submission = sub.submit(
            title=post_data["title"],
            selftext=post_data["body"],
            flair_id=flair_id
        )
    else:
        submission = sub.submit(
            title=post_data["title"],
            selftext=post_data["body"]
        )

    return f"https://reddit.com{submission.permalink}"

def main():
    # Check if Mac is online
    if not check_mac_online():
        print("ERROR: Mac is offline. Can't post to Reddit (VPS IP blocked).")
        print("Wait for Mac to wake up and retry.")
        sys.exit(1)

    print("Mac online! Starting SOCKS proxy...")
    start_socks_proxy()

    target = sys.argv[1] if len(sys.argv) > 1 else "r/gaydating"

    if target == "--all":
        results = []
        for subreddit, post_data in POSTS.items():
            try:
                url = post_to_reddit(subreddit, post_data)
                results.append(f"✅ {subreddit}: {url}")
                print(f"Posted on {subreddit}: {url}")
                time.sleep(1800)  # 30 min between posts (anti-spam)
            except Exception as e:
                results.append(f"❌ {subreddit}: {e}")
                print(f"Failed on {subreddit}: {e}")
        print("\n".join(results))
    else:
        sub_name = target if target.startswith("r/") else f"r/{target}"
        if sub_name in POSTS:
            try:
                url = post_to_reddit(sub_name, POSTS[sub_name])
                print(f"✅ {sub_name}: {url}")
            except Exception as e:
                print(f"❌ {sub_name}: {e}")
        else:
            print(f"Unknown subreddit: {sub_name}")
            print(f"Available: {', '.join(POSTS.keys())}")

if __name__ == "__main__":
    main()
