# Release & Deployment Checklist

Before deploying a new version to InfinityFree and Vercel, complete this checklist:

## Pre-Release (Local)
- [ ] `APP_DEBUG=false` in deployment `.env`.
- [ ] Verify `project/backend` is fully synced with `project/deployment/core`.
- [ ] Run `php artisan optimize:clear`.
- [ ] Run `php artisan view:clear`.
- [ ] Generate database backup via phpMyAdmin export.

## Deployment
- [ ] **Frontend (Vercel):** Push to `main` branch or trigger manual deployment.
- [ ] **Backend (InfinityFree):** Zip `deployment/core`, upload via FTP, extract over `htdocs`.
- [ ] **Database:** Run any pending SQL schema changes manually in phpMyAdmin.

## Post-Release Validation
- [ ] **Health Check:** Open Backend URL (`/`) and verify API Console loads.
- [ ] **DB Check:** Verify DB status shows "Operational" in the API Console.
- [ ] **Auth Check:** Login via the React frontend.
