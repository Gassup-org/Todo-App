# Code Standards

## Overview
Use simple, readable TypeScript. Follow YAGNI, KISS, and DRY. Prefer explicit business rules over clever abstractions.

## File Naming
- JS/TS/CSS files use kebab-case.
- Components use kebab-case filenames and PascalCase exports.
- Keep code files under 200 lines when practical.

## Backend Standards
- Express route files only define paths and middleware order.
- Controllers validate/parse and return API envelope responses.
- Services own business rules.
- Repositories own Prisma queries and required filters.
- Never accept `userId` from request body for user-owned operations.
- Env validation must fail closed at startup.

## Frontend Standards
- Use React Router for page routing.
- Use TanStack Query for server state.
- Keep local UI state close to components unless shared.
- Render user content through React text nodes, not `dangerouslySetInnerHTML`.
- Add labels and keyboard support for interactive controls.

## API Standards
All API responses use:
```json
{ "data": {}, "error": null }
```
or
```json
{ "data": null, "error": { "code": "VALIDATION_FAILED", "message": "...", "details": {}, "requestId": "..." } }
```

Common error codes (application-level, not env vars):
- AUTH_REQUIRED
- FORBIDDEN
- VALIDATION_FAILED
- NOT_FOUND
- CONFLICT
- RATE_LIMITED
- INTERNAL

## Testing Standards
- Unit-test pure utilities and business rules.
- Integration-test auth, RBAC, todo ownership, soft-delete filters, and reminder idempotency.
- E2E-test only focused happy paths and critical guards.
- Do not fake core behavior just to pass tests.

## Security Standards
- Runtime `.env` files must be ignored.
- No secrets in logs, docs, commits, or client bundle.
- OAuth test stub only under `NODE_ENV=test`.
- Admin CRUD needs audit log and last-admin/self-lockout protection.

## Documentation Standards
- Update docs when behavior or setup changes.
- Keep docs concise and accurate to code.
- Add changelog entries for feature, security, and bug-fix milestones.
