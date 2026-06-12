# Design System — v1.0 (Flutter / Android)

> Référence contraignante pour toutes les applications Flutter/Dart Android.
> Indissociable de `layout.md`.
> Tous les tokens sont des constantes Dart déclarées dans `lib/presentation/theme/tokens.dart`, consommées exclusivement par `app_theme.dart` et les widgets via le thème.
> Unités : dimensions en **dp** (valeur logique Flutter), polices en **sp** (suivent le réglage système).

---

## 1. TYPOGRAPHIE

| Token            | Valeur | Usage                          |
| ---------------- | ------ | ------------------------------ |
| `fontFamily`     | Roboto (police système Android — défaut Flutter) | Toutes les applications |
| `fontXs`         | 12     | Labels secondaires, légendes   |
| `fontSm`         | 14     | Labels, sous-titres, corps     |
| `fontBase`       | 16     | Texte principal, navigation    |
| `fontLg`         | 18     | Titres de section secondaires  |
| `font2xl`        | 24     | Titres de section principaux   |
| `weightNormal`   | `FontWeight.w400` | Corps, descriptions |
| `weightMedium`   | `FontWeight.w500` | Labels, items navigation |
| `weightSemibold` | `FontWeight.w600` | Titres, en-têtes    |
| `weightBold`     | `FontWeight.w700` | Titres principaux   |

---

## 2. COULEURS

Déclaration : deux classes de tokens — `LightColors` et `DarkColors` — implémentant une même interface `AppColors`, injectées dans `ThemeData` via une `ThemeExtension`.

### Mode clair (`LightColors`)

| Token          | Valeur  | Usage                          |
| -------------- | ------- | ------------------------------ |
| `bg`           | #FFFFFF | Fond principal, AppBar         |
| `bgSubtle`     | #F9FAFB | Zones secondaires              |
| `bgMuted`      | #F3F4F6 | Hover/pressed, alternance      |
| `bgElevated`   | #FFFFFF | Drawer, bottom sheet, dialogs  |
| `text`         | #111827 | Texte principal                |
| `textSubtle`   | #6B7280 | Texte secondaire, sous-titres  |
| `textMuted`    | #9CA3AF | Texte désactivé                |
| `border`       | #E5E7EB | Bordures standard              |
| `borderSubtle` | #F3F4F6 | Séparateurs discrets           |
| `borderStrong` | #D1D5DB | En-têtes de liste/tableau      |

### Mode sombre (`DarkColors`)

| Token          | Valeur  | Usage                          |
| -------------- | ------- | ------------------------------ |
| `bg`           | #111827 | Fond principal, AppBar         |
| `bgSubtle`     | #1F2937 | Zones secondaires              |
| `bgMuted`      | #1F2937 | Hover/pressed                  |
| `bgElevated`   | #374151 | Drawer, bottom sheet, dialogs  |
| `text`         | #F9FAFB | Texte principal                |
| `textSubtle`   | #9CA3AF | Texte secondaire               |
| `textMuted`    | #6B7280 | Texte désactivé                |
| `border`       | #374151 | Bordures standard              |
| `borderSubtle` | #1F2937 | Séparateurs discrets           |
| `borderStrong` | #4B5563 | En-têtes de liste/tableau      |

### Couleur primaire — Slate Blue

| Token        | Clair   | Sombre  |
| ------------ | ------- | ------- |
| `primary50`  | #EEF2FF | —       |
| `primary400` | —       | #818CF8 |
| `primary600` | #4F46E5 | —       |
| `primary900` | —       | #312E81 |

Tokens d'usage dérivés, définis par thème — ce sont eux que les composants consomment :

| Token       | Clair        | Sombre       |
| ----------- | ------------ | ------------ |
| `primary`   | `primary600` | `primary400` |
| `primaryBg` | `primary50`  | `primary900` |

> Modification : remplacer les 4 valeurs `primary*` dans `tokens.dart` suffit à changer la couleur primaire sur toute l'application.

### Couleurs sémantiques

