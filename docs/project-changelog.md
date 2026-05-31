# Project Changelog

## 2026-05-30

### Added
- Created planning baseline for scalable React + Node + Express todo app.
- Added project overview PDR.
- Added system architecture doc.
- Added code standards doc.
- Added development roadmap.
- Added API contract draft.
- Added environment example files for client and server.

### Implemented
- Phase 6: dashboards + admin user management.
  - Admin user CRUD endpoints guarded by `requireRole(['admin'])`.
  - Transactional admin lockout protections (block self-destructive actions; block last active admin destructive mutations).
  - Admin audit log (`AdminAuditLog`) for admin user mutations.
  - PATCH inactive guard covered in tests.
- Phase 7: email reminders.
  - SMTP/Nodemailer email sending.
  - Reminder worker via `node-cron`.
  - Claim-before-send `ReminderEvent` logic to prevent duplicate sends under concurrency.

### Quality Gates (this session)
- Passed: typecheck, lint, tests, build.
- Ran: secret scan (`npm run secret:scan` => `git diff --cached --check` + `git status --short`).
- Ran: prisma generate (`npm --workspace app/server run prisma:generate`).

### Security
- Chose database-backed HttpOnly cookie sessions for browser MVP.
- Added requirements for OAuth verified email, unique provider subject, and guarded test stub.
- Added requirements for admin audit log and last-admin protection.
- Added secret handling requirements for runtime `.env` files.

### Decisions
- Database: PostgreSQL only.
- Email: SMTP/Nodemailer.
- Reminder cadence: minute-level cron.
- Admin management: full CRUD with safety guardrails.

## Unresolved Questions
- Phase 8: real Google OAuth manual verification is still pending (requires real credentials).
