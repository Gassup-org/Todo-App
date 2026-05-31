---
phase: 7
title: "Email Reminder Notifications"
status: completed
priority: P2
effort: "1.25d"
dependencies: [4, 6]
---

# Phase 7: Email Reminder Notifications

## Context Links
- Todo phase: `./phase-04-todo-calendar-and-crud.md`
- Dashboard phase: `./phase-06-dashboards-and-admin-management.md`
- API contract: `app/server/API-CONTRACT.md`

## Overview
Send email reminders for todo schedules. Keep delivery idempotent and observable so users do not receive duplicates.

## Key Insights
- MVP uses in-process `node-cron` worker.
- Email provider is SMTP via Nodemailer.
- Delivery is claim-before-send (DB transaction) so concurrent workers do not duplicate email.

## Requirements
- Functional:
  - User can set reminder time on todo.
  - Scheduler sends reminder email when due with minute-level timing.
  - Reminder events are logged as `pending/sending/sent/failed`.
  - Failed sends visible via admin dashboard stats.
- Non-functional:
  - Duplicate sends prevented under concurrent worker attempts.
  - Provider credentials stay server-side.
  - Reminders can be disabled with env kill switch.

## Architecture
- `startReminderWorker()` runs cron per `REMINDERS_ENABLED`.
- `processDueReminders()` scans due todos and sends emails.
- Claim-before-send in DB:
  - create or transition `ReminderEvent` to `sending` inside transaction
  - commit claim
  - send email
  - mark `sent` or `failed`
- Retry is bounded by max attempts; claim will not re-run beyond limit.

## Related Code Files
- Created: `app/server/src/config/email.ts`
- Created: `app/server/src/services/email-service.ts`
- Created: `app/server/src/services/reminder-service.ts`
- Created: `app/server/src/services/reminder-worker.ts`
- Created: `app/server/src/repositories/reminder-event-repository.ts`
- Created: `app/server/src/templates/todo-reminder-email.ts`
- Modified: `app/server/src/db/prisma/schema.prisma`
- Modified: `app/server/src/services/todo-service.ts`
- Modified: `app/client/src/components/todo-form-modal.tsx`
- Modified: `app/client/src/pages/todos-page.tsx`
- Modified: `app/server/src/server.ts`
- Modified: `app/server/.env.example`

## Implementation Steps
1. Add email env vars and validation.
2. Extend todo form for `reminderAt`.
3. Add `ReminderEvent` model with unique `(todoId, reminderAt)` and status fields.
4. Implement SMTP/Nodemailer provider path, configured by env.
5. Implement one-minute cron worker behind `REMINDERS_ENABLED`.
6. Implement atomic claim-before-send transaction:
   - list due active todos (non-deleted)
   - create/transition event to `sending`
   - commit claim
   - send email
   - mark `sent` or `failed`
7. Add bounded retry rule: failed events can retry until max attempts.
8. Add tests for claim idempotency and non-send conditions.

## Todo List
- [x] Email env contract.
- [x] Reminder data model.
- [x] Reminder form field.
- [x] Scheduler worker.
- [x] Atomic claim-before-send flow.
- [x] Email template.
- [x] Idempotency/concurrency tests.
- [x] Failure logging tests.

## Success Criteria
- [x] Reminder email sends for due todo in test environment.
- [x] Same reminder cannot send twice under concurrent worker runs.
- [x] Soft-deleted todos never trigger reminders.
- [x] Failed sends are logged and visible for admin/debugging.
- [x] `REMINDERS_ENABLED=false` stops sending without breaking app.

## Risk Assessment
- Risk: duplicate emails damage trust.
  - Mitigation: claim-before-send transaction, unique key, and tests.
- Risk: provider outage blocks app.
  - Mitigation: catch/send failure, log, bounded retry, operator can disable sending.

## Security Considerations
- Never expose SMTP credentials to client.
- Email content should not include private data beyond todo title and due time.
- Do not log provider secrets.

## Next Steps
Phase 8 runs quality/security/docs sweep and keeps manual-only checks explicit.

## Unresolved Questions
None.
