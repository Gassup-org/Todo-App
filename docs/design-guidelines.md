# Design Guidelines

## Overview
Design direction: tech, modern, dark background, subtle neon accents. Prioritize clarity over visual gimmicks.

## Visual Style
- Background: near-black navy/graphite.
- Accents: cyan and violet neon glow used sparingly.
- Surfaces: glass-like panels with low-opacity borders.
- Typography: clean sans-serif, strong hierarchy.
- Motion: subtle transitions; respect reduced-motion settings.

## Main Screens
- Login page with Google OAuth CTA.
- Todo calendar/day page.
- Traditional vertical list view.
- Fanned-card view inspired by playing cards spread in hand.
- User dashboard.
- Admin dashboard and user management.

## Accessibility
- Maintain sufficient contrast.
- Every interactive control needs label/accessible name.
- Keyboard navigation required for view toggle, todo actions, date picker, forms.
- Fanned-card view must have readable fallback and reduced-motion support.

## Stitch AI Usage
- Stitch is optional, not blocking.
- Save generated artifacts under `plans/260530-scalable-team-todo-app/assets/designs/`.
- Never expose STITCH_API_KEY to client code (server-side env only; see `app/server/.env.example`).
- Apply only useful deltas from Stitch; local design tokens are source of truth.

## Unresolved Questions
None.
