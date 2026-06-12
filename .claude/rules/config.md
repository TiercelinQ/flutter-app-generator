# Règles config, dépendances, i18n, icône, logging, packaging

## Structure `lib/core/config.dart`

Structure minimale obligatoire dans tout projet :

```dart
// Application
const String appName = 'NomApp';
const String appVersion = '1.0.0';

// Base de données (si applicable)
const String dbFilename = 'nom_app.db';
const int dbVersion = 1;

// Internationalisation (si activée)
const String defaultLocale = 'fr';
const List<String> supportedLocales = ['fr', 'en'];
```

- Toute constante réutilisée dans plus d'un fichier va dans `core/config.dart`.
- Chemin de la base : résolu à l'exécution (`getDatabasesPath()`) dans `app_database.dart` — jamais en dur.
- Zéro couleur ni dimension dans `config.dart` — tout le visuel vit dans `tokens.dart` (rules/theme.md).

## `pubspec.yaml` — dépendances de référence

Versions caret (`^`), fixées à la version mineure validée en Phase 1. `pubspec.lock` commité.

```yaml
environment:
  sdk: ^3.4.0

dependencies:
  flutter: { sdk: flutter }
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0
  sqflite: ^2.3.0              # si DB SQLite
  path: ^1.9.0                 # si DB SQLite
  shared_preferences: ^2.2.0   # si préférences
  font_awesome_flutter: ^10.7.0
  flutter_quill: ^9.0.0        # si édition riche activée Phase 1
  flutter_localizations: { sdk: flutter }   # si i18n
  intl: any                                  # si i18n

dev_dependencies:
  flutter_lints: ^4.0.0
  build_runner: ^2.4.0
  riverpod_generator: ^2.4.0
```

## `analysis_options.yaml`

```yaml
include: package:flutter_lints/flutter.yaml
analyzer:
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true
```

`dynamic` interdit sauf justification en commentaire. DartDoc (`///`) sur classes exportées et méthodes publiques.

## Génération de code (Riverpod)

- Les fichiers `.g.dart` ne sont jamais livrés — générés par l'utilisateur :
  `dart run build_runner build --delete-conflicting-outputs`
- Commande incluse dans les instructions du dernier lot, avant `flutter run`.

## Internationalisation (si activée en Phase 1)

- `flutter_localizations` + `gen-l10n` : `l10n.yaml` à la racine, ressources `lib/l10n/app_fr.arb` et `app_en.arb`.
- Toutes les chaînes visibles passent par `AppLocalizations.of(context)` (alias `t` via extension).
- Clés en camelCase par entité : `recordSaved`, `navSettings`.
- Langue chargée au démarrage depuis les préférences, FR par défaut. Changement à chaud via provider `localeControllerProvider`, persisté.
- Zéro chaîne visible en dur dans les trois couches. Si i18n non activée : chaînes FR centralisées dans `core/strings.dart`.

## Icône applicative (launcher)

- Source : `assets/icon/icon.png` — 1024×1024, fond plein (pas de transparence pour l'icône adaptative).
- Outil : `flutter_launcher_icons` (dev dependency, validée d'office) :

```yaml
flutter_launcher_icons:
  android: true
  image_path: assets/icon/icon.png
  adaptive_icon_background: "#FFFFFF"   # token : bg
  adaptive_icon_foreground: assets/icon/icon.png
```

- Commande : `dart run flutter_launcher_icons` — incluse dans les instructions du dernier lot.
- Si l'utilisateur ne fournit pas d'icône en Phase 1 : icône Flutter par défaut, signalé dans le README généré.

## Logging (sur demande uniquement)

Si activé pour un projet : package `logging` (équipe Dart) — à valider en Phase 1.

```dart
// main.dart
Logger.root.level = Level.INFO;
Logger.root.onRecord.listen((r) => debugPrint('${r.time} — ${r.level.name} — ${r.message}'));
```

Sortie fichier sur Android : ajout d'un handler écrivant dans `getApplicationDocumentsDirectory()` (package `path_provider`, à valider).

## Sécurité données

- Requêtes SQL : 100% paramétrées (`?` + `whereArgs`) — règle absolue.
- Aucun secret en dur. Secrets utilisateur (si besoin) : `flutter_secure_storage` (à valider Phase 1).
- Base et préférences : stockage privé de l'app (sandbox Android) — aucun fichier en stockage partagé sans demande explicite + permission.
- Keystore de signature release : local, gitignoré (`android/key.properties`, `*.jks`).

## Build & installation Android

### Signature release (une fois par projet)

```
keytool -genkey -v -keystore android/app/release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

`android/key.properties` (gitignoré) + bloc `signingConfigs` dans `android/app/build.gradle` — livrés commentés dans le dernier lot.

### Commandes

```
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run                       # dev — téléphone branché USB (une fois) ou émulateur
flutter build apk --release       # APK signé : build/app/outputs/flutter-apk/app-release.apk
```

### Installation sans PC (sideload — usage personnel)

1. Copier `app-release.apk` sur le téléphone (Drive, mail, câble).
2. Ouvrir le fichier → autoriser "Installer des applications inconnues" pour la source.
3. Installer. L'application reste installée, indépendante du PC.

### Play Store (sur demande explicite)

`flutter build appbundle --release` → AAB + instructions Play Console, livrés uniquement si demandé.
