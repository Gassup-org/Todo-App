# Todo-App

Full-stack Todo App built from `prompts/initial_prompt.md`.

## Features

- React + Vite + TypeScript frontend
- Node.js + Express + TypeScript backend
- PostgreSQL database via Prisma
- Google OAuth login flow with RBAC roles: `USER` and `ADMIN`
- Protected frontend routes and backend middleware guards
- Calendar/date-based todo management
- Todo CRUD, completion toggle, priority, status, and reminders
- User dashboard metrics
- Admin dashboard and user management APIs
- Email reminder scheduler with SMTP/MailHog support and duplicate-send protection
- Dark tech/neon responsive UI with vertical list and playing-card todo views
- Backend and frontend test scaffolding

## Project structure

```text
Todo-App
├── README.md
├── docs
│   └── QA_CHECKLIST.md
├── prompts
│   └── initial_prompt.md
└── app
    ├── client
    │   ├── Dockerfile
    │   └── src
    │       ├── api
    │       ├── components
    │       ├── features
    │       ├── pages
    │       ├── styles
    │       └── utils
    ├── docker-compose.yaml
    └── server
        ├── Dockerfile
        ├── prisma
        │   └── schema.prisma
        └── src
            ├── config
            ├── controllers
            ├── jobs
            ├── middlewares
            ├── repositories
            ├── routes
            ├── schemas
            ├── services
            ├── tests
            └── utils
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop or compatible Docker runtime
- Google OAuth client credentials for real login testing

## Local infrastructure

Start PostgreSQL and MailHog:

```bash
docker compose -f app/docker-compose.yaml up -d
```

MailHog UI is available at <http://localhost:8025> by default.

## Backend setup

```bash
cd app/server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Default backend URL: <http://localhost:4000>

Health check:

```bash
curl http://localhost:4000/health
```

## Frontend setup

```bash
cd app/client
cp .env.example .env
npm install
npm run dev
```

Default frontend URL: <http://localhost:5173>

## Environment notes

### Backend

Configure `app/server/.env` from `app/server/.env.example`.

Important values:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `CLIENT_URL`
- `SMTP_*` values for email reminders

If SMTP is not configured, reminder emails should use a development fallback logger where implemented.

### Frontend

Configure `app/client/.env` from `app/client/.env.example`.

Important values:

- `VITE_API_URL`

## Scripts

Backend:

```bash
cd app/server
npm run dev
npm run build
npm run lint
npm test
npm run prisma:generate
npm run prisma:migrate
```

Frontend:

```bash
cd app/client
npm run dev
npm run build
npm run lint
npm test
```

## QA

Manual QA checklist: [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md)

Critical flows to verify:

- Guest cannot access protected todo/dashboard routes
- Google login/logout works when credentials are configured
- User can CRUD todos by selected date
- User cannot access another user’s todos
- Admin can access admin dashboard and user management
- Normal user cannot access admin dashboard
- Vertical list and playing-card views both work
- Email reminder sends/logs exactly once

## MCP Stitch AI note

`prompts/initial_prompt.md` requests MCP Stitch AI for UI/UX design support if available. No Stitch MCP tool is available in this session, so the UI is implemented directly from the prompt’s dark tech/neon direction. Configure Stitch MCP separately if you want generated design artifacts later.

## Known limitations for local development

- Google OAuth requires real credentials and callback URL configuration.
- Email reminders require SMTP configuration for real delivery; MailHog is provided for local testing.
- Production deployment should use managed secrets, HTTPS, secure cookie settings, and a managed PostgreSQL instance.