| Token        | Clair   | Sombre  | Usage                  |
| ------------ | ------- | ------- | ---------------------- |
| `success50`  | #F0FDF4 | —       | Fond toast succès      |
| `success600` | #16A34A | #4ADE80 | Bordure, icône succès  |
| `warning50`  | #FFFBEB | —       | Fond toast warning     |
| `warning600` | #D97706 | #FCD34D | Bordure, icône warning |
| `danger50`   | #FFF1F2 | —       | Fond toast danger      |
| `danger600`  | #DC2626 | #F87171 | Bordure, icône danger  |
| `info50`     | #EFF6FF | —       | Fond toast info        |
| `info600`    | #2563EB | #60A5FA | Bordure, icône info    |

### Palette graphiques / visualisation

| Token          | Valeur       |
| -------------- | ------------ |
| `chartPrimary` | `primary`    |
| `chartSuccess` | `success600` |
| `chartWarning` | `warning600` |
| `chartDanger`  | `danger600`  |
| `chartInfo`    | `info600`    |

---

## 3. ESPACEMENTS

| Token      | Valeur | Usage                     |
| ---------- | ------ | ------------------------- |
| `spacing1` | 4      | Micro-espacement          |
| `spacing2` | 8      | Padding interne compact   |
| `spacing3` | 12     | Padding standard          |
| `spacing4` | 16     | Espacement entre éléments, padding écran |
| `spacing6` | 24     | Séparations de sections   |
| `spacing8` | 32     | Séparations majeures      |

---

## 4. TAILLES COMPOSANTS

### Tailles fixes (ancrages visuels globaux)

| Token           | Valeur | Usage                                  |
| --------------- | ------ | -------------------------------------- |
| `appbarHeight`  | 56     | Hauteur AppBar                         |
| `navbarHeight`  | 80     | Hauteur NavigationBar (Material 3)     |
| `iconSm`        | 16     | Icône petite                           |
| `iconMd`        | 20     | Icône standard                         |
| `iconLg`        | 24     | Icône navigation / AppBar              |
| `touchTarget`   | 48     | Surface tactile minimale (accessibilité Android) |

### Tailles dynamiques — principe général

**Règle** : aucun composant n'a de hauteur ou largeur fixe sauf exception documentée ci-dessus. Les dimensions résultent du contenu + padding. Toute zone tactile respecte `touchTarget` ≥ 48dp.

| Composant            | Largeur                              | Hauteur                    | Exception                                     |
| -------------------- | ------------------------------------ | -------------------------- | --------------------------------------------- |
| Bouton               | contenu + padding horizontal         | contenu + padding vertical | groupe aligné : uniformisée sur le plus large |
| Champ de saisie      | étire dans son conteneur (pleine largeur) | contenu + padding vertical | —                                        |
| Item de liste        | pleine largeur                       | contenu + padding vertical (min `touchTarget`) | —             |
| Destination navbar   | répartie également                   | `navbarHeight`             | —                                             |
| Label                | contenu, wrap si contrainte          | contenu                    | —                                             |
| Menu déroulant       | item le plus long                    | contenu                    | —                                             |
| Dialog               | largeur écran − 2×`spacing6`         | contenu                    | —                                             |
| Toast                | largeur écran − 2×`spacing4`         | contenu multi-ligne        | —                                             |
| Bottom sheet         | pleine largeur                       | contenu, max 90% écran     | —                                             |

---

## 5. FORME & OMBRES

| Token       | Valeur                       |
| ----------- | ---------------------------- |
| `radius`    | 0 — flat design strict       |
| `elevation` | 0 — flat design strict       |

`BoxShadow` interdit. `elevation: 0` sur AppBar, NavigationBar, Card, Dialog, BottomSheet (surcharges dans `app_theme.dart`).

---

## 6. TRANSITIONS

| Token               | Valeur                                        | Usage                          |
| ------------------- | --------------------------------------------- | ------------------------------ |
| `transitionDefault` | `Duration(milliseconds: 150)` + `Curves.ease` | États pressed, focus           |
| `transitionSlow`    | `Duration(milliseconds: 250)` + `Curves.ease` | Panels, drawer, sheets, toasts |

---

## 7. FOCUS

| Token       | Valeur                                   |
| ----------- | ---------------------------------------- |
| `focusRing` | bordure 2 `primary`, offset 2 (navigation clavier/TV — secondaire sur mobile tactile) |

Sur mobile, le retour principal est l'état pressed (`bgMuted`) — le focus ring s'applique aux champs de saisie (`focusedBorder`).

