---
name: phase4-contrat
description: Phase 4 du cycle de génération d'application Flutter/Android — contrat architectural complet (arborescence, rôle de chaque fichier, providers, schéma SQLite, tableau tokens → thème), verrouillé après validation.
---

# /phase4-contrat — Contrat architectural

Présenter :

1. **Arborescence complète** du projet (modèle : `rules/architecture.md`) avec le rôle de chaque fichier.
2. **Tableau des providers** : provider → controller → repository → écrans consommateurs.
3. **Schéma SQLite** (si DB) : tables, colonnes, types, version, migrations prévues.
4. **Tableau tokens → thème** : éléments de `app_theme.dart` et tokens consommés.

**→ Validation requise. Ce contrat est verrouillé.**

Tout écart (fusion, scission, renommage, ajout, suppression de fichier, provider, table, colonne ou bibliothèque) impose :

1. Arrêt.
2. Déclaration de l'écart + justification.
3. Validation avant reprise.

→ Enchaîner sur `/phase5-developpement` après validation.
