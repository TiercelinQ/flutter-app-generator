# Guide d'utilisation — Flutter App Generator (unifié)

> Version unifiée : pipeline de génération + skills de maintenance, rôle explicite par skill, specs persistées, vérification exécutable, mémoire native.

---

## Structure du framework

```
claude-flutter-framework/
├── CLAUDE.md                 # Instructions core (EN) · persona · communication FR · index commandes · calibrage
├── design-system.md          # Référence visuelle contraignante (tokens Dart) — source de vérité unique
├── layout.md                 # Référence layout contraignante — AppShell, AppBar, NavigationBar, toasts
├── rules/
│   ├── architecture.md       # Couches data / application / presentation, livraison par lots
│   ├── theme.md              # tokens.dart + app_theme.dart, ThemeExtension, mode sombre
│   ├── errors.md             # Exceptions métier, toasts overlay, AsyncValue
│   ├── config.md             # pubspec, dépendances, i18n gen-l10n, build APK
│   ├── security.md           # Validation entrées, SQL paramétré, flutter_secure_storage, permissions
│   ├── tests.md              # flutter_test + mocktail, couverture par couche
│   └── verification.md       # Vérification EXÉCUTABLE centralisée + intégrité statique
├── skills/
│   ├── flutter-app/          # Menu démarrage / reprise / maintenance (4 options)
│   ├── phase1-cadrage/       # Cadrage — 6 questions + couleur → docs/specs/01-cadrage.md
│   ├── phase2-analyse/       # Fiche besoins → docs/specs/02-analyse.md
│   ├── phase3-layout/        # Proposition layout → docs/specs/03-layout.md
│   ├── phase4-contrat/       # Contrat architectural verrouillé → docs/specs/04-contrat.md
│   ├── phase5-developpement/ # Livraison par lots (enchaînement auto)
│   ├── implement/            # Ajouter une feature à une app livrée (respect contrat + couches)
│   ├── analyze/              # Tracer une fonctionnalité presentation→application→data
│   ├── fix/                  # Corriger un bug — arbre de décision, cause racine
│   ├── refactor/             # Restructurer sous validation explicite uniquement
│   ├── test/                 # Vérification exécutable (analyze, custom_lint, tests)
│   ├── charger-projet/       # Chargement d'un projet existant
│   ├── generate-readme/      # Génération README.md projet existant
│   ├── session/              # Sauvegarde de session
│   ├── statut/               # État courant du projet
│   ├── contrat/              # Arborescence du contrat validé
│   └── memoriser/            # Persiste dans la mémoire native Claude Code
├── settings.json             # Permissions d'exécution (flutter, dart, keytool)
├── GUIDE.md                  # Ce fichier
└── README.md                 # Présentation du repo GitHub (EN)
```

> Structure **plate** : un seul `design-system.md` et un seul `layout.md` (source de vérité unique). `CLAUDE.md` les importe via `@`.

---

## Nouveautés de la version unifiée

| Apport                        | Détail                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Rôle par skill**            | Chaque skill ouvre sur un persona ciblé (Role / Goal / Deliverable).            |
| **Specs persistées**          | Phases 1→4 écrivent `docs/specs/01-cadrage.md` … `04-contrat.md` (en français). |
| **Contrat = source de vérité**| `docs/specs/04-contrat.md` relu par `/charger-projet`, `/contrat`, `/implement`, `/refactor`. |
| **Skills de maintenance**     | `analyze`, `implement`, `fix`, `refactor`, `test` avec arbres de décision et anti-patterns. |
| **Vérification exécutable**   | `rules/verification.md` : analyze, custom_lint, build_runner, tests — échec bloquant. |
| **Mémoire native**            | `/memoriser` écrit dans la mémoire native Claude Code + `MEMORY.md`.            |

---

## Installation

```bash
# Démarrer Claude Code depuis le dossier du framework (ou copier dans le projet cible).
claude
```

### Prérequis

```bash
claude --version      # Claude Code CLI installé et connecté
flutter --version     # Flutter stable · Dart 3 (pour générer/exécuter les apps)
```

### Activer la mémoire (une seule fois, par machine)

```
/config → Memory → Enable auto memory → On
```

---

## Démarrer une nouvelle application

```
/flutter-app → 1
```

### Phase 1 — Cadrage

7 questions en un seul bloc : objectif · base de données (SQLite sqflite / JSON local / aucune) · édition de texte riche (flutter_quill) · i18n FR/EN · icône PNG 1024×1024 · orientation (portrait / portrait+paysage) · tests (flutter_test + mocktail). Puis choix de couleur primaire (3 propositions + Slate Blue par défaut). Calibrage annoncé.

| Taille        | Lots (sans tests) | Lots (avec tests) |
| ------------- | ----------------- | ----------------- |
| Petit         | 3                 | 4                 |
| Moyen / Grand | 4                 | 5                 |

Écrit `docs/specs/01-cadrage.md`.

### Phase 2 — Analyse des besoins

Fiche structurée + calibrage figé. Validation bloquante avant Phase 3. Écrit `docs/specs/02-analyse.md`.

### Phase 3 — Layout

Proposition issue de `layout.md` + personnalisation (destinations NavigationBar, panneau secondaire endDrawer/BottomSheet, actions sur listes, pull-to-refresh). Validation bloquante. Écrit `docs/specs/03-layout.md`.

### Phase 4 — Contrat architectural

Arborescence + rôle de chaque fichier + **tableau des providers** (provider → controller → repository → écrans) + schéma SQLite + tableau tokens → thème. **Verrouillé après validation.** Écrit `docs/specs/04-contrat.md` (source de vérité).

### Phase 5 — Développement par lots

