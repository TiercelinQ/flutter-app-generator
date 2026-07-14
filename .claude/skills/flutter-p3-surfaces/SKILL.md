---
name: flutter-p3-surfaces
description: Phase 3 of the Flutter/Android app generation cycle — guided UI co-design based on the layout.md pattern catalog (navigation, content organization, forms), tailored proposal, grouped detail questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /flutter-p3-surfaces — Layout co-design

## Role
UI designer — map the validated features onto a layout co-defined with the user.

## Goal
Define the concrete screen layout (navigation, content organization, forms, secondary panel, recurring components), co-designed from the `layout.md` pattern catalog (§12), freely amendable by the user.

## Deliverable
`docs/specs/03-surfaces.md` (written in the user's language) + on-screen synthesis.

---

## 1. Analysis

**Phase banner (show first)** — before anything else, output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 3/5 — Surfaces; (2) progress line: Scoping ✓ · Features ✓ · ▶ Surfaces · Architecture · Development; (3) intent in italics: Map the validated features onto the layout. See `## PIPELINE` in `CLAUDE.md`.

**Read `layout.md` first** (no longer auto-imported), plus the design reference for the chosen mode (`docs/specs/01-scoping.md`): `design-system.md` if `designSystem: framework`, `@rules/native-design.md` if `native`. The structural defaults are shared by both modes; in native mode the feedback surface is `SnackBar`/`MaterialBanner` (not the custom toast), so do not raise toast-specific customization.

`layout.md` includes the **§12 composition pattern catalog** (M1 bottom NavigationBar — the default, M2 Navigation Drawer, M3 top TabBar, M4 NavigationRail). The catalog is **structural**: it applies in both design-system modes.

Then read the features validated in Phase 2 (`docs/specs/02-featuring.md`) and derive the signals that drive the co-design: number of top-level destinations, flat or grouped hierarchy, sibling views inside a section, dominant entities, form volume, orientation chosen in Phase 1. These signals choose the recommended option of every question below — never ask what the features already answer.

## 2. Structuring questionnaire — questions via `AskUserQuestion`

Adaptive. **Cap: 2 `AskUserQuestion` calls before the proposal** — one call is usually enough (group the open axes into a single call of ≤ 4 questions). Ask only the axes the features leave open; derive the others silently. For each question, mark the option you recommend with `(recommended)`, chosen from the validated feature context, and **justify it in one line** against the features. Ask with `AskUserQuestion` (clickable options, ≤ 4 options each, **Other** for a composition the user defines). Ask in the user's language:

1. **Main navigation** — options drawn from the `layout.md` §12 catalog, the recommended one first:
   A. Bottom NavigationBar (M1) — 2-5 destinations of comparable weight
   B. Navigation Drawer (M2) — more than 5 sections, or a rich secondary navigation
   C. Top TabBar (M3) — sibling views of one section (combines with M1)
   D. NavigationRail (M4) — landscape/tablet (check the Phase 1 orientation choice)
   **Other** — a composition the user describes.

2. **Content organization** — how the retained navigation is filled:
   A. One screen per feature
   B. Sections grouping several features
   C. Sibling views inside a destination (top TabBar, `layout.md §12` M3)
   D. Pushed screens (list → detail via `Navigator`)

3. **Forms and actions** — where creation/editing happens:
   A. Full dedicated screen
   B. Modal `BottomSheet` (`layout.md §7`)
   C. `AppDialog` (`layout.md §8`)
   And where the actions sit: on the list item · in the AppBar · at the bottom of the detail screen.

4. **Recurring components** — only if the features leave it open (data list vs cards, grouping, lazy loading beyond ~50 items). Otherwise derive them from the features without asking.

## 3. Tailored proposal

Compose the proposal from the retained pattern + the answers, adjusted to the validated features, and state explicitly that the user may amend any part of it or define a different composition. Produce (in the user's language):

## Proposed layout — [APP_NAME]

**Structure**
[Zones of the retained pattern — e.g. AppShell with AppBar + NavigationBar (M1), AppBar + Drawer (M2), AppBar + TabBar (M3), Rail + content (M4) — plus main content]

**Navigation**
| [Destination / Section / Tab] | Content |
| ----------- | ------- |
| …           | …       |

**Recurring components**
- [List / Form / Cards / Charts — depending on the features]

## 4. Detail questions — questions via `AskUserQuestion`

Conditioned on the retained pattern. Same rules as above: recommended option marked, clickable options, ≤ 4 options each, **Other** for the rest, split into ≤ 4-question calls. Ask in the user's language, showing only the questions the retained pattern and the feature context make relevant:

Layout customization:

1. Navigation items of the retained pattern: [proposal — destinations (M1/M4), drawer sections (M2), or tabs (M3)] — modify?
2. Secondary panel: endDrawer / BottomSheet / Dialog only / None? (`layout.md §7` — with M2, the navigation drawer is on the left and the secondary panel stays the right `endDrawer`; both can coexist)
3. Actions on list items: swipe (delete with confirmation) / context menu / visible buttons?
4. Pull-to-refresh on lists: Yes / No?

## 5. Synthesis

Produce the complete synthesis of the validated layout (in the user's language): the retained composition pattern (`layout.md §12` name — M1/M2/M3/M4 — or "user-defined") and the amendments made to it, shell, navigation, content organization, panel, forms, gestures, toasts.

**→ Explicit validation required before Phase 4.**

## 6. Write the spec

Once validated, write the synthesis to `docs/specs/03-surfaces.md` (in the user's language).

→ Chain to `/flutter-p4-architect` after validation.
