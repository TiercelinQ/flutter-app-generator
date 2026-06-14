---
name: phase4-contrat
description: Phase 4 of the Flutter/Android app generation cycle — complete architectural contract (tree, role of each file, providers, SQLite schema, tokens → theme table), written to the contract spec and locked after validation.
model: sonnet
---

# /phase4-contrat — Architectural contract

## Role
Software architect — design the locked structure the whole build will follow.

## Goal
Produce a complete, unambiguous architectural contract that freezes the file tree, providers, schema, and theme mapping.

## Deliverable
`docs/specs/04-contrat.md` (written in French) — the locked source of truth + on-screen contract.

---

At start: read `design-system.md`, `layout.md` (no longer auto-imported), `rules/architecture.md` (tree, batches, Riverpod conventions) and `rules/theme.md` (tokens → theme). Read `docs/specs/01-cadrage.md` through `03-layout.md` for the validated decisions.

Present (in French):

1. **Complete project tree** (model: `rules/architecture.md`) with the role of each file.
2. **Providers table**: provider → controller → repository → consuming screens.
3. **SQLite schema** (if DB): tables, columns, types, version, planned migrations.
4. **Tokens → theme table**: `app_theme.dart` elements and the tokens they consume.
5. **Source → test mapping** (only if tests enabled in Phase 1 Q7): each source module → its `_test.dart` file. See `rules/tests.md`.

**→ Validation required. This contract is locked.**

Any deviation (merge, split, rename, addition, removal of a file, provider, table, column, or library) requires:

1. Stop.
2. Declare the deviation + justification.
3. Validation before resuming.

## Write the spec

Once validated, write the full contract to `docs/specs/04-contrat.md` (in French). This file is the **locked source of truth** re-read by `/phase5-developpement`, `/charger-projet`, `/contrat`, `/implement`, and `/refactor`.

→ Chain to `/phase5-developpement` after validation.
