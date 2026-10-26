# Theme rules - tokens, ThemeData, dark mode

> **Mode.** This file describes `designSystem: framework` (Phase 1 default). If `designSystem: native` was chosen, follow `@rules/native-design.md` instead: `app_theme.dart` = `ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor, brightness: …))` for light + dark, `tokens.dart` keeps `AppTokens` (spacing/sizes/durations) + a single `seedColor`, no `AppColors` `ThemeExtension` (so no `AppColors.light` / `AppColors.dark`); colors are read from `Theme.of(context).colorScheme`, never `context.colors`. The rules below (token color extension, `context.colors`, flat overrides) do not apply in native mode; `AppTokens` and the accessibility rules (`design-system.md §12`) stay shared.

## Files

| File                                     | Role |
| ---------------------------------------- | ---- |
| `lib/presentation/theme/tokens.dart`     | `AppTokens` (typography, spacing, sizes, shape, borders, opacity, motion) + the `AppColors` `ThemeExtension` with its two constants `AppColors.light` and `AppColors.dark` |
| `lib/presentation/theme/app_text_theme.dart` | `AppTextTheme.build(AppColors)`: fills the Material `TextTheme` slots from the typographic tokens (`design-system.md §1`) |
| `lib/presentation/theme/button_styles.dart`  | `AppButtonStyles`: `WidgetStateProperty` styles for the filled (Primary, Danger) and Secondary variants (`design-system.md §9`) |
| `lib/presentation/theme/app_theme.dart`  | `AppTheme.light` / `AppTheme.dark`: one `_build(AppColors, Brightness)` returning a complete `ThemeData` that carries the `AppColors` extension |

## Absolute rules

