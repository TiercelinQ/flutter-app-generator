---
name: flutter-load-project
description: Load an existing Flutter project (Phase 5 complete) from its specs and README — bring the generator rules to bear on already-delivered code. Invoke from the target project root.
model: sonnet
---

# /flutter-load-project — Load an existing project

## Role
Onboarding analyst — take charge of a delivered codebase under the generator rules.

## Goal
Understand the project's structure and confirm the rules apply to any later change.

## Deliverable
A one-block confirmation (in the user's language) of the loaded project.

---

Prerequisite: invoked from the target project root, `.claude/` present.

> If the project root has not been provided in this flow, first ask: `Project root to load? (folder path)`. Read everything below relative to that root.

1. **Read the source of truth in priority order:**
   - `docs/specs/04-architect.md` (locked contract — most reliable). If present, it is authoritative for the structure.
   - Other `docs/specs/*` for the scoping/analysis/layout decisions.
   - `README.md` at the root. If both specs and README are absent: offer `/flutter-generate-readme` and stop.
2. **Detect `test/`** via `Glob` with the pattern `test/**/*_test.dart` → count the files for the Tests line.
3. Read `pubspec.yaml` + walk `lib/` to confirm the structure (core / data / application / presentation).
4. Confirm take-over with this exact format (in the user's language):

Project loaded: [APP_NAME] v[VERSION]

Stack : Flutter [v] · Dart [v] · Riverpod
DB : [value]
Entities detected: [list]
Providers: [count]
Tests : [present ([N] files) | absent]
Design system: [framework v2.0 | framework v1.x (legacy) | native]
Changelog: [present (top vX.Y.Z, [N] unreleased entries) | absent (init offered)]
Specs: [docs/specs present: yes/no]

Generator rules applied. Ready for: development · fixes · improvements · adjustments.

5. **Design system version check (framework mode only — native apps are not concerned).** Read the design-system version the app's `README.md` references (every generated app records it); confirm with legacy markers if needed (`font_awesome_flutter` in `pubspec.yaml`, `radius = 0` in `tokens.dart`). If the app is on **v1.x** and its README carries no "v2.0 conversion declined" note, propose **once**, right after the confirmation block: convert to v2.0 with `/flutter-migrate-design` (recommended). If the user declines, append `(v2.0 conversion declined on [date])` to the README's design-system reference line and do not re-propose — only on explicit request. **A v1.x app is maintained in its own v1.x conventions** (its `tokens.dart`/`app_theme.dart` and existing widgets are the visual reference); never mix v2.0 visuals into it.
5b. **Changelog / versioning check (retroactive init).** Look for `docs/release/CHANGELOG.md`. If **present**, read the top released version and count the `## [Unreleased]` entries for the confirmation block. If **absent** (app predates the versioning system), propose **once**, right after the confirmation block: initialize it with `/flutter-release`'s format via a seed — read the current version from `pubspec.yaml` `version` (the `x.y.z` part, dropping the `+N` build number; fallback `lib/core/config.dart` `appVersion`), create `docs/release/CHANGELOG.md` (create `docs/release/`) with the Keep a Changelog preamble, an empty `## [Unreleased]`, and a `## [<current-version>] - <YYYY-MM-DD>` block noting the baseline (`### Added` / `- Baseline (changelog started).`). Proposed, not imposed; if the user declines, do not re-propose (only on explicit request). Follow `@rules/versioning.md` for the shape.
6. Read and apply all rules (`CLAUDE.md`, `@rules/architecture.md` · `@rules/errors.md` · `@rules/config.md` · `@rules/security.md` · `@rules/tests.md` (if tests present) · `@rules/versioning.md` · `@rules/verification.md`, `layout.md`) to any later change, plus the **design system mode** recorded in `docs/specs/04-architect.md`: `design-system.md` + `@rules/theme.md` if `framework`; `@rules/native-design.md` if `native`. The `rules/*` are not auto-imported: read them before any code change. Keep the loaded app in its existing mode; on a framework v1.x app (step 5), the app's own design system version wins over the framework's `design-system.md` for visual conventions.
7. Any structural deviation detected between the code and the rules (or vs `docs/specs/04-architect.md`): report it, do not fix without a request (hand off to `/flutter-fix-issue` or `/flutter-refactor-code`).
