---
phase: 2
title: Project Scaffold and Tooling
status: completed
priority: P1
effort: 1d
dependencies:
  - 1
---

# Phase 2: Project Scaffold and Tooling

## Context Links
- Repo structure: `README.md`
- Plan overview: `./plan.md`
- Contract: `app/server/API-CONTRACT.md`

## Overview
Create the actual React client and Express server foundation from the README's intended structure. Protect secrets before any runtime env files are created.

## Key Insights
- README defines `app/client` and `app/server`, but current source tree is absent; create the baseline without overwriting unknown files.
- Use TypeScript for maintainability while still satisfying ReactJS/NodeJS/Express stack.
- Use Docker compose for local PostgreSQL and optional mail testing.
- Validation confirmed PostgreSQL only; no SQLite local fallback.
- Red-team accepted: `.gitignore` must be fixed before OAuth/email secrets exist.

## Requirements
- Functional:
  - Client can run locally with Vite.
  - Server exposes health endpoint.
  - Database migration tooling exists.
  - Shared scripts exist for lint, test, typecheck.
  - `.env` files are ignored before credentials are used.
- Non-functional:
  - File names kebab-case.
  - Code files target <200 LOC.
  - Keep repository layer thin; no unused abstraction.
  - No fake implementation just to pass tests.

## Architecture
```text
app/
├── client/    React + Vite + TS
├── server/    Express + TS + Prisma
└── docker-compose.yaml
```
Server layers follow README: `routes -> controllers -> services -> repositories -> db`. Repositories should exist only for real data access and stay small.

## Related Code Files
- Create: `package.json`
- Create: `app/docker-compose.yaml`
- Create: `app/client/package.json`
- Create: `app/client/vite.config.ts`
- Create: `app/client/src/main.tsx`
- Create: `app/client/src/app.tsx`
- Create: `app/client/src/styles/global.css`
- Create: `app/server/package.json`
- Create: `app/server/tsconfig.json`
- Create: `app/server/src/server.ts`
- Create: `app/server/src/app.ts`
- Create: `app/server/src/config/env.ts`
- Create: `app/server/src/routes/health-routes.ts`
- Create: `app/server/src/db/prisma/schema.prisma`
- Modify: `.gitignore`
- Modify: `README.md`

## Implementation Steps
1. Update `.gitignore` first with `**/.env`, `**/.env.*`, `!**/.env.example`, local DB/log/build outputs.
2. Create root workspace scripts: `dev`, `build`, `test`, `lint`, `typecheck`, `secret:scan`.
3. Scaffold Vite React client with router and global CSS/Tailwind setup.
4. Scaffold Express server with JSON middleware, CORS from env, env validation, request ID, health route.
5. Add Prisma schema with initial `User`, `Session`, `Todo`, `ReminderEvent` models.
6. Add Docker compose for PostgreSQL and optional SMTP/mail catcher.
7. Add test setup for server and client.
8. Verify compile commands pass before moving to features.

## Todo List
- [ ] `.gitignore` protects runtime env files.
- [ ] Root workspace scripts created.
- [ ] Client starts and renders shell.
- [ ] Server health endpoint works.
- [ ] Prisma validates schema.
- [ ] Docker compose starts database.
- [ ] Basic smoke tests pass.

## Success Criteria
- [ ] `npm install` then `npm run typecheck` works from root.
- [ ] `npm run test` runs at least health/smoke tests.
- [ ] `docker compose` can start local DB from `app/`.
- [ ] Secret scan runs and `.env` files are ignored.

## Risk Assessment
- Risk: dependency sprawl at scaffold stage.
  - Mitigation: add only needed packages per phase.
- Risk: Windows path issues.
  - Mitigation: use cross-platform npm scripts.

## Security Considerations
- Validate env at startup and fail closed.
- Keep `.env.example`; never commit real `.env`.
- Set CORS origin from env, not wildcard for authenticated routes.
- Do not create real `.env` until ignore rules are in place.

## Next Steps
Phase 3 can add auth after scaffold compiles.

## Unresolved Questions
- Package manager preference: npm default unless user says pnpm/yarn.
