# Layout Système — v2.0 (Flutter / Android)

> Référence contraignante pour toutes les applications Flutter/Dart Android.
> Construit sur `design-system.md v1.0 (Flutter)`. Les deux fichiers sont indissociables.
> Transposition mobile validée du layout desktop : AppBar ↔ topbar, NavigationBar ↔ onglets, toasts overlay custom conservés, statusbar supprimée.

---

## 1. STRUCTURE GLOBALE

```
┌─────────────────────────────────────┐
│           APPBAR (56dp)             │
│  [ Titre ]            [ Thème ]     │
├─────────────────────────────────────┤
│                                     │
│         CONTENU PRINCIPAL           │
│         (zone scrollable)           │
│                                     │
├─────────────────────────────────────┤
│       NAVIGATIONBAR (80dp)          │
│   [ Dest 1 ] [ Dest 2 ] [ Dest 3 ]  │
└─────────────────────────────────────┘
```

Squelette imposé (`AppShell` — `lib/presentation/screens/app_shell.dart`) :

```
Scaffold
├── appBar: AppAppBar            # titre écran courant + actions + toggle thème
├── body: IndexedStack           # un écran par destination, état conservé
└── bottomNavigationBar: NavigationBar (M3) — si ≥ 2 destinations
Overlay racine : ToastOverlay    # toasts superposés, indépendants du Scaffold
```

- 1 seule destination → pas de NavigationBar (AppBar + body uniquement).
- 2 à 5 destinations → NavigationBar. Au-delà de 5 → 4 destinations + « Plus » (écran liste).

