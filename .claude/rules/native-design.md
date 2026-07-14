# Native design system — Material 3 (Flutter only)

> Binding reference **only when `designSystem: native` was chosen in Phase 1** (recorded in `docs/specs/01-scoping.md` and `docs/specs/04-architect.md`).
> Counterpart to `design-system.md` (framework mode). When `designSystem: framework`, ignore this file and follow `design-system.md` + `@rules/theme.md` as before.
> The **structural defaults and the retained composition pattern** (`layout.md`, default `AppShell`: AppBar + NavigationBar + IndexedStack; alternatives in §12) are shared by both modes. This file overrides only the **skin** (colors, shapes, components, feedback).

## 1. Principle

Native mode drops the framework's opinionated flat skin, token color classes, and custom toasts/dialogs. It uses **standard Material 3**: `ColorScheme.fromSeed`, default Material shapes/elevation, and native components. The architecture (layers, Riverpod, SQLite, security, i18n, error escalation) is **unchanged** — only the visual/UI-feedback layer differs.

This mode is **Flutter only**. The other generators (electron, python) keep their single framework design system.

## 2. Theme

- `ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: <seed>, brightness: …))` — one `ColorScheme` per brightness (light + dark), both derived from the **single seed** chosen in Phase 1.
- `AppTheme.light` / `AppTheme.dark` in `app_theme.dart`, toggled by `themeMode` on `MaterialApp` (`themeControllerProvider`, persisted) — same mechanism as framework mode.
- **No `AppColors` `ThemeExtension`, no `LightColors`/`DarkColors`.** Colors are read from `Theme.of(context).colorScheme` (`primary`, `surface`, `error`, `onSurface`, `outline`…).
- No flat override: Material default shapes, elevation, ripples, and `TextTheme` apply. Do **not** force `elevation: 0` / `borderRadius: 0`.

## 3. Seed color

- A **single seed** color chosen in Phase 1 (presets + custom hex), default **Steel Blue `#4682B4`** (reused from the framework default accent).
- No dynamic color (Material You / wallpaper) — deterministic output. Could be added later as an opt-in; not in scope here.
- Written as a single `const Color seedColor = Color(0xFF…);` in `tokens.dart`, consumed by `app_theme.dart`. Changing it reskins the whole app via `fromSeed`.

## 4. Tokens kept / dropped

- **Kept** in `tokens.dart` (`AppTokens`): spacing scale, fixed sizes (`touchTarget`, icon sizes), durations. These are layout rhythm, not skin — keep them to avoid magic numbers (`AppTokens.spacing4`, never a literal `16`).
- **Dropped**: all color token classes, the `AppColors` `ThemeExtension`, the flat-design tokens (`radius`/`elevation` = 0), and the framework typography token scale (use the Material `TextTheme` via `Theme.of(context).textTheme`).
- `seedColor` is the only color constant in `tokens.dart`.

## 5. Components — native mapping

| Need              | Native widget                                                                 |
| ----------------- | ----------------------------------------------------------------------------- |
| Primary button    | `FilledButton`                                                                 |
| Secondary button  | `OutlinedButton`                                                               |
| Ghost button      | `TextButton`                                                                   |
| Danger button     | `FilledButton.styleFrom(backgroundColor: colorScheme.error, foregroundColor: colorScheme.onError)` |
| Icons             | Material `Icons.*` (`font_awesome_flutter` removed from `pubspec.yaml`)        |
| Transient message | `SnackBar` (via `ScaffoldMessenger`)                                           |
| Persistent danger | `MaterialBanner` (via `ScaffoldMessenger`)                                     |
| Confirmation / modal | `AlertDialog` via `showDialog` (triggered from `presentation`)              |
| Lists / forms     | `ListTile` / `TextFormField` with default Material decoration                  |

- Centralize recurring styling in `app_theme.dart` (`filledButtonTheme`, `inputDecorationTheme`, `snackBarTheme`…) where it reduces repetition, but native defaults are acceptable as-is.

## 6. Feedback contract (replaces the toast system)

Error escalation `data → application → presentation` is **unchanged** (`@rules/errors.md`): `data` raises named exceptions, `application` catches them. Only the UI sink changes.

- A `GlobalKey<ScaffoldMessengerState>` is set on `MaterialApp(scaffoldMessengerKey: …)` so `application` controllers can surface feedback **without a `BuildContext`**.
- Helper `lib/presentation/messenger.dart`: holds the key + `showAppSnackBar(...)` / `showAppBanner(...)`. Controllers call these (they import `presentation/messenger.dart` only for the messenger entry point — the key is UI infrastructure, not business logic).
- Mapping (replaces the toast types of `layout.md §6`):

| Type      | Native surface                          | Duration / dismiss          |
| --------- | --------------------------------------- | --------------------------- |
| `success` | `SnackBar`                              | 4s                          |
| `info`    | `SnackBar`                              | 4s                          |
| `warning` | `SnackBar`                              | 6s + close action           |
| `danger`  | `MaterialBanner`                        | persistent + dismiss action |

- `MaterialBanner` is the Material idiom for a persistent message; it stays below the AppBar until dismissed — the native equivalent of the persistent `danger` toast. No fake "long-duration SnackBar".
- Destructive confirmations: `AlertDialog` with the confirm button styled as danger (`colorScheme.error`).

## 7. Architecture deltas (vs `@rules/architecture.md`)

In native mode the generated tree changes only in `presentation/` + `application/`:

- **Removed**: `presentation/widgets/toast_overlay.dart`, `presentation/widgets/app_dialog.dart`, `presentation/widgets/app_button.dart`, `application/toast_controller.dart`.
- **Added**: `presentation/messenger.dart` (global `ScaffoldMessengerKey` + helpers).
- `presentation/theme/tokens.dart`: `AppTokens` + `seedColor` only. `app_theme.dart`: `fromSeed` light/dark, no `AppColors` extension.
- Everything else (`core/`, `data/`, other `application/` controllers, screens) is identical.

## 8. Verification deltas (vs `@rules/verification.md`)

- §B item 6 (design-system compliance): in native mode = colors come from `Theme.of(context).colorScheme` (no raw hex except `seedColor`); spacing/sizes from `AppTokens`; Material components used; **flat-design checks do not apply**.
- §B item 8 (errors): in native mode `SnackBar` / `MaterialBanner` / `AlertDialog` are the **expected** surfaces (not forbidden). The escalation rule still holds: business exceptions caught in `application`, surfaced via the messenger.

## 9. Unchanged across both modes

Layers (`data`/`application`/`presentation`), Riverpod codegen, SQLite + migrations, security (parameterized SQL, secrets, permissions), i18n, calibration, packaging/install methods, and the structural layout (retained composition).

## Integrity verification

Detailed in `@rules/verification.md`, with the native deltas of §8 above. Key points (native mode only): colors read from `Theme.of(context).colorScheme` — no raw hex outside the single `seedColor` in `tokens.dart`, no `AppColors` `ThemeExtension`; spacing/sizes from `AppTokens` (no magic number); Material components used, flat-design checks not applied; feedback through `presentation/messenger.dart` (`SnackBar` / `MaterialBanner` / `AlertDialog`), with the `data → application → presentation` escalation unchanged; the tree deltas of §7 applied (no `toast_overlay.dart` / `app_dialog.dart` / `app_button.dart` / `toast_controller.dart`, `font_awesome_flutter` dropped from `pubspec.yaml`).
