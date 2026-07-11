---
name: flutter-p3-surfaces
description: Phase 3 of the Flutter/Android app generation cycle — layout proposal based on layout.md, grouped customization questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /flutter-p3-surfaces — Layout proposal

## Role
UI designer — map the validated features onto the binding layout system.

## Goal
Define the concrete screen layout (destinations, secondary panel, recurring components) within `layout.md` constraints.

## Deliverable
`docs/specs/03-surfaces.md` (written in the user's language) + on-screen synthesis.

---

## 1. Proposal

**Phase banner (show first)** — before anything else, output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 3/5 — Surfaces; (2) progress line: Scoping ✓ · Features ✓ · ▶ Surfaces · Architecture · Development; (3) intent in italics: Map the validated features onto the layout. See `## PIPELINE` in `CLAUDE.md`.

**Read `layout.md` first** (no longer auto-imported), plus the design reference for the chosen mode (`docs/specs/01-scoping.md`): `design-system.md` if `designSystem: framework`, `rules/native-design.md` if `native`. The structural layout is the same in both modes; in native mode the feedback surface is `SnackBar`/`MaterialBanner` (not the custom toast), so do not raise toast-specific customization.

Based on the features validated in Phase 2 (`docs/specs/02-featuring.md`), propose a layout among the structures defined in `layout.md`, justified against the features. Produce (in the user's language):

## Proposed layout — [APP_NAME]

**Structure**
[Description: AppShell — AppBar, NavigationBar destinations (2 to 5 — or a single screen with no NavigationBar), main content]

**Destinations**
| Destination | Content |
| ----------- | ------- |
| …           | …       |

**Recurring components**
- [List / Form / Cards / Charts — depending on the features]

## 2. Customization — questions via `AskUserQuestion`

For each question, mark the option you recommend with `(recommended)`, chosen from the validated feature context. Ask with `AskUserQuestion` (clickable options, ≤ 4 options each, **Other** for the rest; split into ≤ 4-question calls). Ask in the user's language:

Layout customization:

1. Destinations: [proposal] — modify?
2. Secondary panel: endDrawer / BottomSheet / Dialog only / None?
3. [If add/edit form] Presentation: full dedicated screen / BottomSheet / Dialog?
4. Actions on list items: swipe (delete with confirmation) / context menu / visible buttons?
5. Pull-to-refresh on lists: Yes / No?

## 3. Synthesis

Produce the complete synthesis of the validated layout (in the user's language): shell, destinations, panel, forms, gestures, toasts, any deviations vs the `layout.md` default.

**→ Explicit validation required before Phase 4.**

## 4. Write the spec

Once validated, write the synthesis to `docs/specs/03-surfaces.md` (in the user's language).

→ Chain to `/flutter-p4-architect` after validation.
