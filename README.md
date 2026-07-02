# Flutter App Generator - Unified

> Claude Code generator for **Android mobile apps** - Flutter · Dart · Riverpod.

Part of a family of Claude Code generators. See also [python-app-generator](https://github.com/TiercelinQ/python-app-generator), [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator), and [vscode-ext-generator](https://github.com/TiercelinQ/vscode-ext-generator).

Unified edition: the full generation pipeline **plus** post-delivery maintenance skills, an explicit role per skill, persisted specs, centralized executable verification, and native memory.

---

## What it does

A structured prompt system that generates complete, production-ready Flutter/Android applications through a 5-phase cycle, then maintains them:

1. **Scoping** - 9 questions (objective, **design system**, DB, rich text, i18n, icon, orientation, tests, installation method) + colors: framework mode → color palette (named or custom; 5 roles, dark + supporting tokens derived, WCAG AA check); native mode → a single seed color (`ColorScheme.fromSeed`)
2. **Featuring** - structured feature sheet, explicit out-of-scope, locked sizing
3. **Designing** - NavigationBar destinations, secondary panel, list actions, pull-to-refresh
4. **Architect** - full file tree, providers table, SQLite schema, tokens→theme table - locked before any code is written
5. **Development** - auto-chained batch delivery, seed script if a DB is used

Each phase writes a spec in the user's language to `docs/specs/` (`01-scoping` … `04-architect`); the contract is the source of truth.

**Maintenance commands**: `/flutter-add-feature` (add a feature after a validated contract diff), `/flutter-trace-feature` (trace behavior), `/flutter-fix-issue` (root-cause debugging with a decision tree), `/flutter-refactor-code` (validated, behavior-preserving), `/flutter-run-tests` (executable verification). Plus `/flutter-load-project` and `/flutter-generate-readme` to load/document existing apps.

Every generated app enforces a strict layered architecture and one of two visual design systems chosen in Phase 1: the **framework** design system (default, opinionated flat) or **native Material 3** (`ColorScheme.fromSeed`, native components) — a Flutter-only option.

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
| Icons          | font_awesome_flutter (framework) · Material Icons (native)  |
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
| `/flutter-p3-designing`        | Designing - layout proposal + customization        |
| `/flutter-p4-architect`       | Architect - locked contract (providers, SQLite)    |
| `/flutter-p5-development` | Auto-chained batch delivery                        |
| `/flutter-add-feature`            | Add a feature to a shipped app                     |
| `/flutter-trace-feature`              | Trace a feature across the layers                  |
| `/flutter-fix-issue`                  | Fix a bug - decision tree, root cause              |
| `/flutter-refactor-code`             | Refactor under explicit validation only            |
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

---

## Design system

Chosen in Phase 1. Two modes; both keep the same structural layout (AppShell, AppBar, NavigationBar) and architecture — only the skin and feedback differ.

### Framework mode (default) — `.claude/design-system.md`

- **Flat design** - `borderRadius: 0`, `elevation: 0`, zero shadow, zero gradient
- **Token-driven theme** - every color, size, duration lives in `tokens.dart`; light/dark are two complete `ThemeData` built from tokens, toggled via `themeMode`
- **Roboto** typography (Android native)
- **Color palette** - 5 roles (main background, secondary background, accent, text, details) chosen for the light theme; dark theme and all supporting tokens derived. Default "Steel Blue" + Teal, Forest, Slate, Amber, Ruby named palettes + custom palette; semantic colors stay fixed
- **Custom overlay toasts only** - no native `SnackBar`, no raw `AlertDialog`, no inline banner

### Native mode (Flutter only) — `.claude/rules/native-design.md`

- **Standard Material 3** - `ThemeData(useMaterial3: true)`, default Material shapes/elevation/ripples
- **`ColorScheme.fromSeed`** - a single seed color drives the full light + dark schemes; colors read from `Theme.of(context).colorScheme`. `AppTokens` (spacing/sizes/durations) kept; no color token classes
- **Material Icons** instead of font_awesome_flutter
- **Native feedback** - `SnackBar` (transient) + `MaterialBanner` (persistent danger) + `AlertDialog` (confirmations), via a global `ScaffoldMessengerKey`

---

## Architecture

`.claude/rules/architecture.md` enforces strict unidirectional imports: `presentation` (`ref.watch`/`ref.read`) → `application` (Riverpod notifiers) → `data` (repositories → SQLite). `data` never imports Flutter UI or Riverpod; `presentation` never touches repositories directly. Riverpod 3 with code generation (`@riverpod` + build_runner; `.g.dart` files are user-generated, never delivered).

---

## Documentation

- [GUIDE.md](GUIDE.md) - full usage guide (FR)
- `.claude/design-system.md` - visual token reference (framework mode)
- `.claude/layout.md` - layout reference (AppShell, AppBar, NavigationBar, toasts) - structural parts apply in both modes
- `.claude/rules/` - domain rules:
  - `architecture.md` · `theme.md` · `errors.md` · `config.md` · `security.md` · `tests.md`
  - `native-design.md` - native Material 3 profile (when native mode is chosen)
  - `verification.md` - single source of truth for executable + static checks

---

## Generator family

| Generator | Stack | Target |
| --------- | ----- | ------ |
| [claude-python-app-generator](https://github.com/TiercelinQ/claude-python-app-generator) | Python · PyQt6 · QSS | Windows desktop |
| [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator) | Node.js · Electron · React · TS | Windows desktop |
| [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator) | Flutter · Dart · Riverpod | Android |
| [vscode-ext-generator](https://github.com/TiercelinQ/vscode-ext-generator) | TypeScript · esbuild · native theming | VS Code extension |

---

## License

MIT
