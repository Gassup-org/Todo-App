# Codebase Summary

## Overview
Current project is being bootstrapped into a monorepo todo application.

## Intended Structure
```text
app/
├── client/    React + Vite + TypeScript
├── server/    Node + Express + TypeScript
└── docker-compose.yaml
```

## Current Baseline
- `README.md` describes intended structure.
- `docs/` contains planning baseline docs.
- `app/server/API-CONTRACT.md` defines API contracts.
- `app/server/.env.example` and `app/client/.env.example` define non-secret env templates.

## Main Domains
- Auth and RBAC.
- Todo CRUD with calendar filtering.
- User dashboard.
- Admin dashboard and guarded user CRUD.
- SMTP/Nodemailer reminders.
- Modern dark-neon UI.

## Implementation Notes
- Source files are created in later phases.
- Keep files small and self-documenting.
- Follow `docs/code-standards.md`.

## Unresolved Questions
None.
