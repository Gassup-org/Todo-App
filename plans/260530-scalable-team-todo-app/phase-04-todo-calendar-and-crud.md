---
phase: 4
title: Todo Calendar and CRUD
status: completed
priority: P1
effort: 1.5d
dependencies:
  - 3
---

# Phase 4: Todo Calendar and CRUD

## Context Links
- Auth phase: `./phase-03-auth-rbac-and-google-oauth.md`
- API contract: `app/server/API-CONTRACT.md`
- Research report: `./reports/planner-research-report.md`

## Overview
Implement core todo value: select a date, create/update/delete todos for that day, and keep data private per user.

## Key Insights
- Store times in UTC; compute day windows using user's timezone.
- Use soft delete to reduce data loss risk and support future audit/history.
- Red-team accepted: every normal read/list/dashboard/reminder query must exclude soft-deleted todos.
- Keep CRUD service thin and test ownership rules thoroughly.

## Requirements
- Functional:
  - User selects calendar date.
  - User creates, reads, updates, completes, deletes todos for selected day.
  - User cannot access another user's todo by ID.
  - Todos support reminder time for later phase.
- Non-functional:
  - Query by day is indexed.
  - Date behavior is deterministic in tests.
  - Contract conformance tests cover response and error shapes.

## Architecture
- `todo-routes` maps REST endpoints from `API-CONTRACT.md`.
- `todo-controller` validates request and response DTO.
- `todo-service` handles ownership and date boundaries.
- `todo-repository` handles Prisma queries and central `deletedAt IS NULL` filter.
- Client uses TanStack Query hooks keyed by selected date and timezone.

## Related Code Files
- Create: `app/server/src/routes/todo-routes.ts`
- Create: `app/server/src/controllers/todo-controller.ts`
- Create: `app/server/src/services/todo-service.ts`
- Create: `app/server/src/repositories/todo-repository.ts`
- Create: `app/server/src/validators/todo-validator.ts`
- Create: `app/server/src/utils/day-boundary-utils.ts`
- Create: `app/client/src/pages/todos-page.tsx`
- Create: `app/client/src/components/calendar-day-picker.tsx`
- Create: `app/client/src/components/todo-form-modal.tsx`
- Create: `app/client/src/utils/todo-query-hooks.ts`
- Create: `app/client/src/utils/date-timezone-utils.ts`
- Modify: `app/server/src/db/prisma/schema.prisma`
- Modify: `app/client/src/app.tsx`

## Implementation Steps
1. Add `Todo` model with `userId`, `title`, `description`, `status`, `priority`, `dueAt`, `reminderAt`, `deletedAt`.
2. Add indexes for `userId + dueAt`, `userId + status`, and active reminder lookup.
3. Implement REST endpoints exactly from `API-CONTRACT.md`:
   - `GET /api/v1/todos?date=YYYY-MM-DD`
   - `POST /api/v1/todos`
   - `PATCH /api/v1/todos/:id`
   - `DELETE /api/v1/todos/:id`
4. Implement timezone-safe date boundary utility.
5. Implement repository invariant: all default todo reads filter `deletedAt: null`; only admin audit paths may opt out explicitly.
6. Build calendar day picker and todo form.
7. Wire query hooks and invalidate-on-success after mutations.
8. Add tests for CRUD, IDOR, timezone boundaries, contract shape, and soft-delete exclusion.

## Todo List
- [ ] Prisma todo model and migration.
- [ ] CRUD API with validation.
- [ ] User ownership enforcement.
- [ ] Soft-delete invariant enforced.
- [ ] Calendar day picker.
- [ ] Todo form and day list data flow.
- [ ] Integration and component tests.

## Success Criteria
- [ ] Authenticated user can CRUD todos for selected day.
- [ ] Another user's todo cannot be read or changed.
- [ ] Soft-deleted todos never appear in normal lists/stats/reminder scans.
- [ ] Day filtering works across at least two timezone cases.
- [ ] Todo API matches contract examples.

## Risk Assessment
- Risk: timezone bugs cause wrong daily list.
  - Mitigation: central date utility and explicit tests.
- Risk: deleted data leaks into stats/reminders.
  - Mitigation: repository-level default filter and integration tests.
- Risk: optimistic UI hides failed writes.
  - Mitigation: simple invalidate-on-success first; optimize later.

## Security Considerations
- Validate title/description length.
- Escape displayed text by using React default rendering.
- Never accept `userId` from client body.
- Return 404 for unauthorized todo ID access to reduce IDOR signal.

## Next Steps
Phase 5 creates polished UI for list and fanned-card views.

## Unresolved Questions
- Todo priority/status enum values: use `low|normal|high` and `active|completed` by default.
