---
name: flutter-migrate-design
description: Convert a Flutter app generated with the framework design system v1.x to v2.0 — tokens (accent-tinted neutrals, derived semantics), icons (font_awesome_flutter → lucide_icons_flutter), radius, TabBar underline indicator — without changing any behavior. Framework mode only (native-mode apps are not concerned). Proposed by /flutter-load-project when a legacy app is detected; runs only on explicit validation.
model: sonnet
---

# /flutter-migrate-design — Convert a v1.x app to design system v2.0

## Role
Migration engineer — re-skin a delivered app to the v2.0 design system with zero behavior change.

## Goal
The app renders under the full v2.0 visual language (tokens, icons, states, motion) while every feature, provider, and business rule behaves exactly as before.

## Deliverable
The converted files on disk (`tokens.dart`, `app_theme.dart`, icon usages, dependency swap) + refreshed app `README.md` / `CLAUDE.md` / `docs/specs/04-architect.md` theme table + passing verification + a conversion summary.

---

## Prerequisite

The project is loaded (`/flutter-load-project`), in **framework mode**, and detected on design system **v1.x** (README reference; markers: `font_awesome_flutter` in `pubspec.yaml`, `radius = 0` in `tokens.dart`). Native-mode apps are out of scope — say so and stop. If the app is already on v2.0, say so and stop.

**Load context**: `design-system.md` (v2.0) + `layout.md` (v3.1) + `@rules/theme.md` + `@rules/config.md` + `@rules/verification.md`, and the app's `docs/specs/01-scoping.md` (original palette choice) + `docs/specs/04-architect.md` (locked contract).

## Step 1 — Inventory (read-only)

- `tokens.dart`: current `LightColors`/`DarkColors` values, identify the accent (`primary600`).
- `docs/specs/01-scoping.md`: was the palette a **named preset** (Steel Blue, Teal…) or **custom** (5 explicit roles)?
- `app_theme.dart`: radius/elevation overrides, button themes, tab styling.
- Widgets (`Grep` for `FaIcon`, `FontAwesomeIcons`): every icon usage, per file.
- `pubspec.yaml`: `font_awesome_flutter` presence.

## Step 2 — Palette conversion decision

- **Preset palette** → re-derive **everything** from the accent per `design-system.md §2`: accent stops, accent-tinted neutrals (both `*Colors` classes), per-project semantic colors (info = accent). Full v2.0 atmosphere.
- **Custom palette** → the roles the user explicitly chose in Phase 1 (recorded in `01-scoping.md`) become **v2.0 overrides** (they win over the tinted targets); everything else derives from the accent.
- Announce the derived token set and run the **AA contrast check** (same pairs as `/flutter-p1-scoping` §2), reporting failures without blocking.

## Step 3 — Conversion plan (validation gate)

