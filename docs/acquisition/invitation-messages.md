# Embir — Messages d'invitation

## Principe

Aucune automatisation. L'utilisateur copie et partage manuellement.
Pas de spam. Pas d'envoi automatique.

## Message standard (WhatsApp, SMS, DM)

```
Je viens de rejoindre Embir, une nouvelle plateforme de rencontre 
moderne et gratuite pendant son lancement. 

Tu peux créer ton profil ici : https://embir.xyz
```

## Lien direct

```
https://embir.xyz
```

## Page d'invitation

Route : /inviter
Accessible depuis le dashboard ET en page standalone.
Contient :
- Titre "Invite tes amis sur Embir"
- Texte explicatif
- Message copiable
- Lien copiable
- Bouton copie (JS)
- Pas d'envoi automatique

## Canaux suggérés

- WhatsApp (lien natif wa.me si configuré)
- SMS (lien natif sms: si configuré)
- DM réseaux sociaux
- Email informel

## Règles

- Pas de scraping
- Pas de liste d'envoi
- Pas d'automatisation
- L'utilisateur garde le contrôle
- Message transparent (gratuit, lancement)
