# Deployment Guide

## Overview
Deployment target is not selected yet. This guide covers local Docker development baseline and release checks.

## Local Prerequisites
- Node.js LTS.
- npm.
- Docker Desktop.
- PostgreSQL via `app/docker-compose.yaml`.

## Environment
Use example files only as templates:
- `app/server/.env.example`
- `app/client/.env.example`

Never commit real `.env` files.

## Local Services
- PostgreSQL for app data.
- Mailpit for SMTP/Nodemailer testing.

Notes:
- Default docker compose password: `change-me-local-only`.
- If `DATABASE_URL` does not match the container password, Prisma will fail with `P1000`.

Start services:
```powershell
cd app
docker compose up -d
```

## Release Checks
Automated (this repo):
- Contract conformance.
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run secret:scan`
- `npm --workspace app/server run prisma:generate`

Manual/external:
- Focused E2E smoke.
- Real Google OAuth manual verification (real credentials).
- Security manual review.
- Migration rollback/restore rehearsal.

## Production Notes
- Set secure cookies in production.
- Restrict CORS to deployed client origin.
- Use managed PostgreSQL with backups.
- Use a real SMTP provider.
- Keep reminder worker singleton or use DB claim-before-send protocol.

## Unresolved Questions
- Deployment host not selected.
- Real Google OAuth manual verification pending (needs real credentials).