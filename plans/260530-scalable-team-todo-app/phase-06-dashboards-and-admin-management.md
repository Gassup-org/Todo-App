---
phase: 6
title: Dashboards and Admin Management
status: completed
priority: P2
effort: 1d
dependencies:
  - 3
  - 4
---

# Phase 6: Dashboards and Admin Management

## Context Links
- Auth phase: `./phase-03-auth-rbac-and-google-oauth.md`
- Todo phase: `./phase-04-todo-calendar-and-crud.md`
- UI phase: `./phase-05-modern-stitch-ui-and-views.md`
- API contract: `app/server/API-CONTRACT.md`

## Overview
Add simple personal stats for users and full admin user management CRUD. Keep dashboard metrics useful, not overbuilt.

## Key Insights
- User asked dashboard stats simple.
- Admin exists because app has user accounts and management needs.
- Avoid expensive analytics tables until usage demands it.
- Dashboards exclude soft-deleted todos; reminder failures exposed for Phase 7.

## Requirements
- Functional:
  - User dashboard: completed/open todos, overdue count, upcoming reminders.
  - Admin dashboard: user count, active todo count, completion rate, reminder failures.
  - Admin user CRUD: list, create/invite placeholder user, update role/profile status, deactivate/reactivate, and soft-delete.
- Non-functional:
  - Admin queries paginated.
  - Dashboard endpoints require auth/RBAC.
  - All metrics exclude soft-deleted todos unless explicitly labeled audit/history.

## Architecture
- User dashboard endpoint reads current user's aggregate only.
- Admin dashboard endpoint uses admin RBAC and bounded queries.
- Reminder failure summary reads `ReminderEvent` rows.
- Admin user mutations are transactional, audit-logged, and lockout-safe.

## Related Code Files
- Created: `app/server/src/routes/dashboard-routes.ts`
- Created: `app/server/src/routes/admin-routes.ts`
- Created: `app/server/src/controllers/dashboard-controller.ts`
- Created: `app/server/src/controllers/admin-controller.ts`
- Created: `app/server/src/services/dashboard-service.ts`
- Created: `app/server/src/services/admin-service.ts`
- Created: `app/server/src/repositories/dashboard-repository.ts`
- Created: `app/server/src/repositories/admin-repository.ts`
- Created: `app/client/src/pages/user-dashboard-page.tsx`
- Created: `app/client/src/pages/admin-dashboard-page.tsx`
- Created: `app/client/src/components/stat-card.tsx`
- Created: `app/client/src/components/user-management-table.tsx`
- Created: `app/client/src/components/user-management-form-modal.tsx`
- Created: `app/client/src/utils/dashboard-query-hooks.ts`
- Modified: `app/server/src/app.ts`
- Modified: `app/client/src/app.tsx`

## Implementation Steps
1. Define minimal dashboard DTOs in `API-CONTRACT.md`.
2. Implement user dashboard aggregates scoped to authenticated user.
3. Implement admin dashboard aggregates gated by `requireRole(['admin'])`.
4. Implement admin user CRUD endpoints from `API-CONTRACT.md`:
   - `GET /api/v1/admin/users`
   - `POST /api/v1/admin/users`
   - `PATCH /api/v1/admin/users/:id`
   - `POST /api/v1/admin/users/:id/deactivate`
   - `POST /api/v1/admin/users/:id/reactivate`
   - `DELETE /api/v1/admin/users/:id`
5. Add audit log for all admin user mutations.
6. Add transactional admin lockout protection:
   - block self deactivation/demotion/delete
   - block last-active-admin destructive mutations
   - serialize concurrent admin mutations with DB row locks
7. Expose reminder failure count/list so Phase 7 can surface delivery problems.
8. Build dashboard pages using existing neon panels/stat cards.
9. Add tests for user scoping, admin-only access, pagination, CRUD guardrails, audit log, and soft-delete exclusions.

## Todo List
- [x] User stats endpoint.
- [x] Admin stats endpoint.
- [x] Reminder failure visibility endpoint/field.
- [x] Admin user CRUD endpoints.
- [x] User dashboard UI.
- [x] Admin dashboard UI.
- [x] RBAC, pagination, admin CRUD guardrail, audit log, and soft-delete tests.

## Success Criteria
- [x] User dashboard shows accurate personal counts.
- [x] Normal user cannot access admin routes.
- [x] Admin can view aggregate stats and manage users through guarded CRUD.
- [x] Reminder failures are visible to admin/debugging flow.
- [x] Admin queries remain bounded and paginated.

## Risk Assessment
- Risk: dashboard scope grows into analytics product.
  - Mitigation: MVP metrics only; document later ideas in roadmap.
- Risk: admin CRUD can lock out or delete critical accounts.
  - Mitigation: transactional locks + last-admin protection + self-lockout guard + audit log + soft delete.

## Security Considerations
- Admin endpoints never return secrets, session tokens, or OAuth tokens.
- User emails visible only to admins.
- Admin user mutations log actor, target, old values, new values, and reason.

## Next Steps
Phase 7 uses reminder failure visibility for observability.

## Validation Updates
- Admin user management implemented as full CRUD for MVP.
- Transactional lockout protections + audit log verified by tests.

## Unresolved Questions
None.
