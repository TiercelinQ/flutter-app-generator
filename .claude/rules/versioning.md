# Versioning & changelog rules — Flutter app

> The generated app keeps a human-readable changelog and a SemVer version. This rule defines the changelog format, where the version lives, how each maintenance operation feeds the changelog, and how `/flutter-release` cuts a version. Referenced by `/flutter-p5-development`, `/flutter-add-feature`, `/flutter-fix-issue`, `/flutter-refactor-code`, `/flutter-migrate-design`, `/flutter-load-project`, and `/flutter-release`.

## Canonical file — `docs/release/CHANGELOG.md`

- The changelog lives at **`docs/release/CHANGELOG.md`** (create the `docs/release/` folder if absent). This is the single source of truth for the app's release history.
- **Written in English**, regardless of the user's language — it is a deploy artifact meant to be pasted into a GitHub / Play Store release. (Specs and README stay in the user's language; the changelog does not.)
- Format: **[Keep a Changelog](https://keepachangelog.com/en/1.1.0/)** + **[Semantic Versioning](https://semver.org/spec/v2.0.0.html)**.

Seed written at generation (Phase 5):

```markdown
# Changelog

All notable changes to this project are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]

## [1.0.0] - <YYYY-MM-DD>
### Added
- Initial release.
```

## Entry categories

Under `## [Unreleased]`, group entries in these sections (Keep a Changelog), in this order, omitting empty ones:

- `### Added` — a new feature/capability (backward compatible).
- `### Changed` — a change to existing behavior, an internal refactor, a UI migration.
- `### Fixed` — a bug fix.
- `### Removed` — a removed feature/capability.
- `### Security` — a security fix.

A **breaking change** (incompatible with the previous version) is marked with a leading `**BREAKING:**` in its entry (usually under `Changed` or `Removed`). This marker drives the MAJOR inference at release.

## Version source — single source + mirror + `+N` build number

- **Canonical**: `pubspec.yaml` `version: x.y.z+N`. The `x.y.z` part is the SemVer version (Android `versionName`); **`+N` is the Android build number** (`versionCode`), which Android requires to be a **monotonically increasing integer** — every install of a new build must have a higher `N` than the one it replaces.
- **Mirror**: `lib/core/config.dart` `appVersion` — must equal the `x.y.z` part of `pubspec.yaml` `version` at all times (the mirror carries **no `+N`** — it is the semantic version string only). `/flutter-release` writes both; verification asserts the equality (`@rules/verification.md`).
- The version at the **top released block** of `docs/release/CHANGELOG.md` uses the `x.y.z` form (**no `+N`** — the build number is a packaging detail, not release history) and must match the canonical `x.y.z`. Between releases, `[Unreleased]` sits above it and carries the pending entries.

## SemVer mapping (per maintenance operation)

Operations **accumulate** entries under `[Unreleased]` — they do **not** bump the version. The bump happens once, at `/flutter-release`. The mapping below is what each operation contributes, and what the release inference reads:

| Operation | Changelog section | Release effect |
| --------- | ----------------- | -------------- |
| `add-feature` | `Added` (+ `Changed` if it alters existing behavior) | MINOR |
| `fix-issue` | `Fixed` | PATCH |
| `refactor-code` | `Changed` (internal) | PATCH |
| `migrate-design` | `Changed` (UI migrated to design system v2.0) | MINOR |
| breaking change (any op) | `**BREAKING:**` marker (`Changed`/`Removed`) | MAJOR |

> `migrate-design` is **framework-mode only** (native-mode apps are not concerned — `@rules/native-design.md`). Versioning itself is **mode-agnostic**: both `framework` and `native` apps keep the same changelog and the same `pubspec.yaml` version source.

## Release inference (`/flutter-release`)

From the accumulated `[Unreleased]` entries, infer the increment:

1. Any `**BREAKING:**` marker or a `Removed` entry → **MAJOR**.
2. Else any `Added` entry → **MINOR**.
3. Else (only `Fixed` / internal `Changed`) → **PATCH**.

The inferred increment is **proposed** to the user (`AskUserQuestion`, inferred option preselected as recommended); the user can override — notably to force a MAJOR the inference cannot detect. MAJOR is never applied silently. Whatever the increment, `/flutter-release` also **increments `+N` by 1** (Android build number — see Version source).

### What counts as breaking (MAJOR) for a Flutter Android app

- A feature/screen removed that a user relied on.
- A `sqflite` DB schema migration that cannot read the previous data format (`onUpgrade` drops/rewrites data — `@rules/architecture.md`).
- A config/preferences format change that requires manual user action.
- Raising `minSdkVersion` (dropping support for older Android versions that could run the previous release).

## Anti-patterns — what NOT to do

- **Do not** put the changelog at the project root — it lives in `docs/release/CHANGELOG.md`.
- **Do not** write the changelog in the user's language — English only.
- **Do not** bump `pubspec.yaml` `version` / `config.dart appVersion` in a maintenance operation — only `/flutter-release` bumps.
- **Do not** let `config.dart appVersion` diverge from the `x.y.z` part of `pubspec.yaml` `version`.
- **Do not** write the `+N` build number into the changelog block or into `config.dart appVersion` — it belongs to `pubspec.yaml` only.
- **Do not** forget to increment `+N` at release — Android rejects an install whose build number is not higher than the installed one.
- **Do not** apply a MAJOR bump without explicit user confirmation.
- **Do not** leave stale entries under `[Unreleased]` after a release — they move into the cut version block, and `[Unreleased]` is reset empty.

## Integrity verification

Detailed in `@rules/verification.md`. Key points: `docs/release/CHANGELOG.md` present and Keep a Changelog-shaped; the top released version (`x.y.z`, no `+N`) matches the `x.y.z` part of `pubspec.yaml` `version` and `lib/core/config.dart` `appVersion` (all three equal); every maintenance change added an `[Unreleased]` entry in the right category (no silent change); after a release, `[Unreleased]` is reset empty, the cut block carries the correct version + date, and `pubspec.yaml` `+N` was incremented.
