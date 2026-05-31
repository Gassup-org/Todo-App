---
title: Scalable Team Todo App
description: >-
  Plan React + Node + Express todo app with RBAC, Google OAuth, calendar todos,
  modern dark neon UI, dashboards, and email reminders.
status: in-progress
priority: P2
branch: with-kit
tags:
  - todo-app
  - react
  - node
  - express
  - rbac
  - oauth
  - stitch
blockedBy: []
blocks: []
created: '2026-05-30T14:11:45.627Z'
createdBy: 'ck:plan'
source: skill
---

# Scalable Team Todo App

## Overview
Build a maintainable personal todo app in the repo's intended `app/client` + `app/server` structure. Use React + Node + Express with TypeScript, PostgreSQL, Google OAuth, database-backed HttpOnly cookie sessions, RBAC (`guest`, `user`, `admin`), calendar day filtering, two todo views, dashboards, and idempotent email reminders.

## Team Strategy
| Role | Model intent | Ownership |
|---|---|---|
| Team lead | current/high-capability model (`gpt-5.5` if available) | architecture, decisions, phase gates |
| Fullstack devs | cheapest capable model (`gpt-5.3` if available, otherwise mapped fallback) | separate backend/frontend feature globs |
| QA/QC | cheapest capable model | acceptance checks, UX/a11y, edge cases |
| Tester | cheapest capable model | unit/integration/e2e tests only |
| Code reviewer | high confidence review agent | final security and quality review |

Phase 1 must write the actual model mapping table before spawning a team.

## Phases
| Phase | Name | Status | Dependency |
|---|---|---|---|
| 1 | [Discovery and Contracts](./phase-01-discovery-and-contracts.md) | Completed | Completed |
| 2 | [Project Scaffold and Tooling](./phase-02-project-scaffold-and-tooling.md) | Completed | Completed |
| 3 | [Auth RBAC and Google OAuth](./phase-03-auth-rbac-and-google-oauth.md) | Completed | Completed |
| 4 | [Todo Calendar and CRUD](./phase-04-todo-calendar-and-crud.md) | Completed | Completed |
| 5 | [Modern Stitch UI and Views](./phase-05-modern-stitch-ui-and-views.md) | Completed | Completed |
| 6 | [Dashboards and Admin Management](./phase-06-dashboards-and-admin-management.md) | Completed | Completed |
| 7 | [Email Reminder Notifications](./phase-07-email-reminder-notifications.md) | Completed | 4,6 |
| 8 | [Quality Security Docs and Release](./phase-08-quality-security-docs-and-release.md) | In Progress | 3-7 |

## Hard Gates
- Phase 1 contract must define endpoint schemas, error envelope, pagination, timestamp/timezone format, RBAC matrix, env contract, model mapping, and docs bootstrap exception.
- Phase 2 must protect secrets in `.gitignore` before any real `.env` is created.
- Phase 3 must use one auth strategy: database-backed sessions in HttpOnly SameSite cookies for browser MVP.
- Phase 5 cannot block on Stitch/MCP; local dark-neon UI is the fallback.
- Phase 7 must use atomic claim-before-send reminder delivery.
- Phase 8 must include migration rollback/restore rehearsal.

## Dependencies
- Existing plans are unrelated to this app plan; no cross-plan dependency.
- External setup needed: Google OAuth credentials, email provider credentials, optional Stitch API key.

## Key Files
Main targets: `app/client/**`, `app/server/**`, `app/docker-compose.yaml`, `.env.example`, `.gitignore`, `docs/**`, and optional `plans/260530-scalable-team-todo-app/assets/designs/**`.

## Success Criteria
- Authenticated users manage only their own todos.
- Admin dashboard manages users and sees aggregate stats.
- Calendar day selection works with timezone-safe date boundaries.
- Todo list supports vertical list and fanned playing-card style view.
- Email reminders are idempotent under concurrent worker attempts and logged.
- Tests, lint, typecheck, build, secret scan, prisma generate, docs updates complete.
- Manual-only gates (OAuth real login, migration rollback rehearsal, deploy) are explicitly tracked.

## Red Team Review

### Session — 2026-05-30
**Findings:** 15 adjudicated (12 accepted, 3 rejected)
**Severity breakdown:** 4 Critical, 8 High, 3 Medium

