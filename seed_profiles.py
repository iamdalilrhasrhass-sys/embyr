"""
Seed Embyr with realistic-looking user profiles
Creates accounts via the local API to make the site look alive
"""
import requests, json, random, time
from datetime import datetime, timedelta

API = "http://localhost:3000/api/auth/register"

# French gay male names
FIRST_NAMES = [
    "Lucas", "Thomas", "Alexandre", "Maxime", "Hugo", "Antoine", "Jules",
    "Léo", "Raphaël", "Nathan", "Enzo", "Louis", "Mathis", "Paul", "Noah",
    "Gabin", "Clément", "Mathéo", "Ethan", "Valentin", "Nolan", "Axel",
    "Adam", "Bastien", "Romain", "Arthur", "Timéo", "Victor", "Simon", "Florian",
    "Quentin", "Dorian", "Cédric", "Julien", "Sébastien", "Mickaël", "Jérôme",
    "Nicolas", "Damien", "Laurent", "Cyril", "Yannick", "David", "Olivier",
    "Kévin", "Jonathan", "Vincent", "Guillaume", "Pierre", "Fabien"
]

LAST_NAMES = [
    "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit",
    "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel",
    "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Morel",
    "Girard", "André", "Mercier", "Dupont", "Lambert", "Fontaine", "Rousseau",
    "Vincent", "Muller", "Lefèvre", "Faure", "André", "Boyer", "Bonnet"
]

CITIES = [
    ("Paris", "75000"), ("Lyon", "69000"), ("Marseille", "13000"),
    ("Toulouse", "31000"), ("Bordeaux", "33000"), ("Lille", "59000"),
    ("Nice", "06000"), ("Nantes", "44000"), ("Strasbourg", "67000"),
    ("Montpellier", "34000"), ("Rennes", "35000"), ("Grenoble", "38000"),
    ("Aix-en-Provence", "13100"), ("Tours", "37000"), ("Reims", "51100")
]

BIOS = [
    "Nouveau sur Embyr, hâte de découvrir !",
    "Je cherche des rencontres sincères et sans prise de tête.",
    "Passionné de voyages, de sport et de bons restaurants.",
    "Plutôt chill, je vois où la vie me mène.",
    "En mode fondateur — je construis cette communauté avec vous.",
    "Geek assumé, chaton addict, à la recherche de belles rencontres.",
    "Sportif, 3 fois par semaine à la salle. Ouvert d'esprit.",
    "Amateur d'art et de culture, je parle peu mais j'écoute beaucoup.",
    "Cuisinier le jour, cinéphile le soir. Et toi ?",
    "Je viens de débarquer sur Embyr, on papote ?",
    "Designer le jour, musicien la nuit. Créatif dans l'âme.",
    "Cherche pas l'amour, cherche des connexions vraies.",
    "Entrepreneur, passionné, ambitieux. Et romantique.",
    "Voyageur, 15 pays visités. Prêt pour la prochaine aventure.",
    "Simple, direct, honnête. Je ne joue pas de rôle.",
    "Nouveau en ville, je cherche des potes et peut-être plus.",
    "Sportif et gourmand — le combo parfait ?",
    "Développeur le jour, rêveur la nuit. J'ai codé une partie d'Embyr !",
    "Infirmier, passionné par mon métier. Doux et attentionné.",
    "Fan de techno, de bons plans et de découvertes."
]

PROFILE_PICS = [
    "https://i.pravatar.cc/400?u=embyr1",
    "https://i.pravatar.cc/400?u=embyr2",
    "https://i.pravatar.cc/400?u=embyr3",
    "https://i.pravatar.cc/400?u=embyr4",
    "https://i.pravatar.cc/400?u=embyr5",
    "https://i.pravatar.cc/400?u=embyr6",
    "https://i.pravatar.cc/400?u=embyr7",
    "https://i.pravatar.cc/400?u=embyr8",
    "https://i.pravatar.cc/400?u=embyr9",
    "https://i.pravatar.cc/400?u=embyr10",
    "https://i.pravatar.cc/400?u=embyr11",
    "https://i.pravatar.cc/400?u=embyr12",
]

def random_birthdate(age_min=18, age_max=45):
    days_ago = random.randint(age_min * 365, age_max * 365)
    return (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")

def generate_referral():
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "EMB-" + "".join(random.choice(chars) for _ in range(6))

def create_profile(index):
    name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    email = f"seed{index:03d}@embir.xyz"
    password = "SeedPass2026!"
    city = random.choice(CITIES)[0]
    birthdate = random_birthdate(21, 38)
    bio = random.choice(BIOS)
    referral = generate_referral()
    
    payload = {
        "email": email,
        "password": password,
        "name": name,
        "city": city,
        "birthDate": birthdate,
        "gender": "male",
        "referralCode": referral
    }
    
    try:
        r = requests.post(API, json=payload, timeout=10)
        if r.status_code == 201:
            data = r.json()
            user_id = data.get('user', {}).get('id', '?')
            print(f"  ✅ {name:25s} | {email:20s} | {city:15s} | ID={user_id}")
            return True, user_id
        elif r.status_code == 409:
            print(f"  ⚠️  {email} déjà existant")
            return False, None
        else:
            print(f"  ❌ {name:25s} | {r.status_code} | {r.text[:80]}")
            return False, None
    except Exception as e:
        print(f"  ❌ {name:25s} | Error: {e}")
        return False, None

# First check if the API is up
print("=== Vérification API Embyr ===")
try:
    r = requests.get("http://localhost:3000", timeout=5)
    print(f"Site OK: HTTP {r.status_code}")
except:
    print("❌ Site pas accessible!")
    exit(1)

print("\n=== CRÉATION DES PROFILS ===\n")

created = 0
# Create 15 profiles
for i in range(1, 16):
    print(f"[{i}/15]", end="")
    success, uid = create_profile(i)
    if success:
        created += 1
    time.sleep(0.5)  # Small delay to avoid overwhelming the API

print(f"\n\n=== RÉSULTAT ===")
print(f"Créés: {created}/15 profils")
print(f"Email pattern: seed001@embir.xyz … seed015@embir.xyz")
print(f"Mot de passe: SeedPass2026!")
