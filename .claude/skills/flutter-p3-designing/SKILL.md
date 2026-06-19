---
name: flutter-p3-designing
description: Phase 3 of the Flutter/Android app generation cycle — layout proposal based on layout.md, grouped customization questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /flutter-p3-designing — Layout proposal

## Role
UI designer — map the validated features onto the binding layout system.

## Goal
Define the concrete screen layout (destinations, secondary panel, recurring components) within `layout.md` constraints.

## Deliverable
`docs/specs/03-designing.md` (written in the user's language) + on-screen synthesis.

---

## 1. Proposal

**Read `design-system.md` and `layout.md` first** (no longer auto-imported).

Based on the project description (`docs/specs/02-featuring.md`), propose a layout among the structures defined in `layout.md`:

1. Describe the chosen structure (NavigationBar destinations, optional secondary panel, recurring components).
2. Justify the choice against the features.
3. List the navigation destinations and their content (2 to 5 — or a single screen with no NavigationBar).

## 2. Customization — questions via `AskUserQuestion`

For each question offering a choice, mark the option you recommend with `(recommended)`, chosen from the validated feature context.

Ask in the user's language:

Layout customization:

1. Destinations: [proposal] — modify?
2. Secondary panel: endDrawer / BottomSheet / Dialog only / None?
3. [If add/edit form] Presentation: full dedicated screen / BottomSheet / Dialog?
4. Actions on list items: swipe (delete with confirmation) / context menu / visible buttons?
5. Pull-to-refresh on lists: Yes / No?

## 3. Synthesis

Produce a complete synthesis of the validated layout (shell, destinations, panel, forms, gestures, toasts, any deviations vs the `layout.md` default).

**→ Explicit validation required before Phase 4.**

## 4. Write the spec

Once validated, write the synthesis to `docs/specs/03-designing.md` (in the user's language).

→ Chain to `/flutter-p4-architect` after validation.
