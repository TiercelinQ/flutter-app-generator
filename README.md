# Flutter App Generator

Système de génération d'applications mobiles **Android** en **Flutter / Dart / Riverpod**, piloté par Claude Code.

Pendant mobile des générateurs python-app-generator et electron-app-generator : mêmes phases, mêmes commandes, même design system — transposé aux idiomes Android (AppBar, NavigationBar, gestes, APK).

## Caractéristiques

- **Cycle en 5 phases** : cadrage → analyse → layout → contrat architectural verrouillé → développement par lots
- **Architecture en couches strictes** : `data` (models, repositories SQLite) · `application` (Notifiers Riverpod) · `presentation` (widgets)
- **Design system contraignant** : tokens Dart light/dark, flat design, Font Awesome, toasts overlay custom
- **Riverpod 2 avec génération de code** (`@riverpod` + build_runner)
- **SQLite via sqflite** — SQL paramétré obligatoire · **flutter_quill** en option Phase 1
- **Continuité** : sauvegarde/reprise de session, contrat consultable, mémoire des décisions
- **Livrable** : APK release signé, installable sans PC (sideload) — AAB Play Store sur demande

## Démarrage

```bash
git clone https://github.com/[utilisateur]/flutter-app-generator.git
cd flutter-app-generator
claude
```

Puis :

```
/flutter-app
```

Documentation complète : [GUIDE.md](GUIDE.md)

## Stack des applications générées

| Élément        | Valeur                                        |
| -------------- | --------------------------------------------- |
| OS cible       | Android — minSdk 24                           |
| Framework      | Flutter stable · Dart 3                       |
| État           | Riverpod 2 (codegen)                          |
| Architecture   | data / application / presentation             |
| Thème          | tokens.dart + ThemeData clair/sombre          |
| DB (option)    | sqflite — SQL paramétré                       |
| Édition riche  | flutter_quill (option Phase 1)                |
| Icônes         | font_awesome_flutter                          |
| i18n           | gen-l10n FR/EN (ARB)                          |
| Qualité        | flutter_lints · analyzer strict               |
