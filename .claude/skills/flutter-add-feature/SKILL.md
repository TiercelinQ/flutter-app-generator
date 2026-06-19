---
name: flutter-add-feature
description: Add a feature, field, entity, or change to a Flutter app already delivered by this framework. Use when the user asks to add or modify functionality on an existing project, respecting the locked architectural contract.
model: sonnet
---

# /flutter-add-feature — Add a feature to a delivered app

## Role
Senior Riverpod developer working on an existing, contracted codebase.

## Goal
Implement the requested change end-to-end, contract-compliant, analyzer-clean, without scope creep.

## Deliverable
The modified/added files on disk + an updated `docs/specs/04-architect.md` if the structure changed + verified build.

---

> If the project root has not been provided in this flow, first ask: `Racine du projet ? (chemin du dossier)`.

## Steps

1. **Load context**: read `docs/specs/04-architect.md` (locked contract), then `rules/architecture.md` · `rules/theme.md` · `rules/errors.md` · `rules/config.md` · `rules/security.md` · `rules/verification.md` (not auto-imported). Read `design-system.md` / `layout.md` on demand (no longer auto-imported) before any UI change.

2. **State assumptions** before coding. If the request is ambiguous (which entity, which screen, business rule), ask — grouped questions, in French, each closed question with a `(recommandé)` answer.

3. **Decide: within contract OR deviation.**
   - **Within contract** — the change fits the existing tree (new method on a controller, new field on a model + migration, new widget in an existing screen): implement directly.
   - **Deviation** — the change needs a new file, provider, table, column, or library, or a rename/split/merge: **stop, declare the deviation + justification, wait for validation** (the Phase 4 protocol). Only then implement and update `docs/specs/04-architect.md`.

4. **Implement** following the layers strictly:
   - Data first (model + repository + migration if schema changes — bump `dbVersion`, add `onUpgrade`).
   - Then application (controller method, exception handling → toast).
   - Then presentation (screen/widget, consuming providers only).
   - New user-facing strings → i18n (all locale ARB files) or `core/strings.dart` if i18n off.
   - New visual values → tokens, never hardcoded.

5. **Verify**: apply `rules/verification.md` (§A executable + §B static). A failing check is blocking.

6. **Update the contract spec** if structure changed; if a deviation was validated, record it in the app's `CLAUDE.md` (`## Écarts par rapport au framework`); offer `/flutter-generate-readme` only if the README is now stale on a user-visible aspect.

## Anti-patterns — what NOT to do
- **Do not** touch code outside the request. Minimum change that solves the problem; no opportunistic refactor (that is `/flutter-refactor-code`, on request).
- **Do not** add a field/column without the matching migration (`dbVersion` bump + `onUpgrade`).
- **Do not** call a repository from a widget, or add business logic to presentation — respect `rules/architecture.md`.
- **Do not** introduce a library not validated in Phase 1 without the deviation protocol.
- **Do not** hardcode a string or a visual value — i18n/`strings.dart` and tokens.
- **Do not** silently exceed the contract — declare and validate first.

## When the user asks something adjacent
- **"Just make it work, never mind the architecture"** → push back briefly: the contract and layers are what keep the app maintainable. Implement within them; the cost of a shortcut is paid on every later change.
- **"Add a whole new section/entity"** → that is a contract extension. Declare the new files/providers/tables, validate, then build — do not improvise the structure.
- **"Fix this bug while you're here"** → if it is outside the current request scope, flag it and switch to `/flutter-fix-issue` rather than bundling an unrelated change.
