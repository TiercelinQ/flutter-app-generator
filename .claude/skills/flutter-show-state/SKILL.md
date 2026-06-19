---
name: flutter-show-state
description: Show the current state of the generation project — phase, batch, next action, locked decisions, open points.
model: haiku
---

# /flutter-show-state — Current state

## Role
Status reporter.

## Goal
Give a one-glance state of the project.

## Deliverable
The status block (French).

---

Show only (in French):

```
Phase : [nom] | Lot : [X/total] | Prochain : [action attendue]
Décisions verrouillées : [liste]
Points ouverts : [liste ou "aucun"]
```

Do not append the `/flutter-save-session · /flutter-show-state · /flutter-show-contract` reminder after this reply.
