# Règles d'architecture — data / application / presentation

## Mapping MVC → couches Flutter/Riverpod

| Couche MVC | Couche Flutter           | Contenu                                        |
| ---------- | ------------------------ | ----------------------------------------------- |
| Model      | `lib/data/`              | Modèles immuables, repositories, accès SQLite   |
| Controller | `lib/application/`       | Notifiers Riverpod — état + orchestration       |
| View       | `lib/presentation/`      | Widgets, écrans, thème — UI uniquement          |

## Responsabilités

### Data — `lib/data/`
- `models/` : classes immuables (`final` + `const` constructeurs), `fromMap`/`toMap` pour SQLite. Zéro logique d'affichage.
- `repositories/` : un repository par entité — seul point d'accès à SQLite/`shared_preferences`. Lèvent des exceptions métier nommées (`data/exceptions.dart`).
- `database/app_database.dart` : ouverture, `onCreate`/`onUpgrade` (migrations versionnées), schéma SQL.
- **Interdit** : import de `flutter/material.dart`, de Riverpod, ou de `presentation/`/`application/`.
- **Toute requête SQL est paramétrée** (`?` + `whereArgs`) — zéro interpolation de valeurs.

### Application — `lib/application/`
- Un fichier par entité : `[entite]_controller.dart` — `@riverpod` Notifier/AsyncNotifier (codegen).
- Orchestrent : appellent les repositories, exposent l'état (`AsyncValue<T>` pour l'asynchrone), interceptent les exceptions métier et déclenchent les toasts (`rules/errors.md`).
- **Interdit** : import de widgets, `BuildContext`, accès SQLite direct.

### Presentation — `lib/presentation/`
- `screens/` : un écran par destination + `app_shell.dart`. `ConsumerWidget`/`ConsumerStatefulWidget`.
- `widgets/` : composants réutilisables (AppButton, AppDialog, ToastOverlay, items de liste…).
- `theme/` : `tokens.dart` + `app_theme.dart` — voir `rules/theme.md`.
- Consomment uniquement les providers (`ref.watch`/`ref.read`) — **jamais les repositories directement**.
- Aucune logique métier. Aucune gestion d'erreur métier (toasts pilotés par `application`).

## Imports unidirectionnels

```
presentation ──ref.watch/read──▶ application ──▶ data
      │                               │
      └────── core/ (config, utils purs) ◀───────┘   importable par toutes les couches
```

- `lib/core/config.dart` : constantes applicatives. `lib/core/utils/helpers.dart` : fonctions pures (formatage, validation) — zéro Flutter, zéro Riverpod, zéro accès données.
- Une entité = un model + un repository + un controller + un écran/widgets. Constantes partagées dans `core/config.dart`.

## Riverpod — conventions

- Génération de code obligatoire : annotations `@riverpod`, fichiers `.g.dart` via `build_runner`. Zéro provider manuel.
- État asynchrone : `AsyncValue` — les écrans gèrent les trois cas via `.when(data/loading/error)`.
- `ref.read` réservé aux callbacks ; `ref.watch` dans `build`.
- Zéro logique dans les providers de simple exposition ; logique d'orchestration dans les Notifiers uniquement.

## Arborescence type générée

```
mon_app/
├── pubspec.yaml
├── analysis_options.yaml          # flutter_lints + règles strictes
├── l10n.yaml                      # si i18n activée
├── README.md
├── android/                       # généré par flutter create — minSdk 24, signature release
└── lib/
    ├── main.dart                  # ProviderScope, MaterialApp, themeMode, ToastOverlay racine
    ├── core/
    │   ├── config.dart            # Constantes applicatives
    │   └── utils/helpers.dart     # Fonctions pures
    ├── data/
    │   ├── exceptions.dart        # Exceptions métier nommées
    │   ├── database/app_database.dart
    │   ├── models/[entite].dart
    │   └── repositories/
    │       ├── preferences_repository.dart
    │       └── [entite]_repository.dart
    ├── application/
    │   ├── theme_controller.dart  # ThemeMode + persistance
    │   ├── toast_controller.dart  # File de toasts
    │   └── [entite]_controller.dart
    └── presentation/
        ├── theme/
        │   ├── tokens.dart        # Tous les tokens design-system
        │   └── app_theme.dart     # ThemeData light/dark + ThemeExtension AppColors
        ├── screens/
        │   ├── app_shell.dart     # Scaffold, AppBar, NavigationBar, IndexedStack
        │   └── [entite]_screen.dart
        └── widgets/
            ├── toast_overlay.dart
            ├── app_dialog.dart
            ├── app_button.dart
            └── [entite]_…​.dart
```

