# Layout System — v1.1 (Flutter / Android)

> Binding reference for all Flutter/Dart Android applications.
> Built on `design-system.md v1.1 (Flutter)`. The two files are inseparable.
> Validated mobile transposition of the desktop layout: AppBar ↔ topbar, NavigationBar ↔ tabs, custom overlay toasts kept, status bar removed.

## Changelog

| Version | Date       | Main change                                                            |
| ------- | ---------- | --------------------------------------------------------------------- |
| v1.1    | 2026-06-14 | coherent dark toasts · tree chevron `textSubtle` (WCAG) · overlay layering reference |
| v1.0    | initial    | Mobile transposition: AppBar, NavigationBar, overlay toasts, components |

---

## 1. GLOBAL STRUCTURE

```
┌─────────────────────────────────────┐
│           APPBAR (56dp)             │
│  [ Title ]            [ Theme ]     │
├─────────────────────────────────────┤
│                                     │
│           MAIN CONTENT              │
│         (scrollable area)           │
│                                     │
├─────────────────────────────────────┤
│       NAVIGATIONBAR (80dp)          │
│   [ Dest 1 ] [ Dest 2 ] [ Dest 3 ]  │
└─────────────────────────────────────┘
```

Mandatory skeleton (`AppShell` — `lib/presentation/screens/app_shell.dart`):

```
Scaffold
├── appBar: AppAppBar            # current screen title + actions + theme toggle
├── body: IndexedStack           # one screen per destination, state preserved
└── bottomNavigationBar: NavigationBar (M3) — if ≥ 2 destinations
Root overlay: ToastOverlay       # stacked toasts, independent of the Scaffold
```

- 1 destination only → no NavigationBar (AppBar + body only).
- 2 to 5 destinations → NavigationBar. Beyond 5 → 4 destinations + "More" (list screen).

**Toast** (overlaid, top of screen):

```
┌─────────────────────────────────────┐
│           APPBAR                    │
│  ┌───────────────────────────────┐  │
│  │ [icon] Message            [×] │  │
│  └───────────────────────────────┘  │
│           MAIN CONTENT              │
├─────────────────────────────────────┤
│         NAVIGATIONBAR               │
└─────────────────────────────────────┘
```

**Secondary panel** (optional — chosen in Phase 3): `endDrawer` (right side) or modal `BottomSheet`.

---

## 2. APPLICATION

| Token / option        | Value                                                       |
| --------------------- | ------------------------------------------------------------ |
| orientation           | portrait only (default) — landscape on Phase 1 request        |
| theme on launch       | follows the OS theme (`ThemeMode.system`) if no preference    |
| OS default theme      | light                                                         |
| Android system bar    | current theme `bg` color (`SystemUiOverlayStyle`)             |
| Android back button   | handled by `PopScope` — closes sheet/dialog/drawer before exiting |
| splash                | native Android, light `bg` background, centered logo (flutter_native_splash if validated in Phase 1) |

---

## 3. APPBAR

| Token              | Value                  |
| ------------------ | ----------------------- |
| height             | `appbarHeight` = 56     |
| light/dark bg      | `bg`                    |
| bottom border      | 1 `border` (no shadow — `elevation: 0`) |
| horizontal padding | `spacing4` = 16         |

### Zones (left → right)

```
[ Current screen title ]   ···   [ Contextual actions ]  [ Theme ]
```

| Zone   | Content                                                        |
| ------ | --------------------------------------------------------------- |
| Left   | Active screen title — `weightSemibold` `fontBase`, `text`. No logo (mobile). |
| Right  | 0–2 contextual actions (`iconLg` icons) + theme selector       |

### Theme selector

- Icon only (fa-sun / fa-moon), `iconLg` = 24, touch zone `touchTarget` = 48.
- Mandatory `tooltip`: "Passer en mode sombre" / "Passer en mode clair".
- Instant toggle — `MaterialApp` `themeMode` (Riverpod provider) — persisted via `shared_preferences`.

---

## 4. NAVIGATIONBAR (Material 3)

| Token               | Value                          |
| ------------------- | ------------------------------- |
| height              | `navbarHeight` = 80             |
| bg                  | `bg`                            |
| top border          | 1 `border` — `elevation: 0`     |
| destinations        | 2 to 5 max                      |
| active indicator    | `primaryBg` background (indicator), `primary` icon + label |
| inactive destination| `textSubtle` icon + label       |
| label               | `weightMedium` `fontXs`, always visible |
| icons               | `iconLg` = 24, FontAwesome      |

- State-based navigation (`IndexedStack` + `activeDestination` provider) — each screen's state is preserved on tab change.
- Splash/ripple: disabled (flat) — `bgMuted` highlight.

---

## 5. MAIN CONTENT AREA

| Token             | Value                                  |
| ----------------- | ---------------------------------------- |
| bg                | `bg`                                     |
| inner padding     | `spacing4` = 16 (mobile — full width)    |
| scroll            | vertical — `ListView` / `SingleChildScrollView` |

### Section header

```
[ Section title ]
[ Subtitle / short description ]
```

