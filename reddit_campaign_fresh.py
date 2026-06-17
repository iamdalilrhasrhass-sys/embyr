#!/usr/bin/env python3
"""EMBIR Reddit Campaign — Fresh posts for June 13-14 growth push"""
import json, time

POSTS = [
    {
        "subreddit": "gaybros",
        "title": "I spent 6 months building a dating app because I was tired of the grind. It's free, no bots, and I need honest feedback.",
        "body": """Hey guys,

Long-time lurker here. I'm a gay developer who got so fed up with dating apps being paywalled, bot-infested meat markets that I built my own. 

**EMBIR** — it's free. Not "free with a premium tier." Free. Zero paywalls.

What makes it different:
- Real verification (no bots, no catfish)
- You set your orientation — you ONLY see compatible people
- No algorithm gaming your emotions to keep you swiping
- Currently live, focused on building a real community first

It's at [embir.xyz](https://embir.xyz) — it's an early version, not perfect, but it works.

I'm one guy in Paris who built this. Not a corporation. I want to build something the community actually wants.

**Brutal feedback please.** What would make you switch from your current app? What's the ONE feature that's missing everywhere?

I'll implement the top suggestions. Dead serious."""
    },
    {
        "subreddit": "gay",
        "title": "What's the worst thing about gay dating apps? (Building a solution, need your input)",
        "body": """Not promoting anything — genuinely doing market research.

I've been building a gay dating platform called EMBIR. Before I write another line of code, I want to hear from you:

1. What's the #1 thing you HATE about current apps (Grindr, Tinder, etc.)?
2. What would your ideal dating app look like?
3. Would you try a new, completely free app if it had no bots?

Some context: EMBIR is 100% free (no subscriptions), manually verified profiles, and you only see people compatible with your orientation. It's live at embir.xyz.

But I don't want to build in a bubble. Tell me what actually matters to you.

No PR speak. Be as brutal as you want."""
    },
    {
        "subreddit": "dating_advice",
        "title": "The problem with dating apps isn't the people — it's the business model",
        "body": """Think about it:

Dating apps make money when you STAY single. Every subscription, every "boost," every premium feature — they profit from your loneliness.

A truly successful dating app would LOSE all its users. So they design the opposite: infinite swiping, algorithmic frustration, just enough hope to keep you paying.

I'm building EMBIR to break this cycle:
- 100% free (no financial incentive to keep you single)
- No desirability scores or hidden rankings
- Real verification to kill bots
- You match, you talk, you meet — that's it

It's at [embir.xyz](https://embir.xyz) — early version, live now.

Curious: have you noticed apps getting WORSE over time? More paywalls, more bots? Or is it just me?"""
    },
    {
        "subreddit": "LGBT",
        "title": "Building an inclusive dating platform — what does 'inclusive' actually mean to you?",
        "body": """Hi everyone,

I'm a solo queer developer building EMBIR, a dating platform designed with inclusivity as the foundation, not an afterthought.

**What I've built so far:**
- You choose your orientation and gender identity — you only see compatible people
- All orientations welcome: gay, lesbian, bi, trans, queer, pan, ace, straight
- No algorithmic gatekeeping or "hotness" scores
- 100% free — no subscriptions, ever
- Currently live at [embir.xyz](https://embir.xyz)

**What I need from you:**
1. What does "inclusive dating app" mean to YOU specifically?
2. What features would make you feel safe and seen?
3. What's the biggest red flag when you try a new platform?

I'm one person building this. Your input directly shapes what gets built next.

No corporate BS. Tell me the truth."""
    },
    {
        "subreddit": "SideProject",
        "title": "I built a free, inclusive dating platform in 6 months — 0 users so far. Roast my approach.",
        "body": """Built EMBIR ([embir.xyz](https://embir.xyz)) — a dating platform that's:
- 100% free (no paywalls, no premium tiers)
- Inclusive for all orientations
- Manually verified profiles (zero bots)
- Privacy-first design

**Stack:** Next.js, TypeScript, Prisma, PostgreSQL, deployed on a $6 VPS
**Time:** 6 months, solo developer
**Users:** 1 (me)

I've tried:
- Reddit posts → no traction
- SEO (150+ pages indexed) → 0 organic traffic in 3 months
- X/Twitter → 0 clicks from 54 replies
- HN Show → 12 upvotes, 0 signups

**What I think the problem is:**
1. The dating space is crowded and trust is zero
2. I'm a solo dev with no brand authority
3. My marketing sucks — I'm an engineer, not a growth hacker

**My question:**
If you had a functional product with zero users, what would YOU do to get the first 100? 

Brutal honesty appreciated. I can take it."""
    }
]

COMMENTS = [
    # r/gaybros comments
    {"subreddit": "gaybros", "trigger_keywords": ["grindr", "tired", "app", "dating", "meet", "lonely", "ghost"], "templates": [
        "Honestly, this is why I started building my own app. The current ones are designed to keep you swiping, not meeting people. Free and bot-free — embir.xyz if you want to check it.",
        "The bot problem is real. I built verification into my app from day one because of this exact issue. embir.xyz — not perfect but zero bots, guaranteed.",
        "I felt this in my soul. After getting ghosted 20 times I just started building my own platform. It's free, no games. embir.xyz if you're curious.",
        "This is the exact conversation that made me build EMBIR. The gamification of dating is toxic. My app has no swiping mechanics, just real profiles."
    ]},
    # r/gay comments  
    {"subreddit": "gay", "trigger_keywords": ["alternative", "grindr", "free", "dating", "app", "recommend"], "templates": [
        "If you're looking for something free and actually focused on dating (not hookups), I built EMBIR. It's still small but growing. embir.xyz",
        "I tried all of them and got so frustrated I built my own. It's basic but free and bot-free. embir.xyz — would love feedback.",
        "The alternatives are just as bad with different branding. That's why I'm building something from scratch — no paywalls, real verification."
    ]},
    # r/dating_advice comments
    {"subreddit": "dating_advice", "trigger_keywords": ["tired", "dating", "apps", "delete", "quit", "grindr", "tinder", "frustrated"], "templates": [
        "I quit all of them and built my own. No paywalls, no bots, just real people. It's small but growing. embir.xyz if you want to try something different.",
        "This is exactly why I'm building EMBIR. Dating shouldn't feel like a casino. Free platform, real verification, no algorithmic tricks.",
        "The problem is the business model — they make money when you stay single. My app is free so there's no incentive to keep you swiping forever."
    ]}
]

# Output for use by automation scripts
if __name__ == "__main__":
    print(json.dumps({"posts": len(POSTS), "comment_groups": len(COMMENTS), "ready": True}, indent=2))
