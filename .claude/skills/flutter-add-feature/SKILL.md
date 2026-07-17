---
name: flutter-add-feature
description: Add a feature, field, entity, or change to a Flutter app already delivered by this framework. Use when the user asks to add or modify functionality on an existing project, respecting the locked architectural contract and the security rules.
model: sonnet
---

# /flutter-add-feature — Add a feature to a delivered app

## Role
Senior Riverpod developer working on an existing, contracted codebase.

## Goal
Add the requested feature end-to-end (data → application → presentation), contract-compliant, secure, after an explicit contract-diff validation, without scope creep.

## Deliverable
The created/modified files on disk (one batch) + an updated `docs/specs/04-architect.md` if the structure changed + verified build.

---

## Prerequisite

The project must be loaded (`/flutter-load-project` run at session start, OR `docs/specs/04-architect.md` / README.md present and read).

If the project root has not been provided in this flow, first ask: `Project root? (folder path)`.

If no contract is known: stop and ask for `/flutter-load-project`.

**Load context**: read `docs/specs/04-architect.md` (locked contract — it records the **design system mode**), then `@rules/architecture.md` · `@rules/errors.md` · `@rules/config.md` · `@rules/security.md` · `@rules/theme.md` (if `framework` mode) · `@rules/versioning.md` · `@rules/verification.md` (not auto-imported). For UI, read the mode's reference on demand (no longer auto-imported) before any UI change: `design-system.md` + `layout.md` if `framework`; `@rules/native-design.md` + `layout.md` if `native`. Match the existing app's mode — never mix the two.

## Step 1 — Light feature scoping

Ask the closed parameters with `AskUserQuestion` (clickable options, recommended first); the short description (Q1) stays free-form text:

New feature — a few questions:

1. Short description (1 sentence)
2. Business entity affected: [existing: list] | new (to name)
3. Type of change:
   A. New entity (model + repository + controller + screen)
   B. Extension of an existing entity
   C. New shared screen/widget (no new model)
   D. UI-only change (theme or layout)
4. Generate tests for this feature? Yes / No (recommended: aligned with the project stack)

Mark a `(recommended)` option for each closed question, inferred from the existing project. If the request stays ambiguous (business rule, edge case), state assumptions explicitly and ask before the diff.

## Step 2 — Architectural contract diff

