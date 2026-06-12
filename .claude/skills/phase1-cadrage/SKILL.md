---
name: phase1-cadrage
description: Phase 1 du cycle de génération d'application Flutter/Android — cadrage en 5 questions groupées, choix de la couleur primaire, annonce du calibrage (nombre de lots).
---

# /phase1-cadrage — Cadrage

## 1. Questions — un seul bloc

```
Cadrage du projet :

1. Objectif de l'application — description libre.
2. Base de données : SQLite (sqflite) / JSON local / aucune ?
3. Édition de texte riche (gras, listes, titres — flutter_quill) ? Oui / Non
4. Internationalisation FR/EN activée pour ce projet ? Oui / Non (FR par défaut si Non)
5. Icône applicative : fichier PNG 1024×1024 fourni ? Oui (chemin) / Non (défaut Flutter, ajout possible plus tard)
```

Préférences persistantes (thème, dernière destination) : toujours activées via `shared_preferences` — pas de question.

## 2. Couleur primaire

Après réception des réponses, proposer :

```
Couleur primaire pour ce projet :

A. [Couleur 1] — [hex clair] / [hex sombre] — [caractère en 3 mots]
B. [Couleur 2] — [hex clair] / [hex sombre] — [caractère en 3 mots]
C. [Couleur 3] — [hex clair] / [hex sombre] — [caractère en 3 mots]
D. Slate Blue  — #4F46E5 / #818CF8          — professionnel, tech, sobre (défaut)
```

- Proposer 3 couleurs professionnelles adaptées au contexte de l'application décrite.
- Si A, B ou C : les valeurs `primary50/400/600/900` sont définies pour ce projet dans `tokens.dart`. Le `design-system.md` global reste inchangé.
- Si D ou pas de réponse : Slate Blue par défaut.

## 3. Calibrage — annoncé en fin de Phase 1

| Taille        | Fichiers | Fonctionnalités | Lots |
| ------------- | -------- | --------------- | ---- |
| Petit         | < 10     | ≤ 5             | 3    |
| Moyen / Grand | ≥ 10     | > 5             | 4    |

Le nombre de lots est figé après validation. Aucune modification possible.

## 4. Bibliothèques

Toute bibliothèque hors stack (graphiques fl_chart, flutter_secure_storage, logging, flutter_native_splash…) est proposée et validée ici — aucune ne pourra être ajoutée ensuite sans protocole de déclaration.

→ Enchaîner sur `/phase2-analyse` après validation.