- Title: `weightBold` `font2xl` (24), `text`.
- Subtitle: `weightNormal` `fontSm` (14), `textSubtle`.
- Bottom margin: `spacing6` = 24 before the content.
- If the screen title is already in the AppBar: no duplicate — the section header is reserved for sub-sections.

---

## 6. TOAST

Fully replaces `SnackBar` and inline banner. Neither is used in the applications.
Component: `presentation/widgets/toast_overlay.dart` + Riverpod controller `toastControllerProvider` (queue).

| Token                  | Value                                               |
| ---------------------- | --------------------------------------------------- |
| position               | Top of screen, below the system area (SafeArea), overlaid |
| width                  | screen width − 2×`spacing4`                          |
| top margin             | `spacing4` = 16 (below the AppBar)                   |
| spacing between toasts | `spacing2` = 8                                       |
| stacking               | Vertical, queue, no overlap                          |
| enter animation        | Slide from top, `transitionSlow` = 250ms             |
| exit animation         | Fade + slide up, `transitionSlow` = 250ms            |
| gesture                | Swipe up = dismiss (dismissible types)               |

### Display durations

| Type      | Duration   | Manual dismiss      |
| --------- | ---------- | ------------------- |
| `success` | 4s         | No                  |
| `info`    | 4s         | No                  |
| `warning` | 6s         | Yes (×)             |
| `danger`  | persistent | Yes (×) mandatory   |

### Toast anatomy

```
┌────────────────────────────────────┐
│ [icon]  Main message           [×] │
│         Optional description       │
└────────────────────────────────────┘
```

| Token              | Value                                       |
| ------------------ | -------------------------------------------- |
| padding            | `spacing3` vertical, `spacing4` horizontal   |
| left border        | 4 semantic color                             |
| bg                 | semantic bg (`*50`)                          |
| message font       | `weightMedium` `fontSm` (14)                 |
| description font   | `weightNormal` `fontXs` (12), `textSubtle`   |
| icon               | `iconMd` = 20                                |

| Type      | Bg          | Border       | Icon (FontAwesome)         |
| --------- | ----------- | ------------ | -------------------------- |
| `success` | `success50` | `success600` | `circleCheck`              |
| `warning` | `warning50` | `warning600` | `triangleExclamation`      |
| `danger`  | `danger50`  | `danger600`  | `circleExclamation`        |
| `info`    | `info50`    | `info600`    | `circleInfo`               |

Dark mode: the toast uses one coherent palette per theme, all from the active `*Colors` class — bg `*50` (deep tint in dark, see `design-system.md §2`), text `text`, left border + icon `*600`. No mixing of light bg with dark accent. Icons use the matching `icon*` token (`iconSuccess`/`iconWarning`/`iconDanger`/`iconInfo`).
Layering: the `ToastOverlay` is mounted at the root (above modal routes) so a persistent `danger` toast stays visible over a dialog/sheet (`design-system.md §13`).

---

## 7. SECONDARY PANEL

Chosen in Phase 3: `endDrawer` or `BottomSheet`. Opened by explicit action only. Never automatically.

### endDrawer (right side)

| Token          | Value                                       |
| -------------- | --------------------------------------------- |
| width          | 85% screen, max 360                           |
| animation      | slide from the right, `transitionSlow`        |
| bg             | `bgElevated`                                  |
| left border    | 1 `border`                                    |
| padding        | `spacing6` = 24                               |
| overlay bg     | `text` 40% opacity (scrimColor)               |

- Close: tap overlay, Android back button, or × button in the drawer.
- Header: `weightSemibold` `fontLg` (18) title + × button aligned right.
- Content vertically scrollable on overflow.

### Modal BottomSheet

| Token        | Value                                   |
| ------------ | ---------------------------------------- |
| width        | full width                               |
| height       | content, max 90% screen                  |
| animation    | slide from the bottom, `transitionSlow`  |
| bg           | `bgElevated` — `radius` 0 (flat)          |
| top border   | 1 `border`                                |
| padding      | `spacing6` = 24 + bottom SafeArea         |
| overlay bg   | `text` 40% opacity                        |

- Close: tap overlay, back button, swipe down, or × button.
- Header identical to the drawer. Scrollable content (`DraggableScrollableSheet` if long).

---

## 8. RECURRING COMPONENTS

### Data list (mobile counterpart of the desktop table)

On mobile, a data table becomes a vertical list of structured items (`ListView.separated`).

- Item: full width, vertical padding `spacing2` (8) + horizontal `spacing4`, min height `touchTarget`.
- Item structure: main line `weightMedium` `fontSm` `text` + secondary line `fontXs` `textSubtle` + value/action on the right.
- Separator: 1 `borderSubtle`.
- Group header (if grouping): `bgSubtle` bg, `weightSemibold` `fontSm`, `textSubtle`, bottom border 2 `borderStrong`.
- Selected item: `primaryBg` bg. Pressed: `bgMuted`.
- Row alternation: disabled (flat design).
- **Long lists: native lazy loading (`ListView.builder`) + pagination in batches of 50 on scroll** (replaces desktop button pagination). Loading indicator at the list footer.
- Per-item actions: swipe (`Dismissible`) for deletion with confirmation, or context menu — chosen in Phase 3.

