# Design System — v2.0 (Flutter / Android)

> **Applies when `designSystem: framework` (Phase 1 default).** If `designSystem: native` was chosen, ignore this file for colors/components and follow `rules/native-design.md` (Material 3); only the structural layout of `layout.md` stays shared.
> Binding reference for all Flutter/Dart Android applications.
> Inseparable from `layout.md`.
> All tokens are Dart constants declared in `lib/presentation/theme/tokens.dart`, consumed exclusively by `app_theme.dart` and by widgets through the theme.
> Units: dimensions in **dp** (Flutter logical value), fonts in **sp** (follow the system setting).

**Visual language (v2.0)**: depth is expressed by the **stroke** (borders), never by shadows or elevation. Corners are softly rounded (5). Neutrals carry a low tint of the project accent, so every generated application has its own atmosphere. Motion is discreet (asymmetric deceleration) with **one** signature gesture: the sliding underline of the top `TabBar` indicator (Material animates it natively).

## Changelog

| Version | Date       | Main change                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------- |
| v2.0    | 2026-07-16 | modernization: `radius` 0 → **5** · **accent-tinted neutrals** (all neutral roles derived from the accent hue; explicit palette roles still win) · **semantic colors derived per project** (fixed hue anchors, harmonized ±6° toward the accent; info = accent) · pointer hover = **border strengthening** (touch keeps the `bgMuted` pressed highlight) · easing `easeOut` (`Curves.easeOutCubic`) 160/240ms · **signature gesture**: sliding `TabBar` indicator underline · icons Font Awesome → **Lucide** (`lucide_icons_flutter`); `icon*` tokens alias the derived tokens · floating layers marked by `borderStrong` (shadows/elevation still forbidden) |
| v1.6    | 2026-06-27 | default accent → **Steel Blue** `#4682B4` (chromatic in both themes, derived like the named palettes) · dark **surfaces** stay neutral grey · `onPrimary` stays a single white value (white on `#4682B4` 4.1:1) · Teal kept as a named palette |
| v1.5    | 2026-06-20 | default accent → **Teal** `#0D9488` · dark surfaces stay neutral grey · grey-accent dark special-case removed |
| v1.4    | 2026-06-20 | decouple Danger button text from the accent: new fixed `onDanger` token |
| v1.3    | 2026-06-19 | full **palette** model (5 roles/theme) · named palette catalog + custom palette · WCAG AA check (warn) |
| v1.2    | 2026-06-14 | dark theme re-skin: 4-step dark surface ramp · Steel Blue primary (both modes) |
| v1.1    | 2026-06-14 | line-height · dark semantic backgrounds · WCAG AA target · overlay layering |
| v1.0    | initial    | Dart-token port: typography, colors, spacing, components, states (touchTarget, sp units) |

> Aligns with the Electron generator `design-system.md v2.0` and Python `v2.0` (shared palette + derivation model). Per-file versions: theme rules in `rules/theme.md`, layout in `layout.md`.

Every generated application references the active version in its `README.md`.

---

## 1. TYPOGRAPHY

| Token            | Value | Usage                          |
| ---------------- | ----- | ------------------------------ |
| `fontFamily`     | system font (Roboto on Android — Flutter default, no pinned family) | All applications |
| `fontXs`         | 12    | Secondary labels, captions     |
| `fontSm`         | 14    | Labels, subtitles, body        |
| `fontBase`       | 16    | Primary text, navigation       |
| `fontLg`         | 18    | Secondary section titles       |
| `font2xl`        | 24    | Primary section titles         |
| `weightNormal`   | `FontWeight.w400` | Body, descriptions |
| `weightMedium`   | `FontWeight.w500` | Labels, navigation items |
| `weightSemibold` | `FontWeight.w600` | Titles, headers    |
| `weightBold`     | `FontWeight.w700` | Primary titles     |

> Do not pin a font family: Flutter's default resolves to the Android system face. Zero embedded font, zero dependency; the application always looks native to its OS.

### Line-height

Applied via the `height` property of `TextStyle` (multiplier of font size).

