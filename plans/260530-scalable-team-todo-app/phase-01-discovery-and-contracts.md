---
phase: 1
title: Discovery and Contracts
status: completed
priority: P1
effort: 0.75d
dependencies: []
---

# Phase 1: Discovery and Contracts

## Context Links
- Repo structure: `README.md`
- Research report: `./reports/planner-research-report.md`
- Rules: `.claude/rules/development-rules.md`

## Overview
Lock MVP scope, API contracts, auth decision, docs baseline, and agent-team model mapping before coding. This prevents frontend/backend drift when multiple agents work in parallel.

## Key Insights
- Source folders are not present in the working tree yet; README is intended structure, not existing code.
- User wants agent team execution, but runtime model labels may not match `gpt-5.3` exactly.
- Keep MVP simple; defer advanced queues and heavy analytics.
- Red-team accepted: vague contracts break parallel work; contracts must be strict enough to generate tests.

## Requirements
- Functional:
  - Define roles: `guest`, `user`, `admin`.
  - Define auth, todo, dashboard, full admin CRUD, reminder endpoint contracts.
  - Define required environment variables.
  - Define agent model mapping and fallback order.
- Non-functional:
  - Contracts must include schemas, status codes, error taxonomy, pagination, nullability, timestamp/timezone format, and idempotency semantics.
  - Security rules explicit for auth, user-owned data, OAuth identity linking, and admin access.

## Architecture
- API namespace: `/api/v1`.
- Response shape:
  ```json
  { "data": {}, "error": { "code": "STRING", "message": "STRING", "details": {}, "requestId": "STRING" } }
  ```
- Pagination shape: `{ items, pageInfo: { cursor, nextCursor, hasNextPage } }` for list endpoints that can grow.
- Timestamp format: UTC ISO-8601 in storage/API; client-selected date uses `YYYY-MM-DD` plus user timezone.
- Auth decision: database-backed session table + HttpOnly SameSite cookie for browser MVP; no browser localStorage tokens.
- API contract artifact: `app/server/API-CONTRACT.md` is source of truth for Phases 3/4/6/7.

## Related Code Files
- Create: `docs/project-overview-pdr.md`
- Create: `docs/system-architecture.md`
- Create: `docs/code-standards.md`
- Create: `docs/development-roadmap.md`
- Create: `docs/project-changelog.md`
- Create: `app/server/API-CONTRACT.md`
- Create: `app/server/.env.example`
- Create: `app/client/.env.example`

## Implementation Steps
1. Confirm MVP boundary: auth, todos, views, dashboards, reminders.
2. Write endpoint contract tables for auth, todos, dashboards, reminders.
3. Write response/error envelope and error enum (`AUTH_REQUIRED`, `FORBIDDEN`, `VALIDATION_FAILED`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`).
4. Write RBAC matrix:
   - `guest`: login page only.
   - `user`: own todos + own dashboard.
   - `admin`: user management + app stats.
5. Define data model draft, unique constraints, indexes, soft-delete invariants, and reminder idempotency keys.
6. Define env contract for OAuth, sessions, database, email, CORS, reminders, Stitch.
7. Write model mapping table: requested `gpt-5.5`/`gpt-5.3` to available runtime models/fallbacks.
8. Bootstrap required docs because `docs/` is absent; after bootstrap, update existing docs only.
9. Assign non-overlapping agent ownership globs for implementation phases.

## Todo List
- [ ] Create endpoint contract table with examples.
- [ ] Create RBAC matrix.
- [ ] Create env var contract.
- [ ] Create session/auth contract.
- [ ] Create model mapping table.
- [ ] Create first-pass docs skeleton with bootstrap exception note.
- [ ] Record unresolved credentials/setup items.

## Success Criteria
- [ ] A dev can implement each endpoint without asking for response shapes.
- [ ] Contract tests can be derived from `API-CONTRACT.md`.
- [ ] RBAC behavior is testable from contract.
- [ ] Env setup is clear enough for local dev.
- [ ] Team model fallback is explicit before spawning agents.

## Risk Assessment
- Risk: unclear dashboard scope grows too large.
  - Mitigation: MVP dashboard = simple counts and recent activity.
- Risk: model preference cannot map exactly.
  - Mitigation: documented fallback order and user approval before team spawn.

## Security Considerations
- Never put secrets in plan files or committed `.env`.
- Admin endpoints must require both valid session and `admin` role.
- Todo endpoints must enforce user ownership server-side.
- OAuth must require provider-verified email and unique provider subject.

## Next Steps
Proceed to Phase 2 scaffold after contracts are accepted.

## Validation Updates
- Admin user management scope confirmed as full CRUD for MVP.
- Email provider confirmed as SMTP/Nodemailer.
- Database confirmed as PostgreSQL only.
- Reminder timing confirmed as minute-level cron.

## Unresolved Questions
None.
