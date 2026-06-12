# Règles thème — tokens, ThemeData, mode sombre

## Fichiers

| Fichier                                  | Rôle                                                       |
| ---------------------------------------- | ----------------------------------------------------------- |
| `lib/presentation/theme/tokens.dart`     | Tous les tokens : `AppTokens` (dimensions, typo, durées) + `LightColors`/`DarkColors` (couleurs) |
| `lib/presentation/theme/app_theme.dart`  | `AppTheme.light` / `AppTheme.dark` (ThemeData complets) + `ThemeExtension AppColors` + extension `context.colors` |

## Règles absolues

1. **Zéro valeur visuelle en dur dans les widgets** — zéro `Color(0xFF…)`, zéro taille/durée littérale, zéro `TextStyle` local non dérivé du thème. Toute valeur vient de `AppTokens` ou `context.colors`.
2. **Tout style récurrent est centralisé dans `app_theme.dart`** : `appBarTheme`, `navigationBarTheme`, `filledButtonTheme`, `outlinedButtonTheme`, `textButtonTheme`, `inputDecorationTheme`, `dialogTheme`, `dividerTheme`, `textTheme`. Les widgets composent, ils ne stylent pas.
3. **Mode sombre = `AppTheme.dark` complet** construit depuis `DarkColors`, basculé via `themeMode` sur `MaterialApp` (provider `themeControllerProvider`, persisté). Zéro `Theme.of(context).brightness ==` dans les écrans, zéro couleur conditionnelle locale.
4. **Chaque valeur de `app_theme.dart` porte un commentaire** indiquant le token source du design system.
5. **Flat design** : `elevation: 0` partout, `borderRadius: BorderRadius.zero`, `splashFactory: NoSplash.splashFactory`, highlight `bgMuted`, zéro `BoxShadow`.
6. **Structure de `tokens.dart`** : sections commentées dans cet ordre — TYPOGRAPHIE · COULEURS CLAIR · COULEURS SOMBRE · PRIMAIRE (projet : [couleur Phase 1]) · SÉMANTIQUES · ICÔNES · ESPACEMENTS · TAILLES FIXES · TRANSITIONS.

## Accès aux couleurs dans les widgets

```dart
// app_theme.dart
class AppColors extends ThemeExtension<AppColors> { /* tous les tokens couleur */ }
extension AppColorsX on BuildContext {
  AppColors get colors => Theme.of(this).extension<AppColors>()!;
}

// widget — token : textSubtle
Text(label, style: TextStyle(color: context.colors.textSubtle));
```

Exception unique tolérée : valeurs calculées à l'exécution impossibles en tokens (ex. position d'un geste) — à justifier en commentaire.

## Couleur primaire par projet

Si une couleur ≠ Slate Blue est choisie en Phase 1 : seules les 4 valeurs `primary50/400/600/900` changent dans `tokens.dart` du projet. Le `design-system.md` global reste inchangé.

## Barre système Android

`SystemUiOverlayStyle` aligné sur le thème courant (fond `bg`, icônes sombres en clair / claires en sombre) — défini dans `app_theme.dart` (`appBarTheme.systemOverlayStyle`), nulle part ailleurs.
