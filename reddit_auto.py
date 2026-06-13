#!/usr/bin/env python3
"""
Reddit Poster — Embir
Uses Python Reddit API Wrapper (PRAW) + proxychains via Tor

Setup:
  pip3 install praw
  export REDDIT_CLIENT_ID="..."
  export REDDIT_SECRET="..."
  export REDDIT_USERNAME="Outrageous_Fault9316"
  export REDDIT_PASSWORD="..."

Usage:
  proxychains python3 /root/embyr/reddit_auto.py
"""

import os
import sys
import time
import json
import random
from datetime import datetime

# ── config ──────────────────────────────────────────────
REDDIT_USER_AGENT = "EmbirBot/1.0 (by u/Outrageous_Fault9316)"
SUBREDDITS = [
    "gaydating",
    "grindr",
    "gaybros",
    "askgaybros",
    "gaymers",
    "lgbt",
]

POSTS = [
    {
        "subreddit": "gaydating",
        "title": "Embir — Une app de rencontre gay 100% gratuite vient de sortir",
        "text": """Salut les gars,

Un pote a lancé Embir, une app de rencontre entre hommes.

Le concept est simple :
🔥 100% gratuit. Tout est débloqué.
💰 Quand le premium arrivera, ce sera 5x moins cher que Grindr.
🌍 25 langues dispo, avec traduction automatique des messages.
🛡️ Modération stricte — pas de dick pics en page d'accueil.

C'est tout frais, la communauté est en train de se construire. Venez jeter un œil et donner votre avis.

👉 embir.xyz""",
    },
    {
        "subreddit": "grindr",
        "title": "Vous en avez pas marre de payer 30€ par mois pour voir qui vous like ?",
        "text": """Sérieux. 30 balles par mois pour voir qui t'a liké. 25€ sur Tinder pour la même chose. Des pubs toutes les 30 secondes.

On a construit Embir pour arrêter cette arnaque.

🔥 Gratuit. Vraiment gratuit. Tout débloqué.
💰 Premium bientôt — 5x moins cher que Grindr.
🌍 25 langues. L'app traduit automatiquement les messages.
🛡️ Pas de nudes non sollicités. Modération stricte.

On lance tout juste. Venez tester, critiquer, construire avec nous.

👉 embir.xyz""",
    },
    {
        "subreddit": "gaybros",
        "title": "Mon pote dev a codé une app de rencontre gratuite pour les gays, je vous partage",
        "text": """Un ami développeur en a eu marre des apps qui te pompent 30€/mois pour des fonctions basiques. Il a passé 6 mois à coder Embir.

Le résultat est propre :
- Gratuit, toutes les fonctions débloquées
- Traduction automatique des messages (25 langues)
- Système de parrainage pour inviter tes potes
- Modération active, zéro spam

Il lance tout juste et cherche des retours. Si vous voulez tester une alternative à ce qu'on a actuellement, allez faire un tour.

👉 embir.xyz""",
    },
    {
        "subreddit": "askgaybros",
        "title": "Combien vous dépensez par mois en apps de rencontre ?",
        "text": """Petit sondage honnête entre nous : vous mettez combien par mois dans les apps de rencontre ?

Grindr, Tinder, Romeo, Scruff... entre les abonnements, les boosts et les "voir qui t'a liké", ça monte vite.

Je demande parce qu'un ami a lancé Embir (embir.xyz), une app 100% gratuite avec traduction auto, et je me demande si le modèle "gratuit au lancement" peut vraiment marcher face aux mastodontes.

Vous en pensez quoi ? Modèle gratuit > premium cher, ou vous préférez payer pour un service établi ?""",
    },
    {
        "subreddit": "gaymers",
        "title": "Une app de rencontre créée par des gamers, pour les gamers 🎮",
        "text": """Salut la team,

Avec un pote on a bossé sur Embir, une app de rencontre gay. On est tous les deux gamers, et on a intégré des trucs qu'on aimerait voir :

- Un système de parrainage avec des pseudos (pas besoin de vrai nom)
- Des salons de discussion par centres d'intérêt
- Une interface sombre qui défonce pas les yeux à 2h du mat
- Traduction auto pour parler avec des mecs du monde entier

C'est gratuit pour le lancement. Si vous voulez tester et donner votre avis, on est preneurs.

👉 embir.xyz""",
    },
    {
        "subreddit": "lgbt",
        "title": "On a créé une app de rencontre gay gratuite parce que l'argent ne devrait pas être une barrière",
        "text": """L'équipe Embir ici.

On a construit Embir avec une conviction simple : rencontrer quelqu'un ne devrait pas coûter 30€ par mois.

Notre approche :
🏳️‍🌈 100% gratuit aujourd'hui. Tout le monde peut tout utiliser.
💰 Quand on passera payant, ce sera 5x moins cher que les alternatives.
🌍 25 langues — parce que l'amour n'a pas de frontières.
🛡️ Safe space. Modération active, zéro tolérance pour le harcèlement.

On est encore petits. On construit la communauté avec vous.

👉 embir.xyz""",
    },
]


def post_one(reddit, post):
    sub = reddit.subreddit(post["subreddit"])
    title = post["title"]
    text = post["text"]
    print(f"[{datetime.now()}] Posting to r/{post['subreddit']}...")
    submission = sub.submit(title, selftext=text, send_replies=True)
    print(f"  ✅ Posted: {submission.url}")
    return submission


def post_all():
    import praw

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    secret = os.environ.get("REDDIT_SECRET")
    username = os.environ.get("REDDIT_USERNAME")
    password = os.environ.get("REDDIT_PASSWORD")

    if not all([client_id, secret, username, password]):
        print("❌ Missing env vars: REDDIT_CLIENT_ID, REDDIT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD")
        sys.exit(1)

    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=secret,
        username=username,
        password=password,
        user_agent=REDDIT_USER_AGENT,
    )

    # Verify connection
    me = reddit.user.me()
    print(f"[{datetime.now()}] Connected as u/{me.name} (karma: {me.link_karma})")

    results = []
    for i, post in enumerate(POSTS):
        try:
            sub = post_one(reddit, post)
            results.append(sub)
            if i < len(POSTS) - 1:
                wait = random.randint(1800, 2400)  # 30-40 min between posts
                print(f"  ⏳ Waiting {wait//60} min...")
                time.sleep(wait)
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            # Continue with next post

    print(f"\n[{datetime.now()}] Done. {len(results)}/{len(POSTS)} posts succeeded.")
    return results


if __name__ == "__main__":
    post_all()