| Token           | Value | Usage                          |
| --------------- | ----- | ------------------------------ |
| `leadingTight`  | 1.25  | Titles (`fontLg`, `font2xl`)   |
| `leadingNormal` | 1.5   | Body, labels                   |

> Scale note: the step from `fontLg` (18) to `font2xl` (24) is wider than the lower steps. No `fontXl` (20) token is defined (no current usage); do not add one speculatively.

### Numerals

Tables, counters, and any column of figures set `FontFeature.tabularFigures()` on their `TextStyle` so digits align vertically.

---

## 2. COLORS

Declaration: two token classes — `LightColors` and `DarkColors` — implementing a single `AppColors` interface, injected into `ThemeData` via a `ThemeExtension`.

A project's colors come from a **palette**. In v2.0 only the **accent is mandatory**: every neutral role, the accent stops, and the semantic colors **derive** from it. The four other roles (main background, secondary background, text, details) remain available as **explicit overrides** — when provided, their values win over the derivation (same precedence rule as v1.6 presets).

### Palette roles → tokens

| Role (palette)      | Mandatory | Drives       | Also derives                                                                       |
| ------------------- | --------- | ------------ | ----------------------------------------------------------------------------------- |
| Accent              | yes       | `primary600` | `primary50/400/700/800/900`, `primary`, `primaryBg`, `selectionBg`, `cursorColor`, `onPrimary`, **all neutral tokens** (tinting rule below), **all semantic tokens** (harmonization rule below) |
| Main background     | optional  | `bg`         | `bgElevated` (= `bg` in light)                                                       |
| Secondary background| optional  | `bgSubtle`   | `bgMuted` (`bgSubtle` darkened ~3 % L)                                               |
| Text                | optional  | `text`       | `textSubtle` (mix text→bg ~45 %), `textMuted` (mix text→bg ~62 %)                    |
| Details             | optional  | `border`     | `borderSubtle` (mix border→bg ~50 %), `borderStrong` (mix border→text ~12 %)         |

### Derivation rules (computed by Claude in Phase 1, written as literal `Color(0xFF…)` in `tokens.dart`)

**Accent stops** (unchanged from v1.6 — same H/S as the accent, lightness varies): `primary50` L≈95 %, `primary400` L≈70 %, `primary700` L≈50 %, `primary800` L≈42 %, `primary900` L≈25 %. Usage tokens: `primary` = `primary600` (light) / `primary400` (dark); `primaryBg` = `primary50` (light) / `primary900` (dark). Same `colorsys` method as the Python generator. `onPrimary` = `#FFFFFF` or near-black, whichever wins contrast on the accent.

**Tinted neutrals** (new in v2.0). Let **H** be the accent hue. Every neutral token is `hsl(H, S, L)` with the fixed S/L targets below. The tint is atmospheric, never saturated: S stays ≤ 33 % in light, ≤ 24 % in dark. When an optional palette role is provided, its explicit value replaces the tinted target for that token, and its supporting tokens derive from it by the mix rules of the role table above.

| Token          | Light `hsl(H, S%, L%)` | Dark `hsl(H, S%, L%)` |
| -------------- | ---------------------- | ---------------------- |
| `bg`           | 30, 99.4               | 14, 11                 |
| `bgSubtle`     | 25, 97                 | 16, 15                 |
| `bgElevated`   | = `bg`                 | 15, 17                 |
| `bgMuted`      | 22, 94.5               | 16, 19                 |
| `text`         | 33, 9                  | 24, 96                 |
| `textSubtle`   | 10, 44                 | 13, 63                 |
| `textMuted`    | 12, 64                 | 11, 42                 |
| `border`       | 18, 90                 | 14, 23                 |
| `borderSubtle` | 20, 94                 | 15, 18                 |
| `borderStrong` | 14, 64                 | 15, 38                 |

> Dark surface ramp stays ascending: `bg` < `bgSubtle` < `bgElevated` < `bgMuted`, so the pressed highlight stays visible on every surface, including inside drawers and sheets. Same rationale as v1.6.