**Toast** (superposé, haut de l'écran) :

```
┌─────────────────────────────────────┐
│           APPBAR                    │
│  ┌───────────────────────────────┐  │
│  │ [icône] Message           [×] │  │
│  └───────────────────────────────┘  │
│         CONTENU PRINCIPAL           │
├─────────────────────────────────────┤
│         NAVIGATIONBAR               │
└─────────────────────────────────────┘
```

**Panneau secondaire** (optionnel — choisi en Phase 3) : `endDrawer` (latéral droit) ou `BottomSheet` modal.

---

## 2. APPLICATION

| Token / option        | Valeur                                                       |
| --------------------- | ------------------------------------------------------------ |
| orientation           | portrait uniquement (défaut) — paysage sur demande Phase 1    |
| thème au lancement    | suit le thème OS (`ThemeMode.system`) si aucune préférence    |
| thème par défaut OS   | clair                                                         |
| barre système Android | couleur `bg` du thème courant (`SystemUiOverlayStyle`)        |
| bouton retour Android | géré par `PopScope` — ferme sheet/dialog/drawer avant de quitter |
| splash                | natif Android, fond `bg` clair, logo centré (flutter_native_splash si validé Phase 1) |

---

## 3. APPBAR

| Token              | Valeur                  |
| ------------------ | ----------------------- |
| hauteur            | `appbarHeight` = 56     |
| fond clair/sombre  | `bg`                    |
| bordure bas        | 1 `border` (pas d'ombre — `elevation: 0`) |
| padding horizontal | `spacing4` = 16         |

### Zones (gauche → droite)

```
[ Titre écran courant ]   ···   [ Actions contextuelles ]  [ Thème ]
```

| Zone   | Contenu                                                        |
| ------ | --------------------------------------------------------------- |
| Gauche | Titre de l'écran actif — `weightSemibold` `fontBase`, `text`. Pas de logo (mobile). |
| Droite | 0–2 actions contextuelles (icônes `iconLg`) + sélecteur de thème |

### Sélecteur de thème

- Icône seule (fa-sun / fa-moon), `iconLg` = 24, zone tactile `touchTarget` = 48.
- `tooltip` obligatoire : "Passer en mode sombre" / "Passer en mode clair".
- Toggle instantané — `themeMode` du `MaterialApp` (provider Riverpod) — persisté via `shared_preferences`.

---

## 4. NAVIGATIONBAR (Material 3)

| Token               | Valeur                          |
| ------------------- | ------------------------------- |
| hauteur             | `navbarHeight` = 80             |
| fond                | `bg`                            |
| bordure haut        | 1 `border` — `elevation: 0`     |
| destinations        | 2 à 5 max                       |
| indicateur actif    | fond `primaryBg` (indicator), icône + label `primary` |
| destination inactive| icône + label `textSubtle`      |
| label               | `weightMedium` `fontXs`, toujours visible |
| icônes              | `iconLg` = 24, FontAwesome      |

- Navigation par état (`IndexedStack` + provider `activeDestination`) — l'état de chaque écran est conservé au changement d'onglet.
- Splash/ripple : désactivé (flat) — highlight `bgMuted`.

---

## 5. ZONE DE CONTENU PRINCIPAL

| Token             | Valeur                                  |
| ----------------- | ---------------------------------------- |
| fond              | `bg`                                     |
| padding intérieur | `spacing4` = 16 (mobile — pleine largeur) |
| scroll            | vertical — `ListView` / `SingleChildScrollView` |

### En-tête de section

```
[ Titre de la section ]
[ Sous-titre / description courte ]
```

- Titre : `weightBold` `font2xl` (24), `text`.
- Sous-titre : `weightNormal` `fontSm` (14), `textSubtle`.
- Margin bas : `spacing6` = 24 avant le contenu.
- Si le titre d'écran est déjà dans l'AppBar : pas de doublon — en-tête de section réservé aux sous-sections.

---

## 6. TOAST

Remplace intégralement `SnackBar` et bandeau inline. Aucun des deux dans les applications.
Composant : `presentation/widgets/toast_overlay.dart` + controller Riverpod `toastControllerProvider` (file d'attente).

| Token                  | Valeur                                              |
| ---------------------- | --------------------------------------------------- |
| position               | Haut de l'écran, sous la zone système (SafeArea), superposé |
| largeur                | largeur écran − 2×`spacing4`                         |
| margin haut            | `spacing4` = 16 (sous l'AppBar)                      |
| espacement entre toasts| `spacing2` = 8                                       |
| empilement             | Vertical, file d'attente, sans chevauchement         |
| animation entrée       | Glissement depuis le haut, `transitionSlow` = 250ms  |
| animation sortie       | Fondu + glissement haut, `transitionSlow` = 250ms    |
| geste                  | Swipe vers le haut = fermeture (types fermables)     |

### Durées d'affichage

| Type      | Durée      | Fermeture manuelle  |
| --------- | ---------- | ------------------- |
| `success` | 4s         | Non                 |
| `info`    | 4s         | Non                 |
| `warning` | 6s         | Oui (×)             |
| `danger`  | persistant | Oui (×) obligatoire |

### Anatomie du toast

```
┌────────────────────────────────────┐
│ [icône]  Message principal     [×] │
│          Description optionnelle   │
└────────────────────────────────────┘
```

| Token              | Valeur                                      |
| ------------------ | -------------------------------------------- |
| padding            | `spacing3` vertical, `spacing4` horizontal   |
| bordure gauche     | 4 couleur sémantique                         |
| fond               | fond sémantique (`*50`)                      |
| police message     | `weightMedium` `fontSm` (14)                 |
| police description | `weightNormal` `fontXs` (12), `textSubtle`   |
| icône              | `iconMd` = 20                                |

| Type      | Fond        | Bordure      | Icône (FontAwesome)        |
| --------- | ----------- | ------------ | -------------------------- |
| `success` | `success50` | `success600` | `circleCheck`              |
| `warning` | `warning50` | `warning600` | `triangleExclamation`      |
| `danger`  | `danger50`  | `danger600`  | `circleExclamation`        |
| `info`    | `info50`    | `info600`    | `circleInfo`               |

Note mode sombre : fonds `*50` clairs conservés (toast = surface claire contrastée) — texte du toast en `LightColors.text`.

---

## 7. PANNEAU SECONDAIRE

Choisi en Phase 3 : `endDrawer` ou `BottomSheet`. Ouvert par action explicite uniquement. Jamais automatiquement.

### endDrawer (latéral droit)

| Token          | Valeur                                       |
| -------------- | --------------------------------------------- |
| largeur        | 85% écran, max 360                            |
| animation      | glissement depuis la droite, `transitionSlow` |
| fond           | `bgElevated`                                  |
| bordure gauche | 1 `border`                                    |
| padding        | `spacing6` = 24                               |
| overlay fond   | `text` opacité 40% (scrimColor)               |

- Fermeture : tap overlay, bouton retour Android, ou bouton × dans le drawer.
- En-tête : titre `weightSemibold` `fontLg` (18) + bouton × aligné à droite.
- Contenu scrollable verticalement si dépassement.

### BottomSheet modal

| Token        | Valeur                                  |
| ------------ | ---------------------------------------- |
| largeur      | pleine largeur                           |
| hauteur      | contenu, max 90% écran                   |
| animation    | glissement depuis le bas, `transitionSlow` |
| fond         | `bgElevated` — `radius` 0 (flat)          |
| bordure haut | 1 `border`                                |
| padding      | `spacing6` = 24 + SafeArea bas            |
| overlay fond | `text` opacité 40%                        |

- Fermeture : tap overlay, bouton retour, swipe bas, ou bouton ×.
- En-tête identique au drawer. Contenu scrollable (`DraggableScrollableSheet` si long).

---

## 8. COMPOSANTS RÉCURRENTS

### Liste de données (pendant du tableau desktop)

Sur mobile, le `QTableView` devient une liste verticale d'items structurés (`ListView.separated`).

- Item : pleine largeur, padding vertical `spacing2` (8) + horizontal `spacing4`, hauteur min `touchTarget`.
- Structure item : ligne principale `weightMedium` `fontSm` `text` + ligne secondaire `fontXs` `textSubtle` + valeur/action à droite.
- Séparateur : 1 `borderSubtle`.
- En-tête de groupe (si groupement) : fond `bgSubtle`, `weightSemibold` `fontSm`, `textSubtle`, bordure bas 2 `borderStrong`.
- Item sélectionné : fond `primaryBg`. Pressed : `bgMuted`.
- Alternance de lignes : désactivée (flat design).
- **Listes longues : chargement paresseux natif (`ListView.builder`) + pagination par lots de 50 au scroll** (remplace la pagination à boutons desktop). Indicateur de chargement en pied de liste.
- Actions par item : swipe (`Dismissible`) pour suppression avec confirmation, ou menu contextuel — choisi en Phase 3.

### Formulaire de saisie

- Labels au-dessus des champs, `weightMedium` `fontSm`, `text`.
- Champs : pleine largeur, hauteur dynamique (contentPadding vertical `spacing2`), bordure 1 `border`, focus 2 `primary` — centralisé dans `inputDecorationTheme`.
- Espacement entre champs : `spacing4` = 16.
- Champ en erreur : bordure 2 `danger600` + message `danger600` sous le champ, `fontXs` — via `errorText`.
- Actions formulaire : alignées à droite — Annuler (secondaire) + Valider (primaire) ; sur écran de saisie plein : Valider en bas pleine largeur.
- Clavier : `textInputAction` cohérent (next/done), `keyboardType` adapté, scroll automatique vers le champ focusé.

### Arborescence

- Indentation par niveau : `spacing4` = 16.
- Icône expand/collapse : chevron FontAwesome, `iconSm` = 16, `textMuted`.
- Item : padding vertical `spacing1` (4), hauteur tactile min `touchTarget`.
- Item sélectionné : fond `primaryBg`.

### Graphiques / Visualisation

- Fond transparent (hérite du contenu).
- Palette : `chartPrimary`, `chartSuccess`, `chartWarning`, `chartDanger`, `chartInfo`.
- Légende : `weightNormal` `fontSm`, `textSubtle`. Aucune ombre.
- Bibliothèque (fl_chart…) : à valider en Phase 1 (aucune par défaut).

### Éditeur riche — flutter_quill (si activé en Phase 1)

- `QuillSimpleToolbar` : fond `bgSubtle`, bordure bas 1 `border`, icônes `iconMd` `iconDefault`, bouton actif fond `primaryBg` icône `primary`.
- `QuillEditor` : padding `spacing4`, styles de texte mappés sur les tokens typographiques.
- Contenu persisté en Delta JSON (colonne TEXT SQLite).
- Barre d'outils limitée aux contrôles requis par les fonctionnalités validées — pas la barre complète par défaut.

### Dialog (modale)

```
┌─────────────────────────────────────┐
│  Titre du dialog                [×] │
├─────────────────────────────────────┤
│  Contenu (formulaire, texte…)       │
├─────────────────────────────────────┤
│              [ Annuler ] [ Valider ]│
└─────────────────────────────────────┘
```

Composant `AppDialog` (`showDialog` + widget custom) — jamais `AlertDialog` brut.

| Token        | Valeur                          |
| ------------ | -------------------------------- |
| largeur      | largeur écran − 2×`spacing6`     |
| fond         | `bg` — `radius` 0, `elevation` 0 |
| bordure      | 1 `border`                       |
| padding      | `spacing6` = 24                  |
| overlay fond | `text` opacité 40% (barrierColor)|

- Ouvert par action explicite uniquement.
- Fermeture : ×, Annuler, bouton retour Android, tap overlay.
- En-tête : titre `weightSemibold` `fontLg` + × à droite, bordure bas 1 `borderSubtle`.
- Pied : Annuler (secondaire) + Valider (primaire) à droite, bordure haut 1 `borderSubtle`.
- Confirmations destructives : ce dialog, bouton Valider en variante danger.

---

## 9. GESTES & NAVIGATION SYSTÈME

| Geste / bouton          | Action                                                    |
| ----------------------- | ---------------------------------------------------------- |
| Retour Android          | Ferme dans l'ordre : dialog → sheet/drawer → écran poussé → app (`PopScope`) |
| Swipe haut sur toast    | Fermeture (types fermables)                                |
| Swipe sur item de liste | Suppression avec confirmation (si activé Phase 3)          |
| Tap destination navbar  | Change d'écran, état conservé                              |
| Pull-to-refresh         | `RefreshIndicator` sur les listes de données (couleur `primary`) |

---

## 10. PRÉFÉRENCES PERSISTÉES

`shared_preferences` — accédées uniquement via `data/repositories/preferences_repository.dart`, exposées par provider.

| Préférence            | Valeur par défaut |
| --------------------- | ----------------- |
| thème                 | système OS        |
| dernière destination  | première          |
| locale (si i18n)      | fr                |

---

## 11. RÉFÉRENCE CROISÉE DESIGN SYSTEM

Ce fichier ne redéfinit pas les tokens — il les consomme. Toute valeur visuelle est tracée vers `design-system.md v1.0 (Flutter)`.

| Besoin                     | Token                                        |
| -------------------------- | -------------------------------------------- |
| Fond principal             | `bg`                                         |
| Fond zones secondaires     | `bgSubtle`                                   |
| Fond drawer / sheet        | `bgElevated`                                 |
| Texte principal            | `text`                                       |
| Texte secondaire           | `textSubtle`                                 |
| Bordures                   | `border` / `borderSubtle` / `borderStrong`   |
| Couleur active / sélection | `primary` / `primaryBg`                      |
| Surface tactile minimale   | `touchTarget` = 48                           |
| Transitions panels         | `transitionSlow` = 250ms                     |
| Transitions états          | `transitionDefault` = 150ms                  |
| Forme                      | `radius` = 0 (flat design)                   |
| Ombres                     | `elevation` = 0 (flat design)                |
