# System Deployment Blueprint

This document recommends the deployment environment, storage, build flow, and cache configurations for the Scrabble Wordseser MVP.

## 1. Hosting Architecture (Simple MVP Deployment)
- **Application Server**: Single Virtual Private Server (VPS) running a Linux stack (Ubuntu, Nginx, PHP-FPM, Node.js).
- **Database Server**: MySQL database running on the same VPS instance (or as a separate managed service).

---

## 2. Storage & Cache Configurations
- **PDF File Storage**:
  - Saved in the server filesystem (`storage/app/public/materials/`), with a symbolic link in the web root (`public/storage`).
- **Cache Engine**:
  - Uses the file-based cache driver for simplicity, which is sufficient for MVP load requirements.
- **Queues**:
  - Runs tasks synchronously (`QUEUE_CONNECTION=sync`) during the MVP phase to avoid running background worker processes.

---

## 3. Build & CI/CD Pipeline

### Frontend Compilation
1. Install dependencies: `npm ci`.
2. Build production assets: `npm run build`. This runs the Vite compiler, generating optimized, minified static HTML, CSS, and JS assets in the `/dist` directory.
3. Serve generated static files directly using Nginx.

### Backend Setup
1. Install dependencies: `composer install --no-dev --optimize-autoloader`.
2. Configure environment: Copy `.env.example` to `.env` and set environment variables.
3. Run database migrations: `php artisan migrate --force`.
4. Cache configuration files:
   - `php artisan config:cache`
   - `php artisan route:cache`