---

## 8. ÉTATS DES COMPOSANTS INTERACTIFS

Applicable à tous les boutons, destinations, items cliquables :

| État                   | Règle                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `default`              | Style de base défini par le composant                              |
| `pressed` (≈ hover)    | Fond `bgMuted` — splash/highlight désactivés au profit d'un highlight plat (`splashFactory: NoSplash`) |
| `active` / sélectionné | Fond `primaryBg`, contenu `primary`                                |
| `disabled`             | Opacité 40%, non interactif                                        |
| champ focusé           | Bordure 2 `primary`                                                |

---

## 9. BOUTONS

| Variante   | Widget de base   | Fond          | Texte        | Bordure        |
| ---------- | ---------------- | ------------- | ------------ | -------------- |
| Primaire   | `FilledButton`   | `primary`     | #FFFFFF      | aucune         |
| Secondaire | `OutlinedButton` | transparent   | `text`       | 1 `border`     |
| Danger     | `FilledButton`   | `danger600`   | #FFFFFF      | aucune         |
| Ghost      | `TextButton`     | transparent   | `textSubtle` | aucune         |

Styles centralisés dans `app_theme.dart` (`filledButtonTheme`, `outlinedButtonTheme`, `textButtonTheme`) — variantes danger/ghost via constructeurs nommés d'un widget `AppButton` consommant les tokens. Zéro `ButtonStyle` local dans les écrans.

**Dimensionnement dynamique** — la taille résulte du contenu + padding (hauteur tactile min `touchTarget`) :

| Taille        | Padding vertical | Padding horizontal | Police                     |
| ------------- | ---------------- | ------------------ | -------------------------- |
| `sm`          | `spacing1` (4)   | `spacing3` (12)    | `weightMedium` `fontXs`    |
| `md` (défaut) | `spacing2` (8)   | `spacing4` (16)    | `weightMedium` `fontSm`    |
| `lg`          | `spacing3` (12)  | `spacing6` (24)    | `weightMedium` `fontBase`  |

**Groupe de boutons alignés** : largeur uniformisée sur le bouton le plus large (`IntrinsicWidth` + `CrossAxisAlignment.stretch`).

---

## 10. ICÔNES — font_awesome_flutter

Bibliothèque : `font_awesome_flutter` (Font Awesome Free, embarquée localement).

**Règle** : couleurs et tailles d'icônes passent par les tokens — jamais de `Color(0xFF…)` ni de taille littérale dans les widgets.

| Token         | Clair                    | Sombre   |
| ------------- | ------------------------ | -------- |
| `iconDefault` | #6B7280 (`textSubtle`)   | #9CA3AF  |
| `iconActive`  | #4F46E5 (`primary`)      | #818CF8  |
| `iconDanger`  | #DC2626 (`danger600`)    | #F87171  |
| `iconSuccess` | #16A34A (`success600`)   | #4ADE80  |
| `iconMuted`   | #9CA3AF (`textMuted`)    | #6B7280  |

```dart
// Utilisation dans un widget
FaIcon(
  FontAwesomeIcons.house,
  size: AppTokens.iconMd,
  color: context.colors.iconDefault, // extension sur BuildContext → ThemeExtension
)
```

**Changement de thème** : les couleurs viennent de la `ThemeExtension` — le rebuild de `MaterialApp` au changement de `themeMode` met tout à jour automatiquement.

---

## 11. RÈGLES D'APPLICATION DU THÈME

1. **Zéro valeur visuelle en dur dans les widgets.** Toute couleur, taille, durée, style de texte vient de `tokens.dart` (via `AppTokens` et la `ThemeExtension` `AppColors`).
2. **Tout style récurrent est centralisé dans `app_theme.dart`** (ThemeData : boutons, champs, AppBar, NavigationBar, Dialog…). Les widgets ne portent que la composition.
3. **Le mode sombre est un `ThemeData` complet** (`AppTheme.dark`) construit depuis `DarkColors` — basculé par `themeMode` sur `MaterialApp`. Jamais de condition de thème dans les écrans.
4. **Chaque valeur de `app_theme.dart` est tracée vers un token** — commentaire indiquant le token source.

```dart
// app_theme.dart — token : bg / text
scaffoldBackgroundColor: colors.bg,
```
