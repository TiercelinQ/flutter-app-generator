# Design System — v1.3 (Flutter / Android)

> Binding reference for all Flutter/Dart Android applications.
> Inseparable from `layout.md`.
> All tokens are Dart constants declared in `lib/presentation/theme/tokens.dart`, consumed exclusively by `app_theme.dart` and by widgets through the theme.
> Units: dimensions in **dp** (Flutter logical value), fonts in **sp** (follow the system setting).

## Changelog

| Version | Date       | Main change                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------- |
| v1.3    | 2026-06-19 | full **palette** model (5 roles/theme: fond principal, fond secondaire, accent, texte, détails) replaces the primary-only choice · light theme chosen, dark + supporting tokens derived · named palette catalog + custom palette · semantic/icons/charts kept fixed · WCAG AA check (warn) |
| v1.2    | 2026-06-14 | dark theme re-skin (theme-dark.md palette): 4-step dark surface ramp · dark neutrals/borders/semantic/icons/selection · Steel Blue primary (both modes) |
| v1.1    | 2026-06-14 | line-height · dark semantic backgrounds · primary/danger pressed stops · WCAG AA target · overlay layering · dark surface ramp fix · icon warning/info · selection/opacity/border-width/onPrimary tokens |
| v1.0    | initial    | Dart-token port: typography, colors, spacing, components, states (touchTarget, sp units)            |

> Aligns with the Python generator `design-system.md v1.4` and Electron `v1.3` (shared palette model). Per-file versions: theme rules in `rules/theme.md`, layout in `layout.md`.

Every generated application references the active version in its `README.md`.

---

## 1. TYPOGRAPHY

| Token            | Value | Usage                          |
| ---------------- | ----- | ------------------------------ |
| `fontFamily`     | Roboto (Android system font — Flutter default) | All applications |
| `fontXs`         | 12    | Secondary labels, captions     |
| `fontSm`         | 14    | Labels, subtitles, body        |
| `fontBase`       | 16    | Primary text, navigation       |
| `fontLg`         | 18    | Secondary section titles       |
| `font2xl`        | 24    | Primary section titles         |
| `weightNormal`   | `FontWeight.w400` | Body, descriptions |
| `weightMedium`   | `FontWeight.w500` | Labels, navigation items |
| `weightSemibold` | `FontWeight.w600` | Titles, headers    |
| `weightBold`     | `FontWeight.w700` | Primary titles     |

### Line-height

Applied via the `height` property of `TextStyle` (multiplier of font size).

| Token           | Value | Usage                          |
| --------------- | ----- | ------------------------------ |
| `leadingTight`  | 1.25  | Titles (`fontLg`, `font2xl`)   |
| `leadingNormal` | 1.5   | Body, labels                   |

> Scale note: the step from `fontLg` (18) to `font2xl` (24) is wider than the lower steps. No `fontXl` (20) token is defined (no current usage); do not add one speculatively.

---

## 2. COLORS

Declaration: two token classes — `LightColors` and `DarkColors` — implementing a single `AppColors` interface, injected into `ThemeData` via a `ThemeExtension`.

A project's colors come from a **palette**: 5 roles chosen per project, **light theme only** — the dark theme (`DarkColors`) and every supporting token are **derived**. The default palette is the set of values in the tables below (neutrals + Steel Blue), so a project that keeps the default renders exactly as before.

### Palette roles → tokens

| Role (palette)   | Drives        | Also derives                                                                       |
| ---------------- | ------------- | ---------------------------------------------------------------------------------- |
| Fond principal   | `bg`          | `bgElevated` (= `bg` in light)                                                      |
| Fond secondaire  | `bgSubtle`    | `bgMuted` (`bgSubtle` darkened ~3 % L)                                              |
| Accent           | `primary600`  | `primary50/400/700/800/900`, `primary`, `primaryBg`, `selectionBg`, `cursorColor`, `onPrimary` |
| Texte            | `text`        | `textSubtle` (mix text→bg ~45 %), `textMuted` (mix text→bg ~62 %)                   |
| Détails          | `border`      | `borderSubtle` (mix border→bg ~50 %), `borderStrong` (mix border→text ~12 %)       |

