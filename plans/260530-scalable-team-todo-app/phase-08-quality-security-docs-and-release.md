---
phase: 8
title: "Quality Security Docs and Release"
status: in-progress
priority: P1
effort: "1d"
dependencies: [3, 4, 5, 6, 7]
---

# Phase 8: Quality Security Docs and Release

## Context Links
- Development rules: `.claude/rules/development-rules.md`
- Documentation rules: `.claude/rules/documentation-management.md`
- All prior phases in `./plan.md`

## Overview
Validate the final app, fix issues, update docs, rehearse rollback, and prepare clean handoff. Mandatory because app includes auth, user data, and email.

## Key Insights
- Quality gates must be evidenced (command run + outcome), not assumed.
- Keep manual/external checks explicitly incomplete until done with real credentials/deploy.

## Requirements
- Functional:
  - Full test suite passes, including admin user CRUD and reminder worker logic.
  - App runs locally from documented commands.
  - Docs reflect actual implementation.
- Non-functional:
  - No type errors.
  - No secrets committed.
  - Prisma client generation works.

## Architecture
Quality gate order:
`contract check -> typecheck -> lint -> tests -> build -> secret scan -> prisma generate -> docs update -> final review`.

## Related Code Files
- Modify: `docs/deployment-guide.md`
- Modify: `docs/system-architecture.md`
- Modify: `docs/development-roadmap.md`
- Modify: `docs/project-changelog.md`
- Modify: `plans/260530-scalable-team-todo-app/plan.md`

## Implementation Steps
1. Verify all implemented routes conform to `API-CONTRACT.md`.
2. Run typecheck.
3. Run lint.
4. Run tests.
5. Run build.
6. Run secret scan.
7. Run prisma generate.
8. Update docs with actual architecture, setup, roadmap, changelog.
9. Keep manual-only items not marked done until actually performed.

## Todo List
- [x] Contract conformance passes. (server routes validated against `app/server/API-CONTRACT.md`)
- [x] Typecheck passes. (`npm run typecheck`)
- [x] Lint passes. (`npm run lint`)
- [x] Tests pass. (`npm test`)
- [x] Build passes. (`npm run build`)
- [x] Secret scan complete. (`npm run secret:scan`)
- [x] Prisma client generate complete. (`npm --workspace app/server run prisma:generate`)
- [ ] Focused E2E smoke passes. (manual; Playwright not run in this session)
- [ ] Real Google OAuth manual check complete. (requires real credentials)
- [ ] Security review complete. (manual review)
- [ ] Migration rollback/restore check complete. (manual rehearsal)
- [x] Docs updated. (this session)
- [ ] Final acceptance checklist complete.

## Success Criteria
- [ ] All tests pass without fake shortcuts.
- [ ] `README.md` has local setup and env instructions.
- [ ] Docs folder contains required project docs and matches actual code.
- [ ] Code reviewer reports no blocking findings.
- [ ] No secrets appear in git diff/history for this work.
- [ ] Migration recovery path is verified or explicitly documented as forward-only with backup restore.

## Risk Assessment
- Risk: manual checks get silently assumed.
  - Mitigation: keep manual-only gates unchecked and listed.

## Security Considerations
- Secret scan before commit/push.
- Verify `.env` ignored and only examples committed.
- Verify middleware order: auth before role checks before controller.

## Next Steps
After this phase, run `/ck:ship` or git workflow if user requests commit/push.

## Unresolved Questions
- Run real Google OAuth manual check with real credentials (prod-like cookie + callback behavior).