### Default palette — Steel Blue accent `#4682B4` (H = 207), computed hex

Light (`LightColors`):

| Token          | Value   | Token          | Value   |
| -------------- | ------- | -------------- | ------- |
| `bg`           | #FDFEFF | `text`         | #0F181E |
| `bgSubtle`     | #F5F8FA | `textSubtle`   | #65717B |
| `bgMuted`      | #EEF1F4 | `textMuted`    | #98A4AE |
| `bgElevated`   | #FDFEFF | `border`       | #E1E6EA |
| —              | —       | `borderSubtle` | #ECF0F3 |
| —              | —       | `borderStrong` | #96A4B0 |

Dark (`DarkColors`, derived):

| Token          | Value   | Token          | Value   |
| -------------- | ------- | -------------- | ------- |
| `bg`           | #181C20 | `text`         | #F2F5F7 |
| `bgSubtle`     | #20272C | `textSubtle`   | #94A2AD |
| `bgElevated`   | #252C32 | `textMuted`    | #5F6C77 |
| `bgMuted`      | #293138 | `border`       | #323B43 |
| —              | —       | `borderSubtle` | #272F35 |
| —              | —       | `borderStrong` | #52626F |

> Hex values are computed from the HSL targets; re-check with a contrast tool before shipping (Phase 1 runs the AA check, §12).

### Named palettes (Phase 1 catalog)

`/flutter-p1-scoping` presents these. In v2.0 a preset is defined by its **accent alone**; the four optional roles may still be listed to override the tint (e.g. Amber warms its backgrounds beyond the rule). Custom palettes: 1 mandatory hex (accent) + up to 4 optional overrides.

| Name                 | Accent  | Optional overrides                     |
| -------------------- | ------- | -------------------------------------- |
| Steel Blue (default) | #4682B4 | —                                      |
| Teal                 | #0D9488 | —                                      |
| Forest               | #059669 | —                                      |
| Slate                | #4F46E5 | —                                      |
| Amber                | #B45309 | Main bg #FFFDFB, Secondary bg #FBF6EF  |
| Ruby                 | #BE123C | —                                      |

### Accent — Steel Blue (default palette)

Unchanged mechanics from v1.6: a single chromatic ramp used in **both** themes; the 6 stops are mode-agnostic (one value each, shared by `LightColors`/`DarkColors`), only the usage tokens flip. Replacing the 6 `primary*` values in `tokens.dart` (+ regenerating the derived neutrals/semantics) is enough to change the accent across the whole application.

| Token        | Value   | Usage                                                     |
| ------------ | ------- | --------------------------------------------------------- |
| `primary50`  | #EDF3F8 | Selection / active bg (light)                             |
| `primary400` | #5A9FD4 | Active content (dark) — bright, reads on the dark `bg`    |
| `primary600` | #4682B4 | Primary button fill (both themes); active content (light) |
| `primary700` | #396A93 | Primary button pressed                                    |
| `primary800` | #2F5879 | Primary button deep pressed                               |
| `primary900` | #2A4F72 | Selection / active bg (dark)                              |

Derived usage tokens, defined per theme — these are the ones components consume:

| Token       | Light        | Dark         |
| ----------- | ------------ | ------------ |
| `primary`   | `primary600` | `primary400` |
| `primaryBg` | `primary50`  | `primary900` |

> `onPrimary` (primary-button text): `#FFFFFF` in **both** themes for Steel Blue (white on `#4682B4` 4.1:1, AA for UI / large text). The dark foreground accent is the brighter `primary400 #5A9FD4`, not the button fill.

### Semantic colors (derived — harmonized with the project atmosphere)

New in v2.0. Semantic colors keep **fixed hue anchors** so the meaning never drifts, but their exact hue/saturation/lightness are **derived per project** so they share the tinted atmosphere of the neutrals. **Info is the accent itself.**

**Derivation rule.** Let **Ha** be the accent hue and **Hs** the anchor hue of a semantic color. The harmonized hue is:

