# Security rules — Flutter/Android

Applied to 100% of generated applications. Any deviation requires the contract declaration protocol (stop → declare → validate).

## 1. Input validation

- Every value entering a repository (from a screen, a file, an import) is validated before use: type, mandatory fields, bounds, format.
- Validation lives in `data/repositories/` (business rules) or `core/utils/helpers.dart` (pure format checks). Widgets may pre-validate for UX but the data layer is the authority.
- Raise a named business exception (`data/exceptions.dart`) on invalid data — never silently coerce.

## 2. SQL — always parameterized

- 100% parameterized queries (`?` placeholders + `whereArgs`). Zero string interpolation of values into SQL.
- All DB access through `data/database/app_database.dart` + repositories — no raw `sqflite` access from `application`/`presentation`.

## 3. Secrets

- No hardcoded secret (API key, token, password) in the code, `core/config.dart`, or `shared_preferences`.
- User secrets, when required: `flutter_secure_storage` (validate the dependency in Phase 1) — backed by Android Keystore. Never plain text in prefs or the DB.
- Never log a secret, token, or PII.

## 4. Android permissions & platform

- Declare only the strictly necessary permissions in `AndroidManifest.xml`. No broad permission "just in case".
- Request runtime permissions at point of use, with a rationale; handle denial gracefully.
- Network calls (if any feature needs them, validated in Phase 1) over HTTPS only; no cleartext traffic (`android:usesCleartextTraffic="false"`).

## 5. Data storage

- Database, preferences, and files live in the app's private sandbox (default paths) — never world-readable external storage without an explicit, validated feature + permission.
- No application data committed (`.gitignore`: `*.db`, secrets, keystore).
- Release signing keystore: local, gitignored (`android/key.properties`, `*.jks`).

## 6. WebView / external content (only if validated in Phase 1)

- If a WebView is used: `javascriptMode` enabled only when required, restrict navigation to allow-listed URLs, never load untrusted HTML with JS.
- External URLs opened via `url_launcher` are constants from `core/config.dart` — never a value coming from data/user input unvalidated.

## Anti-patterns — what NOT to do

- **Do not** interpolate a value into a SQL string — use `?` + `whereArgs`.
- **Do not** hardcode a secret or store it in `shared_preferences`/SQLite — use `flutter_secure_storage`.
- **Do not** declare unnecessary Android permissions or enable cleartext traffic.
- **Do not** write app data to shared external storage without a validated feature + permission.
- **Do not** open a user/data-supplied URL or load untrusted HTML in a WebView.
- **Do not** log secrets or PII.

## Integrity verification

Detailed in `@rules/verification.md`. Key points: no hardcoded secret in source/config/prefs; all SQL parameterized; secrets (if any) via `flutter_secure_storage`; Android permissions minimal; no cleartext traffic; app data in private sandbox.
