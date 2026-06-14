---
name: phase3-layout
description: Phase 3 of the Flutter/Android app generation cycle — layout proposal based on layout.md, grouped customization questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /phase3-layout — Layout proposal

## Role
UI designer — map the validated features onto the binding layout system.

## Goal
Define the concrete screen layout (destinations, secondary panel, recurring components) within `layout.md` constraints.

## Deliverable
`docs/specs/03-layout.md` (written in French) + on-screen synthesis.

---

## 1. Proposal

**Read `design-system.md` and `layout.md` first** (no longer auto-imported).

Based on the project description (`docs/specs/02-analyse.md`), propose a layout among the structures defined in `layout.md`:

1. Describe the chosen structure (NavigationBar destinations, optional secondary panel, recurring components).
2. Justify the choice against the features.
3. List the navigation destinations and their content (2 to 5 — or a single screen with no NavigationBar).

## 2. Customization — questions grouped in a single block

Ask in French:

```
Personnalisation du layout :

1. Destinations : [proposition] — modifier ?
2. Panneau secondaire : endDrawer / BottomSheet / Dialog seul / Aucun ?
3. [Si formulaire d'ajout/édition] Présentation : écran dédié plein / BottomSheet / Dialog ?
4. Actions sur les items de liste : swipe (suppression avec confirmation) / menu contextuel / boutons visibles ?
5. Pull-to-refresh sur les listes : Oui / Non ?
```

## 3. Synthesis

Produce a complete synthesis of the validated layout (shell, destinations, panel, forms, gestures, toasts, any deviations vs the `layout.md` default).

**→ Explicit validation required before Phase 4.**

## 4. Write the spec

Once validated, write the synthesis to `docs/specs/03-layout.md` (in French).

→ Chain to `/phase4-contrat` after validation.