```
Hs' = Hs + clamp(shortest_angle(Ha − Hs), −10°, +10°) × 0.6      → shift capped at ±6°
```

| Semantic | Anchor Hs | Light `*600` `hsl(Hs', S%, L%)` | Dark `*600` `hsl(Hs', S%, L%)` |
| -------- | --------- | -------------------------------- | ------------------------------- |
| success  | 152       | S 48, L 38                       | S 42, L 60                      |
| warning  | 38        | S 62, L 40                       | S 56, L 60                      |
| danger   | 355       | S 52, L 48                       | S 46, L 62                      |
| info     | = accent  | `info600` = `primary600`         | `info600` = `primary400`        |

**Surface tokens** (`*50`, toast backgrounds):
- Light: `*50` = sRGB mix of `bg` 92 % + `*600` 8 %.
- Dark: `*50` = sRGB mix of `bg` 82 % + dark `*600` 18 %.
- Info: `info50` = `primaryBg` (`primary50` light / `primary900` dark).

> Naming note (kept from v1.6): `*50` is a **role** ("semantic surface / toast background"), not a fixed luminance level. Light = pale tint, Dark = deep tint of the same hue, declared in `DarkColors`. A toast keeps one coherent palette per theme: bg `*50`, text `text`, border/icon `*600` — all resolved from the same `*Colors` class.

**Danger button stops** (fill logic unchanged: red fill + white text in both themes):
- `danger700` = light `danger600` at L −7 %; `danger800` at L −13 %.

Default palette (accent H 207) computed hex:

| Token        | Light   | Dark    | Usage                  |
| ------------ | ------- | ------- | ---------------------- |
| `success50`  | #EFF6F3 | #26372F | Success toast bg       |
| `success600` | #328F6D | #6EC4A4 | Success border, icon   |
| `warning50`  | #F8F5EC | #392F1B | Warning toast bg       |
| `warning600` | #A58327 | #D2B460 | Warning border, icon   |
| `danger50`   | #F8EFF1 | #38222B | Danger toast bg        |
| `danger600`  | #BA3B52 | #CB7282 | Danger border, icon    |
| `danger700`  | #A23448 | #A23448 | Danger button pressed  |
| `danger800`  | #8A2C3D | #8A2C3D | Danger button deep pressed |
| `info50`     | = `primary50` | = `primary900` | Info toast bg |
| `info600`    | = `primary600` | = `primary400` | Info border, icon |

> The ±6° cap keeps every semantic color instantly recognizable across projects (a danger is always red-family, a success always green-family). Every `*600`/`*50` pair must pass the §12 checks — Phase 1 verifies and reports.

### Charts / visualization palette

Unchanged mechanics — the chart tokens reference the themed tokens, so they follow light/dark with no redefinition.

| Token          | Value        |
| -------------- | ------------ |
| `chartPrimary` | `primary`    |
| `chartSuccess` | `success600` |
| `chartWarning` | `warning600` |
| `chartDanger`  | `danger600`  |
| `chartInfo`    | `info600`    |

### Text selection & on-primary

Unchanged from v1.6.

| Token           | Light        | Dark         | Usage                            |
| --------------- | ------------ | ------------ | -------------------------------- |
| `selectionBg`   | `primaryBg`  | `primaryBg`  | Text field selection background  |
| `cursorColor`   | `primary`    | `primary`    | Text field cursor                |
| `onPrimary`     | #FFFFFF      | #FFFFFF      | Text/icon on Primary button      |
| `onDanger`      | #FFFFFF      | #FFFFFF      | Text/icon on Danger button (fixed) |

> `onPrimary` (Primary button) and `onDanger` (Danger button) replace the literal `#FFFFFF` in button styles (§9). They stay separate tokens so a custom accent dark enough to need near-black `onPrimary` does not drag the Danger button along (the danger fill keeps white text in both themes). `selectionBg`/`cursorColor` go into `textSelectionTheme` in `app_theme.dart`.

---

## 3. SPACING

Unchanged from v1.6.

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

Unchanged from v1.6 (fixed anchors + dynamic sizing principle).

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

