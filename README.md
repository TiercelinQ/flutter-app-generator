# Flutter App Generator - Unified

> Claude Code generator for **Android mobile apps** - Flutter · Dart · Riverpod.

Part of a family of Claude Code generators. See also [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator), [python-app-generator](https://github.com/TiercelinQ/python-app-generator), [sf-node-generator](https://github.com/TiercelinQ/sf-node-generator), and [vscode-ext-generator](https://github.com/TiercelinQ/vscode-ext-generator).

Unified edition: the full generation pipeline **plus** post-delivery maintenance skills, an explicit role per skill, persisted specs, centralized executable verification, and native memory.

---

## What it does

A structured prompt system that generates complete, production-ready Flutter/Android applications through a 5-phase cycle, then maintains them:

1. **Scoping** - 9 questions (objective, DB, rich text, i18n, orientation, **design system**, icon, tests, installation method) + colors: framework mode → color palette (named or custom; accent + optional overrides, neutrals and semantics derived, WCAG AA check); native mode → a single seed color (`ColorScheme.fromSeed`)
2. **Featuring** - structured feature sheet, explicit out-of-scope, locked sizing
3. **Surfaces** - NavigationBar destinations, secondary panel, list actions, pull-to-refresh
4. **Architect** - full file tree, providers table, SQLite schema, tokens→theme table - locked before any code is written
5. **Development** - auto-chained batch delivery, seed script if a DB is used

Each phase writes a spec in the user's language to `docs/specs/` (`01-scoping` … `04-architect`); the contract is the source of truth.

**Maintenance commands**: `/flutter-add-feature` (add a feature, contract-compliant — explicit contract-diff validation before writing), `/flutter-trace-feature` (trace behavior), `/flutter-fix-issue` (root-cause debugging with a decision tree), `/flutter-refactor-code` (validated, behavior-preserving), `/flutter-migrate-design` (convert a v1.x framework-mode app to design system v2.0), `/flutter-release` (cut a SemVer release from the accumulated changelog), `/flutter-run-tests` (executable verification). Plus `/flutter-load-project` and `/flutter-generate-readme` to load/document existing apps.

Every generated app enforces a strict layered architecture, non-negotiable security rules, and one of two visual design systems chosen in Phase 1: the **framework** design system (default, opinionated stroke-based skin) or **native Material 3** (`ColorScheme.fromSeed`, native components) — a Flutter-only option.

---

## Generated app stack

| Element        | Value                                                       |
| -------------- | ----------------------------------------------------------- |
| Target OS      | Android - minSdk 24, latest stable targetSdk                |
| Framework      | Flutter stable · Dart 3                                      |
| State          | Riverpod 3 with code generation (@riverpod + build_runner)  |
| Architecture   | Strict layers - data · application · presentation           |
| Design system  | Phase 1 choice: framework (tokens + custom toasts) or native Material 3 (`ColorScheme.fromSeed`, native components) |
| Theme          | framework: centralized tokens `tokens.dart` + `app_theme.dart` (light/dark) · native: `ColorScheme.fromSeed` light/dark, `AppTokens` kept |
| DB             | sqflite - raw SQL always parameterized (opt-in)             |
| Rich editing   | flutter_quill (opt-in)                                      |
| Icons          | Lucide `lucide_icons_flutter` (framework) · Material Icons (native) |
| i18n           | flutter_localizations + gen-l10n FR/EN (opt-in)             |
| Preferences    | shared_preferences                                          |
| Tests          | flutter_test + mocktail (opt-in)                            |
| Security        | parameterized SQL · flutter_secure_storage (opt-in) · minimal permissions |
| Quality        | flutter_lints · clean analyzer · DartDoc                    |
| Deliverable    | On-device install, method chosen in Phase 1 (USB direct by default; Debug APK file; Signed release APK / Play Store AAB if selected) |

---

## Requirements

```bash
claude --version     # Claude Code CLI - installed and authenticated
flutter --version    # Flutter stable · Dart 3
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

| Command                 | Action                                             |
| ----------------------- | -------------------------------------------------- |
| `/flutter-app`          | Start menu (4 entry points incl. maintenance)      |
| `/flutter-p1-scoping`       | Scoping - 9 questions (incl. design system) + palette/seed |
| `/flutter-p2-featuring`       | Featuring - requirements sheet + locked sizing     |
| `/flutter-p3-surfaces`        | Surfaces - layout proposal + customization        |
| `/flutter-p4-architect`       | Architect - locked contract (providers, SQLite)    |
| `/flutter-p5-development` | Auto-chained batch delivery                        |
| `/flutter-add-feature`            | Add a feature to a shipped app (contract diff first) |
| `/flutter-trace-feature`              | Trace a feature across the layers                  |
| `/flutter-fix-issue`                  | Fix a bug - decision tree, root cause              |
| `/flutter-refactor-code`             | Refactor under explicit validation only            |
| `/flutter-migrate-design`            | Convert a v1.x app to design system v2.0           |
| `/flutter-release`                   | Cut a SemVer release from the accumulated changelog|
| `/flutter-run-tests`                 | Executable verification (analyze, lint, tests)     |
| `/flutter-load-project`       | Load an existing project from its specs/README     |
| `/flutter-generate-readme`      | Generate README.md for an existing project         |
| `/flutter-save-session`              | Save current session state                         |
| `/flutter-show-state`               | Current project status                             |
| `/flutter-show-contract`              | Display locked architecture contract               |
| `/flutter-save-memory`            | Persist a note in Claude Code native memory        |

---

## Generated app structure

```
my_app/
├── pubspec.yaml · analysis_options.yaml · l10n.yaml (if i18n)
├── README.md
├── CLAUDE.md                      # Project identity (origin, business context, deviations)
├── .claude/settings.json          # Guardrails + verification hook (self-enforced app)
├── docs/specs/                    # Generation specs (user's language): 01-scoping … 04-architect
├── docs/release/CHANGELOG.md      # SemVer changelog (Keep a Changelog, English)
├── android/                       # minSdk 24, release signing
└── lib/
    ├── main.dart                  # ProviderScope, MaterialApp, themeMode, root ToastOverlay
    ├── core/                      # config.dart · strings.dart (if i18n off) · utils/helpers.dart
    ├── data/                      # exceptions.dart · database/ · models/ · repositories/
    ├── application/               # theme_controller · toast_controller · [entity]_controller
    └── presentation/
        ├── theme/                 # tokens.dart · app_theme.dart (ThemeExtension AppColors)
        ├── screens/               # app_shell.dart · [entity]_screen.dart
        └── widgets/               # app_app_bar · toast_overlay · app_dialog · app_button…
```

> Tree shown for **framework** mode. In **native** mode `presentation/` drops `toast_overlay`/`app_dialog`/`app_button` and `application/` drops `toast_controller`; a `presentation/messenger.dart` (global `ScaffoldMessengerKey`) drives native `SnackBar`/`MaterialBanner`/`AlertDialog`, and `theme/` holds `AppTokens` + a single `seedColor`.

## Versioning & changelog

Every generated app carries a SemVer version and a changelog at `docs/release/CHANGELOG.md` (Keep a Changelog format, written in English). Maintenance skills (`add-feature`, `fix-issue`, `refactor-code`, `migrate-design`) accumulate entries under `## [Unreleased]`; `/flutter-release` freezes them into a dated version block and bumps the version source (`pubspec.yaml` `version: x.y.z+N`, where the Android build number `N` is incremented on each bump, mirrored in `lib/core/config.dart`). The version is never bumped silently. See `rules/versioning.md`.

---

## Design system

Chosen in Phase 1. Two modes; both keep the same structural layout (AppShell, AppBar, NavigationBar) and architecture — only the skin and feedback differ.

### Framework mode (default) — `.claude/design-system.md` (v2.0)

- **Depth by stroke** - borders express hierarchy and elevation, `elevation: 0`, zero shadow, zero gradient; soft radius 5
- **Token-driven theme** - every color, size, duration lives in `tokens.dart`; light/dark are two complete `ThemeData` built from tokens, toggled via `themeMode`
- **System font** typography (Android native face, no pinned family)
- **Color palette** - one mandatory accent (+ up to 4 optional role overrides); accent-tinted neutrals, accent stops, and per-project semantic colors all derived from it (info = accent). Default "Steel Blue" + Teal, Forest, Slate, Amber, Ruby named palettes + custom palette
- **Lucide icons** (`lucide_icons_flutter`) and one signature gesture: the sliding TabBar underline indicator
- **Custom overlay toasts only** - no native `SnackBar`, no raw `AlertDialog`, no inline banner

### Native mode (Flutter only) — `.claude/rules/native-design.md`

- **Standard Material 3** - `ThemeData(useMaterial3: true)`, default Material shapes/elevation/ripples
- **`ColorScheme.fromSeed`** - a single seed color drives the full light + dark schemes; colors read from `Theme.of(context).colorScheme`. `AppTokens` (spacing/sizes/durations) kept; no color token classes
- **Material Icons** instead of the framework's Lucide set
- **Native feedback** - `SnackBar` (transient) + `MaterialBanner` (persistent danger) + `AlertDialog` (confirmations), via a global `ScaffoldMessengerKey`

---

## Architecture

`.claude/rules/architecture.md` enforces strict unidirectional imports: `presentation` (`ref.watch`/`ref.read`) → `application` (Riverpod notifiers) → `data` (repositories → SQLite). `data` never imports Flutter UI or Riverpod; `presentation` never touches repositories directly. Riverpod 3 with code generation (`@riverpod` + build_runner; `.g.dart` files are user-generated, never delivered).

---

## Security

`.claude/rules/security.md` is non-negotiable, applied to 100% of generated apps: every input validated in the data layer, 100% parameterized SQL (`?` + `whereArgs`), secrets only in `flutter_secure_storage` (Android Keystore, never prefs/DB), minimal Android permissions, no cleartext traffic, app data in the private sandbox. `/flutter-fix-issue` and `/flutter-add-feature` always route through it.

---

## Documentation

- [GUIDE.md](GUIDE.md) - full usage guide (FR)
- `.claude/design-system.md` - visual token reference (framework mode)
- `.claude/layout.md` - layout companion (pattern catalog + proposed default composition — structural defaults shared by both modes)
- `.claude/rules/` - domain rules:
  - `architecture.md` · `theme.md` · `errors.md` · `config.md` · `security.md` · `tests.md` · `readme.md` · `versioning.md`
  - `native-design.md` - native Material 3 profile (when native mode is chosen)
  - `verification.md` - single source of truth for executable + static checks

---

## Generator family

| Generator | Stack | Target |
| --------- | ----- | ------ |
| [python-app-generator](https://github.com/TiercelinQ/python-app-generator) | Python · PySide6 · QSS | Windows desktop |
| [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator) | Node.js · Electron · React · TS | Windows desktop |
| [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator) | Flutter · Dart · Riverpod | Android |
| [sf-node-generator](https://github.com/TiercelinQ/sf-node-generator) | Node.js · TypeScript · Salesforce CLI | Headless CLI |
| [vscode-ext-generator](https://github.com/TiercelinQ/vscode-ext-generator) | TypeScript · esbuild · native theming | VS Code extension |

---

## License

MIT
