# System Architecture

## Overview
The app uses a simple monorepo layout: React client in `app/client`, Express API in `app/server`, and PostgreSQL via Docker compose. Keep modules small and layered.

## High-Level Flow
```text
Browser React app
  -> /api/v1 HTTP requests with HttpOnly session cookie
Express API
  -> auth/RBAC middleware
  -> controllers
  -> services
  -> repositories
  -> Prisma/PostgreSQL
Cron reminder worker
  -> ReminderEvent claim-before-send
  -> SMTP/Nodemailer
```

## Backend Layers
| Layer | Responsibility |
|---|---|
| Routes | URL mapping and middleware ordering |
| Controllers | Parse inputs, call services, shape responses |
| Services | Business rules, auth decisions, orchestration |
| Repositories | Prisma queries and data invariants |
| DB | PostgreSQL schema, constraints, migrations |

Repositories must stay thin. Do not add generic repository abstractions without real reuse.

## Auth Architecture
- Google OAuth creates/updates `User` by verified provider identity.
- `Session` stores hashed opaque session tokens.
- Browser receives only an HttpOnly SameSite cookie.
- `require-auth` loads user from session.
- `requireRole(['admin'])` gates admin endpoints.
- Test OAuth stub is allowed only under `NODE_ENV=test`; server must fail startup if enabled elsewhere.

## Admin Management Architecture
- Admin endpoints are under `/api/v1/admin/*` and require `requireRole(['admin'])`.
- Admin user mutations are transactional and audit-logged.
- Transactional lockout protections:
  - block self deactivation/demotion/delete
  - block last-active-admin destructive mutations
  - serialize concurrent admin mutations with DB row locks (`SELECT ... FOR UPDATE`)
- Audit log: `AdminAuditLog` stores actor, target, action, old/new values, reason.
- Admin guardrails are enforced in service layer before mutation:
  - block self deactivation/demotion/delete
  - block destructive mutation on the last active admin (count checked under locks)

## Data Model
| Entity | Key fields |
|---|---|
| User | id, googleSub, email, emailVerified, name, avatarUrl, role, timezone, status, deletedAt |
| Session | id, userId, tokenHash, expiresAt, revokedAt, userAgent, ipAddress |
| Todo | id, userId, title, description, status, priority, dueAt, reminderAt, deletedAt |
| ReminderEvent | id, todoId, userId, reminderAt, status, attempts, lastError, sentAt |
| AdminAuditLog | id, actorUserId, targetUserId, action, oldValues, newValues, reason, createdAt |

## Data Invariants
- User ownership is always derived from authenticated session, never request body.
- Normal todo reads filter `deletedAt IS NULL`.
- Dashboard stats exclude soft-deleted todos by default.
- Reminder worker only scans active, non-deleted todos and skips inactive/deleted users.
- Admin destructive actions preserve last-admin protection.

## Reminder Architecture
- One-minute cron cadence via `node-cron`.
- SMTP/Nodemailer sends email.
- Worker claims a reminder in DB before sending (claim-before-send):
  - create `ReminderEvent` in `sending` inside a DB transaction, unique key `(todoId, reminderAt)`
  - on unique conflict, transition `pending/failed -> sending` only if `attempts < max`
  - after commit: send email, then mark `sent` or `failed`
- Worker is guarded by REMINDERS_ENABLED; multiple workers are safe (claims are atomic) but avoid running more than one unless intended.

## UI Architecture
- `todos-page` owns selected date and view mode.
- `todo-list-view` is default reliable view.
- `todo-fanned-card-view` adds visual card-spread presentation.
- `app-shell` owns navigation and route layout.
- Dark-neon design tokens live in CSS/Tailwind config.

## Security Notes
- No runtime `.env` files committed.
- CORS origin from env.
- Cookies secure in production.
- Admin endpoints return no session tokens, OAuth tokens, or provider secrets.

## References
- `docs/project-overview-pdr.md`
- `docs/code-standards.md`
- `app/server/API-CONTRACT.md`

## Unresolved Questions
- Validate real Google OAuth end-to-end with real credentials (cookie/session + callback) before marking Phase 8 complete.