**The stroke is the language of depth.** An element detaches from the background by its border, never by a shadow or elevation. Hierarchy = border strength: `borderSubtle` < `border` < `borderStrong`. Floating layers (dialog, bottom sheet, drawer, dropdown) mark their elevation with a `borderStrong` side; the toast's stroke marker is its 4-width semantic left accent (`layout.md §6`).

| Token       | Value                                        |
| ----------- | -------------------------------------------- |
| `radius`    | 5, uniform                                   |
| `elevation` | 0 — `BoxShadow` forbidden                    |

> `radius` applies to every rounded element: buttons, fields, cards, toasts, dialogs, sheets (`BorderRadius.circular(AppTokens.radius)`). Nested radius (e.g. menu items inside a 5-radius menu): 3 (`radius` − 2). `elevation: 0` stays enforced on AppBar, NavigationBar, Card, Dialog, BottomSheet (overrides in `app_theme.dart`), as in v1.6.

### Border widths

| Token                 | Value | Usage                                          |
| --------------------- | ----- | ---------------------------------------------- |
| `borderWidth`         | 1     | Standard borders, separators                   |
| `borderWidthEmphasis` | 2     | Focused field, error field, TabBar indicator (signature underline) |
| `borderWidthAccent`   | 4     | Toast left accent                              |

### Opacity

| Token             | Value | Usage                                  |
| ----------------- | ----- | -------------------------------------- |
| `opacityDisabled` | 0.4   | Disabled interactive elements          |
| `opacityOverlay`  | 0.4   | Dialog / drawer / sheet scrim (`text`) |

---

## 6. TRANSITIONS

New in v2.0: a single asymmetric easing (fast start, soft landing) replaces `Curves.ease`. It is the only easing in the system.

| Token               | Value                                                  | Usage                              |
| ------------------- | ------------------------------------------------------ | ---------------------------------- |
| `easeOut`           | `Curves.easeOutCubic`                                  | Every animation                    |
| `transitionDefault` | `Duration(milliseconds: 160)` + `easeOut`              | Pressed, focus, state changes      |
| `transitionSlow`    | `Duration(milliseconds: 240)` + `easeOut`              | Panels, drawer, sheets, TabBar indicator |

