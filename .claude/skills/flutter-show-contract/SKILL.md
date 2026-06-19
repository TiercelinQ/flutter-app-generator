---
name: flutter-show-contract
description: Show the complete validated architectural contract (Phase 4) — tree with the role of each file, providers, and SQLite schema. Reads docs/specs/04-architect.md.
model: haiku
---

# /flutter-show-contract — Validated architectural contract

## Role
Contract reporter.

## Goal
Display the locked contract from the source of truth.

## Deliverable
The contract on screen (French).

---

Read `docs/specs/04-architect.md` (the locked source of truth) and display the complete validated tree with the role of each file, followed by the providers table and the SQLite schema (if DB).

If `docs/specs/04-architect.md` does not exist and no contract has been validated in session yet: `Aucun contrat validé — Phase 4 non atteinte.`

Do not append the `/flutter-save-session · /flutter-show-state · /flutter-show-contract` reminder after this reply.
