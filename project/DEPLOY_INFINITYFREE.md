# InfinityFree Deployment Guide

## 1. Project Structure on InfinityFree
InfinityFree uses `htdocs` as the public web root. For security, Laravel's core files should not be accessible from the web.

Your FTP structure should look like this:
```
/
├── htdocs/                 # Contents of backend/public/ go here
│   ├── index.php
│   ├── .htaccess
│   └── ...
└── core/                   # The rest of the Laravel backend goes here
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── routes/
    ├── storage/
    ├── vendor/
    ├── .env
    └── ...
```

## 2. Pre-Deployment Preparation (Local)
Before uploading files to FTP, run these commands locally:
```bash
# Clear all caches
php artisan optimize:clear
php artisan view:clear

# Install dependencies (no dev)
composer install --optimize-autoloader --no-dev
```

## 3. Database Setup
Since you cannot run `php artisan migrate` on InfinityFree:
1. Ensure your local database is up to date (`php artisan migrate:fresh --seed`).
2. Export your local MySQL database to a `.sql` file.
3. In InfinityFree Control Panel:
   - Create a new MySQL database.
   - Note the DB Name, DB User, DB Password, and DB Host.
4. Open phpMyAdmin from the Control Panel and Import your `.sql` file.

**Deployment Order (if manual):**
1. Create Database
2. Import Migrations & Tables
3. Run Seeders (if using an export, this is included in step 2)
4. Ensure Admin User exists

## 4. File Upload (FTP)
1. Connect to your InfinityFree account via an FTP client (e.g., FileZilla).
2. Create a folder named `core` in the root directory (alongside `htdocs`).
3. Upload all files and folders from your Laravel `backend/` directory **EXCEPT** the `public` folder to the `core` folder.
4. Upload the **contents** of your local `backend/public/` folder into the `htdocs/` folder on InfinityFree.

## 5. Environment Configuration
1. Open the `.env` file in the `core` folder on the server.
2. Update the variables based on your InfinityFree credentials:
```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-infinityfree-domain.epizy.com

DB_CONNECTION=mysql
DB_HOST=sqlXXX.epizy.com       # Check Control Panel
DB_PORT=3306
DB_DATABASE=epiz_12345678_db   # Check Control Panel
DB_USERNAME=epiz_12345678      # Check Control Panel
DB_PASSWORD=your_db_password

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=public

# Set to your Vercel frontend URL
FRONTEND_URL=https://your-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app
```

## 6. Configure `index.php`
Because the folder structure has changed, you must update `htdocs/index.php`.

Edit `htdocs/index.php` and change the paths to point to the `core` folder:

```php
// Find:
require __DIR__.'/../vendor/autoload.php';
// Change to:
require __DIR__.'/../core/vendor/autoload.php';

// Find:
$app = require_once __DIR__.'/../bootstrap/app.php';
// Change to:
$app = require_once __DIR__.'/../core/bootstrap/app.php';
```

## 7. Storage Setup
InfinityFree does not support symlinks (`storage:link`). 
However, this backend streams PDFs directly via the `MaterialController::streamPdf()` method:
```php
$path = Storage::disk('public')->path($material->pdf_path);
return response()->file($path, ...);
```
**No changes are required for file uploads to work!** The uploaded files will safely sit in `core/storage/app/public/materials/` and be streamed through the API.

## 8. Connecting with Vercel Frontend
Once the backend is live:
1. Get the InfinityFree URL (e.g., `http://your-api-domain.epizy.com`).
2. Go to your Vercel Dashboard -> Settings -> Environment Variables.
3. Add or update `VITE_API_URL` to point to the InfinityFree URL.
4. Redeploy the Vercel frontend to apply the changes.

## 9. Verification
- Visit `http://your-api-domain.epizy.com/api/courses` (Should return JSON or Unauthorized, not a 500 error).
- Check the Frontend application and ensure it can log in.
