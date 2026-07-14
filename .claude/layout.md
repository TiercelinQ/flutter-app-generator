# Layout System — v3.0 (Flutter / Android)

> The **structural defaults** (global structure, AppShell, AppBar, NavigationBar, content area, secondary panel, recurring components, gestures) are shared by **both** design-system modes. The **skin/feedback** parts that reference framework tokens or the custom toast system (notably §6 Toast) apply in `framework` mode only — in `native` mode (`rules/native-design.md`), feedback uses native `SnackBar`/`MaterialBanner` and Material default shapes; the §12 pattern catalog is structural and shared by both modes.
> Companion layout reference — not a constraint. This file provides: (1) a **proposed default
> composition** and a **catalog of alternative composition patterns** (§12) that Claude co-designs
> from in Phase 3, the user amending or replacing freely;
> (2) the **feedback spec** (toasts, dialogs) serving the error contract; (3) **defaults and
> technical recommendations** (dimensions, behaviors) — never a composition restriction.
> The retained composition is the one validated in `docs/specs/03-surfaces.md` and locked in
> `docs/specs/04-architect.md`.
> Built on `design-system.md v1.6 (Flutter)`. The two files are inseparable.
> Validated mobile transposition of the desktop layout: AppBar ↔ topbar, NavigationBar ↔ tabs, custom overlay toasts kept, status bar removed.

## Changelog

| Version | Date       | Main change                                                            |
| ------- | ---------- | --------------------------------------------------------------------- |
| v3.0    | 2026-07-14 | Composition pattern catalog (§12): Drawer, top TabBar, NavigationRail alternatives; Phase 3 becomes a guided co-design flow |
| v2.0    | 2026-07-13 | Non-binding composition: mandatory AppShell becomes the proposed default; destination cap becomes a technical recommendation |
| v1.1    | 2026-06-14 | coherent dark toasts · tree chevron `textSubtle` (WCAG) · overlay layering reference |
| v1.0    | initial    | Mobile transposition: AppBar, NavigationBar, overlay toasts, components |

---

## 1. GLOBAL STRUCTURE

Proposed default composition — submitted in Phase 3, amendable or replaceable by the user.

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

Proposed default skeleton (`AppShell` — `lib/presentation/screens/app_shell.dart`):

```
Scaffold
├── appBar: AppAppBar            # current screen title + actions + theme toggle
├── body: IndexedStack           # one screen per destination, state preserved
└── bottomNavigationBar: NavigationBar (M3) — if ≥ 2 destinations
Root overlay: ToastOverlay       # stacked toasts, independent of the Scaffold
```

- 1 destination only → no NavigationBar (AppBar + body only).
- 2 to 5 destinations → NavigationBar. Technical recommendation: beyond 5, the Material `NavigationBar` degrades (labels truncate, touch targets shrink); the suggested pattern is 4 destinations + "More" (list screen), not an imposed rule.

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

Default values — customizable in Phase 3.

| Token / option        | Default                                                     |
| --------------------- | ------------------------------------------------------------ |
| orientation           | portrait only (default) — landscape on Phase 1 request        |
| theme on launch       | follows the OS theme (`ThemeMode.system`) if no preference    |
| OS default theme      | light                                                         |
| Android system bar    | current theme `bg` color (`SystemUiOverlayStyle`)             |
| Android back button   | handled by `PopScope` — closes sheet/dialog/drawer before exiting |
| splash                | native Android, light `bg` background, centered logo (flutter_native_splash if validated in Phase 1) |

---

## 3. APPBAR

| Token              | Default                 |
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

| Token               | Default                         |
| ------------------- | ------------------------------- |
| height              | `navbarHeight` = 80             |
| bg                  | `bg`                            |
| top border          | 1 `border` — `elevation: 0`     |
| destinations        | 2 to 5 recommended (NavigationBar ergonomics) |
| active indicator    | `primaryBg` background (indicator), `primary` icon + label |
| inactive destination| `textSubtle` icon + label       |
| label               | `weightMedium` `fontXs`, always visible |
| icons               | `iconLg` = 24, FontAwesome      |

- State-based navigation (`IndexedStack` + `activeDestination` provider) — each screen's state is preserved on tab change.
- Splash/ripple: disabled (flat) — `bgMuted` highlight.

