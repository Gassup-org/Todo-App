# Development Roadmap

## Overview
Roadmap for the scalable team todo app. Phase source of truth: `plans/260530-scalable-team-todo-app/plan.md`.

## Status Legend
- Pending: not started.
- In Progress: active implementation.
- Completed: implemented + checks run (typecheck/lint/test/build as applicable).

## Milestones
| Phase | Milestone | Status |
|---|---|---|
| 1 | Discovery and contracts | Completed |
| 2 | Project scaffold and tooling | Completed |
| 3 | Auth, RBAC, Google OAuth | Completed |
| 4 | Todo calendar and CRUD | Completed |
| 5 | Modern UI and views | Completed |
| 6 | Dashboards and admin management | Completed |
| 7 | Email reminder notifications | Completed |
| 8 | Quality, security, docs, release | In Progress |

## Recently Completed
- Phase 6: admin dashboards + admin user management CRUD.
  - Transactional admin lockout protections (self-lockout guard, last-active-admin guard, row locks).
  - Admin audit log on all admin user mutations.
  - PATCH inactive guard covered by tests.
- Phase 7: SMTP/Nodemailer reminder worker.
  - Claim-before-send ReminderEvent flow to prevent duplicates.

## Phase 8 Quality Gates (this session)
- Done: contract conformance check, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run secret:scan`, `npm --workspace app/server run prisma:generate`.
- Not done (manual/external): real Google OAuth login verification (real creds), security manual review, migration rollback/restore rehearsal, deploy.

## Future Ideas
- Drag reorder for fanned cards.
- Dedicated background worker process.
- Multiple email providers.
- Deployment-specific guide after target host chosen.

## Unresolved Questions
- Run real Google OAuth manual verification (Phase 8) with real credentials.
