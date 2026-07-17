# Changelog

All notable changes to the Flutter app generator are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]

## [1.1.0] - 2026-07-17
### Added
- App changelog + SemVer versioning system (`/flutter-release`, `rules/versioning.md`, `docs/release/CHANGELOG.md`). Generated apps keep a Keep a Changelog file; maintenance skills accumulate `[Unreleased]` entries; `/flutter-release` stamps a dated version block, bumps `pubspec.yaml` `version` and the Android `+N` build number, and syncs `lib/core/config.dart` `appVersion`.

## [1.0.0]
### Added
- Unified edition baseline.