(+ `lib/l10n/app_fr.arb`, `app_en.arb` si i18n — voir `rules/config.md`.)

## Livraison par lots

**Petit projet (3 lots) :**

| Lot | Contenu                                                                                  |
| --- | ----------------------------------------------------------------------------------------- |
| 1   | `core/` + `data/` (exceptions, database, models, repositories)                           |
| 2   | `application/` + `presentation/` (theme, screens, widgets)                               |
| 3   | `main.dart` + `pubspec.yaml` + `analysis_options.yaml` + l10n + README + instructions    |

**Moyen / Grand projet (4 lots) :**

| Lot | Contenu                                                                                  |
| --- | ----------------------------------------------------------------------------------------- |
| 1   | `core/` + `data/`                                                                        |
| 2   | `presentation/` (theme, screens, widgets)                                                |
| 3   | `application/` (controllers)                                                             |
| 4   | `main.dart` + `pubspec.yaml` + `analysis_options.yaml` + l10n + README + instructions    |

### Format de livraison
- Annonce : `📦 Lot N/[total] — [contenu]`
- Fichiers écrits directement sur le disque, blocs complets et autonomes (hors `.g.dart` — générés par build_runner).
- Enchaînement automatique entre les lots sans confirmation.
- Dernier lot : instructions (`flutter pub get`, `dart run build_runner build --delete-conflicting-outputs`, `flutter run`, `flutter build apk --release`, sideload) + `README.md` à la racine.

## Vérification d'intégrité (silencieuse — signalée uniquement si écart)

**Chaque lot :**
1. Dart valide, analyzer clean (mental ou `flutter analyze` si environnement dispo).
2. Imports : tous utilisés, aucun manquant, sens unidirectionnel respecté.
3. Responsabilités des couches respectées (zéro UI en data/application, zéro accès données en presentation).
4. Zéro `// TODO`, zéro implémentation vide injustifiée, zéro `dynamic` injustifié.
5. Dart 3 · API Flutter stable · zéro API dépréciée.
6. Conformité `design-system.md` et `layout.md` — zéro valeur visuelle en dur dans les widgets.
7. SQL : 100% paramétré.

**Dernier lot uniquement — cross-fichiers :**
8. Tous providers référencés existent ; annotations `@riverpod` cohérentes avec les usages (`.g.dart` à générer listés).
9. Schéma SQLite ↔ `fromMap`/`toMap` ↔ repositories alignés ; version de schéma et migrations cohérentes.
10. Contrat architectural respecté.
11. Clés i18n : toutes utilisées, aucune manquante (si activée).

## Ajustements post-livraison

Demandés par l'utilisateur après exécution. Correction isolée sur le fichier concerné + ses dépendances directes. Livraison du fichier complet corrigé.

## Résolution d'anomalie — protocole nettoyage

Quand une anomalie nécessite plusieurs tentatives avant d'être résolue, dès que la solution définitive est identifiée et livrée, produire obligatoirement :

```
Anomalie résolue. Éléments à retirer des tentatives précédentes :

Fichier [nom] :
- [ligne / bloc / import / provider / token / clé i18n à supprimer]
- ...
```

- Lister uniquement les éléments ajoutés lors des tentatives infructueuses qui ne sont plus nécessaires.
- Couvrir tous les fichiers impactés : Dart, pubspec, ARB, tokens.
- Livrer les fichiers nettoyés complets si l'utilisateur confirme.
- Puis proposer : "Veux-tu mémoriser ce point ? `/memoriser`"

## Suppressions

Suppression totale dans tous les fichiers : code, imports, providers, modèles, colonnes SQL (+ migration), tokens, clés ARB. Interdit : code commenté, implémentations vides, résidus. Livraison des fichiers modifiés complets.