The **semantic colors** (success/warning/danger/info), the **icon tokens**, and the **chart palette** are **fixed** — independent of the palette, they carry meaning (see below).

### Derivation rules (computed by Claude in Phase 1, written as literal `Color(0xFF…)` in `tokens.dart`)

- **Supporting light tokens**: the sRGB mixes in the role table above.
- **Accent stops** (HSL rule from the accent, same H/S, lightness varies): `primary50` L≈95 %, `primary400` L≈70 %, `primary700` L≈50 %, `primary800` L≈42 %, `primary900` L≈25 %. Usage tokens: `primary` = `primary600` (light) / `primary400` (dark); `primaryBg` = `primary50` (light) / `primary900` (dark). Same `colorsys` method as the Python generator. `onPrimary` = `#FFFFFF` or near-black, whichever wins contrast on the accent.
- **Dark theme** (`DarkColors`, from the light palette, keeping each role's hue/saturation, re-targeting lightness):

| Token        | Dark L | Token            | Dark L          |
| ------------ | ------ | ---------------- | --------------- |
| `bg`         | ≈10 %  | `text`           | ≈83 %           |
| `bgSubtle`   | ≈14 %  | `textSubtle`     | ≈66 %           |
| `bgElevated` | ≈18 %  | `textMuted`      | ≈40 %           |
| `bgMuted`    | ≈22 % (lightest) | `border` / `borderSubtle` / `borderStrong` | ≈26 % / ≈20 % / ≈33 % |
| accent       | `primary400` (L≈60-70 %) | semantic / icons / charts | fixed |

> Harmony: dark surfaces carry a low saturation (≈8-12 %) of the accent hue for depth, not a flat grey. The dark surface ramp stays ascending. The **default palette** ships explicit values for both classes (the tables below); like Steel Blue today, its explicit values win over the rule and guarantee the current rendering. Named presets and custom palettes derive `DarkColors` by the rule.

### Named palettes (Phase 1 catalog)

`/flutter-p1-scoping` presents these; each lists its 5 **light** roles (dark derived). The user can also enter a **custom palette** (5 light hex). Phase 1 then checks WCAG AA (text/bg, textSubtle/bg, accent/bg, onPrimary/accent) and reports failures without blocking (`§12`).

| Name             | Fond principal | Fond secondaire | Accent  | Texte   | Détails |
| ---------------- | -------------- | --------------- | ------- | ------- | ------- |
| Acier (default)  | #FFFFFF        | #F9FAFB         | #4682B4 | #111827 | #E5E7EB |
| Forêt            | #FFFFFF        | #F6F8F6         | #059669 | #14201A | #DCE5DF |
| Ardoise          | #FFFFFF        | #F8FAFC         | #4F46E5 | #1E293B | #E2E8F0 |
| Ambre            | #FFFDFB        | #FBF6EF         | #B45309 | #1C1917 | #ECE3D8 |
| Rubis            | #FFFFFF        | #FAF7F7         | #BE123C | #1A1212 | #EAE0E1 |

### Light mode — default palette (`LightColors`)

| Token          | Value   | Usage                          |
| -------------- | ------- | ------------------------------ |
| `bg`           | #FFFFFF | Main background, AppBar        |
| `bgSubtle`     | #F9FAFB | Secondary areas                |
| `bgMuted`      | #F3F4F6 | Hover/pressed, alternation     |
| `bgElevated`   | #FFFFFF | Drawer, bottom sheet, dialogs  |
| `text`         | #111827 | Primary text                   |
| `textSubtle`   | #6B7280 | Secondary text, subtitles      |
| `textMuted`    | #9CA3AF | Disabled text                  |
| `border`       | #E5E7EB | Standard borders               |
| `borderSubtle` | #F3F4F6 | Discreet separators            |
| `borderStrong` | #D1D5DB | List/table headers             |

### Dark mode — default palette (`DarkColors`, derived)

| Token          | Value   | Usage                          |
| -------------- | ------- | ------------------------------ |
| `bg`           | #1A1A1F | Main background, AppBar        |
| `bgSubtle`     | #22222A | Secondary areas                |
| `bgElevated`   | #2A2A35 | Drawer, bottom sheet           |
| `bgMuted`      | #313140 | Hover/pressed                  |
| `text`         | #D4D4D4 | Primary text                   |
| `textSubtle`   | #9A9AB0 | Secondary text                 |
| `textMuted`    | #5A5A72 | Disabled text                  |
| `border`       | #3A3A4A | Standard borders               |
| `borderSubtle` | #2E2E3A | Discreet separators            |
| `borderStrong` | #4A4A5E | List/table headers             |

> Dark surface ramp: `bg` #1A1A1F < `bgSubtle` #22222A < `bgElevated` #2A2A35 < `bgMuted` #313140. `bgMuted` is the lightest so that the pressed highlight stays visible on every surface, including inside drawers and sheets.

### Accent — Steel Blue (default palette)

| Token        | Light   | Dark    | Usage                            |
| ------------ | ------- | ------- | -------------------------------- |
| `primary50`  | #EDF3F8 | —       | Selection / active bg (light)    |
| `primary400` | —       | #5A9FD4 | Active content (dark)            |
| `primary600` | #4682B4 | #4682B4 | Primary button fill (both modes); active content (light) |
| `primary700` | #396A93 | #396A93 | Primary button pressed (both modes) |
| `primary800` | #2F5879 | #2F5879 | Primary button deep pressed (both modes) |
| `primary900` | —       | #2A4F72 | Selection / active bg (dark)     |

Derived usage tokens, defined per theme — these are the ones components consume:

| Token       | Light        | Dark         |
| ----------- | ------------ | ------------ |
| `primary`   | `primary600` | `primary400` |
| `primaryBg` | `primary50`  | `primary900` |

> Modification: replacing the 6 `primary*` values in `tokens.dart` is enough to change the **accent** across the whole application. `primary700`/`primary800` are mode-agnostic (one value each). For a custom color they derive from `primary600` by the same HSL rule used by the Python generator (same H/S, lightness 50%/42%); Steel Blue is a preset whose explicit values win over that rule (its `primary600` already sits near L 49%, so `primary700/800` are darkened past the generic stops to keep the pressed darken visible).

### Semantic colors (fixed — outside the palette)

| Token        | Light   | Dark    | Usage                  |
| ------------ | ------- | ------- | ---------------------- |
| `success50`  | #F0FDF4 | #1D3F2A | Success toast bg       |
| `success600` | #16A34A | #4A9E6A | Success border, icon   |
| `warning50`  | #FFFBEB | #483B13 | Warning toast bg       |
| `warning600` | #D97706 | #CCA840 | Warning border, icon   |
| `danger50`   | #FFF1F2 | #441818 | Danger toast bg        |
| `danger600`  | #DC2626 | #C04A4A | Danger border, icon    |
| `danger700`  | #B91C1C | #B91C1C | Danger button pressed  |
| `danger800`  | #991B1B | #991B1B | Danger button deep pressed |
| `info50`     | #EFF6FF | #1A3042 | Info toast bg          |
| `info600`    | #2563EB | #4682B4 | Info border, icon      |

> Naming note: `*50` is a **role** ("semantic surface / toast background"), not a fixed luminance level. Light = pale tint, Dark = deep tint of the same hue, declared in `DarkColors`. A toast then keeps one coherent palette per theme: bg `*50`, text `text`, border/icon `*600` — all resolved from the same `*Colors` class. On the dark `*50` background, `text` (#D4D4D4) and the `*600` dark accent both keep WCAG AA contrast.

### Charts / visualization palette

| Token          | Value        |
| -------------- | ------------ |
| `chartPrimary` | `primary`    |
| `chartSuccess` | `success600` |
| `chartWarning` | `warning600` |
| `chartDanger`  | `danger600`  |
| `chartInfo`    | `info600`    |

> Charts reference the themed tokens (`primary`, `*600`), so they follow light/dark with no redefinition; the dark `*600` accents keep legible series on a dark background.

### Text selection & on-primary

| Token           | Light        | Dark         | Usage                            |
| --------------- | ------------ | ------------ | -------------------------------- |
| `selectionBg`   | `primaryBg`  | `primaryBg`  | Text field selection background  |
| `cursorColor`   | `primary`    | `primary`    | Text field cursor                |
| `onPrimary`     | #FFFFFF      | #FFFFFF      | Text/icon on Primary / Danger buttons |

> `onPrimary` replaces the literal `#FFFFFF` in button styles (§9). `selectionBg`/`cursorColor` go into `textSelectionTheme` in `app_theme.dart`.

---

## 3. SPACING

| Token      | Value | Usage                     |
| ---------- | ----- | ------------------------- |
| `spacing1` | 4     | Micro-spacing             |
| `spacing2` | 8     | Compact inner padding     |
| `spacing3` | 12    | Standard padding          |
| `spacing4` | 16    | Inter-element spacing, screen padding |
| `spacing6` | 24    | Section separation        |
| `spacing8` | 32    | Major separation          |

---

## 4. COMPONENT SIZES

### Fixed sizes (global visual anchors)

| Token           | Value | Usage                                  |
| --------------- | ----- | -------------------------------------- |
| `appbarHeight`  | 56    | AppBar height                          |
| `navbarHeight`  | 80    | NavigationBar height (Material 3)      |
| `iconSm`        | 16    | Small icon                             |
| `iconMd`        | 20    | Standard icon                          |
| `iconLg`        | 24    | Navigation / AppBar icon               |
| `touchTarget`   | 48    | Minimum touch surface (Android a11y)   |

### Dynamic sizes — general principle

**Rule**: no component has a fixed height or width except the documented exceptions above. Dimensions result from content + padding. Every touch zone respects `touchTarget` ≥ 48dp.

| Component             | Width                                | Height                     | Exception                                     |
| --------------------- | ------------------------------------ | -------------------------- | --------------------------------------------- |
| Button                | content + horizontal padding         | content + vertical padding | aligned group: unified on the widest          |
| Input field          | stretches in its container (full width) | content + vertical padding | —                                         |
| List item            | full width                           | content + vertical padding (min `touchTarget`) | —             |
| Navbar destination   | evenly distributed                   | `navbarHeight`             | —                                             |
| Label                | content, wrap if constrained         | content                    | —                                             |
| Dropdown menu        | longest item                         | content                    | —                                             |
| Dialog               | screen width − 2×`spacing6`          | content                    | —                                             |
| Toast                | screen width − 2×`spacing4`          | multi-line content         | —                                             |
| Bottom sheet         | full width                           | content, max 90% screen    | —                                             |

---

## 5. SHAPE, SHADOWS, BORDERS, OPACITY

| Token       | Value                   |
| ----------- | ----------------------- |
| `radius`    | 0, strict flat design   |
| `elevation` | 0, strict flat design   |

`BoxShadow` forbidden. `elevation: 0` on AppBar, NavigationBar, Card, Dialog, BottomSheet (overrides in `app_theme.dart`).

### Border widths

| Token                 | Value | Usage                                          |
| --------------------- | ----- | ---------------------------------------------- |
| `borderWidth`         | 1     | Standard borders, separators                   |
| `borderWidthEmphasis` | 2     | Focused field, error field, active indicator   |
| `borderWidthAccent`   | 4     | Toast left accent                              |

### Opacity

| Token             | Value | Usage                                  |
| ----------------- | ----- | -------------------------------------- |
| `opacityDisabled` | 0.4   | Disabled interactive elements          |
| `opacityOverlay`  | 0.4   | Dialog / drawer / sheet scrim (`text`) |

---

## 6. TRANSITIONS

| Token               | Value                                         | Usage                          |
| ------------------- | --------------------------------------------- | ------------------------------ |
| `transitionDefault` | `Duration(milliseconds: 150)` + `Curves.ease` | Pressed, focus states          |
| `transitionSlow`    | `Duration(milliseconds: 250)` + `Curves.ease` | Panels, drawer, sheets, toasts |

---

## 7. FOCUS

| Token       | Value                                   |
| ----------- | ---------------------------------------- |
| `focusRing` | 2 `primary` border, offset 2 (keyboard/TV navigation — secondary on touch mobile) |

On mobile, the primary feedback is the pressed state (`bgMuted`) — the focus ring applies to input fields (`focusedBorder`).

---

## 8. INTERACTIVE COMPONENT STATES

Applies to **transparent / neutral interactive elements**: navbar destinations, list/tree items, Secondary and Ghost buttons. Filled colored buttons (Primary, Danger) follow their own pressed rules in §9, because a `bgMuted` gray highlight on a colored fill drops the semantic color.

| State               | Rule                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `default`           | Base style defined by the component                                |
| `pressed`           | `bgMuted` highlight — splash disabled (`splashFactory: NoSplash`) |
| `active` / selected | `primaryBg` background, `primary` content                          |
| `disabled`          | `opacityDisabled` (0.4), non-interactive                           |
| focused field       | `borderWidthEmphasis` (2) `primary` border                        |

> `active`/selected (persistent chosen state: navbar destination, selected item) is distinct from `pressed` (transient touch-down). Do not conflate them.

---

## 9. BUTTONS

| Variant    | Base widget      | Background    | Text         | Border         |
| ---------- | ---------------- | ------------- | ------------ | -------------- |
| Primary    | `FilledButton`   | `primary600`  | `onPrimary`  | none           |
| Secondary  | `OutlinedButton` | transparent   | `text`       | 1 `border`     |
| Danger     | `FilledButton`   | `danger600`   | `onPrimary`  | none           |
| Ghost      | `TextButton`     | transparent   | `textSubtle` | none           |

**Pressed state per variant** (via `WidgetStateProperty` overlay/background in `app_theme.dart`):

| Variant   | pressed background       |
| --------- | ------------------------ |
| Primary   | `primary700`             |
| Danger    | `danger700`              |
| Secondary | `bgMuted` highlight      |
| Ghost     | `bgMuted` highlight      |

> Colored buttons (Primary, Danger) darken on press via their own `700` stops, never the neutral `bgMuted` rule of §8. Disabled: `opacityDisabled`.

> Primary button fill uses `primary600` (#4682B4 in both modes), **not** the `primary` usage token — so the button stays mid-steel in dark mode and white `onPrimary` reaches 4.11:1 (AA for UI / large text). The brighter `primary` (`primary400` #5A9FD4 in dark) is reserved for foreground accents (active content, icons, focus) that must read on dark surfaces; using it as a button fill would drop white text to 2.86:1.

Styles centralized in `app_theme.dart` (`filledButtonTheme`, `outlinedButtonTheme`, `textButtonTheme`) — danger/ghost variants via named constructors of an `AppButton` widget consuming the tokens. Zero local `ButtonStyle` in screens.

**Dynamic sizing** — the size results from content + padding (min touch height `touchTarget`):

| Size          | Vertical padding | Horizontal padding | Font                       |
| ------------- | ---------------- | ------------------ | -------------------------- |
| `sm`          | `spacing1` (4)   | `spacing3` (12)    | `weightMedium` `fontXs`    |
| `md` (default)| `spacing2` (8)   | `spacing4` (16)    | `weightMedium` `fontSm`    |
| `lg`          | `spacing3` (12)  | `spacing6` (24)    | `weightMedium` `fontBase`  |

**Aligned button group**: width unified on the widest button (`IntrinsicWidth` + `CrossAxisAlignment.stretch`).

---

## 10. ICONS — font_awesome_flutter

Library: `font_awesome_flutter` (Font Awesome Free, embedded locally).

**Rule**: icon colors and sizes go through tokens — never `Color(0xFF…)` or a literal size in widgets.

| Token         | Light                    | Dark     |
| ------------- | ------------------------ | -------- |
| `iconDefault` | #6B7280 (`textSubtle`)   | #9A9AB0  |
| `iconActive`  | #4682B4 (`primary`)      | #5A9FD4  |
| `iconSuccess` | #16A34A (`success600`)   | #4A9E6A  |
| `iconWarning` | #D97706 (`warning600`)   | #CCA840  |
| `iconDanger`  | #DC2626 (`danger600`)    | #C04A4A  |
| `iconInfo`    | #2563EB (`info600`)      | #4682B4  |
| `iconMuted`   | #9CA3AF (`textMuted`)    | #5A5A72  |

```dart
// Usage in a widget
FaIcon(
  FontAwesomeIcons.house,
  size: AppTokens.iconMd,
  color: context.colors.iconDefault, // extension on BuildContext → ThemeExtension
)
```

**Theme change**: colors come from the `ThemeExtension` — rebuilding `MaterialApp` on `themeMode` change updates everything automatically.

---

## 11. THEME APPLICATION RULES

1. **Zero hardcoded visual value in widgets.** Every color, size, duration, text style comes from `tokens.dart` (via `AppTokens` and the `AppColors` `ThemeExtension`).
2. **Every recurring style is centralized in `app_theme.dart`** (ThemeData: buttons, fields, AppBar, NavigationBar, Dialog…). Widgets only carry composition.
3. **Dark mode is a complete `ThemeData`** (`AppTheme.dark`) built from `DarkColors` — toggled by `themeMode` on `MaterialApp`. Never a theme condition inside screens.
4. **Every value in `app_theme.dart` is traced to a token** — comment indicating the source token.

```dart
// app_theme.dart — token: bg / text
scaffoldBackgroundColor: colors.bg,
```

---

## 12. ACCESSIBILITY

Target: **WCAG 2.1 level AA**, on top of the Android touch baseline.

| Criterion           | Rule                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Touch target        | ≥ 48dp (`touchTarget`) on every interactive element — already enforced (§4)                    |
| Text contrast       | ≥ 4.5:1 normal text, ≥ 3:1 large text (≥ 18sp bold or ≥ 24sp) and UI components                |
| `textMuted`         | Disabled / decorative only, exempt from AA. Interactive icons (e.g. tree chevron) use `textSubtle` |
| Dynamic type        | Fonts in **sp** follow the system text-size setting (§1). Avoid clamping `textScaler` to a fixed value |
| Reduced motion      | Honor `MediaQuery.disableAnimations` — skip/shorten `transition*` when it is true              |
| Focus / state       | Pressed feedback (`bgMuted`) is the primary touch affordance; the focus ring serves keyboard/TV |

> Contrast figures are computed estimates, not tool-measured. Re-check with a contrast checker before shipping a custom palette (Phase 1 runs the AA check).

---

## 13. LAYERING (overlay order)

Flutter has no `z-index`; order comes from `Overlay` entry order and the `Navigator` stack. The intent below must be enforced by inserting the `ToastOverlay` above the modal routes.

| Order | Element                              | Mechanism                                        |
| ----- | ----------------------------------- | ------------------------------------------------ |
| back  | Screen content (`IndexedStack`)     | Scaffold body                                    |
|       | Drawer / BottomSheet + scrim        | `Scaffold.endDrawer` / `showModalBottomSheet`    |
|       | Dialog + barrier                    | `showDialog` (root navigator)                    |
| front | Toasts (`ToastOverlay`)             | root `Overlay` entry above modal routes          |

> A persistent `danger` toast must stay visible above a dialog/sheet, so the `ToastOverlay` is mounted at the `MaterialApp` builder level (root overlay), not inside a screen.
