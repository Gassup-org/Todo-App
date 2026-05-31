---
phase: 3
title: Auth RBAC and Google OAuth
status: completed
priority: P1
effort: 1.5d
dependencies:
  - 2
---

# Phase 3: Auth RBAC and Google OAuth

## Context Links
- Contract phase: `./phase-01-discovery-and-contracts.md`
- Scaffold phase: `./phase-02-project-scaffold-and-tooling.md`
- API contract: `app/server/API-CONTRACT.md`

## Overview
Implement Google OAuth, database-backed sessions, and RBAC middleware. This unlocks personal todos and admin management safely.

## Key Insights
- RBAC must be enforced on server, not just hidden in UI.
- Guest is not a persisted role for normal app data; guest means unauthenticated visitor.
- Red-team accepted: session strategy must be fixed before downstream work.
- Auth strategy: database-backed session table + HttpOnly SameSite cookie; no JWT/localStorage for browser MVP.

## Requirements
- Functional:
  - Google OAuth login/callback/logout.
  - Current user endpoint.
  - Role stored on `users.role` with default `user`.
  - Admin-only route guard.
  - Session revocation on logout.
- Non-functional:
  - Tokens/session IDs not stored in localStorage.
  - Auth errors follow API contract.
  - Test OAuth stub cannot run outside `NODE_ENV=test`.

## Architecture
- `auth-routes` owns OAuth redirects/callback and logout.
- `auth-service` verifies Google profile and creates/updates user.
- `session-repository` stores hashed session tokens with expiry.
- `require-auth` attaches authenticated user context from valid session cookie.
- `require-role` checks role list for admin endpoints.
- Frontend auth store caches only safe user profile and role.

## Related Code Files
- Create: `app/server/src/config/auth.ts`
- Create: `app/server/src/routes/auth-routes.ts`
- Create: `app/server/src/controllers/auth-controller.ts`
- Create: `app/server/src/services/auth-service.ts`
- Create: `app/server/src/services/session-service.ts`
- Create: `app/server/src/middlewares/require-auth.ts`
- Create: `app/server/src/middlewares/require-role.ts`
- Create: `app/server/src/repositories/user-repository.ts`
- Create: `app/server/src/repositories/session-repository.ts`
- Create: `app/server/src/types/authenticated-request.ts`
- Create: `app/client/src/pages/login-page.tsx`
- Create: `app/client/src/utils/api-client.ts`
- Create: `app/client/src/utils/auth-store.ts`
- Create: `app/client/src/components/protected-route.tsx`
- Create: `app/client/src/components/admin-route.tsx`
- Modify: `app/server/src/db/prisma/schema.prisma`
- Modify: `app/server/src/app.ts`
- Modify: `app/client/src/app.tsx`

## Implementation Steps
1. Add Google OAuth config and env validation.
2. Add user schema fields: `googleSub`, `email`, `emailVerified`, `name`, `avatarUrl`, `role`, `timezone`.
3. Add unique constraints on `googleSub` and normalized `email` according to contract.
4. Implement account-linking rule: trust Google subject first; require verified email; reject ambiguous email conflicts with 409.
5. Add `Session` model with hashed token, expiry, user agent/ip metadata, revoked timestamp.
6. Implement OAuth callback and safe session cookie issue.
7. Add logout and current-user endpoints.
8. Implement `require-auth` and `require-role` middleware.
9. Add frontend login page, protected route, admin route.
10. Add auth integration tests, middleware negative tests, account-linking conflict tests, and production guard test for OAuth stub.

## Todo List
- [ ] Google OAuth env vars documented.
- [ ] Users persist from OAuth callback with unique constraints.
- [ ] Sessions persist and revoke correctly.
- [ ] Authenticated context available to routes.
- [ ] Non-admin receives 403 on admin route.
- [ ] Frontend handles logged-out and logged-in states.
- [ ] Tests cover 401, 403, logout, current user, linking conflicts, and stub guard.

## Success Criteria
- [ ] User can sign in via Google in local dev with valid credentials.
- [ ] Real Google login is manually verified before release.
- [ ] Admin-only route blocks normal user.
- [ ] OAuth test stub fails server startup outside `NODE_ENV=test`.
- [ ] No auth tokens/session IDs are exposed through frontend logs or localStorage.

## Risk Assessment
- Risk: OAuth credentials unavailable during implementation.
  - Mitigation: implement test-mode callback stub only for automated tests, hard-failed outside test env.
- Risk: CSRF/session mistakes.
  - Mitigation: HttpOnly cookies, SameSite, origin checks, CSRF strategy if cross-site deployment needs it, auth negative tests.

## Security Considerations
- Use `httpOnly`, `secure` in production, `sameSite=lax/strict` for session cookie.
- Hash stored session tokens and expire/revoke sessions.
- Rate-limit auth callback/session endpoints.
- Never trust client-provided role.
- Require provider-verified email and deterministic linking.

## Next Steps
Phase 4 builds user-owned todo CRUD on authenticated route context.

## Unresolved Questions
- None for session strategy; database-backed sessions are selected for MVP.