---

## 5. MAIN CONTENT AREA

| Token             | Default                                |
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

Chosen in Phase 3: `endDrawer` or `BottomSheet`. Opened by explicit action only. Never automatically. Default values below.

### endDrawer (right side)

| Token          | Default                                     |
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

| Token        | Default                                 |
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
- **Long lists: native lazy loading (`ListView.builder`) + pagination recommended in batches of ~50 on scroll** (replaces desktop button pagination). Loading indicator at the list footer.
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

| Token        | Default                          |
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

Default behaviors — customizable in Phase 3.

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

This file does not redefine tokens — it consumes them. Every visual value is traced to `design-system.md v1.6 (Flutter)`.

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

---

## 12. COMPOSITION PATTERNS

Catalog of alternative composition patterns for the Phase 3 co-design flow. The default composition (§1-§10) is pattern **M1**. Each pattern below is a starting point the user may amend or replace; dimensions are defaults. The retained composition is recorded in `docs/specs/03-surfaces.md` and locked in `docs/specs/04-architect.md`. The patterns are **structural**: they apply in both design-system modes (`framework` and `native`). The feedback spec (§6 toasts, §8 dialogs) applies to every pattern — in `native` mode read it as `SnackBar`/`MaterialBanner`/`AlertDialog` (`rules/native-design.md §6`).

### M1 — Bottom NavigationBar (default)

Material 3 bottom navigation — the composition proposed by default in Phase 3.

**Structure**: see §1 (AppShell, toast overlay, secondary panel) and §4 (NavigationBar tokens, destinations, state-based navigation). Not repeated here.

| Element        | Default                                                     |
| -------------- | ----------------------------------------------------------- |
| AppBar         | `appbarHeight` = 56 — §3                                     |
| NavigationBar  | `navbarHeight` = 80, 2 to 5 destinations recommended — §4     |
| body           | `IndexedStack` — one screen per destination, state preserved  |

**When to recommend**: 2-5 top-level destinations of comparable weight, reachable in one tap, flat hierarchy.

**Implementation notes**: `AppShell` = `Scaffold` + `appBar` + `body: IndexedStack` + `bottomNavigationBar: NavigationBar` (§1). A single destination → no NavigationBar. Beyond 5, the technical recommendation of §1 applies (4 destinations + a "More" screen).

**Interactions**: toasts (§6), secondary panel (§7), dialogs (§8), and gestures (§9) unchanged. A top `TabBar` (M3) may be added inside one destination.

### M2 — Navigation Drawer

Sliding side menu opened from a hamburger in the AppBar — for many sections or a rich secondary navigation.

**Structure**

```
┌─────────────────────────────────────┐
│ [≡]  APPBAR (56dp)      [ Theme ]   │
├─────────────────────────────────────┤
│                                     │
│           MAIN CONTENT              │
│         (scrollable area)           │
│                                     │
│                                     │
└─────────────────────────────────────┘
   [≡] opens →  ┌──────────────────┐
                │ DRAWER (max 360) │
                │ [ico] Section 1  │
                │ [ico] Section 2  │
                │ …                │
                └──────────────────┘
```

| Element           | Default                                                    |
| ----------------- | ----------------------------------------------------------- |
| width             | 85% screen, max 360 (same as the §7 panel)                  |
| bg                | `bgElevated`                                                |
| item              | icon `iconLg` (24) + label `weightMedium` `fontSm`, min height `touchTarget` |
| active item       | `primaryBg` background, `primary` icon + label              |
| inactive item     | `textSubtle` icon + label                                   |
| section header    | `weightSemibold` `fontSm`, `textSubtle` — for grouped items |
| overlay bg        | `text` 40% opacity (scrimColor)                             |
| animation         | slide from the left, `transitionSlow`                       |

**When to recommend**: more than 5 sections; grouped or secondary navigation (settings, about, account) that does not deserve a bottom destination; long labels.

