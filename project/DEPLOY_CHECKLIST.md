# InfinityFree Deployment Checklist

## Pre-Deployment
- [ ] Ensure local backend tests pass
- [ ] Export local database to `.sql` file
- [ ] Run `composer install --optimize-autoloader --no-dev` locally
- [ ] Run `php artisan optimize:clear` locally

## InfinityFree Setup
- [ ] Create InfinityFree Account
- [ ] Create Subdomain / Add Domain
- [ ] Create MySQL Database in Control Panel
- [ ] Note down Database Credentials (Host, User, Password, DB Name)
- [ ] Open phpMyAdmin and Import `.sql` file

## File Transfer
- [ ] Connect to FTP using FileZilla
- [ ] Create `core` directory in root
- [ ] Upload all backend files (except `public`) to `core` directory
- [ ] Upload contents of `public` directory to `htdocs` directory

## Configuration
- [ ] Copy `.env.infinityfree.example` to `core/.env` on server
- [ ] Configure `core/.env` with Production settings (`APP_ENV=production`, `APP_DEBUG=false`)
- [ ] Configure `core/.env` with InfinityFree Database credentials
- [ ] Configure `core/.env` with Frontend URL (`FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS`)
- [ ] Edit `htdocs/index.php` to update paths to `../core/vendor/autoload.php` and `../core/bootstrap/app.php`

## Verification & Testing
- [ ] Test Backend API URL (`/api/courses`) in browser
- [ ] Connect Vercel Frontend (Update `VITE_API_URL` env variable)
- [ ] Test Homepage loads correctly
- [ ] Test Login functionality
- [ ] Test Admin dashboard access
- [ ] Test Teacher course creation
- [ ] Test Student course enrollment
- [ ] Test Upload PDF material
- [ ] Test Viewing PDF material (verifies Storage configuration)
- [ ] Test Crossword data saving and loading
- [ ] Test Submission History
- [ ] Smoke Test on Mobile Device
