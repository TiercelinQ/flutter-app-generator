---
name: flutter-generate-readme
description: Analyze the specs and source of an existing Flutter project and generate its README.md (objective, stack, tree, providers, SQLite schema, conventions, build). Invoke from the target project root.
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

1. **Sources, in priority**: `docs/specs/*` (especially `04-architect.md`) for the intended structure, then the real code — `pubspec.yaml`, `lib/core/`, `lib/data/` (exceptions, database, models, repositories), `lib/application/`, `lib/presentation/`, `l10n.yaml`. When specs and code disagree, the code is what shipped — describe the code and note the divergence.
2. Generate `README.md` at the root:

```markdown
# [APP_NAME]

[Objective inferred from specs/code — 2 sentences max]

## Stack
[table: Flutter, Dart, Riverpod, sqflite, flutter_quill, i18n]

## Tree
[real tree with the role of each file]

## Providers
[table provider → repository → screens]

## SQLite schema
[tables, columns, version — or "none"]

## Conventions
[layers, tokens, toasts, parameterized SQL — pointer to the rules]

## Build & installation
[Common: flutter pub get · build_runner · custom_lint · flutter_launcher_icons (if icon)]
[Then the 4 install methods, USB direct first — see rules/config.md §Installation methods.
 Highlight the one chosen in Phase 1 (Q8). Signing/keystore steps only for Signed release APK / Play Store AAB.]

## Uninstall
[Clean removal (app + private data) — see rules/config.md §Installation methods → Uninstall.
 Both cases documented (dev/sideload A/B/C vs Play Store D); highlight the one matching the install method chosen in Phase 1 (Q8).]
```

3. Write the file to disk, confirm in one line (in the user's language).
4. If anything is undeterminable from specs + code: ask the closed questions with `AskUserQuestion` (clickable options) before writing.
