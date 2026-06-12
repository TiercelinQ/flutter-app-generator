# Guide d'utilisation — Flutter App Generator

---

## Structure du projet

```
flutter-app-generator/
├── .claude/
│   ├── CLAUDE.md                              # Instructions core
│   ├── design-system.md                       # Référence visuelle contraignante (tokens Dart)
│   ├── layout.md                              # Référence layout contraignante (Android)
│   ├── rules/
│   │   ├── architecture.md                    # Couches data/application/presentation, Riverpod, lots, nettoyage
│   │   ├── theme.md                           # tokens.dart, app_theme.dart, mode sombre, flat design
│   │   ├── errors.md                          # Protocole erreurs Data→Application→Presentation, toasts
│   │   └── config.md                          # config.dart, pubspec, i18n ARB, icône, build APK
│   └── skills/
│       ├── flutter-app/     /flutter-app      # Menu démarrage / reprise
│       ├── phase1-cadrage/  /phase1-cadrage   # Cadrage — 5 questions + couleur primaire
│       ├── phase2-analyse/  /phase2-analyse   # Fiche besoins structurée
│       ├── phase3-layout/   /phase3-layout    # Proposition layout + personnalisation
│       ├── phase4-contrat/  /phase4-contrat   # Contrat architectural verrouillé
│       ├── phase5-developpement/ /phase5-...  # Livraison par lots + README.md
│       ├── charger-projet/  /charger-projet   # Chargement d'un projet existant
│       ├── generate-readme/ /generate-readme  # Génération README.md projet existant
│       ├── session/         /session          # Sauvegarde de session
│       ├── statut/          /statut           # État courant du projet
│       ├── contrat/         /contrat          # Arborescence du contrat validé
│       └── memoriser/       /memoriser        # Mémorisation erreurs / décisions
├── .gitignore
├── GUIDE.md                                   # Ce fichier
└── README.md                                  # Présentation du repo GitHub
```

---

## Installation depuis GitHub

```bash
git clone https://github.com/[utilisateur]/flutter-app-generator.git
cd flutter-app-generator
```

### Prérequis

```bash
# Claude Code CLI installé et connecté
claude --version

# Flutter SDK stable (inclut Dart 3) + toolchain Android
flutter --version
flutter doctor        # Android SDK + licences OK requis
```

### Démarrage

```bash
# Depuis le dossier flutter-app-generator/
claude
```

Claude Code détecte `.claude/CLAUDE.md` automatiquement. `design-system.md` et `layout.md`
sont dans `.claude/` et importés via `@` — chargés à chaque session.

### Activer la mémoire (une seule fois, par machine)

```
/config
→ Memory → Enable auto memory → On
```

Sans cette activation, `/memoriser` formule les notes mais ne les persiste pas entre sessions.

---

## Fichiers ignorés par git (.gitignore)

| Fichier / Dossier             | Raison                                     |
| ----------------------------- | ------------------------------------------ |
| `.claude/settings.local.json` | Permissions et hooks personnels            |
| `.claude/agent-memory/`       | Mémoire auto Claude Code — personnelle     |
| `claude-sessions/`            | Fichiers SESSION propres à chaque projet   |
| `*.g.dart`                    | Générés par build_runner                   |
| `build/` · `.dart_tool/`      | Builds Flutter                             |
| `android/key.properties` · `*.jks` | Signature release — locale, jamais commitée |

> **Note** : `.claude/settings.json` (sans `.local`) peut être commité pour partager
> des permissions ou hooks communs à tous les utilisateurs du repo.

---

## Effort recommandé par modèle

| Skill                                                                                                                                            | Modèle | Effort recommandé     |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------------------- |
| `/flutter-app` · `/statut` · `/contrat` · `/session` · `/memoriser`                                                                              | Haiku  | — (tâches mécaniques) |
| `/phase1-cadrage` · `/phase2-analyse` · `/phase3-layout` · `/phase4-contrat` · `/phase5-developpement` · `/charger-projet` · `/generate-readme`  | Sonnet | `medium`              |

`high` : justifié pour la Phase 4 (contrat + schéma SQLite + providers) ou le débogage multi-fichiers / état Riverpod.
Changer l'effort en session : `/effort medium` ou `/effort high`.

---

## Démarrer une nouvelle application

```
/flutter-app → 1
```

### Phase 1 — Cadrage

Claude pose 5 questions en un seul bloc :

1. Objectif de l'application
2. Base de données (SQLite via sqflite / JSON local / aucune)
3. Édition de texte riche — flutter_quill (Oui / Non)
4. Internationalisation FR/EN (Oui / Non)
5. Icône applicative PNG 1024×1024 (fournie / défaut)