**Motion policy**: state changes and panel movements (drawer, sheet — Material's own transitions, retimed where configurable) animate; nothing else does. **No entry animations on toasts** — they appear and disappear instantly, and the stack reflows without animation. The only *expressive* movement in the system is the sliding `TabBar` indicator (§8), which Material animates natively.

---

## 7. FOCUS

Unchanged from v1.6.

| Token       | Value                                   |
| ----------- | ---------------------------------------- |
| `focusRing` | 2 `primary` border, offset 2 (keyboard/TV navigation — secondary on touch mobile) |

On mobile, the primary feedback is the pressed state (`bgMuted`) — the focus ring applies to input fields (`focusedBorder`).

---

## 8. INTERACTIVE COMPONENT STATES

Applies to **neutral interactive elements**: navbar destinations, tabs, list/tree items, Secondary and Ghost buttons. Filled colored buttons (Primary, Danger) follow §9.

**v2.0 change — on pointer devices, hover is a stroke event.** Android is touch-first: the `bgMuted` **pressed** highlight stays the primary affordance. Where a pointer hover exists (mouse, stylus, ChromeOS/desktop targets), hover = border strengthening — the element's border climbs one step, and borderless items carry a **transparent 1-width border** so hover never shifts layout.

| State               | Rule                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `default`           | Base style; borderless items have a transparent 1-width border    |
| hover (pointer)     | Border climbs one step: transparent → `border`; `border` → `borderStrong` (`transitionDefault`). Touch devices: no hover state |
| `pressed`           | `bgMuted` highlight — splash disabled (`splashFactory: NoSplash`) |
| `active` / selected | `primaryBg` background, `primary` content. Top tabs instead use the **signature underline** (below) |
| `disabled`          | `opacityDisabled` (0.4), non-interactive                           |
| focused field       | `borderWidthEmphasis` (2) `primary` border                        |

> `active`/selected (persistent chosen state) is distinct from `pressed` (transient touch-down). Do not conflate them.

### Signature gesture — the sliding underline (TabBar indicator)

The selected indicator of **top tabs / horizontal navigation** is a 2-width `primary` underline that **slides** from the previous tab to the new one. Material's `TabBar` animates its indicator natively — configure it centrally in `tabBarTheme` (`app_theme.dart`): `UnderlineTabIndicator` with `borderWidthEmphasis` and `primary`, over a 1 `border` baseline. It is the identity gesture of the system: it exists wherever a horizontal selection exists (top `TabBar`), and nowhere else — the `NavigationBar` (bottom) and `NavigationRail` keep the `primaryBg` active pill (§8 selected state).

> With `MediaQuery.disableAnimations` (reduced motion, §12) the indicator snaps.

---

## 9. BUTTONS

| Variant    | Base widget      | Background    | Text         | Border              |
| ---------- | ---------------- | ------------- | ------------ | ------------------- |
| Primary    | `FilledButton`   | `primary600`  | `onPrimary`  | none                |
| Secondary  | `OutlinedButton` | transparent   | `text`       | 1 `border`          |
| Danger     | `FilledButton`   | `danger600`   | `onDanger`   | none                |
| Ghost      | `TextButton`     | transparent   | `textSubtle` | 1 transparent       |

**States per variant** (via `WidgetStateProperty` in `app_theme.dart`):

| Variant   | hover (pointer)                      | pressed              |
| --------- | ------------------------------------ | -------------------- |
| Primary   | —                                    | `primary700`         |
| Danger    | —                                    | `danger700`          |
| Secondary | border → `borderStrong`              | `bgMuted` highlight  |
| Ghost     | border → `border`, text → `text`     | `bgMuted` highlight  |

> v2.0: Secondary and Ghost hover by **stroke** on pointer devices (§8); the touch pressed feedback keeps the `bgMuted` highlight. Colored buttons darken on press via their own `700` stops, never the neutral `bgMuted` rule. Disabled: `opacityDisabled`.

> Primary button fill uses `primary600` in **both** themes with `onPrimary` (unchanged v1.6 logic; the brighter `primary400` remains reserved for dark foreground accents: active content, icons, focus). Danger fill uses the light `danger600` in both themes with white `onDanger`.

Styles centralized in `app_theme.dart` (`filledButtonTheme`, `outlinedButtonTheme`, `textButtonTheme`) — danger/ghost variants via named constructors of an `AppButton` widget consuming the tokens. Zero local `ButtonStyle` in screens.

**Dynamic sizing** — unchanged from v1.6, the size results from content + padding (min touch height `touchTarget`):

| Size          | Vertical padding | Horizontal padding | Font                       |
| ------------- | ---------------- | ------------------ | -------------------------- |
| `sm`          | `spacing1` (4)   | `spacing3` (12)    | `weightMedium` `fontXs`    |
| `md` (default)| `spacing2` (8)   | `spacing4` (16)    | `weightMedium` `fontSm`    |
| `lg`          | `spacing3` (12)  | `spacing6` (24)    | `weightMedium` `fontBase`  |

**Aligned button group**: width unified on the widest button (`IntrinsicWidth` + `CrossAxisAlignment.stretch`).

---

## 10. ICONS — Lucide

Library: `lucide_icons_flutter` (pub.dev, embedded locally — verified 2026-07-16 at `^3.1.15`, MIT; re-confirm at generation and pin). Stroke icons speak the same stroke language as the borders (§5); the icon font renders Lucide's native stroke design (the `iconStroke` 1.75 target of the other generators maps to the font's default weight here — per-glyph stroke width is not tunable on an icon font).

**Rule**: icon colors and sizes go through tokens — never `Color(0xFF…)` or a literal size in widgets.

| Token         | Value (alias)  |
| ------------- | -------------- |
| `iconDefault` | `textSubtle`   |
| `iconActive`  | `primary`      |
| `iconSuccess` | `success600`   |
| `iconWarning` | `warning600`   |
| `iconDanger`  | `danger600`    |
| `iconInfo`    | `info600`      |
| `iconMuted`   | `textMuted`    |