Present the plan (in the user's language): files touched, the icon mapping table (below) instantiated with the icons actually found, the palette decision, and the note that **no behavior changes** (no repository, provider, or i18n edit). **→ Validation required before writing.**

## Step 4 — Conversion (single batch, complete files)

1. **`tokens.dart`** — full v2.0 token set as literal `Color(0xFF…)`: tinted neutrals in both `*Colors` classes, derived semantics (+ danger700/800), `radius = 5`, `easeOut` + retimed `transitionDefault` (160ms) / `transitionSlow` (240ms), `icon*` tokens turned into aliases of the derived tokens (hex table removed), unchanged structural tokens carried over, section order per `@rules/theme.md` rule 6.
2. **`app_theme.dart`** — v2.0 state model: radius via `BorderRadius.circular(AppTokens.radius)` (nested 3) on buttons/fields/dialogs/sheets; `elevation: 0` kept; floating layers gain a `borderStrong` side (dialog, sheet, drawer); pointer hover = border strengthening via `WidgetStateProperty` on Secondary/Ghost (`design-system.md §9`); `tabBarTheme` gains the signature `UnderlineTabIndicator` (2, `primary`) if the composition has a top TabBar; toast entry/exit animations removed from `toast_overlay.dart` (motion policy); token comments updated.
3. **Icons** — `pubspec.yaml`: remove `font_awesome_flutter`, add `lucide_icons_flutter` (pin per `@rules/config.md`); replace every `FaIcon(FontAwesomeIcons.x, …)` with `Icon(LucideIcons.y, …)` using the mapping below (size/color props kept on tokens).
4. **Docs** — app `README.md`: design system reference → `v2.0` (+ layout `v3.1`), stack line Icons → Lucide; app `CLAUDE.md`: dated migration note under `## Deviations from the framework` (or a `## Design system migration` block); `docs/specs/04-architect.md`: refresh the tokens → theme table values, append a dated migration note (this validated run is the contract amendment).

### Icon mapping — `FontAwesomeIcons.*` → `LucideIcons.*`

| FontAwesome | Lucide | FontAwesome | Lucide |
| ----------- | ------ | ----------- | ------ |
| `house` | `house` | `magnifyingGlass` | `search` |
| `gear` | `settings` | `plus` | `plus` |
| `circleCheck` | `circleCheck` | `trash` / `trashCan` | `trash2` |
| `triangleExclamation` | `triangleAlert` | `pen` / `pencil` | `pencil` |
| `circleExclamation` | `circleAlert` (toasts: `circleX`, `layout.md §6`) | `floppyDisk` | `save` |
| `circleXmark` | `circleX` | `xmark` | `x` |
| `circleInfo` | `info` | `bars` | `menu` |
| `sun` / `moon` | `sun` / `moon` | `user` | `user` |
| `chevronRight` / `chevronDown` | `chevronRight` / `chevronDown` | `download` / `upload` | `download` / `upload` |
| `arrowsRotate` / `rotate` | `refreshCw` | `spinner` | `loaderCircle` |
| `check` | `check` | `arrowRightFromBracket` | `logOut` |

Any icon not in this table: pick the closest Lucide equivalent, verify the identifier exists in the pinned `lucide_icons_flutter` (the analyzer is the guard), and list the chosen mapping in the conversion summary. Never invent an identifier.

## Step 5 — Verification and summary

- Run `@rules/verification.md §A` in full (`flutter pub get` → `build_runner` → `flutter analyze` → `dart run custom_lint` → `flutter test` if tests exist → `flutter build apk`) — a failure is blocking.
- Residual grep: `font_awesome`, `FaIcon`, `FontAwesomeIcons` must return nothing in `lib/` and `pubspec.yaml`; the old v1.x hex must be gone from `tokens.dart` (neutrals `0xFF1C1C1C`, `0xFFF9FAFB`, `0xFFF3F4F6`, `0xFF9CA3AF`, `0xFFE5E7EB`, `0xFFD1D5DB`, `0xFF6B7280` and semantics `0xFF16A34A`, `0xFFD97706`, `0xFFDC2626`, `0xFF2563EB` — `0xFFFFFFFF` legitimately survives as `onPrimary`/`onDanger`).
- Manual visual pass by the user: state that colors, radius, and the tab indicator are the only intended visible changes — every feature must behave identically. Report the conversion summary (files, icon mappings, AA results).
- After an anomaly: cleanup protocol (`@rules/architecture.md`), then offer `/flutter-save-memory`.

## Anti-patterns — what NOT to do

- **Do not** run without the Step 3 validation, and do not convert partially — the app is either fully v1.x or fully v2.0 (never a mix).
- **Do not** touch repositories, providers' business logic, ARB keys, or SQL — this is a re-skin.
- **Do not** redesign the layout/composition — the retained Phase 3 composition stays; only its skin changes.
- **Do not** touch a native-mode app — `/flutter-migrate-design` is framework-mode only.
- **Do not** improvise a Lucide identifier — map it, verify it compiles, report it.
- **Do not** leave Font Awesome residue (dependency, imports, `FaIcon` usages, old `icon*` hex).
- **Do not** convert the palette of a custom-palette app without preserving its explicitly chosen roles as overrides (Step 2).

## Integrity verification

Detailed in `@rules/verification.md`. Key points: §A executable suite green after conversion; zero `font_awesome`/`FaIcon` residue in `lib/` and `pubspec.yaml`; `tokens.dart`/`app_theme.dart` fully v2.0 (tinted neutrals, derived semantics, radius token, `borderStrong` floating layers, TabBar underline indicator where tabs exist); app README/CLAUDE.md/04-architect.md updated with the v2.0 reference and the dated migration note.
