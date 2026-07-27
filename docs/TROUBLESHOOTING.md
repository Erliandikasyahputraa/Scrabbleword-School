# Troubleshooting Guide

## Problem: 419 Page Expired
- **Cause:** Usually CSRF token mismatch, but this API is stateless.
- **Solution:** Ensure the route is placed in `routes/api.php`, NOT `routes/web.php`. Verify Sanctum is utilizing Bearer tokens instead of stateful cookies.

## Problem: CORS Error
- **Cause:** Preflight request failed or origin is denied.
- **Solution:** Check `config/cors.php`. Verify `FRONTEND_URL` in `.env` matches the exact React origin (without trailing slash).

## Problem: 500 Internal Server Error
- **Cause:** Unhandled exception or syntax error.
- **Solution:** Temporarily enable `APP_DEBUG=true` in `.env`. Check `storage/logs/laravel.log`.

## Problem: Storage Link Broken (404 on Files)
- **Cause:** InfinityFree forbids symlinks.
- **Solution:** Ensure files are being served through a dedicated controller method (e.g., `return response()->file()`) rather than public asset URLs.

## Problem: InfinityFree 403 Forbidden
- **Cause:** ModSecurity triggered or file permissions are incorrect.
- **Solution:** Ensure all folders are `755` and files are `644`. Avoid suspicious URL payloads.

## Problem: Database Connection Failed
- **Cause:** Incorrect `.env` credentials on the production server.
- **Solution:** Confirm `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` from the InfinityFree control panel. `DB_HOST` is never `localhost` on InfinityFree.