> v2.0: the `icon*` tokens are **aliases of the derived tokens** inside each `*Colors` class (getters, no independent hex) — they follow the project palette and both themes with no redefinition (the v1.6 hardcoded hex table is removed).

```dart
// Usage in a widget
import 'package:lucide_icons_flutter/lucide_icons.dart';
Icon(
  LucideIcons.house,
  size: AppTokens.iconMd,
  color: context.colors.iconDefault, // extension on BuildContext → ThemeExtension
)
```

**Theme change**: colors come from the `ThemeExtension` — rebuilding `MaterialApp` on `themeMode` change updates everything automatically.

**Fallback**: if `lucide_icons_flutter` is unavailable or unmaintained at generation time, vendor the needed Lucide SVGs into `assets/icons/` and render them with `flutter_svg` (same names, same tokens) — declare the deviation.

---

## 11. THEME APPLICATION RULES

Unchanged from v1.6, plus rule 5.

1. **Zero hardcoded visual value in widgets.** Every color, size, duration, text style comes from `tokens.dart` (via `AppTokens` and the `AppColors` `ThemeExtension`).
2. **Every recurring style is centralized in `app_theme.dart`** (ThemeData: buttons, fields, AppBar, NavigationBar, TabBar, Dialog…). Widgets only carry composition.
3. **Dark mode is a complete `ThemeData`** (`AppTheme.dark`) built from `DarkColors` — toggled by `themeMode` on `MaterialApp`. Never a theme condition inside screens.
4. **Every value in `app_theme.dart` is traced to a token** — comment indicating the source token.
5. **The signature underline is themed centrally**: the `TabBar` indicator is configured once in `tabBarTheme` (§8) — never a per-screen indicator override.

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
| Semantic contrast   | Every derived `*600` ≥ 3:1 against `bg` and against its `*50` toast bg; error helper text ≥ 4.5:1 against `bg` |
| Semantic recognizability | Harmonization hue shift capped at ±6° (§2) — a danger stays red-family in every project   |
| Hover cue (pointer) | Border strengthening (§8) must yield a ≥ 3:1 change against the surface, or pair with a `bgSubtle` secondary cue |
| Dynamic type        | Fonts in **sp** follow the system text-size setting (§1). Avoid clamping `textScaler` to a fixed value |
| Reduced motion      | Honor `MediaQuery.disableAnimations` — skip/shorten `transition*`, including the TabBar indicator slide |
| Focus / state       | Pressed feedback (`bgMuted`) is the primary touch affordance; the focus ring serves keyboard/TV |

> Contrast figures are computed estimates, not tool-measured. Phase 1 runs the AA check on: text/bg, textSubtle/bg, accent/bg, onPrimary/accent, and each derived semantic pair; it reports failures without blocking.

---

## 13. LAYERING (overlay order)

Unchanged scale. Flutter has no `z-index`; order comes from `Overlay` entry order and the `Navigator` stack. The intent below must be enforced by inserting the `ToastOverlay` above the modal routes. v2.0 note: a floating layer is marked by its stroke — a `borderStrong` side (or the toast's semantic accent) — plus `bgElevated` on the surfaces that use it (drawer, sheet); **never** by elevation or a shadow.

| Order | Element                              | Mechanism                                        |
| ----- | ----------------------------------- | ------------------------------------------------ |
| back  | Screen content (`IndexedStack`)     | Scaffold body                                    |
|       | Drawer / BottomSheet + scrim        | `Scaffold.endDrawer` / `showModalBottomSheet`    |
|       | Dialog + barrier                    | `showDialog` (root navigator)                    |
| front | Toasts (`ToastOverlay`)             | root `Overlay` entry above modal routes          |

> A persistent `danger` toast must stay visible above a dialog/sheet, so the `ToastOverlay` is mounted at the `MaterialApp` builder level (root overlay), not inside a screen.
