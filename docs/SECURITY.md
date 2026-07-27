# Security Architecture

## Authentication
Token-based authentication utilizing **Laravel Sanctum**. Clients must provide a `Bearer` token in the `Authorization` header.

## Authorization
Role-Based Access Control (RBAC). Middleware verifies roles (e.g., `role:admin`) before granting access to sensitive routes.

## Sanctum & Bearer Token
Tokens are issued upon login and stored securely on the client side (memory or HttpOnly cookies in the future, currently LocalStorage assumed).

## CORS
Configured to strictly allow requests only from the specified `FRONTEND_URL`.

## Storage & File Upload
Files are validated by MIME type and size. Uploads are placed outside the public directory.

## Threat Mitigation
- **SQL Injection:** Mitigated via Eloquent ORM.
- **XSS:** Mitigated by React's default DOM escaping and Laravel's strict JSON responses.
- **CSRF:** Mitigated by stateless API architecture (no cookie-based sessions for API).

## Known Risks
- Shared hosting environments are susceptible to noisy-neighbor attacks.
- File streaming blocks PHP workers; large files under high concurrency may exhaust connection limits.
