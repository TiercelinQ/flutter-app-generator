---
name: phase5-developpement
description: Phase 5 du cycle de génération d'application Flutter/Android — développement et livraison par lots, fichiers écrits directement sur le disque, vérifications d'intégrité, README final et instructions de build APK.
---

# /phase5-developpement — Développement par lots

## Règles de code

Appliquer intégralement : `rules/architecture.md` · `rules/theme.md` · `rules/errors.md` · `rules/config.md` · `design-system.md` · `layout.md`.

Rappels critiques :
- Analyzer clean · `flutter_lints` · Dart 3 strict · DartDoc sur classes et API publiques.
- Gestion d'erreurs sur toutes les opérations critiques.
- Zéro valeur visuelle en dur dans les widgets — tout dans `tokens.dart` / `app_theme.dart`.
- SQL 100% paramétré.
- Riverpod codegen — fichiers `.g.dart` jamais livrés, commande build_runner dans les instructions.
- Aucune bibliothèque non validée en Phase 1.

## Livraison

- Créer les dossiers et écrire les fichiers **directement sur le disque** — aucune action manuelle requise. Projet initialisé par `flutter create` si absent (ou structure `lib/` écrite dans un projet existant).
- Annonce : `📦 Lot N/[total] — [contenu]`
- Enchaînement automatique entre les lots sans confirmation.
- Découpage des lots : tableaux de `rules/architecture.md` (3 lots Petit / 4 lots Moyen-Grand, figé en Phase 1).

## Vérification d'intégrité

Silencieuse — signalée uniquement si écart. Liste complète : `rules/architecture.md §Vérification d'intégrité`. Les vérifications cross-fichiers (providers, schéma SQLite, clés i18n, contrat) s'exécutent au dernier lot.

## Dernier lot — livrables supplémentaires obligatoires

- Instructions complètes :
  ```
  flutter pub get
  dart run build_runner build --delete-conflicting-outputs
  dart run flutter_launcher_icons        # si icône fournie
  flutter run                            # dev
  flutter build apk --release            # APK sideload
  ```
  + procédure d'installation sans PC et signature release (`rules/config.md §Build`).
- `README.md` écrit automatiquement à la racine du projet : objectif, stack, arborescence, providers, schéma DB, conventions, build/installation.

## Ajustements post-livraison

Correction isolée sur le fichier concerné + dépendances directes. Livraison du fichier complet corrigé.
Après résolution d'anomalie : bilan de nettoyage (`rules/architecture.md`) puis proposer `Veux-tu mémoriser ce point ? /memoriser`.

## Phase 6 — Finalisation (à la demande explicite uniquement)

Retouches thème · optimisations (const, rebuilds) · conformité `layout.md` · conformité `design-system.md`.
