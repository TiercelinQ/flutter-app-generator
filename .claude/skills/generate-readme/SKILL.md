---
name: generate-readme
description: Analyser le code source d'un projet Flutter existant et générer automatiquement son README.md (objectif, stack, arborescence, providers, schéma SQLite, conventions, build). Invoquer depuis la racine du projet cible.
---

# /generate-readme — Génération du README.md

Pré-requis : invoqué depuis la racine du projet cible.

1. Analyser : `pubspec.yaml`, `lib/core/`, `lib/data/` (exceptions, database, models, repositories), `lib/application/`, `lib/presentation/`, `l10n.yaml`.
2. Générer `README.md` à la racine :

```markdown
# [NOM_APP]

[Objectif déduit du code — 2 phrases max]

## Stack
[tableau : Flutter, Dart, Riverpod, sqflite, flutter_quill, i18n]

## Arborescence
[arborescence réelle avec rôle de chaque fichier]

## Providers
[tableau provider → repository → écrans]

## Schéma SQLite
[tables, colonnes, version — ou "aucune"]

## Conventions
[couches, tokens, toasts, SQL paramétré — renvoi aux règles]

## Build & installation
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter build apk --release
```

3. Écrire le fichier sur le disque, confirmer en une ligne.
4. Si des informations sont indéterminables depuis le code : poser les questions groupées en un seul bloc avant d'écrire.
