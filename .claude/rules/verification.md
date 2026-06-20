# Verification rules — single source of truth

> Centralized, reusable verification for the whole framework. Referenced by `/flutter-p5-development`, `/flutter-add-feature`, `/flutter-fix-issue`, and `/flutter-run-tests` — never duplicated in those skills.
> Two parts: **executable verification** (run real commands) and **static integrity** (read the code). Run silently; report only on a discrepancy.

---

## A. Executable verification (run the commands)

When the environment allows it (Flutter SDK available), these commands are **mandatory** and a failure is **blocking** — do not mark work as done while any of them fails. Run them in order:

```
flutter pub get                                       # dependencies resolve
dart run build_runner build --delete-conflicting-outputs   # .g.dart generated, no conflict
flutter analyze                                       # MUST report "No issues found"
dart run custom_lint                                  # Riverpod lints clean (not covered by flutter analyze)
flutter test                                          # ONLY if tests enabled (Phase 1 Q7) / test/ exists — otherwise skip
flutter build apk                                     # compile smoke (debug) — last batch; use --release / `appbundle` only if a Signed release APK / Play Store AAB was selected (Phase 1 Q8)
```

Rules:
- A non-zero exit or any reported issue is a failure → fix the root cause, do not silence the rule. Re-run until clean.
- **`flutter test`**: run only if tests were enabled in Phase 1 (Q7) / `test/` contains tests. **Do not create tests if the project has none** — only run what exists.
- If the Flutter SDK is **not** available in the environment, say so explicitly, fall back to the static checks below (read-through), and tell the user which commands they must run themselves before considering the work verified. Never claim a clean analyzer you could not run.
- Quote the relevant command output as proof when reporting completion.
- The generated app ships a `.claude/settings.json` (deny guards on secrets/artifacts + a `Stop` hook running `flutter analyze`). These enforce the rules automatically in later maintenance sessions but **do not replace** this checklist.

---

## B. Static integrity (read the code)

### Every batch / every change
1. Valid Dart, analyzer-clean (mentally, then confirmed by §A when the SDK is available).
2. Imports: all used, none missing, unidirectional direction respected (`presentation → application → data`; `core` importable by all).
3. Layer responsibilities respected (zero UI in data/application, zero data access in presentation). See `rules/architecture.md` anti-patterns.
4. Zero `// TODO`, zero unjustified empty implementation, zero unjustified `dynamic`.
5. Dart 3 · stable Flutter API · zero deprecated API.
6. `design-system.md` and `layout.md` compliance — zero hardcoded visual value in widgets. See `rules/theme.md` anti-patterns.
7. SQL: 100% parameterized (`?` + `whereArgs`).
8. Errors: business exceptions caught in `application`, surfaced as toasts; no `SnackBar`/raw `AlertDialog`. See `rules/errors.md`.
9. Security: no hardcoded secret; SQL parameterized; secrets via `flutter_secure_storage`; minimal Android permissions; no cleartext traffic. See `rules/security.md`.

### Last batch only — cross-file
10. Every referenced provider exists; `@riverpod` annotations consistent with usages (`.g.dart` to generate listed in instructions).
11. SQLite schema ↔ `fromMap`/`toMap` ↔ repositories aligned; schema version and migrations consistent.
12. Architectural contract (`docs/specs/04-architect.md`) respected — every file, provider, table, column matches the locked contract, or a declared+validated discrepancy exists.
13. i18n keys: all used, none missing (if enabled).
14. `docs/specs/` present and consistent with the delivered code (the contract describes what was built).

### Per-domain (conditional — see the matching rule for detail)
- **tests** (`rules/tests.md`): if enabled, each source module has a matching `_test.dart` (Phase 4 mapping); `flutter test` exit 0; `mocktail` in `dev_dependencies`.

---

## C. Reporting

- All clean → one short confirmation line in the user's language (no full recap of the checklist).
- Any discrepancy → name the file, the failing check (§A command output or §B item number), and the fix applied or proposed.
- Verification that could not be run (no SDK) → state it plainly and list the commands the user must run.