Puis propose 3 couleurs primaires adaptées au contexte + l'option Slate Blue par défaut.
Toute bibliothèque hors stack est validée ici.
Annonce le calibrage (Petit : 3 lots / Moyen-Grand : 4 lots) — figé après cette phase.

### Phase 2 — Analyse des besoins

Fiche structurée : objectif, fonctionnalités retenues, hors périmètre, contraintes techniques.
**→ Validation explicite requise avant Phase 3.**

### Phase 3 — Proposition de layout

Claude propose une structure issue de `layout.md` (AppBar + NavigationBar 2–5 destinations,
ou écran unique) puis pose les questions de personnalisation en un seul bloc :

1. Destinations de navigation (modifications)
2. Panneau secondaire (endDrawer / BottomSheet / Dialog seul / Aucun)
3. Présentation des formulaires (écran dédié / BottomSheet / Dialog)
4. Actions sur les items de liste (swipe / menu contextuel / boutons)
5. Pull-to-refresh (Oui / Non)

Produit une synthèse complète du layout validé.
**→ Validation explicite requise avant Phase 4.**

### Phase 4 — Contrat architectural

Arborescence complète + rôle de chaque fichier + tableau des providers + schéma SQLite + tableau tokens → thème.
**→ Verrouillé après validation. Tout écart impose : arrêt → déclaration → validation.**

### Phase 5 — Développement par lots

Claude crée les dossiers et écrit les fichiers directement sur le disque — aucune action manuelle requise.
Format d'annonce : `📦 Lot N/[total] — [contenu]`
Enchaînement automatique entre les lots sans confirmation.

**Contenu par taille de projet :**

| Taille               | Lot 1               | Lot 2                          | Lot 3                                   | Lot 4                                   |
| -------------------- | ------------------- | ------------------------------ | --------------------------------------- | --------------------------------------- |
| Petit (3 lots)       | `core/` + `data/`   | `application/` + `presentation/` | `main.dart` + pubspec + l10n + README | —                                       |
| Moyen/Grand (4 lots) | `core/` + `data/`   | `presentation/`                | `application/`                          | `main.dart` + pubspec + l10n + README   |

**Dernier lot — livrables supplémentaires obligatoires :**

- Instructions complètes : `flutter pub get` → `build_runner` → `flutter run` → `flutter build apk --release` + installation sans PC (sideload) + signature release
- `README.md` écrit automatiquement à la racine du projet

> **Note** : Claude Code demandera la permission d'exécuter Bash la première fois.
> Accepter pour tous les appels du projet pour ne pas être interrompu à chaque fichier.
> Les fichiers `.g.dart` (Riverpod codegen) ne sont pas livrés — ils sont générés par
> `dart run build_runner build --delete-conflicting-outputs`.

---

## Installer l'application générée sur ton téléphone

**Sans PC après le build (sideload — usage personnel) :**

1. `flutter build apk --release` → `build/app/outputs/flutter-apk/app-release.apk`
2. Copier l'APK sur le téléphone (Drive, mail, câble une fois)
3. Ouvrir le fichier → autoriser « Installer des applications inconnues » → installer

L'application reste installée, indépendante du PC. Le branchement USB n'est nécessaire
que pour le développement (`flutter run`, hot reload) ou un `flutter install` ponctuel.

**Play Store :** `flutter build appbundle --release` — instructions livrées sur demande explicite.

---

## Reprendre une session existante

### Sauvegarder en fin de session

```
/session
```

Claude crée automatiquement le dossier `claude-sessions/` (s'il n'existe pas) et écrit
le fichier `SESSION_NomApp_SN.md` dedans.

### Reprendre

```
/flutter-app → 2
```

Claude demande le chemin du fichier SESSION, le lit automatiquement et reprend
sans re-poser les questions résolues.

```
ex: C:\projets\mon-app\claude-sessions\SESSION_MonApp_S1.md
```

---

## Travailler sur un projet existant (Phase 5 terminée)

Le `.claude/` doit être présent à la racine du projet. Si ce n'est pas le cas :

```bash
# Copier le .claude/ dans le projet existant (Windows)
xcopy /E /I flutter-app-generator\.claude mon-projet\.claude
```

Puis lancer Claude Code depuis la racine du projet :

```bash
cd mon-projet\
claude
```

**Projet avec README.md :**

```
/charger-projet
```

Claude lit `README.md`, confirme la prise en charge et applique toutes les règles.

**Projet sans README.md :**

```
/generate-readme
```

Claude analyse le code source et génère `README.md` automatiquement.

---

## Gestion des anomalies et mémoire

### Résolution d'anomalie

Après chaque correction, Claude produit :

```
Anomalie résolue. Éléments à retirer des tentatives précédentes :
Fichier [nom] : [lignes / blocs / providers / tokens / clés ARB à supprimer]
```

