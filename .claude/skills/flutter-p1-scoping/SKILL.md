---
name: flutter-p1-scoping
description: Phase 1 of the Flutter/Android app generation cycle — scoping in 6 grouped questions, primary color choice, calibration announcement (number of batches), and writing of the scoping spec.
model: sonnet
---

# /flutter-p1-scoping — Scoping

## Role
Project scoper — turn a vague idea into a bounded, validated scope.

## Goal
Lock the project parameters (stack options, DB, i18n, calibration, primary color) before any analysis.

## Deliverable
`docs/specs/01-scoping.md` (written in French) + on-screen summary.

---

## 1. Questions — single block

> If invoked directly (not routed from `/flutter-app`) without a destination folder set for this flow, first ask: `Où créer l'application ? (chemin du dossier de destination)`.

Ask in French. Each closed question carries a `(recommandé)` answer:

```
Cadrage du projet :

1. Objectif de l'application — description libre.
2. Base de données : SQLite (sqflite) / JSON local / aucune ? (recommandé : SQLite si données structurées, sinon aucune)
3. Édition de texte riche (gras, listes, titres — flutter_quill) ? Oui / Non (recommandé : Non sauf besoin avéré)
4. Internationalisation FR/EN activée pour ce projet ? Oui / Non — FR par défaut (recommandé : Non sauf besoin EN avéré)
5. Icône applicative : fichier PNG 1024×1024 fourni ? Oui (chemin) / Non (recommandé : Non, défaut Flutter, ajout possible plus tard)
6. Orientation : portrait uniquement / portrait + paysage ? (recommandé : portrait uniquement)
7. Tests automatisés (flutter_test + mocktail) ? Oui / Non (recommandé : Oui pour usage pro)
```

Persistent preferences (theme, last destination): always enabled via `shared_preferences` — no question.

## 2. Primary color

After receiving the answers, propose (in French):

```
Couleur primaire pour ce projet :

A. Steel Blue — #4682B4 / #5A9FD4          — professionnel, tech, sobre (recommandé)
B. [Color 1] — [light hex] / [dark hex] — [character in 3 words]
C. [Color 2] — [light hex] / [dark hex] — [character in 3 words]
D. [Color 3] — [light hex] / [dark hex] — [character in 3 words]
E. [Color 4] — [light hex] / [dark hex] — [character in 3 words]
```

- Steel Blue is always option A and the recommended default. Propose 4 professional colors (options B-E) suited to the described application context.
- If B, C, D or E: the `primary50/400/600/900` values are set for this project in `tokens.dart`. The global `design-system.md` stays unchanged.
- If A or no answer: Steel Blue by default.

## 3. Calibration — announced at the end of Phase 1

Apply the CALIBRATION table in `CLAUDE.md` (canonical source): Small (< 10 files and ≤ 5 features) → 3 batches; Medium/Large (≥ 10 or > 5) → 4 batches; divergent criteria → the highest wins. **+1 batch if tests are enabled (Q7)** — Small 4 / Medium-Large 5.

The number of batches is frozen after validation. No further modification possible.

## 4. Libraries

Any library outside the stack (charts fl_chart, flutter_secure_storage, logging, flutter_native_splash…) is proposed and validated here — none can be added later without a declaration protocol.

## 5. Write the spec

Write `docs/specs/01-scoping.md` (in French) capturing: objective, DB choice, rich editing, i18n, icon, orientation, tests (Q7), primary color (with hex values), validated libraries, and the frozen calibration (size + number of batches). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/flutter-p2-featuring` after validation.