1. **Zero hardcoded visual value in widgets**: zero `Color(0xFF…)`, zero literal size/duration, zero local `TextStyle` not derived from the theme. Every value comes from `AppTokens` or `context.colors`. The only literal color allowed is `Colors.transparent`.
2. **Every recurring style is centralized in `app_theme.dart`**: `appBarTheme`, `navigationBarTheme`, `tabBarTheme`, `cardTheme`, `dialogTheme`, `bottomSheetTheme`, `drawerTheme`, `filledButtonTheme`, `outlinedButtonTheme`, `textButtonTheme`, `inputDecorationTheme`, `textSelectionTheme`, `dividerTheme`, `textTheme`. Widgets compose, they do not style. Use the `*ThemeData` types (`CardThemeData`, `DialogThemeData`, `TabBarThemeData`): the old `CardTheme`, `DialogTheme`, `TabBarTheme` names are deprecated.
3. **Dark mode = complete `AppTheme.dark`** built from `AppColors.dark`, toggled via `themeMode` on `MaterialApp` (`themeModeControllerProvider`, persisted). The switch is instant (`themeAnimationDuration: Duration.zero`, `AppColors.lerp` snaps). Zero `Theme.of(context).brightness ==` in screens, zero local conditional color.
4. **Every value in `app_theme.dart` carries a comment** indicating the source design-system token.
5. **Depth by stroke and surface ladder** (`design-system.md §2, §5`): `elevation: 0` everywhere, `surfaceTintColor: Colors.transparent`, zero `BoxShadow`, zero gradient; `borderRadius` only via the token (`BorderRadius.circular(AppTokens.radius)` = 5, nested `AppTokens.radiusNested` = 3), never a literal radius. Chrome (AppBar, TabBar, NavigationBar, NavigationRail) is on `bgSubtle`, panels and cards on `bgPanel`, floating layers (dialog, sheet, drawer, menu) on `bgElevated` with a `borderStrong` side; the canvas stays on `bg`. `splashFactory: NoSplash.splashFactory`, `bgMuted` pressed highlight.
6. **Structure of `tokens.dart`**: `AppTokens` first, as `abstract final class` with commented groups in this order: typography (+ line-height) · spacing · fixed sizes · shape / border widths / opacity · motion (`easeOut`, `transitionDefault`, `transitionSlow`). Then the `AppColors` `ThemeExtension` (`final class`): the themed neutrals and semantics as fields (`bg`, `bgSubtle`, `bgMuted`, `bgElevated`, `bgPanel`, `text*`, `border*`, `primary`, `primaryBg`, `success/warning/danger 50 and 600`, `dangerFill`, `onPrimary`, `onDanger`), the mode-agnostic accent stops as `static const` (`primary50/400/600/700/800/900`, `danger700/800`), the aliases as getters (`info50`, `info600`, `icon*`, `selectionBg`, `cursorColor`, no independent hex), then `AppColors.light`, `AppColors.dark`, `copyWith`, `lerp`. Plus `extension AppColorsContext on BuildContext { AppColors get colors }`.
7. **States use `WidgetStateProperty`** (never the old `MaterialStateProperty`), never a `Color` computed in `build`. Opacity goes through `Color.withValues(alpha:)` (never `withOpacity`); disabled = `opacityDisabled` on fill and content, scrim = `text.withValues(alpha: opacityOverlay)`.
8. **Focus ring drawn inside the control** (`design-system.md §7`): `ButtonStyle` has no outline offset, so the ring is the control's own `BorderSide` of width `borderWidthEmphasis` when `WidgetState.focused`; color `primary`, except `text` on Primary and Danger buttons (`primary` on `primary600` would be 1:1). Text fields show the ring on any focus (`focusedBorder`). Never remove it.
9. **Pointer hover** (mouse, ChromeOS): transparent 1-width border to `borderStrong`; a bordered control (`borderStrong`) to `textSubtle`; Primary and Danger hover = `primary700` / `danger700`, pressed = `primary800` / `danger800`. Touch has no hover state: the `bgMuted` pressed highlight stays the primary feedback.
10. **Reduced motion**: honor `MediaQuery.disableAnimationsOf(context)` - shorten/skip `transitionDefault`/`transitionSlow` when true (Android "Remove animations"), and build the `TabController` with `animationDuration: Duration.zero` so the TabBar indicator snaps.
11. **Text selection**: `selectionBg` / `cursorColor` set once in `textSelectionTheme` (`app_theme.dart`), never per-field.
12. **Layers import downward only**: `presentation` reads `application` through providers, `application` reads `data` through repositories, `presentation` never imports `data`. `presentation/theme` imports nothing from the other layers.

## Color access in widgets

```dart
// tokens.dart
final class AppColors extends ThemeExtension<AppColors> { /* all themed color tokens, light and dark constants */ }
extension AppColorsContext on BuildContext {
  AppColors get colors => Theme.of(this).extension<AppColors>()!;
}

// widget - token: textSubtle
Text(label, style: TextStyle(color: context.colors.textSubtle));
```

Only tolerated exception: values computed at runtime that cannot be tokens (e.g. a gesture position), justified with a comment. Reference implementation of `AppColors`, `AppTokens`, `AppTextTheme`, `AppButtonStyles` and `AppTheme`: `design-system.md §2, §9, §11`.

## Per-project palette

In Phase 1 the project picks a **palette** (named or custom): the accent is mandatory (→ `primary600` after the AA darkening), the four other roles are optional overrides (main background → `bg`, secondary background → `bgSubtle`, text → `text`, details → `border`). Claude derives everything else (`design-system.md §2`): the accent stops (`primary600` darkened in steps of 1 % lightness until white text, `primary` on `bg` and `primary` on `primary50` all reach 4.5:1; `primary700` / `primary800` = `primary600` minus 3 and 6 points of lightness), `onPrimary`, the **accent-tinted neutrals** and surface ladder for both themes (`bgPanel` included), and the **per-project semantic colors** (hue anchors harmonized ±6° toward the accent; info = accent; `dangerFill`), then writes the resolved `Color(0xFF…)` into `tokens.dart`: neutrals and semantics in **both** `AppColors.light` and `AppColors.dark`, the accent in the `static const` `primary*` stops (the derived `primary`/`primaryBg` reference them and stay unchanged). Explicit overrides win over the tinted targets. The default palette is what the global `design-system.md` documents; a custom palette replaces these values in `tokens.dart` only, `design-system.md` stays unchanged. The `icon*` tokens are aliases of the derived tokens: nothing to derive for them. The `flutter_launcher_icons` adaptive background (`@rules/config.md`) follows the light `bg`.

