# Embir — Tracking Template & Posting Checklist

## Tracker (copier dans Google Sheets / Notion)

Une ligne par vidéo publiée. Colonnes:

| Colonne | Type | Exemple | Note |
|---------|------|---------|------|
| Date | date | 2026-06-21 | |
| Jour | text | J1 | J1-J14 |
| Script | text | Script 1 | |
| Hook variant | text | A | A/B/C |
| Plateforme | text | TikTok | TT/Reels/Shorts/Pinterest |
| Heure publication | time | 07:30 | |
| Sound | text | VO original | ou nom trend |
| Vues @24h | number | 3200 | |
| Vues @7j | number | 18500 | |
| Likes | number | 890 | |
| Commentaires | number | 47 | |
| Shares | number | 23 | |
| Saves | number | 156 | Save rate = signal fort |
| Clics profil | number | 89 | |
| Clics lien bio | number | 34 | = conversion réelle |
| Nouveaux followers | number | 12 | |
| Retention 3s % | number | 52 | >50% = bon hook |
| Retention complète % | number | 28 | >30% = bon contenu |
| Verdict | text | HIT | FLOP/MOYEN/HIT |
| Action suivante | text | Repost hook C sur Reels | |

### Seuils de verdict
- **FLOP**: <1000 vues @24h OU retention 3s <30% → hook à revoir. Pas de repost.
- **MOYEN**: 1k-10k vues @24h, retention 3s 30-50% → retester avec autre hook.
- **HIT**: >10k vues @24h, retention 3s >50% → recycler sur Reels/Shorts immédiatement + décliner en 3 sous-variantes.

### KPIs hebdomadaires (J7 & J14)
- Vues totales semaine
- Taux de clic lien bio (clics / vues) — cible >1%
- Coût par acquisition (si pub) — sinon organique
- Nouveaux inscrits Embir attribués (UTM source=tiktok)
- Meilleur script + meilleur hook de la semaine

---

## UTM Tracking (obligatoire)

Chaque lien en bio doit avoir un UTM pour attribuer les inscriptions:

```
https://embir.xyz/?utm_source=tiktok&utm_medium=social&utm_campaign=launch_w1&utm_content=script1_hookA
```

| Champ | Valeur |
|-------|--------|
| utm_source | tiktok / instagram / youtube / pinterest |
| utm_medium | social |
| utm_campaign | launch_w1 / launch_w2 |
| utm_content | scriptN_hookX (ex: script1_hookA) |

> Mettre à jour le lien en bio pour chaque vidéo (linktree permet plusieurs liens).
> Ou utiliser un lien court paramétré (bit.ly) pour chaque combinaison script+hook.

---

## Posting Checklist (avant CHAQUE publication)

### Pré-production
- [ ] Script choisi + hook variant (A/B/C)
- [ ] Shot list lu, props prêts
- [ ] Téléphone: mode Ne pas déranger, charge >50%
- [ ] Lumière testée (visage éclairé, pas de contre-jour)
- [ ] Micro testé (audio clair, pas d'écho)

### Tournage
- [ ] Format vertical 9:16 vérifié
- [ ] Hook filmé en 3 variantes (A/B/C)
- [ ] Screen recording Embir (app ouverte, notifications off)
- [ ] B-roll capturé (1 plan de plus que prévu)
- [ ] CTA final filmé ("embir.xyz")

### Montage
- [ ] Durée 25-55s (jamais >60s pour launch)
- [ ] Hook dans les 1.5 premières secondes
- [ ] Captions burned-in (CapCut, chunkées selon 02_CAPTIONS.md)
- [ ] Mots-clés en couleur accent #ff5e36
- [ ] Watermark "embir.xyz" top-left discret
- [ ] "embir.xyz" à l'écran minimum 2s à la fin
- [ ] Couper les silences / respirations longues
- [ ] Sound ajouté (VO ou trend)

### Avant publication
- [ ] Caption rédigée (1 phrase + question + hashtags)
- [ ] Hashtags: 4-6 (mix générique + niche + #embirdating)
- [ ] Cover frame choisi (frame à ~1s avec texte hook)
- [ ] UTM link prêt pour bio
- [ ] Lien en bio mis à jour (linktree)
- [ ] Tags ajoutés (TikTok: dating, datingapp, freedating)

### Après publication (dans 2h)
- [ ] Répondre aux 5 premiers commentaires (boost algo)
- [ ] Partager sur Story IG (si Reels)
- [ ] Noter dans le tracker (date, script, hook, plateforme, heure)
- [ ] Screen des analytics à 24h (vues, retention, saves)

### À 24h
- [ ] Remplir Vues @24h, Likes, Commentaires, Saves, Clics profil
- [ ] Déterminer verdict (FLOP/MOYEN/HIT)
- [ ] Si HIT: lancer recyclage Reels + Shorts
- [ ] Si MOYEN: planifier repost avec autre hook
- [ ] Si FLOP: analyser le hook (retention 3s), pas repost

---

## Calendrier de review
- **Quotidien** (5 min): remplir tracker 24h, répondre commentaires
- **J7** (30 min): bilan semaine 1, identifier top 3 scripts/hooks, ajuster semaine 2
- **J14** (1h): bilan complet campagne, décider suite (scale gagnants / nouvelles angles)

## Outils recommandés (gratuits)
- **Montage**: CapCut (mobile + desktop, captions auto + edit)
- **Tracker**: Google Sheets (template ci-dessus) ou Notion
- **UTM**: bit.ly ou utm.io
- **Trends**: TikTok Creative Center, TokBoard
- **Download sans watermark**: snapinst.app (pour recyclage cross-plateforme)
- **Stock B-roll**: Pexels, Pixabay (gratuit, sans attribution)
