# README synchronization rule

> The generated app's `README.md` is a **derived** document — its source of truth is the code plus `docs/specs/04-architect.md`. After any post-delivery change, the README must keep reflecting what shipped. This is the single, shared definition of when and how to refresh it. Referenced by `/flutter-add-feature`, `/flutter-fix-issue`, `/flutter-refactor-code`.

## What the README documents

objective · stack & dependencies · file tree · providers · SQLite schema · conventions · build & installation & uninstall. Exact sections: `/flutter-generate-readme`.

## When to refresh (trigger)

Regenerate the README **iff** the change touched a documented aspect above:
- a dependency added/removed, or a stack change,
- the file tree changed (a file/screen/module added, renamed, moved, or deleted),
- a provider or controller added or renamed,
- the DB schema changed (table, column, version/migration),
- build or install steps changed.

A purely internal change (a private method, the body of an existing controller/notifier, a token value, a bug fix with no structural impact) does **not** trigger a refresh.

## How to refresh

Regenerate the README via the logic of `/flutter-generate-readme` (reads specs + code), in the same delivery, without asking. Full regeneration — the README is derived, so hand edits are not preserved. No manual "offer" step.

## Read-only skills

Verification/analysis skills (`/flutter-run-tests`, `/flutter-trace-feature`) never rewrite the README. At most they flag it as stale; refreshing is done by the write skills above.