## Android system bar

`SystemUiOverlayStyle` aligned with the current theme (`bgSubtle` background, the chrome color; dark icons in light / light icons in dark), defined in `app_theme.dart` (`appBarTheme.systemOverlayStyle`), nowhere else. Edge-to-edge insets are respected on Android 15 and later.

## Anti-patterns - what NOT to do

- **Do not** write `Color(0xFF…)`, `Colors.red`, a literal hex, or `const TextStyle(fontSize: 14)` inside a widget. Route every color/size through `context.colors` / `AppTokens`.
- **Do not** branch on `Theme.of(context).brightness` or an `isDark` boolean inside a screen to pick a color. The two `ThemeData` already resolve light/dark: read the token.
- **Do not** declare a local `ButtonStyle`, `BoxDecoration`, or `InputDecoration` in a screen when a centralized theme entry exists. Add/extend the theme in `app_theme.dart` instead.
- **Do not** add `elevation`, a `BoxShadow`, a gradient, or a literal `borderRadius` "just here": the radius always reads the token (`AppTokens.radius`, nested 3); depth is stroke-based globally.
- **Do not** put an AppBar, TabBar or NavigationBar on `bg`: chrome is `bgSubtle`; a dialog, sheet or drawer is `bgElevated` with a `borderStrong` side.
- **Do not** copy a token value (e.g. `16`) as a magic number: reference the token (`AppTokens.spacing4`).
- **Do not** keep a `Theme.of(context)` result and then override one of its properties with a local constant; that silently breaks theming.
- **Do not** use `MaterialStateProperty`, `withOpacity`, `CardTheme`, `DialogTheme` or `TabBarTheme` (renamed or deprecated: `WidgetStateProperty`, `withValues(alpha:)`, `CardThemeData`, `DialogThemeData`, `TabBarThemeData`).
- **Do not** use a `primary` focus ring on a Primary or Danger button (1:1 against the fill): it is `text`.
- **Do not** signal a selected or status state by color alone: 2 `primary` leading bar (list, tree, drawer item), indicator stroke (NavigationBar, NavigationRail), tab underline, `Semantics(selected: true)`; status color paired with a word or an icon shape.
- **Do not** clamp `textScaler` to a fixed value: layouts reflow, navigation labels wrap and are never ellipsized.

## Integrity verification

Detailed in `@rules/verification.md`. Key points (framework mode): zero hardcoded visual value in widgets (the only literal color is `Colors.transparent`): every color through `context.colors`, every size/duration/text style through `AppTokens` / the theme; recurring styles centralized in `app_theme.dart` (no local `ButtonStyle`/`BoxDecoration`/`InputDecoration` in a screen, TabBar indicator themed once in `tabBarTheme`); dark mode = complete `AppTheme.dark` from `AppColors.dark` (no `brightness ==` / `isDark` branch in a screen); stroke-based depth held (`elevation: 0`, `surfaceTintColor` transparent, radius only via `AppTokens.radius`, no `BoxShadow`, no gradient, chrome on `bgSubtle`, floating layers on `bgElevated` + `borderStrong`); states through `WidgetStateProperty` and `withValues(alpha:)`; focus ring drawn inside the control (`text` on filled buttons), never removed; no selected or status state carried by color alone; reduced motion through `MediaQuery.disableAnimationsOf`; `tokens.dart` laid out as documented. Native mode: `@rules/native-design.md §8`.
