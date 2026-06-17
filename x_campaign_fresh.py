#!/usr/bin/env python3
"""EMBIR X/Twitter Posts — June 13 Growth Campaign"""
import json

X_POSTS = [
    "Tired of dating apps that charge you $30/month just to see who liked you? Same. That's why I built EMBIR — 100% free. No catch. embir.xyz",
    
    "Hot take: Dating apps are designed to keep you single. They profit from your loneliness. EMBIR is free — we have zero incentive to keep you swiping. embir.xyz",
    
    "Built a dating platform that's actually inclusive. Gay, straight, bi, trans, queer — everyone's welcome, but you only see compatible people. No bots. embir.xyz",
    
    "6 months ago I got fed up with dating apps. Today EMBIR is live. Free. No paywalls. Real verification. I'm one guy who built this, not a corporation. embir.xyz",
    
    "The gay dating app market is broken: bots everywhere, paywalls on basic features, zero innovation. I'm trying to fix this with EMBIR. Free, verified, inclusive. embir.xyz",
    
    "I spent my weekends for 6 months building a dating platform. It's free, has zero bots, and works for all orientations. Looking for honest feedback. embir.xyz",
    
    "Unpopular opinion: Your dating app shouldn't feel like a casino. No swiping mechanics, no algorithmic manipulation. Just real people. That's EMBIR. embir.xyz"
]

X_REPLIES = {
    "grindr": [
        "Grindr's free tier is basically unusable now. Built EMBIR as an alternative — completely free, no bots. embir.xyz",
        "Grindr was great 5 years ago. Now it's bots and paywalls. I built something different — free and verified. embir.xyz"
    ],
    "tinder": [
        "Tinder's business model is keeping you single. My app is free so there's no incentive to do that. embir.xyz",
        "Swiped for 3 years on Tinder. Built my own app instead. Free, no games. embir.xyz"
    ],
    "dating app": [
        "Tried them all, got frustrated, built my own. It's free and actually works. embir.xyz — would love feedback.",
        "The dating app industry needs disruption. I'm trying with EMBIR — free, no bots, inclusive. embir.xyz"
    ],
    "lonely": [
        "You're not alone. Dating apps make us feel worse, not better. Built EMBIR to actually connect people, not exploit loneliness. embir.xyz",
        "This is exactly why I built EMBIR. Real connections, not algorithmic isolation. Free. embir.xyz"
    ],
    "bot": [
        "The bot problem is out of control. EMBIR has manual verification — zero bots, guaranteed. embir.xyz",
        "Bots ruined dating apps. That's why EMBIR verifies every profile manually. Small but real. embir.xyz"
    ]
}

if __name__ == "__main__":
    print(f"X Posts ready: {len(X_POSTS)}")
    print(f"X Reply categories: {len(X_REPLIES)}")
    print(json.dumps(X_POSTS[:3], indent=2))
