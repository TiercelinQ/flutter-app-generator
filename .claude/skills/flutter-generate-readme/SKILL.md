---
name: flutter-generate-readme
description: Analyze the specs and source of an existing Flutter project and generate its README.md (objective, features, stack, tree, providers, SQLite schema, conventions, installation). Invoke from the target project root.
model: sonnet
---

# /flutter-generate-readme — Generate the README.md

## Role
Technical writer — produce an accurate project README from specs + code.

## Goal
Write a README that reflects what was actually built.

## Deliverable
`README.md` at the project root.

---

Prerequisite: invoked from the target project root.

Use the native Claude Code tools (no shell — Windows-compatible):

1. **Sources, in priority**: `docs/specs/*` (especially `04-architect.md` — it records the design system mode) for the intended structure, then the real code:
   - List source files via `Glob` `lib/**/*.dart` (exclude `build/`, `.dart_tool/`, `*.g.dart`).
   - Read `pubspec.yaml`, `lib/core/` (config, strings, utils), `lib/data/` (exceptions, database, models, repositories), `lib/application/`, `lib/presentation/` (theme, screens, widgets), `l10n.yaml` (if present).
   - Detect `test/` via `Glob` `test/**/*_test.dart`.
   - When specs and code disagree, the code is what shipped — describe the code and note the divergence.
2. Generate `README.md` at the root via `Write`:

```markdown
# [APP_NAME] — v[VERSION]

## Objective
[Inferred from docs/specs, config.dart and the structure — 2 sentences max]

## Features
- [Inferred from the present screens/ and controllers/]

## Technical stack
- OS: Android (minSdk 24) · Flutter stable · Dart 3 · Riverpod 3 (codegen)
- Design system: [framework | native — inferred from 01-scoping.md / 04-architect.md, else tokens.dart]
- DB: [inferred from pubspec.yaml and data/]
- Rich editing: [Yes/No — inferred from flutter_quill in pubspec.yaml]
- i18n: [Yes/No — inferred from l10n.yaml / lib/l10n/]
- Tests: [Yes (flutter_test + mocktail) | No — inferred from the presence of test/]

## Architecture
[Actual file tree with the role of each file]

## Providers
[table provider → controller → repository → consuming screens]

## SQLite schema
[tables, columns, version — or "none"]

## Conventions
[layers, theming (tokens + custom toasts for framework; ColorScheme.fromSeed + native SnackBar/MaterialBanner/AlertDialog for native), parameterized SQL — pointer to the rules]

## Prerequisites
Flutter stable SDK · Dart 3 · an Android device or emulator (USB debugging enabled for the USB direct method).

## Installation
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # .g.dart
dart run custom_lint                                       # Riverpod lints
dart run flutter_launcher_icons                            # if an icon was provided
[Then the 4 install methods, USB direct first — see rules/config.md §Installation methods.
 Highlight the one chosen in Phase 1 (Q9). Signing/keystore steps only for Signed release APK / Play Store AAB.
 Uninstall: clean removal (app + private data) — both cases documented (dev/sideload A/B/C vs Play Store D); highlight the one matching Q9.]

## Tests
[Section included only if test/ detected]
flutter test

## Palette / Seed
[framework: name or custom; 5 roles (main background, secondary background, accent, text, details) inferred from tokens.dart — otherwise default "Steel Blue" palette.
 native: the single seedColor from tokens.dart (ColorScheme.fromSeed).]
```

3. Write the file via `Write` (never `cat`/heredoc — Windows-incompatible).
4. If anything is undeterminable from specs + code: ask the closed questions with `AskUserQuestion` (clickable options) before writing.

Confirm with: `README.md generated at the project root.`
