# Guide d'utilisation — Flutter App Generator (unifié)

> Version unifiée : pipeline de génération + skills de maintenance, rôle explicite par skill, specs persistées, vérification exécutable, mémoire native.

---

## Structure du framework

```
claude-flutter-framework/
├── CLAUDE.md                 # Instructions core (EN) · persona · communication FR · index commandes · calibrage
├── GUIDE.md                  # Ce fichier
├── README.md                 # Présentation du repo GitHub (EN)
├── CHANGELOG.md              # Changelog du générateur (distinct de celui des apps générées)
├── LICENSE
└── .claude/
    ├── design-system.md      # Référence visuelle contraignante (tokens Dart) — mode framework
    ├── layout.md             # Cadre layout d'accompagnement — catalogue de patterns + composition par défaut + spec toasts
    ├── rules/
    │   ├── architecture.md   # Couches data / application / presentation, livraison par lots
    │   ├── theme.md          # tokens.dart + app_theme.dart, ThemeExtension, mode sombre (mode framework)
    │   ├── native-design.md  # Profil Material 3 natif (si design system natif choisi en phase 1)
    │   ├── errors.md         # Exceptions métier, toasts overlay, AsyncValue
    │   ├── config.md         # pubspec, dépendances, i18n gen-l10n, build APK
    │   ├── security.md       # Validation entrées, SQL paramétré, flutter_secure_storage, permissions
    │   ├── tests.md          # flutter_test + mocktail, couverture par couche
    │   ├── verification.md   # Vérification EXÉCUTABLE centralisée + intégrité statique
    │   └── readme.md         # Synchro README post-livraison (régénération auto)
    ├── skills/
    │   ├── flutter-app/             # Menu démarrage / reprise / maintenance (4 options)
    │   ├── flutter-p1-scoping/      # Scoping — 9 questions (dont design system) + couleur → docs/specs/01-scoping.md
    │   ├── flutter-p2-featuring/    # Fiche besoins → docs/specs/02-featuring.md
    │   ├── flutter-p3-surfaces/    # Proposition layout → docs/specs/03-surfaces.md
    │   ├── flutter-p4-architect/    # Contrat architectural verrouillé → docs/specs/04-architect.md
    │   ├── flutter-p5-development/  # Livraison par lots (enchaînement auto)
    │   ├── flutter-add-feature/     # Ajouter une feature à une app livrée (diff de contrat validé avant écriture)
    │   ├── flutter-trace-feature/   # Tracer une fonctionnalité presentation→application→data
    │   ├── flutter-fix-issue/       # Corriger un bug — arbre de décision, cause racine
    │   ├── flutter-refactor-code/   # Restructurer sous validation explicite uniquement
    │   ├── flutter-migrate-design/  # Convertir une app v1.x vers le design system v2.0 (mode framework)
    │   ├── flutter-release/         # Figer une version SemVer depuis le changelog cumulé
    │   ├── flutter-run-tests/       # Vérification exécutable (analyze, custom_lint, tests)
    │   ├── flutter-load-project/    # Chargement d'un projet existant
    │   ├── flutter-generate-readme/ # Génération README.md projet existant
    │   ├── flutter-save-session/    # Sauvegarde de session
    │   ├── flutter-show-state/      # État courant du projet
    │   ├── flutter-show-contract/   # Arborescence du contrat validé
    │   └── flutter-save-memory/     # Persiste dans la mémoire native Claude Code
    ├── settings.json         # Permissions d'exécution (flutter, dart, keytool) + garde-fous deny (.env, .g.dart, build)
    └── settings.local.json   # Overrides locaux (non versionné)
```

> Source de vérité **unique** : un seul `design-system.md` et un seul `layout.md`, sous `.claude/` (lus à la demande par les skills UI, non auto-importés). `design-system.md` vaut pour le mode framework ; en mode natif, la référence visuelle contraignante est `rules/native-design.md`. Les défauts structurels de `layout.md` valent pour les deux modes ; la composition est un défaut modifiable, co-défini en Phase 3.

