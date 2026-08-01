# Changelog

All notable changes to this generator are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.
(This is the changelog of the **generator** itself, distinct from the `docs/release/CHANGELOG.md` of each generated app.)

## [1.5.0] - 2026-08-01
### Added
- Phase 5 offers `/flutter-save-session` between batches when the session is running long or the context is heavily loaded (safety net before saturation; automatic chaining stays the default).
- Phase 2 Step 1 constrains the application name: space-free candidates, a free-typed name is normalized into the technical identifier (`appName`); the display name (launcher label, README) may keep spaces and both are recorded when they differ.
- `/flutter-release` now updates the README title line (`# [APP_NAME] — v[NEW]`, `x.y.z` form) as a targeted edit of that single line; the version-bump trigger is documented in `rules/readme.md`.
- The app-template `.claude/settings.json` deny anchoring is documented as deliberate in Phase 5 ("Deny anchoring" note — no deny may match `docs/release/CHANGELOG.md`).

### Changed
- The seed script `tool/seed.dart` ships inside the last code batch — no dedicated seed batch; the announced batch total now always matches the frozen calibration.
- The business exception example is renamed `AppDatabaseException` (avoids the analyzer-ambiguous import with sqflite's own `DatabaseException`).
- Downstream Phase 1 question numbers removed: conditions now read "in Phase 1"; the numbers stay in `p1-scoping` only.
- The CALIBRATION closing paragraph is harmonized across the 5 generators (rejoined into one paragraph; "rich text editing and i18n push the size up").

### Fixed
- The Phase 5 batch-split line says "frozen in Phase 2" (was "Phase 1"), matching the canonical calibration freeze.

## [1.4.0] - 2026-07-26
### Added
- Phase 5 now writes the delivery baseline session file `docs/sessions/SESSION_<App>_S0.md` automatically at the end of the last batch (`/flutter-save-session` template, `N = 0`, overwritten if Phase 5 is replayed). Manual `/flutter-save-session` saves keep numbering from `S1`. The delivery summary links it.

## [1.3.0] - 2026-07-25
### Added
- Generated apps now ship a `.gitignore` **appended** to the one `flutter create` generates (never overwritten): the Android signing/data secrets it leaves out (`*.jks`, `key.properties`, `*.db`) plus the Claude Code repo-hygiene socle (`.claude/settings.local.json` + `.claude/agent-memory/`, `tasks/`, private `docs/specs/`), while keeping `docs/release/CHANGELOG.md`, `.claude/settings.json`, `CLAUDE.md`, `test/`, and `tool/` tracked (`rules/config.md §.gitignore`, batch tables, `rules/verification.md` §16).

### Changed
- The generated `README.md` is now always written in English (public-facing document), regardless of the user's interface language; specs under `docs/specs/` stay in the user's language (`rules/readme.md`, `flutter-generate-readme`, `rules/versioning.md`).

## [1.2.0] - 2026-07-18
### Added
- Data lists gain a sort control (sort field + ascending/descending toggle); `DataColumn.onSort` when a Material `DataTable` is used.
- Post-delivery reminder: the Phase 5 delivery summary and the generated app `CLAUDE.md` now list the maintenance commands and `/flutter-release`.

### Changed
- Navigation Drawer (M2) and NavigationRail (M4) destination labels word-wrap within the rail width instead of truncating.

## [1.1.0] - 2026-07-17
### Added
- App changelog + SemVer versioning system (`/flutter-release`, `rules/versioning.md`, `docs/release/CHANGELOG.md`). Generated apps keep a Keep a Changelog file; maintenance skills accumulate `[Unreleased]` entries; `/flutter-release` stamps a dated version block, bumps `pubspec.yaml` `version` and the Android `+N` build number, and syncs `lib/core/config.dart` `appVersion`.

## [1.0.0]
### Added
- Unified edition baseline.
