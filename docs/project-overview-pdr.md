# Project Overview PDR

## Overview
Build a personal todo app with React + Node + Express. The product supports Google OAuth, RBAC, day-based todo management, two todo views, dashboards, admin user management, and SMTP email reminders.

## Goals
- Let authenticated users manage personal todos by calendar day.
- Provide list view and fanned playing-card view.
- Give users simple stats for todo completion and upcoming reminders.
- Give admins full guarded user CRUD and app statistics.
- Send minute-level email reminders through SMTP/Nodemailer.

## MVP Roles
| Role | Access |
|---|---|
| Guest | Login page only |
| User | Own todos, own dashboard, own reminder settings |
| Admin | User features plus admin dashboard and guarded user CRUD |

## Confirmed Decisions
- Frontend: React + Vite + TypeScript.
- Backend: Node.js + Express + TypeScript.
- Database: PostgreSQL only for local and production.
- ORM: Prisma.
- Auth: Google OAuth with database-backed HttpOnly SameSite cookie sessions.
- Email: SMTP/Nodemailer.
- Reminder timing: one-minute cron cadence.
- UI style: modern tech, dark background, subtle cyan/violet neon.
- Stitch AI: optional design input, not a blocking dependency.

## Agent Model Mapping
| Requested role/model | Runtime mapping | Fallback |
|---|---|---|
| Team lead `gpt-5.5` | Current session high-capability model | `opus` if a subagent must own leadership |
| Dev/QA/Tester `gpt-5.3` | Cheapest capable available subagent model | `sonnet`, then `haiku` for simple read-only/check tasks |

The current harness does not expose a literal `gpt-5.3` selector to the Agent tool. Implementation should use the cheapest available capable model and state the mapping in reports.

## Scope Boundary
### In Scope
- Auth/RBAC.
- Todo CRUD by selected date.
- List and fanned-card views.
- User dashboard.
- Admin stats and full guarded user CRUD.
- SMTP reminder delivery.
- Local Docker/PostgreSQL setup.
- Docs and tests.

### Out of Scope
- Payments.
- Mobile apps.
- Real-time collaboration.
- Multi-provider email abstraction.
- Drag reorder for cards unless explicitly requested later.
- Production deployment target beyond local Docker docs.

## Acceptance Criteria
- Users can sign in with Google and maintain a server-side session.
- Normal users cannot read or mutate other users' todos.
- Admins can manage users through guarded CRUD with audit logging and last-admin protection.
- Calendar date selection returns correct todos using timezone-safe boundaries.
- Soft-deleted todos are excluded from normal lists, dashboards, and reminders.
- Reminder sends are idempotent under concurrent worker attempts.
- Typecheck, tests, security review, and docs update complete.

## References
- Plan: `plans/260530-scalable-team-todo-app/plan.md`
- API contract: `app/server/API-CONTRACT.md`