Puis propose : `Veux-tu mémoriser ce point ? /memoriser`

### /memoriser

```
/memoriser
```

Claude demande ce qu'il faut retenir :

- A. Erreur à ne plus reproduire
- B. Décision structurante
- C. Préférence de génération
- D. Autre

Consigne une note datée et catégorisée dans `~/.claude/agent-memory/`.
Disponible dans toutes les sessions suivantes sur ce projet.

> La mémoire est stockée localement sur ta machine — elle n'est pas commitée dans le repo.

---

## Commandes de référence

| Commande                | Modèle | Action                                               |
| ----------------------- | ------ | ---------------------------------------------------- |
| `/flutter-app`          | Haiku  | Menu démarrage / reprise                             |
| `/phase1-cadrage`       | Sonnet | Cadrage — 5 questions + couleur primaire             |
| `/phase2-analyse`       | Sonnet | Fiche besoins structurée                             |
| `/phase3-layout`        | Sonnet | Proposition layout + personnalisation                |
| `/phase4-contrat`       | Sonnet | Contrat architectural verrouillé                     |
| `/phase5-developpement` | Sonnet | Livraison par lots — fichiers écrits sur le disque   |
| `/charger-projet`       | Sonnet | Charger un projet existant depuis son README.md      |
| `/generate-readme`      | Sonnet | Générer README.md d'un projet existant               |
| `/session`              | Haiku  | Sauvegarder la session dans `claude-sessions/`       |
| `/statut`               | Haiku  | État courant (phase, lot, décisions, points ouverts) |
| `/contrat`              | Haiku  | Arborescence du contrat architectural validé         |
| `/memoriser`            | Haiku  | Mémoriser une erreur, décision ou préférence         |

---

## Structure d'une application générée

```
mon_app/
├── pubspec.yaml                   # Dépendances ^, flutter_lints, riverpod codegen
├── analysis_options.yaml          # Lints stricts
├── l10n.yaml                      # Si i18n activée
├── README.md                      # Généré automatiquement en fin de Phase 5
├── claude-sessions/               # Fichiers SESSION (gitignorés)
├── assets/icon/icon.png           # Icône launcher (si fournie)
├── android/                       # minSdk 24, signature release (key.properties gitignoré)
└── lib/
    ├── main.dart                  # ProviderScope, MaterialApp, themeMode, ToastOverlay
    ├── core/
    │   ├── config.dart            # Constantes applicatives
    │   └── utils/helpers.dart     # Fonctions pures
    ├── data/
    │   ├── exceptions.dart        # Exceptions métier nommées
    │   ├── database/app_database.dart   # Schéma, migrations (si SQLite)
    │   ├── models/[entite].dart
    │   └── repositories/[entite]_repository.dart
    ├── application/
    │   ├── theme_controller.dart  # ThemeMode + persistance
    │   ├── toast_controller.dart  # File de toasts
    │   └── [entite]_controller.dart   # @riverpod Notifiers
    └── presentation/
        ├── theme/
        │   ├── tokens.dart        # Tous les tokens design-system
        │   └── app_theme.dart     # ThemeData light/dark + ThemeExtension
        ├── screens/
        │   ├── app_shell.dart     # AppBar, NavigationBar, IndexedStack
        │   └── [entite]_screen.dart
        └── widgets/               # toast_overlay, app_dialog, app_button, items…
```

Données d'exécution (base SQLite, préférences) : stockage privé sandbox Android, jamais dans le projet.

---

## Points de vigilance

- `design-system.md` et `layout.md` sont dans `.claude/` — ne pas les déplacer ni modifier.
- Toutes les valeurs visuelles vivent dans `lib/presentation/theme/tokens.dart` — y compris les couleurs d'icônes (pendant de l'exception `config.py` du générateur Python, ici intégrée au thème).
- Le contrat architectural (Phase 4) est verrouillé. Tout changement structurel — y compris schéma SQLite — impose le protocole de déclaration.
- `.g.dart` jamais commités ni livrés — toujours régénérés par build_runner après modification d'un controller.
- SQL 100% paramétré (`?` + `whereArgs`) — règle absolue.
- `flutter_quill` n'est présent que si l'édition riche a été activée en Phase 1.
- Keystore de signature (`*.jks`, `key.properties`) : local, gitignoré — le perdre = impossible de mettre à jour l'app installée.
- `/charger-projet` et `/generate-readme` doivent être invoqués depuis la racine du projet cible.
- La mémoire (`~/.claude/agent-memory/`) est locale à ta machine — non commitée, non partagée.
- `.claude/settings.local.json` est gitignorée — chaque utilisateur configure ses propres permissions locales.
