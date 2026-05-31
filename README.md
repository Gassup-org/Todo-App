# Todo-App

## Overview

React + Node + Express todo app with PostgreSQL, Google OAuth, RBAC, calendar todos, dashboards, and SMTP reminders.

## Project structure

Current scaffold:

```text
Todo-App
├── README.md
├── package.json
├── docs
├── plans
└── app
    ├── client
    │   ├── index.html
    │   ├── package.json
    │   ├── src
    │   │   ├── app.tsx
    │   │   ├── main.tsx
    │   │   ├── styles
    │   │   └── test
    │   └── vite.config.ts
    ├── docker-compose.yaml
    └── server
        ├── API-CONTRACT.md
        ├── package.json
        └── src
            ├── app.ts
            ├── config
            ├── db
            ├── middlewares
            ├── routes
            ├── server.ts
            └── utils
```

Planned feature layers are added as phases land:

```text
app/server/src
├── controllers
├── repositories
├── services
├── templates
├── types
└── validators
```

## Prerequisites

- Node.js LTS
- npm
- Docker Desktop (for Postgres + Mailpit)

## Quick start (dev)

### 1) Install deps

```powershell
npm install
```

### 2) Start local services (Postgres + Mailpit)

```powershell
cd app
docker compose up -d
```

Mailpit UI: http://localhost:8025

### 3) Create local env files

Server:

```powershell
copy app\server\.env.example app\server\.env
```

Client:

```powershell
copy app\client\.env.example app\client\.env
```

Notes:
- Do NOT commit real `.env` files. Only examples are tracked.
- For Google OAuth to work, fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` in `app/server/.env`.

### 4) Generate Prisma client + run migrations

```powershell
npm run prisma:generate --workspace app/server
npm run prisma:migrate --workspace app/server
```

If you get `P1000: Authentication failed`, your Postgres password likely does not match `DATABASE_URL`.
- Default docker compose password: `change-me-local-only`
- If you previously started the container with a different password, reset local DB volume:

```powershell
cd app
docker compose down -v
```

Then start services again and rerun migrations.

### 5) Run dev servers

```powershell
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:4000/api/v1

## Quality gates

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
```

## Common issues

### TEST_AUTH_ENABLED can only be true when NODE_ENV=test

This guard prevents enabling the test login route outside tests.
- In `app/server/.env` keep:
  - `TEST_AUTH_ENABLED=false`
  - `NODE_ENV=development`

## Plan

Active implementation plan: `plans/260530-scalable-team-todo-app/plan.md`.
