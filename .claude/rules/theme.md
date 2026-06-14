# Theme rules — tokens, ThemeData, dark mode

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
6. **Structure of `tokens.dart`**: commented sections in this order — TYPOGRAPHY (+ line-height) · LIGHT COLORS · DARK COLORS · PRIMARY (project: [Phase 1 color]) — 50/400/600/700/800/900 + derived · SEMANTIC (incl. danger700/800) · ICONS · SPACING · FIXED SIZES · SHAPE / BORDER-WIDTH / OPACITY · TRANSITIONS · SELECTION / ON-PRIMARY.
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

## Per-project primary color

If a color ≠ Slate Blue is chosen in Phase 1: only the 6 `primary50/400/600/700/800/900` values change in the project's `tokens.dart` (the derived `primary`/`primaryBg` reference them and stay unchanged). The global `design-system.md` stays unchanged.

## Android system bar

`SystemUiOverlayStyle` aligned with the current theme (`bg` background, dark icons in light / light icons in dark) — defined in `app_theme.dart` (`appBarTheme.systemOverlayStyle`), nowhere else.

## Anti-patterns — what NOT to do

- **Do not** write `Color(0xFF…)`, `Colors.red`, a literal hex, or `const TextStyle(fontSize: 14)` inside a widget. Route every color/size through `context.colors` / `AppTokens`.
- **Do not** branch on `Theme.of(context).brightness` or an `isDark` boolean inside a screen to pick a color. The two `ThemeData` already resolve light/dark — read the token.
- **Do not** declare a local `ButtonStyle`, `BoxDecoration`, or `InputDecoration` in a screen when a centralized theme entry exists. Add/extend the theme in `app_theme.dart` instead.
- **Do not** add `elevation`, `BoxShadow`, `borderRadius > 0`, or a gradient "just here". Flat design is global.
- **Do not** copy a token value (e.g. `16`) as a magic number — reference the token (`AppTokens.spacing4`).
- **Do not** keep a `Theme.of(context)` result and then override one of its properties with a local constant — that silently breaks theming.
