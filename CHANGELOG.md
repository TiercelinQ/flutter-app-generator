# Changelog

All notable changes to this generator are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.
(This is the changelog of the **generator** itself, distinct from the `docs/release/CHANGELOG.md` of each generated app.)

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