Fichiers écrits directement sur le disque. Annonce `Lot N/[total] — [contenu]`. Enchaînement automatique. Dernier lot : instructions (build_runner, custom_lint, build APK), `README.md`. Vérification exécutable appliquée. Les fichiers `.g.dart` ne sont jamais livrés (générés par build_runner).

---

## Reprendre une session

```
/session            # sauvegarder en fin de session (claude-sessions/)
/flutter-app → 2    # reprendre : fournir le chemin du fichier SESSION
```

---

## Travailler sur un projet livré

```
/flutter-app → 3      # ou directement /charger-projet depuis la racine du projet
```

Claude lit `docs/specs/04-contrat.md` (priorité), sinon le README, sinon le code, puis applique toutes les règles. Projet sans README : `/generate-readme`.

### Maintenance (`/flutter-app → 4`)

| Besoin                          | Commande      |
| ------------------------------- | ------------- |
| Ajouter une fonctionnalité      | `/implement`   |
| Comprendre / tracer le code     | `/analyze`     |
| Corriger un bug                 | `/fix`         |
| Restructurer (sous validation)  | `/refactor`    |
| Vérifier le build / lancer les checks | `/test`  |

---

## Vérification exécutable

`rules/verification.md` est la source unique. Commandes (échec bloquant quand l'environnement le permet) :

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # .g.dart
flutter analyze              # 0 issue
dart run custom_lint         # lints Riverpod
flutter test                 # si tests existants uniquement
flutter build apk --release  # APK final (dernier lot)
```

`/test` exécute cette échelle ; `/fix` y renvoie pour confirmer une correction.

---

## Architecture en couches

`rules/architecture.md` impose des imports unidirectionnels stricts : `presentation` (`ref.watch`/`ref.read`) → `application` (Notifiers Riverpod) → `data` (repositories → SQLite). `data` n'importe jamais Flutter UI ni Riverpod ; `presentation` n'accède jamais aux repositories directement. Riverpod 3 avec génération de code (`@riverpod` + build_runner). `/fix`, `/implement` et `/refactor` y renvoient.

---

## Gestion des anomalies et mémoire

Après correction (`/fix` ou Phase 5), Claude produit un bilan de nettoyage puis propose `Veux-tu mémoriser ce point ? /memoriser`. `/memoriser` catégorise et écrit dans la **mémoire native Claude Code** (+ `MEMORY.md`).

---

## Commandes de référence

| Commande                | Modèle | Action                                               |
| ----------------------- | ------ | ---------------------------------------------------- |
| `/flutter-app`          | Haiku  | Menu démarrage / reprise / maintenance               |
| `/phase1-cadrage`       | Sonnet | Cadrage — 6 questions + couleur                      |
| `/phase2-analyse`       | Sonnet | Fiche besoins                                        |
| `/phase3-layout`        | Sonnet | Proposition layout + personnalisation                |
| `/phase4-contrat`       | Sonnet | Contrat architectural verrouillé (providers, SQLite) |
| `/phase5-developpement` | Sonnet | Livraison par lots — enchaînement automatique        |
| `/implement`            | Sonnet | Ajouter une feature à une app livrée                 |
| `/analyze`              | Sonnet | Tracer une fonctionnalité à travers les couches      |
| `/fix`                  | Sonnet | Corriger un bug — cause racine                       |
| `/refactor`             | Sonnet | Restructurer sous validation                         |
| `/test`                 | Sonnet | Vérification exécutable                               |
| `/charger-projet`       | Sonnet | Charger un projet existant                           |
| `/generate-readme`      | Sonnet | Générer README.md d'un projet existant               |
| `/session`              | Haiku  | Sauvegarder la session                               |
| `/statut`               | Haiku  | État courant                                         |
| `/contrat`              | Haiku  | Contrat architectural validé                         |
| `/memoriser`            | Haiku  | Persister dans la mémoire native                     |

---

## Structure d'une application générée

```
mon_app/
├── pubspec.yaml · analysis_options.yaml · l10n.yaml (si i18n)
├── README.md
├── CLAUDE.md                      # Identité projet (origine, contexte, écarts) — généré en fin de Phase 5
├── .claude/settings.json          # Garde-fous + hook de vérification (app auto-contrôlée)
├── docs/specs/                    # Specs de génération (FR)
├── android/                       # minSdk 24, signature release
└── lib/
    ├── main.dart                  # ProviderScope, MaterialApp, themeMode, ToastOverlay
    ├── core/                      # config.dart, strings.dart (si i18n off), utils/helpers.dart
    ├── data/                      # exceptions.dart, database/, models/, repositories/
    ├── application/               # theme_controller, toast_controller, [entite]_controller
    └── presentation/
        ├── theme/                 # tokens.dart, app_theme.dart
        ├── screens/               # app_shell.dart, [entite]_screen.dart
        └── widgets/               # app_app_bar, toast_overlay, app_dialog, app_button…
```

---

## Points de vigilance

- `design-system.md` et `layout.md` sont la **source de vérité unique** — ne pas les dupliquer.
- Zéro valeur visuelle en dur dans les widgets — tout dans `tokens.dart` / `app_theme.dart`.
- Couches strictes : `presentation` n'importe jamais `data` ; `data` n'importe jamais Flutter UI ni Riverpod.
- Toute requête SQL est paramétrée (`?` + `whereArgs`) — zéro interpolation.
- Les fichiers `.g.dart` ne sont jamais livrés — générés par `dart run build_runner build`.
- Le contrat (`docs/specs/04-contrat.md`) est verrouillé. Tout changement structurel passe par `/implement` ou le protocole de déclaration d'écart.
- `/charger-projet`, `/generate-readme`, `/implement`, `/analyze`, `/fix`, `/refactor`, `/test` s'invoquent depuis la racine du projet cible.
- Livrable : APK release signé (sideload) — AAB Play Store sur demande.