### Input form

- Labels above the fields, `weightMedium` `fontSm`, `text`.
- Fields: full width, dynamic height (vertical contentPadding `spacing2`), 1 `border` border, focus 2 `primary` — centralized in `inputDecorationTheme`.
- Spacing between fields: `spacing4` = 16.
- Field in error: 2 `danger600` border + `danger600` message below the field, `fontXs` — via `errorText`.
- Form actions: aligned right — Cancel (secondary) + Confirm (primary); on a full input screen: Confirm at the bottom, full width.
- Keyboard: consistent `textInputAction` (next/done), adapted `keyboardType`, automatic scroll to the focused field.

### Tree view

- Indentation per level: `spacing4` = 16.
- Expand/collapse icon: FontAwesome chevron, `iconSm` = 16, `textSubtle` (interactive control — `textMuted` fails AA contrast).
- Item: vertical padding `spacing1` (4), min touch height `touchTarget`.
- Selected item: `primaryBg` bg.

### Charts / Visualization

- Transparent background (inherits the content).
- Palette: `chartPrimary`, `chartSuccess`, `chartWarning`, `chartDanger`, `chartInfo`.
- Legend: `weightNormal` `fontSm`, `textSubtle`. No shadow.
- Library (fl_chart…): to validate in Phase 1 (none by default).

### Rich editor — flutter_quill (if enabled in Phase 1)

- `QuillSimpleToolbar`: `bgSubtle` bg, bottom border 1 `border`, `iconMd` `iconDefault` icons, active button `primaryBg` bg `primary` icon.
- `QuillEditor`: `spacing4` padding, text styles mapped to the typographic tokens.
- Content persisted as Delta JSON (SQLite TEXT column).
- Toolbar limited to the controls required by the validated features — not the full toolbar by default.

### Dialog (modal)

```
┌─────────────────────────────────────┐
│  Dialog title                   [×] │
├─────────────────────────────────────┤
│  Content (form, text…)              │
├─────────────────────────────────────┤
│              [ Cancel ] [ Confirm ] │
└─────────────────────────────────────┘
```

`AppDialog` component (`showDialog` + custom widget) — never a raw `AlertDialog`.

| Token        | Value                           |
| ------------ | -------------------------------- |
| width        | screen width − 2×`spacing6`      |
| bg           | `bg` — `radius` 0, `elevation` 0 |
| border       | 1 `border`                       |
| padding      | `spacing6` = 24                  |
| overlay bg   | `text` 40% opacity (barrierColor)|

- Opened by explicit action only.
- Close: ×, Cancel, Android back button, tap overlay.
- Header: `weightSemibold` `fontLg` title + × on the right, bottom border 1 `borderSubtle`.
- Footer: Cancel (secondary) + Confirm (primary) on the right, top border 1 `borderSubtle`.
- Destructive confirmations: this dialog, Confirm button in danger variant.

---

## 9. GESTURES & SYSTEM NAVIGATION

| Gesture / button        | Action                                                    |
| ----------------------- | ---------------------------------------------------------- |
| Android back            | Closes in order: dialog → sheet/drawer → pushed screen → app (`PopScope`) |
| Swipe up on toast       | Dismiss (dismissible types)                                |
| Swipe on list item      | Deletion with confirmation (if enabled in Phase 3)         |
| Tap navbar destination  | Change screen, state preserved                             |
| Pull-to-refresh         | `RefreshIndicator` on data lists (`primary` color)         |

---

## 10. PERSISTED PREFERENCES

`shared_preferences` — accessed only through `data/repositories/preferences_repository.dart`, exposed by a provider.

| Preference            | Default value     |
| --------------------- | ----------------- |
| theme                 | OS system         |
| last destination      | first             |
| locale (if i18n)      | fr                |

---

## 11. DESIGN SYSTEM CROSS-REFERENCE

This file does not redefine tokens — it consumes them. Every visual value is traced to `design-system.md v1.1 (Flutter)`.

| Need                       | Token                                        |
| -------------------------- | -------------------------------------------- |
| Main background            | `bg`                                         |
| Secondary areas background | `bgSubtle`                                   |
| Drawer / sheet background  | `bgElevated`                                 |
| Primary text               | `text`                                       |
| Secondary text             | `textSubtle`                                 |
| Borders                    | `border` / `borderSubtle` / `borderStrong`   |
| Active / selection color   | `primary` / `primaryBg`                      |
| Minimum touch surface      | `touchTarget` = 48                           |
| Panel transitions          | `transitionSlow` = 250ms                     |
| State transitions          | `transitionDefault` = 150ms                  |
| Shape                      | `radius` = 0 (flat design)                   |
| Shadows                    | `elevation` = 0 (flat design)                |
| Line-height                | `leadingTight` 1.25 / `leadingNormal` 1.5    |
| Overlay scrim opacity      | `opacityOverlay` 0.4 (`text` color)          |
| Overlay order              | layering (`design-system.md §13`)            |
