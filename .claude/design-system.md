# Design System — v1.0 (Flutter / Android)

> Binding reference for all Flutter/Dart Android applications.
> Inseparable from `layout.md`.
> All tokens are Dart constants declared in `lib/presentation/theme/tokens.dart`, consumed exclusively by `app_theme.dart` and by widgets through the theme.
> Units: dimensions in **dp** (Flutter logical value), fonts in **sp** (follow the system setting).

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

---

## 2. COLORS

Declaration: two token classes — `LightColors` and `DarkColors` — implementing a single `AppColors` interface, injected into `ThemeData` via a `ThemeExtension`.

### Light mode (`LightColors`)

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

### Dark mode (`DarkColors`)

| Token          | Value   | Usage                          |
| -------------- | ------- | ------------------------------ |
| `bg`           | #111827 | Main background, AppBar        |
| `bgSubtle`     | #1F2937 | Secondary areas                |
| `bgMuted`      | #1F2937 | Hover/pressed                  |
| `bgElevated`   | #374151 | Drawer, bottom sheet, dialogs  |
| `text`         | #F9FAFB | Primary text                   |
| `textSubtle`   | #9CA3AF | Secondary text                 |
| `textMuted`    | #6B7280 | Disabled text                  |
| `border`       | #374151 | Standard borders               |
| `borderSubtle` | #1F2937 | Discreet separators            |
| `borderStrong` | #4B5563 | List/table headers             |

### Primary color — Slate Blue

| Token        | Light   | Dark    |
| ------------ | ------- | ------- |
| `primary50`  | #EEF2FF | —       |
| `primary400` | —       | #818CF8 |
| `primary600` | #4F46E5 | —       |
| `primary900` | —       | #312E81 |

Derived usage tokens, defined per theme — these are the ones components consume:

| Token       | Light        | Dark         |
| ----------- | ------------ | ------------ |
| `primary`   | `primary600` | `primary400` |
| `primaryBg` | `primary50`  | `primary900` |

> Modification: replacing the 4 `primary*` values in `tokens.dart` is enough to change the primary color across the whole application.

### Semantic colors

| Token        | Light   | Dark    | Usage                  |
| ------------ | ------- | ------- | ---------------------- |
| `success50`  | #F0FDF4 | —       | Success toast bg       |
| `success600` | #16A34A | #4ADE80 | Success border, icon   |
| `warning50`  | #FFFBEB | —       | Warning toast bg       |
| `warning600` | #D97706 | #FCD34D | Warning border, icon   |
| `danger50`   | #FFF1F2 | —       | Danger toast bg        |
| `danger600`  | #DC2626 | #F87171 | Danger border, icon    |
| `info50`     | #EFF6FF | —       | Info toast bg          |
| `info600`    | #2563EB | #60A5FA | Info border, icon      |

### Charts / visualization palette

| Token          | Value        |
| -------------- | ------------ |
| `chartPrimary` | `primary`    |
| `chartSuccess` | `success600` |
| `chartWarning` | `warning600` |
| `chartDanger`  | `danger600`  |
| `chartInfo`    | `info600`    |

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

## 5. SHAPE & SHADOWS

| Token       | Value                        |
| ----------- | ---------------------------- |
| `radius`    | 0 — strict flat design       |
| `elevation` | 0 — strict flat design       |

`BoxShadow` forbidden. `elevation: 0` on AppBar, NavigationBar, Card, Dialog, BottomSheet (overrides in `app_theme.dart`).

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

Applies to all buttons, destinations, clickable items:

| State                  | Rule                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `default`              | Base style defined by the component                                |
| `pressed` (≈ hover)    | `bgMuted` background — splash/highlight disabled in favor of a flat highlight (`splashFactory: NoSplash`) |
| `active` / selected    | `primaryBg` background, `primary` content                          |
| `disabled`             | 40% opacity, non-interactive                                       |
| focused field          | 2 `primary` border                                                 |

---

## 9. BUTTONS

| Variant    | Base widget      | Background    | Text         | Border         |
| ---------- | ---------------- | ------------- | ------------ | -------------- |
| Primary    | `FilledButton`   | `primary`     | #FFFFFF      | none           |
| Secondary  | `OutlinedButton` | transparent   | `text`       | 1 `border`     |
| Danger     | `FilledButton`   | `danger600`   | #FFFFFF      | none           |
| Ghost      | `TextButton`     | transparent   | `textSubtle` | none           |

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
| `iconDefault` | #6B7280 (`textSubtle`)   | #9CA3AF  |
| `iconActive`  | #4F46E5 (`primary`)      | #818CF8  |
| `iconDanger`  | #DC2626 (`danger600`)    | #F87171  |
| `iconSuccess` | #16A34A (`success600`)   | #4ADE80  |
| `iconMuted`   | #9CA3AF (`textMuted`)    | #6B7280  |

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
