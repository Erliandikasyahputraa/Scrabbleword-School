# InfinityFree Backend Audit

## Overview
This audit evaluates the current Laravel backend for compatibility with InfinityFree shared hosting. The goal is to identify blockers, necessary changes, and safe production configurations without altering the actual codebase logic.

## 1. System Requirements & Compatibility
- **Laravel Version**: 11.x (requires PHP 8.2+)
- **PHP Compatibility**: InfinityFree currently supports PHP 8.2 on their newer servers. If the account is provisioned on an older server, it might run PHP 8.1 or 7.4. **Action**: Ensure the InfinityFree account is using PHP 8.2+ via the control panel.
- **Composer Dependencies**: Standard Laravel dependencies. No unusual extensions are required.

## 2. Infrastructure & File System
- **Storage & File Uploads**: 
  - PDFs are stored in `storage/app/public/materials`.
  - InfinityFree **does not support symlinks** (`php artisan storage:link` will fail).
  - **Good News**: The application already uses a route-based streaming strategy (`/api/courses/{courseId}/materials/{id}/pdf` via `MaterialController::streamPdf()`) instead of relying on direct public URLs. This means the lack of symlinks on InfinityFree will **not** break PDF viewing.
- **Public Folder Structure**:
  - InfinityFree serves files from `htdocs`.
  - The standard approach is to upload the contents of the `public/` directory to `htdocs/` and place the rest of the Laravel application in a folder *outside* or *alongside* `htdocs/` (e.g., in the root or a `core/` folder).
  - `index.php` in `htdocs` must be updated to point to the correct `autoload.php` and `bootstrap/app.php` paths.

## 3. Server Configuration & Features
- **Artisan Commands**: InfinityFree does not offer SSH access. You cannot run `php artisan migrate` or `php artisan optimize:clear` on the server.
  - **Workaround**: Migrations must be exported as an SQL dump locally and imported via phpMyAdmin. Cache must be cleared manually by deleting files in `bootstrap/cache/` or using a custom route.
- **Queues & Scheduler**: InfinityFree does not support background queue workers or cron jobs.
  - **Status**: The application currently uses `sync` queue driver and doesn't appear to rely on complex background jobs. This is fully compatible.
- **Cache & Sessions**:
  - Redis/Memcached are not available.
  - Must use `file` or `database` drivers. `file` is recommended for standard setups.

## 4. Security
- **APP_DEBUG**: Must be set to `false`.
- **Directory Listing**: Ensure `.htaccess` blocks directory indexing.
- **Environment Variables**: The `.env` file must be placed outside the public `htdocs` folder so it cannot be downloaded by unauthorized users.

## 5. Potential Blockers & Recommendations
- **Database Connection Limits**: Free hosting limits concurrent connections. Avoid excessively polling endpoints.
- **Upload File Size**: InfinityFree has strict limits on file sizes (usually 10MB). The `MaterialController` currently restricts PDF uploads to 10MB (`max:10240`), which perfectly aligns with this limitation.
- **Execution Time**: PHP execution time is limited. Long-running scripts will be killed.

## Summary
The backend is largely compatible with InfinityFree, primarily because it relies on standard HTTP routing for file serving rather than symlinks. The main deployment effort will involve adjusting the folder structure (`htdocs` vs `core`) and importing the database manually.