| # | Finding | Severity | Disposition | Applied To |
|---|---|---|---|---|
| 1 | Runtime `.env` secret leakage path | Critical | Accept | Completed |
| 2 | Auth/session strategy unresolved | Critical | Accept | Completed |
| 3 | OAuth stub and account linking unsafe | Critical | Accept | Completed |
| 4 | Reminder idempotency lacks locking | Critical | Accept | Completed |
| 5 | API contract too vague for parallel team | High | Accept | Completed |
| 6 | Soft-delete invariant missing | High | Accept | In Progress |
| 7 | Reminder admin visibility dependency hole | High | Accept | Plan, Phase 7 |
| 8 | Stitch/MCP global state blocks MVP | High | Accept | Phase 5 |
| 9 | Migration rollback missing | High | Accept | Phase 8 |
| 10 | Docs baseline deferred too late | Medium | Accept | Phase 1, 8 |
| 11 | Model mapping has no deliverable | Medium | Accept | Plan, Phase 1 |
| 12 | Heavy E2E before contract freeze | Medium | Accept | Phase 8 |
| 13 | Repo already has scaffolded app files | High | Reject | Actual `app/**` glob empty; README is intended tree |
| 14 | Repository layer is always over-engineered | Medium | Reject | README prescribes repositories; keep thin instead of deleting |
| 15 | Reminder feature should be cut entirely | High | Reject | User requested email reminders; scope tightened instead |

### Whole-Plan Consistency Sweep
- Files reread: `plan.md`, `phase-01-discovery-and-contracts.md`, `phase-02-project-scaffold-and-tooling.md`, `phase-03-auth-rbac-and-google-oauth.md`, `phase-04-todo-calendar-and-crud.md`, `phase-05-modern-stitch-ui-and-views.md`, `phase-06-dashboards-and-admin-management.md`, `phase-07-email-reminder-notifications.md`, `phase-08-quality-security-docs-and-release.md`.
- Decision deltas checked: session auth replaces JWT/refresh-token design; Phase 7 dependency changed to `4,6`; Stitch made optional; strict contract gate added; secret/migration/docs gates added.
- Reconciled stale references: plan overview, hard gates, Phase 1 contract, Phase 2 secret gate, Phase 3 auth design, Phase 4 soft-delete invariant, Phase 5 Stitch fallback, Phase 6 reminder failure visibility, Phase 7 dependency and claim-before-send flow, Phase 8 release gates.
- Unresolved contradictions: 0.

## Validation Log

### Session 1 — 2026-05-30
**Trigger:** User chose `/ck:plan validate` after red-team updates.
**Questions asked:** 4

#### Questions & Answers

1. **[Architecture]** Để tiếp tục validate plan hồi nãy: email reminder dùng provider nào cho MVP?
   - Options: SMTP/Nodemailer (Recommended) | Resend API | SendGrid API | Defer email
   - **Answer:** SMTP/Nodemailer (Recommended)
   - **Rationale:** Fixes provider choice for Phase 7 and keeps local testing simple.
2. **[Scope]** Admin user management MVP nên gồm gì?
   - Options: View + role edit (Recommended) | View-only | Full CRUD
   - **Answer:** Full CRUD
   - **Rationale:** Expands admin management scope; requires guardrails, audit log, and tests.
3. **[Architecture]** Database nên dùng hướng nào?
   - Options: PostgreSQL only (Recommended) | SQLite local + Postgres prod
   - **Answer:** PostgreSQL only (Recommended)
   - **Rationale:** Avoids local/prod DB behavior drift and supports sessions/reminder concurrency.
4. **[Assumptions]** Reminder timing MVP cần chính xác mức nào?
   - Options: Minute-level (Recommended) | Daily digest | Hourly batch
   - **Answer:** Minute-level (Recommended)
   - **Rationale:** Confirms cron cadence and reminder acceptance target.

#### Confirmed Decisions
- Email provider: SMTP/Nodemailer for MVP.
- Admin management: full CRUD, with safety guardrails.
- Database: PostgreSQL only across local/prod.
- Reminder timing: minute-level cron.

#### Impact on Phases
- Phase 1: contract must include full admin CRUD endpoints.
- Phase 2: PostgreSQL-only tooling stays confirmed.
- Phase 6: admin user management expands from view/role edit to full CRUD with guardrails + audit log.
- Phase 7: provider fixed to SMTP/Nodemailer and cron cadence fixed to one minute.
- Phase 8: tests/security/docs must cover admin CRUD, SMTP flow, PostgreSQL migrations, and minute-level reminders.

### Whole-Plan Consistency Sweep
- Files reread: `plan.md`, all `phase-*.md` files after red-team updates.
- Decision deltas checked: SMTP/Nodemailer; full admin CRUD; PostgreSQL only; minute-level reminders.
- Reconciled stale references: Phase 6 admin scope, Phase 7 provider/cadence, Phase 8 quality gates, plan unresolved questions.
- Unresolved contradictions: 0.

## Unresolved Questions
- Phase 8: run real Google OAuth login flow with real credentials and confirm callback/session cookie behavior.
