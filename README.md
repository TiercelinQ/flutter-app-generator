# Flutter App Generator

> Claude Code generator for **Android apps** — Flutter · Dart · Riverpod · SQLite.

Part of a family of Claude Code generators. See also [python-app-generator](https://github.com/TiercelinQ/claude-python-app-generator) and [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator).

---

## What it does

A structured prompt system that generates complete, production-ready Flutter Android applications through a 5-phase cycle:

1. **Scoping** — stack decisions (DB, rich text, i18n, app icon), primary color, library validation, lot sizing
2. **Requirements** — structured feature sheet, explicit out-of-scope
3. **Layout** — navigation destinations, secondary panel, form presentation, list gestures
4. **Architecture contract** — full file tree, provider map, SQLite schema, token/theme table — locked before any code is written
5. **Development** — files written directly to disk in batches, no manual steps

Every generated app enforces the same visual design system, MVC-equivalent layered architecture, and strict SQL rules.

---

## Generated app stack

| Element      | Value                                         |
| ------------ | --------------------------------------------- |
| Target OS    | Android — minSdk 24                           |
| Framework    | Flutter stable · Dart 3                       |
| State        | Riverpod 2 (code generation)                  |
| Architecture | data · application · presentation             |
| Theme        | tokens.dart + full light/dark ThemeData       |
| Database     | sqflite — parametrized SQL only (optional)    |
| Rich text    | flutter_quill (optional — activated Phase 1)  |
| Icons        | font_awesome_flutter                          |
| i18n         | gen-l10n FR/EN (ARB files)                    |
| Quality      | flutter_lints · strict analyzer               |
| Delivery     | Signed release APK (sideload) · AAB on demand |

---

## Requirements

```bash
# Claude Code CLI — installed and authenticated
claude --version

# Flutter stable SDK (includes Dart 3) + Android toolchain
flutter --version
flutter doctor    # Android SDK + accepted licenses required
```

---

## Getting started

```bash
git clone https://github.com/TiercelinQ/flutter-app-generator.git
cd flutter-app-generator
claude
```

Then in Claude Code:

```
/flutter-app
```

---

## Commands

| Command                 | Action                                      |
| ----------------------- | ------------------------------------------- |
| `/flutter-app`          | Start menu / resume session                 |
| `/phase1-cadrage`       | Scoping — questions + primary color         |
| `/phase2-analyse`       | Structured requirements sheet               |
| `/phase3-layout`        | Layout proposal + customization             |
| `/phase4-contrat`       | Locked architecture contract                |
| `/phase5-developpement` | Batch delivery — files written to disk      |
| `/charger-projet`       | Load an existing project from its README.md |
| `/generate-readme`      | Generate README.md for an existing project  |
| `/session`              | Save current session state                  |
| `/statut`               | Current project status                      |
| `/contrat`              | Display locked architecture contract        |
| `/memoriser`            | Memorize an error, decision, or preference  |

---

## Generated app structure

```
my_app/
├── pubspec.yaml
├── analysis_options.yaml
├── l10n.yaml                      # if i18n enabled
├── README.md
├── assets/icon/icon.png           # if icon provided
├── android/                       # minSdk 24 · release signing
└── lib/
    ├── main.dart                  # ProviderScope · MaterialApp · ToastOverlay
    ├── core/
    │   ├── config.dart            # App constants
    │   └── utils/helpers.dart     # Pure functions
    ├── data/
    │   ├── exceptions.dart        # Named business exceptions
    │   ├── database/              # SQLite schema · migrations
    │   ├── models/
    │   └── repositories/
    ├── application/
    │   ├── theme_controller.dart
    │   ├── toast_controller.dart
    │   └── [entity]_controller.dart   # @riverpod Notifiers
    └── presentation/
        ├── theme/
        │   ├── tokens.dart        # All design system tokens
        │   └── app_theme.dart     # Light/dark ThemeData + ThemeExtension
        ├── screens/               # app_shell · per-destination screens
        └── widgets/               # toast_overlay · app_dialog · app_button…
```

---

## Design system

All generated apps share the same visual system, defined in `.claude/design-system.md`:

- **Flat design** — `borderRadius: 0`, `elevation: 0`, no shadows, no gradients
- **Dart tokens** — all colors, sizes and durations declared in `tokens.dart`; full light/dark `ThemeData` built from them
- **Roboto** typography (Android system font)
- **Slate Blue** primary color by default — 4 token values to change the entire app color
- **Custom toast overlay** — no `SnackBar`, no `AlertDialog` for business errors; same anatomy as the other generators (4dp left border, semantic backgrounds, 4s/6s/persistent durations)
- **48dp minimum touch target** on all interactive elements

---

## Installing the generated app

No PC required after the build:

```bash
flutter build apk --release
# → build/app/outputs/flutter-apk/app-release.apk
```

Copy the APK to the phone (Drive, email, or USB once), open it, allow unknown sources, install. The app stays installed independently of the PC.

USB connection is only needed for development (`flutter run`, hot reload).

---

## Documentation

- [GUIDE.md](GUIDE.md) — full usage guide
- `.claude/design-system.md` — visual token reference (Dart)
- `.claude/layout.md` — layout reference (AppBar, NavigationBar, toasts, drawer, dialog, lists)
- `.claude/rules/` — domain rules (architecture, theme, errors, config)

---

## Generator family

| Generator                                                                         | Stack                           | Target          |
| --------------------------------------------------------------------------------- | ------------------------------- | --------------- |
| [claude-python-app-generator](https://github.com/TiercelinQ/python-app-generator) | Python · PyQt6 · QSS            | Windows desktop |
| [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator)    | Node.js · Electron · React · TS | Windows desktop |
| [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator)      | Flutter · Dart · Riverpod       | Android         |

---

## License

MIT
