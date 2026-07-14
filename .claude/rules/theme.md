# Theme rules — tokens, ThemeData, dark mode

> **Mode.** This file describes `designSystem: framework` (Phase 1 default). If `designSystem: native` was chosen, follow `@rules/native-design.md` instead: `app_theme.dart` = `ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor, brightness: …))` for light + dark, `tokens.dart` keeps `AppTokens` (spacing/sizes/durations) + a single `seedColor`, no `LightColors`/`DarkColors`, no `AppColors` `ThemeExtension`; colors are read from `Theme.of(context).colorScheme`, never `context.colors`. The rules below (token color classes, `context.colors`, flat overrides) do not apply in native mode.

## Files

| File                                     | Role                                                       |
| ---------------------------------------- | ----------------------------------------------------------- |
| `lib/presentation/theme/tokens.dart`     | All tokens: `AppTokens` (dimensions, typography, durations) + `LightColors`/`DarkColors` (colors) |
| `lib/presentation/theme/app_theme.dart`  | `AppTheme.light` / `AppTheme.dark` (complete ThemeData) + `AppColors ThemeExtension` + `context.colors` extension |

## Absolute rules

1. **Zero hardcoded visual value in widgets** — zero `Color(0xFF…)`, zero literal size/duration, zero local `TextStyle` not derived from the theme. Every value comes from `AppTokens` or `context.colors`.
2. **Every recurring style is centralized in `app_theme.dart`**: `appBarTheme`, `navigationBarTheme`, `filledButtonTheme`, `outlinedButtonTheme`, `textButtonTheme`, `inputDecorationTheme`, `dialogTheme`, `dividerTheme`, `textTheme`. Widgets compose, they do not style.
3. **Dark mode = complete `AppTheme.dark`** built from `DarkColors`, toggled via `themeMode` on `MaterialApp` (`themeControllerProvider`, persisted). Zero `Theme.of(context).brightness ==` in screens, zero local conditional color.
4. **Every value in `app_theme.dart` carries a comment** indicating the source design-system token.
5. **Flat design**: `elevation: 0` everywhere, `borderRadius: BorderRadius.zero`, `splashFactory: NoSplash.splashFactory`, `bgMuted` highlight, zero `BoxShadow`.
6. **Structure of `tokens.dart`**: commented sections in this order — TYPOGRAPHY (+ line-height) · LIGHT COLORS (palette neutrals) · DARK COLORS (palette neutrals, derived) · PRIMARY (project palette accent) — 50/400/600/700/800/900 + derived · SEMANTIC (fixed, incl. danger700/800) · ICONS (fixed) · SPACING · FIXED SIZES · SHAPE / BORDER-WIDTH / OPACITY · TRANSITIONS · SELECTION / ON-PRIMARY / ON-DANGER.
7. **Reduced motion**: honor `MediaQuery.of(context).disableAnimations` — shorten/skip `transitionDefault`/`transitionSlow` when true (Android "Remove animations" a11y setting).
8. **Text selection**: `selectionBg` / `cursorColor` set once in `textSelectionTheme` (`app_theme.dart`), never per-field.

## Color access in widgets

```dart
// app_theme.dart
class AppColors extends ThemeExtension<AppColors> { /* all color tokens */ }
extension AppColorsX on BuildContext {
  AppColors get colors => Theme.of(this).extension<AppColors>()!;
}

// widget — token: textSubtle
Text(label, style: TextStyle(color: context.colors.textSubtle));
```

Only tolerated exception: values computed at runtime that cannot be tokens (e.g. a gesture position) — to be justified with a comment.

## Per-project palette

In Phase 1 the project picks a **palette** (named or custom) = 5 light roles: fond principal → `bg`, fond secondaire → `bgSubtle`, accent → `primary600`, texte → `text`, détails → `border`. Claude derives the supporting neutrals, the 6 accent stops, `onPrimary`, and the **whole dark theme** (`design-system.md §2`), then writes the resolved `Color(0xFF…)` into `tokens.dart`: the neutrals in **both** `LightColors` and `DarkColors`, the accent in the 6 `primary*` stops (the derived `primary`/`primaryBg` reference them and stay unchanged). The default palette is what the global `design-system.md` documents — a custom palette replaces these values in `tokens.dart` only; `design-system.md` stays unchanged. Semantic and icon tokens stay fixed across palettes.

## Android system bar

`SystemUiOverlayStyle` aligned with the current theme (`bg` background, dark icons in light / light icons in dark) — defined in `app_theme.dart` (`appBarTheme.systemOverlayStyle`), nowhere else.

## Anti-patterns — what NOT to do

- **Do not** write `Color(0xFF…)`, `Colors.red`, a literal hex, or `const TextStyle(fontSize: 14)` inside a widget. Route every color/size through `context.colors` / `AppTokens`.
- **Do not** branch on `Theme.of(context).brightness` or an `isDark` boolean inside a screen to pick a color. The two `ThemeData` already resolve light/dark — read the token.
- **Do not** declare a local `ButtonStyle`, `BoxDecoration`, or `InputDecoration` in a screen when a centralized theme entry exists. Add/extend the theme in `app_theme.dart` instead.
- **Do not** add `elevation`, `BoxShadow`, `borderRadius > 0`, or a gradient "just here". Flat design is global.
- **Do not** copy a token value (e.g. `16`) as a magic number — reference the token (`AppTokens.spacing4`).
- **Do not** keep a `Theme.of(context)` result and then override one of its properties with a local constant — that silently breaks theming.

## Integrity verification

Detailed in `@rules/verification.md`. Key points (framework mode): zero hardcoded visual value in widgets — every color through `context.colors`, every size/duration/text style through `AppTokens` / the theme; recurring styles centralized in `app_theme.dart` (no local `ButtonStyle`/`BoxDecoration`/`InputDecoration` in a screen); dark mode = complete `AppTheme.dark` from `DarkColors` (no `brightness ==` / `isDark` branch in a screen); flat design held (`elevation: 0`, `BorderRadius.zero`, no `BoxShadow`, no gradient); `tokens.dart` sections in the documented order. Native mode: `@rules/native-design.md §8`.
