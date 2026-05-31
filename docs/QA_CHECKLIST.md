# QA / Manual Test Checklist

Use this checklist after configuring `.env` files and starting the server, client, PostgreSQL, and MailHog.

## Auth + RBAC

- [ ] Guest sees landing/login content.
- [ ] Guest cannot access `/dashboard`, `/todos`, or `/admin` directly.
- [ ] Guest API request to protected todo endpoints returns `401`.
- [ ] Google OAuth login starts successfully when Google env vars are configured.
- [ ] OAuth callback creates or updates the user.
- [ ] Logged-in user can call `GET /api/v1/auth/me`.
- [ ] Logout clears session/token state.
- [ ] User role cannot access admin APIs or admin UI.
- [ ] Admin role can access admin APIs and admin UI.

## Calendar Todo Flow

- [ ] Selecting a date loads todos for that date.
- [ ] Loading, error, and empty states are visible and readable.
- [ ] Creating a todo attaches it to the selected date.
- [ ] Updating a todo preserves ownership and date behavior.
- [ ] Toggling completed changes status and dashboard metrics.
- [ ] Deleting a todo removes it from the selected date.
- [ ] Todo dates do not shift unexpectedly for the configured timezone.

## Security / Ownership

- [ ] User cannot read another user’s todo by ID.
- [ ] User cannot update another user’s todo by ID.
- [ ] User cannot delete another user’s todo by ID.
- [ ] Invalid input returns a clear validation error.
- [ ] API responses do not expose secrets or stack traces in production mode.

## Todo Views

- [ ] Vertical list view is readable and supports core actions.
- [ ] Playing-card view displays each todo as a card with priority/status hierarchy.
- [ ] Completed todos are visually distinct in both views.
- [ ] View switch persists during the session or behaves predictably.
- [ ] Layout works on desktop, tablet, and mobile widths.

## User Dashboard

- [ ] Total todo count is correct.
- [ ] Completed and pending counts are correct.
- [ ] Completion rate is correct.
- [ ] Priority breakdown is correct.
- [ ] Upcoming reminders are shown when available.

## Admin Dashboard

- [ ] Total users count is correct.
- [ ] Total todos count is correct.
- [ ] Completion overview is correct.
- [ ] User management table loads.
- [ ] Role/status changes are blocked for non-admins.

## Email Reminders

- [ ] Todo can be created with reminder enabled.
- [ ] Reminder can be disabled.
- [ ] Due reminder sends to SMTP/MailHog or logs in dev fallback.
- [ ] The same reminder is not sent twice.
- [ ] Failed reminders record failure state/retry metadata.

## Regression Checks

- [ ] Backend tests pass.
- [ ] Frontend tests pass.
- [ ] Backend lint/build pass.
- [ ] Frontend lint/build pass.
