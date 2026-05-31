---
phase: 5
title: Modern Stitch UI and Views
status: completed
priority: P2
effort: 1.25d
dependencies:
  - 2
  - 4
---

# Phase 5: Modern Stitch UI and Views

## Context Links
- Stitch skill: `.claude/skills/stitch/SKILL.md`
- Design assets folder: `./assets/designs/`
- Todo CRUD phase: `./phase-04-todo-calendar-and-crud.md`

## Overview
Create tech/modern dark UI with subtle neon. Stitch AI is optional design input; local implementation must still complete if Stitch API/MCP is unavailable.

## Key Insights
- Stitch exports HTML/Tailwind and `DESIGN.md`, not React.
- Stitch output is static and non-responsive; implementation must add responsiveness and interactions.
- Fanned-card todo view is the visual signature; keep list view as reliable default.
- Red-team accepted: do not make global MCP config or quota availability block MVP UI.

## Requirements
- Functional:
  - Toggle between vertical list and fanned-card view.
  - Calendar, todo form, empty states, loading states, error states.
  - Dark tech aesthetic with light neon accents.
- Non-functional:
  - Accessible contrast and keyboard navigation.
  - Mobile and desktop responsive.
  - No visual-only control without labels.
  - Local design-token fallback required.

## Architecture
- `todos-page` owns selected date and view mode.
- `todo-list-view` renders traditional vertical list.
- `todo-fanned-card-view` renders overlapping cards like a spread poker hand.
- Design tokens live in CSS/Tailwind theme.
- Optional Stitch artifacts saved under plan assets, then copied into app as implementation guidance.

## Related Code Files
- Optional create: `plans/260530-scalable-team-todo-app/assets/designs/DESIGN.md`
- Optional create: `plans/260530-scalable-team-todo-app/assets/designs/design.html`
- Optional create: `plans/260530-scalable-team-todo-app/assets/designs/design.png`
- Create: `app/client/src/components/app-shell.tsx`
- Create: `app/client/src/components/todo-list-view.tsx`
- Create: `app/client/src/components/todo-fanned-card-view.tsx`
- Create: `app/client/src/components/view-mode-toggle.tsx`
- Create: `app/client/src/components/neon-panel.tsx`
- Create: `app/client/src/styles/design-tokens.css`
- Modify: `app/client/src/pages/todos-page.tsx`
- Modify: `app/client/src/styles/global.css`
- Modify: `app/client/tailwind.config.ts`

## Implementation Steps
1. Implement local design tokens first: dark background, cyan/violet neon accent, glass panels, accessible focus rings.
2. Build list view, fanned-card view, view toggle, and shell using local tokens.
3. Add CSS transform/rotation for fanned-card view with reduced-motion fallback.
4. Test keyboard navigation and responsive layout.
5. Optional Stitch path only if user provides `STITCH_API_KEY`:
   - Run quota check.
   - Generate prompt for dark neon todo dashboard, calendar selector, fanned playing-card view, admin analytics mood.
   - Export `DESIGN.md`, HTML, image to `./assets/designs/` inside this plan folder.
   - Apply only useful design deltas; never expose Stitch key to client.
6. Do not modify `~/.claude/.mcp.json` unless user explicitly asks for MCP setup.

## Todo List
- [ ] Local dark-neon design tokens complete.
- [ ] List view component complete.
- [ ] Fanned-card view component complete.
- [ ] View toggle preserves selected date.
- [ ] Accessibility pass complete.
- [ ] Optional Stitch artifacts created only if credentials exist.

## Success Criteria
- [ ] UI matches tech/modern/dark/neon direction without requiring Stitch.
- [ ] User can switch views without losing selected day.
- [ ] Fanned-card view has visual impact but remains readable.
- [ ] Reduced-motion users get stable card layout.
- [ ] Optional Stitch usage is documented and reproducible via saved prompt/artifacts.

## Risk Assessment
- Risk: Stitch quota/key unavailable.
  - Mitigation: local design-token path is primary.
- Risk: fanned cards hurt usability.
  - Mitigation: keep list view default; card view optional.

## Security Considerations
- Do not expose Stitch API key to app client.
- Sanitize/escape user todo content via React rendering.
- Avoid third-party design assets unless license is clear.

## Next Steps
Phase 6 adds dashboards using same design system.

## Unresolved Questions
- Should fanned-card view support drag reordering in MVP? Default: no.
