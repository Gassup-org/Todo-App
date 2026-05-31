# API Contract

## Overview
Source of truth for backend/frontend implementation. Base path: `/api/v1`. All protected endpoints require a valid HttpOnly session cookie created by Google OAuth login.

## Response Envelope
Success:
```json
{ "data": {}, "error": null }
```

Error:
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable message",
    "details": {},
    "requestId": "req_..."
  }
}
```

## Error Codes
| Code | HTTP | Meaning |
|---|---:|---|
| `AUTH_REQUIRED` | 401 | Missing/invalid session |
| `FORBIDDEN` | 403 | Authenticated but lacks role |
| `VALIDATION_FAILED` | 400 | Invalid payload/query |
| `NOT_FOUND` | 404 | Missing or inaccessible resource |
| `CONFLICT` | 409 | Unique/linking/state conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL` | 500 | Unexpected server error |

## Data Conventions
- Timestamps: UTC ISO-8601 strings.
- Calendar date query: `YYYY-MM-DD` interpreted in user's timezone.
- Pagination: `{ items, pageInfo: { cursor, nextCursor, hasNextPage } }`.
- User-owned mutations derive `userId` from session only.
- Normal todo reads exclude `deletedAt != null`.

## Roles
| Role | Description |
|---|---|
| guest | Unauthenticated browser visitor |
| user | Own todos and own dashboard |
| admin | User features plus admin dashboard and user CRUD |

## Auth Endpoints
| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/auth/google` | guest | none | Redirect to Google OAuth |
| GET | `/auth/google/callback` | guest | Google callback query | Sets session cookie, redirects client |
| POST | `/auth/logout` | user/admin | none | `{ "ok": true }` |
| GET | `/auth/me` | user/admin | none | `UserProfile` |
| POST | `/auth/test-login` | test only | `{ "role": "user" }` | Sets session cookie |

`/auth/test-login` must fail server startup outside `NODE_ENV=test` if enabled.

### UserProfile
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "avatarUrl": "https://...",
  "role": "user",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

## Todo Endpoints
| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/todos?date=YYYY-MM-DD` | user/admin | query date | `Todo[]` |
| POST | `/todos` | user/admin | `TodoCreate` | `Todo` |
| PATCH | `/todos/:id` | owner | `TodoUpdate` | `Todo` |
| DELETE | `/todos/:id` | owner | none | `{ "ok": true }` |

### Todo
```json
{
  "id": "uuid",
  "title": "Write plan",
  "description": "Optional notes",
  "status": "active",
  "priority": "normal",
  "dueAt": "2026-05-30T09:00:00.000Z",
  "reminderAt": "2026-05-30T08:45:00.000Z",
  "createdAt": "2026-05-30T08:00:00.000Z",
  "updatedAt": "2026-05-30T08:00:00.000Z"
}
```

### TodoCreate
```json
{
  "title": "Write plan",
  "description": "Optional notes",
  "status": "active",
  "priority": "normal",
  "dueAt": "2026-05-30T09:00:00.000Z",
  "reminderAt": "2026-05-30T08:45:00.000Z"
}
```

### TodoUpdate
All fields optional except at least one field required. `title`, `description`, `status`, `priority`, `dueAt`, `reminderAt`.

## Dashboard Endpoints
| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/dashboard/me` | user/admin | `UserDashboard` |
| GET | `/admin/dashboard` | admin | `AdminDashboard` |

### UserDashboard
```json
{
  "openTodos": 5,
  "completedTodos": 12,
  "overdueTodos": 1,
  "upcomingReminders": 3
}
```

### AdminDashboard
```json
{
  "userCount": 10,
  "activeTodoCount": 42,
  "completionRate": 0.71,
  "failedReminderCount": 2
}
```

## Admin User CRUD Endpoints
All endpoints require `admin` role. All mutations write `AdminAuditLog` and enforce last-admin/self-lockout protection.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/admin/users?cursor=&limit=` | query | paginated `AdminUser[]` |
| POST | `/admin/users` | `AdminUserCreate` | `AdminUser` |
| PATCH | `/admin/users/:id` | `AdminUserUpdate` | `AdminUser` |
| POST | `/admin/users/:id/deactivate` | `{ "reason": "..." }` | `AdminUser` |
| POST | `/admin/users/:id/reactivate` | `{ "reason": "..." }` | `AdminUser` |
| DELETE | `/admin/users/:id` | `{ "reason": "..." }` | `{ "ok": true }` |

### AdminUser
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "user",
  "status": "active",
  "timezone": "Asia/Ho_Chi_Minh",
  "createdAt": "2026-05-30T08:00:00.000Z"
}
```

## Reminder Behavior
- Reminder cadence: every minute.
- Provider: SMTP/Nodemailer.
- Event states: `pending`, `sending`, `sent`, `failed`.
- Worker must atomically claim a reminder before sending.
- Same `(todoId, reminderAt)` cannot send twice under concurrent workers.

## Environment Keys
See `app/server/.env.example` and `app/client/.env.example`.

## Unresolved Questions
None.
