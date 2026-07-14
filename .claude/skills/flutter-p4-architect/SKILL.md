---
name: flutter-p4-architect
description: Phase 4 of the Flutter/Android app generation cycle — complete architectural contract (tree, role of each file, providers, SQLite schema, tokens → theme table), written to the contract spec and locked after validation.
model: sonnet
---

# /flutter-p4-architect — Architectural contract

## Role
Software architect — design the locked structure the whole build will follow.

## Goal
Produce a complete, unambiguous architectural contract that freezes the file tree, providers, schema, and theme mapping.

## Deliverable
`docs/specs/04-architect.md` (written in the user's language) — the locked source of truth + on-screen contract.

---

**Phase banner (show first)** — before anything else, output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 4/5 — Architecture; (2) progress line: Scoping ✓ · Features ✓ · Surfaces ✓ · ▶ Architecture · Development; (3) intent in italics: Lock the file/structure contract. See `## PIPELINE` in `CLAUDE.md`.

At start: read `layout.md` (no longer auto-imported), `@rules/architecture.md` (tree, batches, Riverpod conventions), and the theming reference for the chosen mode (`docs/specs/01-scoping.md`): `design-system.md` + `@rules/theme.md` if `designSystem: framework`; `@rules/native-design.md` if `native` (apply its §7 tree deltas — no `toast_controller`/`toast_overlay`/`app_dialog`/`app_button`, add `presentation/messenger.dart`, `tokens.dart` = `AppTokens` + `seedColor`). Read `docs/specs/01-scoping.md` through `03-surfaces.md` for the validated decisions.

Present (in the user's language, as plain Markdown — never inside a code block):

1. **Complete project tree** (model: `@rules/architecture.md`) with the role of each file.
2. **Providers table**: provider → controller → repository → consuming screens.
3. **SQLite schema** (if DB): tables, columns, types, version, planned migrations.
4. **Theme mapping** — `framework` mode: tokens → theme table (`app_theme.dart` elements and the tokens they consume):

| design-system.md token | Light value | Dark value | Target theme element |
| ---------------------- | ----------- | ---------- | -------------------- |
| `bg`                   | #FFFFFF     | #1C1C1C    | scaffoldBackgroundColor, appBarTheme |
| `primary600`           | #4682B4     | #4682B4    | filledButtonTheme, navigationBarTheme (selected) |
| …                      | …           | …          | …                    |

   `native` mode: short `ColorScheme.fromSeed(seedColor)` mapping (seed → light/dark `ColorScheme`, `useMaterial3: true`) + the `AppTokens` retained for spacing/sizes/durations.
5. **Source → test mapping** (only if tests enabled in Phase 1 Q8): each source module → its `_test.dart` file. See `@rules/tests.md`.

**→ Validation required. This contract is locked.**

Any deviation (merge, split, rename, addition, removal of a file, provider, table, column, or library) requires:

1. Stop.
2. Declare the deviation + justification.
3. Validation before resuming.

**Blocking rule**: do not deliver Batch 1 until validation is explicit.

## Write the spec

Once validated, write the full contract to `docs/specs/04-architect.md` (in the user's language). This file is the **locked source of truth** re-read by `/flutter-p5-development`, `/flutter-load-project`, `/flutter-show-contract`, `/flutter-add-feature`, and `/flutter-refactor-code`.

→ Chain to `/flutter-p5-development` after validation.
