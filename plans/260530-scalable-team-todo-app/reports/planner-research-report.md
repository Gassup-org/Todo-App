---
type: report
title: Todo App Planner Research Report
date: 2026-05-30
source: planner-agent
---

# Todo App Planner Research Report

## Summary
- Repo has only top-level `README.md` scaffold description; `app/**` and `docs/**` not present yet.
- Use monorepo shape from README: `app/client`, `app/server`, shared Docker compose.
- Keep stack simple: React + Vite + TypeScript, Node + Express + TypeScript, PostgreSQL + Prisma, Passport Google OAuth, database-backed HttpOnly cookie sessions, Nodemailer SMTP email.
- Stitch AI is design input only: generate/export HTML + `DESIGN.md`, then convert to React components manually.

## Findings
| Area | Recommendation | Why |
|---|---|---|
| Frontend | React + Vite + TS, React Router, TanStack Query, Tailwind | Fast, maintainable, Stitch-friendly |
| Backend | Express + TS layered by routes/controllers/services/repositories | Matches README and stays simple |
| DB | PostgreSQL + Prisma | Clear schema, migrations, indexes |
| Auth | Google OAuth + database-backed HttpOnly cookie sessions | Required by user, safer browser RBAC MVP |
| Jobs | `node-cron` first | Todo app scale, avoids premature queue infra |
| Email | Nodemailer with provider env | Swappable provider, simple local dev |
| Tests | Vitest/RTL, Supertest, Playwright | Covers unit/integration/e2e |

## Required setup notes
- User must provide Google OAuth client ID/secret.
- User must provide SMTP credentials for Nodemailer.
- For Stitch: add `STITCH_API_KEY` to local Claude env; optional MCP in `~/.claude/.mcp.json`.
- If current agent runtime cannot select `gpt-5.3`, use cheapest available equivalent for non-lead agents and keep lead in current high-capability model.

## Validation Decisions
1. Database: PostgreSQL only.
2. Email provider: SMTP/Nodemailer.
3. Reminder timing: minute-level sends.
4. Admin management: full CRUD with audit log and last-admin/self-lockout protection.

## Unresolved Questions
None.
