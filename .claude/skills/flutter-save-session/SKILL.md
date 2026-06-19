---
name: flutter-save-session
description: Save the full state of the generation session into docs/sessions/SESSION_AppName_SN.md — phase, batches, locked decisions, open points, referencing the specs. Invoke at the end of a session.
model: haiku
---

# /flutter-save-session — Session save

## Role
Session archivist.

## Goal
Persist enough state to resume the project exactly where it stopped.

## Deliverable
`docs/sessions/SESSION_[app_name]_S[N].md` (in the user's language).

---

1. Create the `docs/sessions/` folder at the project root if it does not exist.
2. Determine N = next session number (existing files + 1).
3. Write `docs/sessions/SESSION_[app_name]_S[N].md` (in the user's language):

# SESSION_S[N] — [APP_NAME] · [completed phase]

## Status

Completed phase: [N — name]
Next phase: [N+1 — name]
Next batch: [X+1/total] (if Phase 5)

## Locked decisions

- OS: Android (minSdk 24) · Stack: Flutter + Dart 3 + Riverpod codegen
- DB: [SQLite/JSON/none] · Rich editing: [Yes/No] · i18n: [Yes/No] · Icon: [provided/default]
- Palette: [name or custom; 5 light roles + derived]
- Calibration: [Small 3 batches / Medium-Large 4 batches]
- Selected features: [list]
- Out of scope: [list]
- Chosen layout: [destinations, panel, forms, gestures]
- Validated libraries: [list]

## Specs

Reference: docs/specs/01-scoping.md · 02-featuring.md · 03-designing.md · 04-architect.md
(the locked contract in 04-architect.md is authoritative — do not duplicate it here)

## Delivered batches

- [x] Batch 1 — [content]
- [ ] Batch 2 — [content]

## Open points

[list or "none"]

> If `docs/specs/04-architect.md` exists, reference it instead of duplicating the full tree. Only summarize the locked decisions here.

4. Confirm: `Session saved: docs/sessions/SESSION_[app_name]_S[N].md`
5. Do not append the `/flutter-save-session · /flutter-show-state · /flutter-show-contract` reminder after this reply.