> Dossiers locaux **non versionnés** (gitignorés) : `tasks/` (plan de travail — `todo.md`, `lessons.md`) et `incidents-reports/`, dossier **optionnel** pour tes propres notes d'incidents/anomalies pendant la maintenance. Rien ne l'alimente automatiquement (aucun skill n'y écrit) ; c'est un espace de notes personnel. Supprime l'entrée du `.gitignore` si tu ne t'en sers pas.

---

## Spécificités de ce framework

| Apport                        | Détail                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Rôle par skill**            | Chaque skill ouvre sur un persona ciblé (Role / Goal / Deliverable).            |
| **Specs persistées**          | Phases 1→4 écrivent `docs/specs/01-scoping.md` … `04-architect.md` (dans la langue de l'utilisateur). |
| **Contrat = source de vérité**| `docs/specs/04-architect.md` relu par `/flutter-load-project`, `/flutter-show-contract`, `/flutter-add-feature`, `/flutter-refactor-code`. |
| **Skills de maintenance**     | `flutter-trace-feature`, `flutter-add-feature`, `flutter-fix-issue`, `flutter-refactor-code`, `flutter-migrate-design`, `flutter-release`, `flutter-run-tests` avec arbres de décision et anti-patterns. |
| **Vérification exécutable**   | `rules/verification.md` : analyze, custom_lint, build_runner, tests — échec bloquant. |
| **Mémoire native**            | `/flutter-save-memory` écrit dans la mémoire native Claude Code + `MEMORY.md`.            |

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

### Phase 1 — Scoping

9 questions : objectif · base de données (SQLite sqflite / JSON local / aucune) · édition de texte riche (flutter_quill) · i18n FR/EN · orientation (portrait / portrait+paysage) · **design system** (framework par défaut / Material 3 natif) · icône PNG 1024×1024 · tests (flutter_test + mocktail) · méthode d'installation (USB direct / APK debug / APK release signé / AAB Play Store). Puis les couleurs, branchées sur le design system :

- **Framework** : choix de la **palette** — un accent obligatoire + jusqu'à 4 rôles optionnels (fond principal, fond secondaire, texte, détails) en override. Tout le reste est dérivé de l'accent : neutres teintés (les deux thèmes), stops d'accent, couleurs sémantiques harmonisées vers l'accent (info = accent). Palette « Steel Blue » par défaut + 5 palettes nommées (Teal, Forest, Slate, Amber, Ruby) + palette personnalisée ; contrôle de contraste WCAG AA (averti), y compris sur les paires sémantiques dérivées.
- **Natif** : une **seed** unique (presets + hex personnalisé) → `ColorScheme.fromSeed` génère les schémas clair + sombre. Pas de palette du mode framework, pas de dynamic color ; contraste garanti par Material 3. Profil : `rules/native-design.md`.

Calibrage annoncé.

| Taille        | Lots (sans tests) | Lots (avec tests) |
| ------------- | ----------------- | ----------------- |
| Petit         | 3                 | 4                 |
| Moyen / Grand | 4                 | 5                 |

Écrit `docs/specs/01-scoping.md`.

### Phase 2 — Featuring

Fiche structurée + calibrage figé. Validation bloquante avant Phase 3. Écrit `docs/specs/02-featuring.md`.

### Phase 3 — Surfaces

Co-conception guidée. Questionnaire structurant (navigation, organisation du contenu, formulaires et actions) appuyé sur le catalogue de patterns de `layout.md` §12 : NavigationBar basse (défaut), Navigation Drawer, TabBar haute, NavigationRail. Patterns structurels, valables dans les deux modes design system. Puis proposition sur mesure, composition librement amendable, et questions de détail (items de navigation, panneau secondaire endDrawer/BottomSheet, actions sur listes, pull-to-refresh). Validation bloquante. Écrit `docs/specs/03-surfaces.md`.

### Phase 4 — Architect

Arborescence + rôle de chaque fichier + **tableau des providers** (provider → controller → repository → écrans) + schéma SQLite + tableau tokens → thème. **Verrouillé après validation.** Écrit `docs/specs/04-architect.md` (source de vérité).

### Phase 5 — Development

Fichiers écrits directement sur le disque. Annonce `Lot N/[total] — [contenu]`. Enchaînement automatique. Dernier lot : instructions (build_runner, custom_lint, build APK, installation + désinstallation selon la méthode choisie en Phase 1), `README.md` + `tool/seed.dart` (jeu de données cohérent si une base est présente). Vérification exécutable appliquée. Les fichiers `.g.dart` ne sont jamais livrés (générés par build_runner).

---

## Reprendre une session

```
/flutter-save-session            # sauvegarder en fin de session (docs/sessions/)
/flutter-app → 2    # reprendre : fournir le chemin du fichier SESSION
```

La reprise est gérée par `/flutter-app` (option 2, ou bloc SESSION collé directement dans le message — reprise sans menu) : lecture complète du fichier SESSION, réponse `Resuming [APP_NAME] — [phase suivante] | Batch [X/total] | Open points: …`, puis enchaînement immédiat sans re-poser les questions résolues.

---

## Travailler sur un projet livré

```
/flutter-app → 3      # ou directement /flutter-load-project depuis la racine du projet
```

Claude lit `docs/specs/04-architect.md` (priorité), sinon le README, sinon le code, détecte les tests (`test/`), puis confirme la prise en charge en un bloc (`Project loaded: [nom] v[version]`, stack, DB, entités, providers, tests, design system, specs, `Generator rules applied. Ready for: development · fixes · improvements · adjustments.`) et applique toutes les règles. Projet sans README : `/flutter-generate-readme`.

### Maintenance (`/flutter-app → 4`)

| Besoin                          | Commande      |
| ------------------------------- | ------------- |
| Ajouter une fonctionnalité      | `/flutter-add-feature`   |
| Comprendre / tracer le code     | `/flutter-trace-feature`     |
| Corriger un bug                 | `/flutter-fix-issue`         |
| Restructurer (sous validation)  | `/flutter-refactor-code`    |
| Convertir une app v1.x vers le design system v2.0 | `/flutter-migrate-design` |
| Figer une version SemVer (changelog cumulé) | `/flutter-release` |
| Vérifier le build / lancer les checks | `/flutter-run-tests`  |

---

## Vérification exécutable

`rules/verification.md` est la source unique. Commandes (échec bloquant quand l'environnement le permet) :

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # .g.dart
flutter analyze              # 0 issue
dart run custom_lint         # lints Riverpod
flutter test                 # si tests existants uniquement
flutter build apk            # smoke de compilation (debug) ; --release / appbundle seulement si APK release signé / AAB choisi (phase 1 Q9)
```

`/flutter-run-tests` exécute cette échelle ; `/flutter-fix-issue` y renvoie pour confirmer une correction.

---

## Architecture en couches

`rules/architecture.md` impose des imports unidirectionnels stricts : `presentation` (`ref.watch`/`ref.read`) → `application` (Notifiers Riverpod) → `data` (repositories → SQLite). `data` n'importe jamais Flutter UI ni Riverpod ; `presentation` n'accède jamais aux repositories directement. Riverpod 3 avec génération de code (`@riverpod` + build_runner). `/flutter-fix-issue`, `/flutter-add-feature` et `/flutter-refactor-code` y renvoient.

---

## Sécurité

`rules/security.md` est non négociable et appliqué à 100% : entrées validées dans la couche `data` ; SQL 100% paramétré (`?` + `whereArgs`) ; secrets uniquement dans `flutter_secure_storage` (Android Keystore, jamais en prefs/DB) ; permissions Android minimales ; pas de trafic en clair ; données de l'app dans le bac à sable privé. `/flutter-fix-issue` et `/flutter-add-feature` y renvoient.

---

## Gestion des anomalies et mémoire

Après correction (`/flutter-fix-issue` ou Phase 5), Claude produit un bilan de nettoyage puis propose `Veux-tu mémoriser ce point ? /flutter-save-memory`. `/flutter-save-memory` catégorise et écrit dans la **mémoire native Claude Code** (+ `MEMORY.md`).

Prérequis : la mémoire auto doit être activée (`/config → Memory → Enable auto memory → On`). Sans cette activation, `/flutter-save-memory` formule les notes mais ne les persiste pas entre sessions.

---

## Commandes de référence

| Commande                | Modèle | Action                                               |
| ----------------------- | ------ | ---------------------------------------------------- |
| `/flutter-app`          | Haiku  | Menu démarrage / reprise / maintenance               |
| `/flutter-p1-scoping`       | Sonnet | Scoping — 9 questions (dont design system) + couleur |
| `/flutter-p2-featuring`       | Sonnet | Fiche besoins                                        |
| `/flutter-p3-surfaces`        | Sonnet | Proposition layout + personnalisation                |
| `/flutter-p4-architect`       | Sonnet | Contrat architectural verrouillé (providers, SQLite) |
| `/flutter-p5-development` | Sonnet | Livraison par lots — enchaînement automatique        |
| `/flutter-add-feature`            | Sonnet | Ajouter une feature à une app livrée                 |
| `/flutter-trace-feature`              | Sonnet | Tracer une fonctionnalité à travers les couches      |
| `/flutter-fix-issue`                  | Sonnet | Corriger un bug — cause racine                       |
| `/flutter-refactor-code`             | Sonnet | Restructurer sous validation                         |
| `/flutter-migrate-design`            | Sonnet | Convertir une app v1.x vers le design system v2.0    |
| `/flutter-release`                   | Sonnet | Figer une version SemVer depuis le changelog cumulé  |
| `/flutter-run-tests`                 | Sonnet | Vérification exécutable                               |
| `/flutter-load-project`       | Sonnet | Charger un projet existant                           |
| `/flutter-generate-readme`      | Sonnet | Générer README.md d'un projet existant               |
| `/flutter-save-session`              | Haiku  | Sauvegarder la session                               |
| `/flutter-show-state`               | Haiku  | État courant                                         |
| `/flutter-show-contract`              | Haiku  | Contrat architectural validé                         |
| `/flutter-save-memory`            | Haiku  | Persister dans la mémoire native                     |

---

## Structure d'une application générée

```
mon_app/
├── pubspec.yaml · analysis_options.yaml · l10n.yaml (si i18n)
├── README.md
├── CLAUDE.md                      # Identité projet (origine, contexte, écarts) — généré en fin de Phase 5
├── .claude/settings.json          # Garde-fous + hook de vérification (app auto-contrôlée)
├── docs/specs/                    # Specs de génération (langue utilisateur)
├── docs/release/CHANGELOG.md      # Changelog SemVer (Keep a Changelog, anglais)
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

> Arbre en mode **framework**. En mode **natif** : `presentation/` sans `toast_overlay`/`app_dialog`/`app_button`, `application/` sans `toast_controller` ; ajout de `presentation/messenger.dart` (clé globale `ScaffoldMessengerKey` → `SnackBar`/`MaterialBanner`/`AlertDialog`) ; `theme/` = `AppTokens` + une `seedColor` (`ColorScheme.fromSeed`).

### Versioning & changelog

Chaque app générée porte une version SemVer et un changelog `docs/release/CHANGELOG.md` (format Keep a Changelog, rédigé en anglais). Les skills de maintenance (`add-feature`, `fix-issue`, `refactor-code`, `migrate-design`) accumulent leurs entrées sous `## [Unreleased]` ; `/flutter-release` les fige en un bloc de version daté et incrémente la source de version (`pubspec.yaml` `version: x.y.z+N`, où le build number Android `N` est incrémenté à chaque bump, miroir `lib/core/config.dart`). La version n'est jamais incrémentée en silence. Voir `rules/versioning.md`.

---

## Points de vigilance

- Le design system est choisi en phase 1 : **framework** (`design-system.md` + `layout.md`) ou **natif** Material 3 (`rules/native-design.md`). Option Flutter only.
- `.claude/design-system.md` et `.claude/layout.md` sont la **source de vérité** du mode framework — ne pas les dupliquer. La composition portée par `layout.md` est un défaut modifiable (retenue validée en Phase 3) ; le skin de `design-system.md` reste contraignant.
- Zéro valeur visuelle en dur dans les widgets — mode framework : tout dans `tokens.dart` / `app_theme.dart` ; mode natif : couleurs via `Theme.of(context).colorScheme`, dimensions via `AppTokens`.
- Couches strictes : `presentation` n'importe jamais `data` ; `data` n'importe jamais Flutter UI ni Riverpod.
- Toute requête SQL est paramétrée (`?` + `whereArgs`) — zéro interpolation.
- Les fichiers `.g.dart` ne sont jamais livrés — générés par `dart run build_runner build`.
- Le contrat (`docs/specs/04-architect.md`) est verrouillé. Tout changement structurel passe par `/flutter-add-feature` (diff de contrat validé avant écriture) ou le protocole de déclaration d'écart.
- `/flutter-load-project`, `/flutter-generate-readme`, `/flutter-add-feature`, `/flutter-trace-feature`, `/flutter-fix-issue`, `/flutter-refactor-code`, `/flutter-migrate-design`, `/flutter-release`, `/flutter-run-tests` s'invoquent depuis la racine du projet cible.
- Livrable : installation sur le téléphone, méthode choisie en phase 1 (Q9) — USB direct par défaut (`flutter run` / `flutter install`, sans signature ni "sources inconnues") ; fichier APK debug ; APK release signé (sideload) ou AAB Play Store si sélectionné. Signature/keystore opt-in (livrés seulement pour release/AAB). Détail : `rules/config.md §Installation methods`.