Produce (in the user's language):

## Contract diff — addition: [feature name]

### Created files
[list]

### Modified files
[list with nature: added method, added model field, added widget…]

### Created/modified providers
[`@riverpod` list — controller notifier → repository → consuming screens]

### Schema changes (if DB)
[table/column — `dbVersion` bump + `onUpgrade` migration entry]

### Created test files (if Q4 = Yes)
[mirror list]

### Impact on design-system / layout
[none | new component to respect within existing tokens (`framework`) or `colorScheme`/`AppTokens` (`native`)]

→ Validation required before writing. Update `docs/specs/04-architect.md` once the diff is applied.

## Step 3 — Application — strict rules

- Read the mode's design reference (`design-system.md` + `layout.md`, or `@rules/native-design.md` + `layout.md`) before any UI change. **Legacy design system**: if the app is on framework v1.x (README reference — see `/flutter-load-project` step 5), new UI follows the app's own v1.x conventions (its `tokens.dart` and existing widgets), never the framework's v2.0 files; the upgrade path is `/flutter-migrate-design`, on request.
- Fully respect `@rules/architecture.md`, `@rules/theme.md` (if `framework` mode), `@rules/native-design.md` (if `native` mode), `@rules/errors.md`, `@rules/config.md`, `@rules/security.md`, `@rules/tests.md`, `@rules/verification.md`, `@rules/readme.md`.
- No modification not listed in the validated diff. No opportunistic improvement of adjacent code.
- Implementation across the layers (a new feature usually touches all three):
  - Data: immutable model (`fromMap`/`toMap`) + repository — sole data access point; raise named business exceptions (`data/exceptions.dart`); **every SQL query parameterized** (`?` + `whereArgs`, `@rules/security.md`).
  - Application: `@riverpod` controller (codegen, never a manual provider) — orchestrate, intercept business exceptions, trigger the mode's feedback (toast via `toastControllerProvider` in `framework` mode; `SnackBar`/`MaterialBanner` via `presentation/messenger.dart` in `native` mode).
  - Presentation: screen/widget consuming providers only (`ref.watch`/`ref.read`) — never a repository, no business logic.
- DB migration needed → bump `dbVersion` in `core/config.dart`, add the `onUpgrade` entry in `data/database/app_database.dart`.
- New user-facing strings → i18n (all locale ARB files) or `core/strings.dart` if i18n off.
- New visual values → `framework`: tokens in `tokens.dart`, never hardcoded; `native`: `Theme.of(context).colorScheme` for colors, `AppTokens` for spacing/sizes.
- If the validated diff introduces a deviation from the contract, record it in the app's `CLAUDE.md` (`## Deviations from the framework`).

## Step 4 — Delivery

Single batch for the feature:

Feature [name] — [N files]

Deliver each created/modified file as a complete block, written to disk (except `.g.dart` — generated by the user via `dart run build_runner build --delete-conflicting-outputs`; list the command). If tests requested: deliver in the same batch, at the end.

## Step 4b — Changelog entry

After the feature is delivered, append an entry under `## [Unreleased]` in `docs/release/CHANGELOG.md` (`@rules/versioning.md`) — **in English**, no version bump:
- `### Added` — the new capability, one concise line (add a `### Changed` line too if it alters existing behavior).
- If the change is backward-incompatible, mark it `**BREAKING:**` (drives a MAJOR at release).
- If `docs/release/CHANGELOG.md` is absent (app predates the system), skip silently and suggest `/flutter-load-project` to initialize it.

Do **not** bump the version — that happens at `/flutter-release`. Mention it once, at the end: the change is recorded under `[Unreleased]`; run `/flutter-release` when ready to cut a version.

## Step 5 — Anomaly

If the user reports an anomaly after delivery, apply the `@rules/architecture.md` cleanup protocol then offer `/flutter-save-memory`.

## Anti-patterns — what NOT to do
- **Do not** write anything not listed in the validated diff, or improve adjacent code (that is `/flutter-refactor-code`, on request).
- **Do not** add a field/column without the matching migration (`dbVersion` bump + `onUpgrade`).
- **Do not** call a repository from a widget, or put business logic in presentation — `@rules/architecture.md` is non-negotiable.
- **Do not** create a manual provider — always `@riverpod` codegen.
- **Do not** interpolate a value into SQL or hardcode a secret — `@rules/security.md` is non-negotiable.
- **Do not** introduce a library not validated in Phase 1 without the deviation protocol.
- **Do not** hardcode a string (i18n) or a visual value (tokens / `colorScheme`).
- **Do not** exceed the contract silently — the diff + validation IS the protocol.

## Verification

Apply `@rules/verification.md` (§A executable + §B static — a failing check is blocking; security checks are not optional). Key points: all created/modified files match the validated diff; providers consistent end-to-end (`@riverpod` controller ↔ generated provider ↔ consuming screens); SQLite schema ↔ `fromMap`/`toMap` ↔ repositories aligned; no import regression (existing files stay functional); if tests, `flutter test` exit 0 on the **whole** project. Then apply `@rules/readme.md` — regenerate the README if the change touched a README-documented aspect.

## When the user asks something adjacent
- **"Just make it work, never mind the architecture/security"** → push back: the layer split and the security rules are what keep a Flutter app safe and maintainable. Implement within them.
- **"Add a whole new screen/entity"** → that is a contract extension. Declare the new files/providers/tables in the diff, validate, then build.
- **"Fix this bug while you're here"** → if outside the current request scope, flag it and switch to `/flutter-fix-issue` rather than bundling an unrelated change.
