---
name: flutter-p1-scoping
description: Phase 1 of the Flutter/Android app generation cycle — scoping in 8 grouped questions, full color palette choice, calibration announcement (number of batches), and writing of the scoping spec.
model: sonnet
---

# /flutter-p1-scoping — Scoping

## Role
Project scoper — turn a vague idea into a bounded, validated scope.

## Goal
Lock the project parameters (stack options, DB, i18n, calibration, palette) before any analysis.

## Deliverable
`docs/specs/01-scoping.md` (written in the user's language) + on-screen summary.

---

## 1. Questions

Start with the objective, then establish the project root (folder name → location → creation), then ask the closed parameters with the `AskUserQuestion` tool (clickable options, the recommended one first). Cap = **4 questions per call** → **two calls**. (Persistent preferences are always enabled via `shared_preferences` — no question.)

1. **Objective** — free-form text: "Application objective? (free description)".

### Project root (folder name → location → creation)

> Skip this block if a project root is already established for this flow.

- **Folder name** — propose 2-4 candidate names derived from the objective, **in kebab-case** (e.g. `expense-tracker`), the recommended one first, with `AskUserQuestion` (the **Other** option carries a custom name as free-form text). The user selects a candidate or types their own. This is the **project directory name**, distinct from the application name chosen in Phase 2.
- **Location** — free-form text: `Parent folder where to create the project? (path, e.g. C:\projects)`.
- **Create the folder** — project root = `[parent]\[folder-name]`. Create it, then confirm: `Project root: [path]`. If it already exists and is not empty, warn and ask the user to confirm reuse or pick another name. Store this path as the project root — all generated files and specs (`docs/specs/`) are written there.

### Closed parameters

2. **`AskUserQuestion` — call 1** (4 questions, each with a recommended option):
   - **Database**: `SQLite` (recommended, sqflite) · `local JSON` · `none`.
   - **Rich text editing** (bold, lists, headings — flutter_quill): `No` (recommended, unless a real need) · `Yes`.
   - **FR/EN i18n** (FR by default): `No` (recommended, unless a real EN need) · `Yes`.
   - **Orientation**: `portrait only` (recommended) · `portrait + landscape`.
3. **`AskUserQuestion` — call 2** (3 questions):
   - **Application icon**: `No` (recommended — Flutter default, can be added later) · `Yes`. If `Yes`, ask the 1024×1024 PNG path as free-form text.
   - **Automated tests** (flutter_test + mocktail): `Yes` (recommended, pro use) · `No`.
   - **Install method** (how the app reaches the phone): `USB direct` (recommended — `flutter run` / `flutter install`, no signing, no "install unknown apps") · `Debug APK file` · `Signed release APK (sideload)` · `Play Store AAB`. The **Other** option covers a custom case. Drives the final build/install instructions and the keystore delivery (signing opt-in: keystore delivered only for `Signed release APK` / `Play Store AAB`). All four methods are documented in the README regardless; the chosen one is highlighted. Detail: `rules/config.md` (Installation methods).

## 2. Color palette

After the answers, propose the **palette** with `AskUserQuestion` (single question; clickable options from the catalog, recommended default first; the **Other** option covers a remaining named palette and the custom palette). A palette = 5 **light** roles (main background, secondary background, accent, text, details); the dark theme and all supporting tokens are derived (`design-system.md §2`).

- **Palette — `AskUserQuestion`**, options (≤ 4): `Steel` (default, recommended) · `Forest` · `Slate` · `Amber`. The **Other** option covers `Ruby` and a **custom palette**. If the user picks a custom palette, ask the 5 light hex values as free-form text (main background, secondary background, accent, text, details). Catalog + hex values: `design-system.md §2`.
- Steel is the recommended default; the named-palette values are canonical — do not improvise them. If no answer: default palette.
- From the 5 light roles, Claude **derives** and announces: supporting light tokens (`bgMuted`, `bgElevated`, `textSubtle`, `textMuted`, `borderSubtle`, `borderStrong`), the 5 accent stops (`primary50/400/700/800/900`), `onPrimary`, and the **whole dark theme** (`DarkColors`, lightness targets in `design-system.md §2`). Written to `tokens.dart` (`LightColors`/`DarkColors`). Semantic and icon tokens stay fixed.
- **Contrast check (WCAG AA, non-blocking)**: compute text/bg, textSubtle/bg, accent/bg, onPrimary/accent; if a ratio fails AA, report it (`color — ratio — target`) and ask the user to confirm or adjust before continuing.
- The global `design-system.md` stays unchanged.

## 3. Provisional calibration — announced at the end of Phase 1

Apply the CALIBRATION table in `CLAUDE.md` (canonical source): Small (< 10 files and ≤ 5 features) → 3 batches; Medium/Large (≥ 10 or > 5) → 4 batches; divergent criteria → the highest wins. **+1 batch if tests are enabled (Q7)** — Small 4 / Medium-Large 5.

Announce it as **provisional**: the real feature count is not known yet (features are elicited in Phase 2). The calibration is **confirmed and locked at the end of Phase 2**, on the v1.0 feature count.

## 4. Libraries

Any library outside the stack (charts fl_chart, flutter_secure_storage, logging, flutter_native_splash…) is proposed and validated here — none can be added later without a declaration protocol.

## 5. Write the spec

Write `docs/specs/01-scoping.md` (in the user's language) capturing: objective, DB choice, rich editing, i18n, icon, orientation, tests (Q7), **install method** (Q8), the **palette** (name or custom; the 5 light roles + the derived dark theme + accent stops + onPrimary; semantic kept fixed) and the contrast-check result, validated libraries, and the provisional calibration (size + number of batches — confirmed in Phase 2). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/flutter-p2-featuring` after validation.