**Implementation notes**: `Scaffold(drawer: NavigationDrawer(...))` — the leading hamburger is added automatically. **Not the same thing as the `endDrawer` of §7**: §7 is the optional *secondary panel* (filters, details) on the right; M2 is the *navigation* drawer on the left. Both can coexist (`drawer:` + `endDrawer:`). Screens stay in an `IndexedStack` driven by the `activeDestination` provider — selecting an item sets the index and closes the drawer. Android back closes the drawer first (`PopScope`, §9).

**Interactions**: toasts (§6), secondary panel (§7), dialogs (§8) unchanged. M2 can carry a bottom NavigationBar (M1) for the 3-4 main destinations while the drawer holds the rest.

### M3 — Top TabBar

`TabBar` under the AppBar — for sibling views inside one section.

**Structure**

```
┌─────────────────────────────────────┐
│           APPBAR (56dp)             │
├─────────────────────────────────────┤
│  [ Tab 1 ] [ Tab 2 ] [ Tab 3 ]      │  TABBAR (48dp)
├─────────────────────────────────────┤
│           MAIN CONTENT              │
│         (TabBarView)                │
├─────────────────────────────────────┤
│       NAVIGATIONBAR (optional)      │
└─────────────────────────────────────┘
```

| Element          | Default                                              |
| ---------------- | ------------------------------------------------------ |
| height           | 48                                                    |
| bg               | `bg` — 1 `border` bottom border, `elevation: 0`        |
| active tab       | `primary` label + 2 `primary` indicator                |
| inactive tab     | `textSubtle` label                                     |
| label            | `weightMedium` `fontSm` (14)                           |
| scrollable       | `isScrollable: true` beyond 3-4 tabs (avoids truncation) |
| swipe            | horizontal swipe between tabs (`TabBarView` default)    |

**When to recommend**: sibling views of one section (All / Active / Archived), compared or switched often; a filter dimension rather than a navigation dimension.

**Implementation notes**: `TabBar` in the AppBar's `bottom:` + `TabBarView` in the body, driven by a `TabController` (`DefaultTabController` or a `TickerProvider` in the screen). Styling centralized in `tabBarTheme` (`app_theme.dart`) — never per-screen (`@rules/theme.md`). **Combines with M1**: the tabs live *inside* one destination, they do not replace the destinations.

**Interactions**: toasts (§6) still overlay at the top of the screen, below the AppBar — they are not covered by the TabBar. Secondary panel (§7), dialogs (§8), and gestures (§9) unchanged; the swipe-between-tabs gesture coexists with the swipe-to-delete of a list item (§8) — confirm both are wanted.

### M4 — NavigationRail

Vertical Material 3 rail on the left edge — the landscape/tablet counterpart of M1.

**Structure**

```
┌──────┬──────────────────────────────┐
│ RAIL │        APPBAR (56dp)         │
│(80dp)├──────────────────────────────┤
│[ico] │                              │
│[ico] │        MAIN CONTENT          │
│[ico] │      (scrollable area)       │
│      │                              │
└──────┴──────────────────────────────┘
```

| Element           | Default                                                   |
| ----------------- | ----------------------------------------------------------- |
| width             | 80 (icons + labels), 72 icons only                          |
| bg                | `bg` — 1 `border` right border, `elevation: 0`              |
| destination       | icon `iconLg` (24) + label `weightMedium` `fontXs`          |
| active indicator  | `primaryBg` background, `primary` icon + label              |
| inactive          | `textSubtle` icon + label                                   |
| label behavior    | `NavigationRailLabelType.all` (labels always visible)       |
| leading           | optional — main action (FAB-like) at the top of the rail    |

**When to recommend**: landscape orientation or tablet (Phase 1 Q5 = landscape allowed); a wide screen where a bottom bar wastes vertical space. Same 2-5 destination range as M1.

**Implementation notes**: `Row(children: [NavigationRail(...), Expanded(child: body)])` inside the `Scaffold` body. **Adaptive variant of M1**: the same `activeDestination` provider drives both — switch on `MediaQuery.of(context).orientation` / width in `AppShell` and render `NavigationRail` in landscape, `NavigationBar` in portrait, with a single destinations list. The `IndexedStack` and the screens are unchanged.

**Interactions**: toasts (§6), secondary panel (§7), dialogs (§8) unchanged. Portrait-only apps (§2 default orientation) rarely need M4 — check the Phase 1 orientation choice before recommending it.
