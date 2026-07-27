# FINAL DEPLOYMENT CHECKLIST

**Instructions:** Check off each item manually during the deployment process.

## 1. PRE-DEPLOYMENT VERIFICATION
- [ ] Vendor folder generated (`composer install --no-dev --optimize-autoloader`).
- [ ] Application Key (`APP_KEY`) generated locally and copied.
- [ ] Local Database exported to `.sql` file.
- [ ] Caches cleared (`php artisan optimize:clear`).

## 2. SERVER CONFIGURATION
- [ ] InfinityFree MySQL Database created.
- [ ] Database Connection Details noted (Host, User, Password, DB Name).
- [ ] `.sql` file imported successfully via phpMyAdmin.

## 3. FILE TRANSFER & STRUCTURE
- [ ] `core` directory created on server.
- [ ] All backend files (except `public/`) uploaded to `core`.
- [ ] Contents of `public/` uploaded to `htdocs`.
- [ ] `vendor/` successfully transferred.

## 4. ENVIRONMENT & CONFIGURATION
- [ ] `.env` created in `core/` folder.
- [ ] `APP_KEY` pasted into `.env`.
- [ ] `APP_URL` configured correctly.
- [ ] `FRONTEND_URL` configured (Vercel link).
- [ ] `SANCTUM_STATEFUL_DOMAINS` configured (Vercel domain).
- [ ] Database credentials entered into `.env`.
- [ ] `index.php` updated to point to `core/vendor/autoload.php` and `core/bootstrap/app.php`.
- [ ] `.htaccess` present in `htdocs/`.

## 5. FUNCTIONAL TESTING
- [ ] Backend API Root loads (e.g., returns JSON or 401/404, not 500).
- [ ] Vercel `VITE_API_URL` updated and redeployed.
- [ ] Storage paths working.
- [ ] Upload PDF tested.
- [ ] PDF preview streaming tested (verifies API serving without symlinks).
- [ ] CORS verified (no browser console blocks).
- [ ] Login works.
- [ ] Admin dashboard loads.
- [ ] Teacher course creation tested.
- [ ] Student enrollment tested.
- [ ] Crossword validation logic works.
- [ ] Submissions successfully recorded.
- [ ] History loads accurately.

## 6. UI/UX VERIFICATION (FRONTEND)
- [ ] Mobile responsive layout confirmed.
- [ ] Dark Mode toggles and persists.
- [ ] Themes apply correctly.
- [ ] Language Switcher (i18n) works.

**READY TO INITIATE DEPLOYMENT.**
