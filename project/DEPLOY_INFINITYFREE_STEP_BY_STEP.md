# Crossword Labs - InfinityFree Deployment Step-By-Step Handbook

This handbook is a complete, zero-assumption guide to deploying the Crossword Labs Laravel Backend to InfinityFree. It is designed for beginners and leaves no steps skipped.

---

## SECTION 1: OVERVIEW

### Deployment Architecture
Crossword Labs consists of a React Frontend (hosted on Vercel) and a Laravel Backend API (hosted on InfinityFree). They communicate over the internet via HTTP requests.

### Why InfinityFree Requires a Special Folder Structure
InfinityFree uses a public directory called `htdocs` to serve websites. 
By default, Laravel expects the root of your project to be hidden and only its `public/` directory exposed to the internet. 

### Why Laravel Cannot Be Uploaded Normally
If you upload your entire Laravel project directly into `htdocs`, anyone can type `http://yourdomain.com/.env` in their browser and steal your database passwords and API keys. This is a critical security vulnerability.

### The Difference Between `htdocs` and `core`
To secure the application:
- **`htdocs`**: The public-facing folder. Only the contents of Laravel's `public/` folder (`index.php`, images, CSS, JS) go here.
- **`core`**: A private folder we will create outside of `htdocs`. All sensitive Laravel files (routes, database, controllers, `.env`) go here where they cannot be accessed by hackers.

---

## SECTION 2: PREREQUISITES

Before starting, ensure you have the following ready:

- [ ] **InfinityFree Account**: Registered and active.
- [ ] **FileZilla**: An FTP client installed on your computer to transfer files.
- [ ] **Local Backend**: The source code of the Crossword Labs Laravel backend on your PC.
- [ ] **Local Database**: A working local MySQL database with your local data.
- [ ] **Composer**: Installed on your computer for PHP package management.
- [ ] **PHP 8.2+**: Installed locally for building the project.
- [ ] **Vercel Frontend**: The deployed frontend application ready to be connected.

---

## SECTION 3: PREPARING LOCAL PROJECT

Before uploading anything, we must prepare the backend on your computer. 
Open your terminal in the backend project folder and run the following commands sequentially:

**1. Install Production Dependencies**
```bash
composer install --no-dev --optimize-autoloader
```
*Why?* This installs the required PHP packages but excludes testing/development tools to save space. `--optimize-autoloader` makes Laravel load files faster in production.

**2. Clear Caches**
```bash
php artisan optimize:clear
```
*Why?* This removes any cached views, routes, and configs from your local environment so they don't break the live server.

**3. Generate App Key**
```bash
php artisan key:generate
```
*Why?* This generates a unique encryption key for secure sessions and cookies. Ensure it updates your `.env` file successfully.

---

## SECTION 4: DATABASE

Since InfinityFree does not allow running `php artisan migrate`, we must transfer the database manually.

### 1. Export SQL Locally
1. Open your local database tool (phpMyAdmin, TablePlus, or DBeaver).
2. Select your Crossword Labs database.
3. Click **Export** and choose **SQL** format. Download the `.sql` file to your PC.

### 2. Create MySQL on InfinityFree
1. Log in to your InfinityFree Control Panel (cPanel).
2. Go to **MySQL Databases**.
3. Create a new database (e.g., `epiz_12345678_crossword`).
4. Note down the **MySQL Hostname**, **MySQL User**, **MySQL Password**, and **Database Name**.

### 3. Import SQL to InfinityFree
1. In the InfinityFree Control Panel, click on **phpMyAdmin**.
2. Select the database you just created from the left sidebar.
3. Click the **Import** tab.
4. Upload the `.sql` file you exported earlier and click **Go**.

### 4. Verify Database
Ensure the `users`, `courses`, and `materials` tables appear in phpMyAdmin and contain data.

---

## SECTION 5: FTP UPLOAD

Now, we transfer the files to InfinityFree using FileZilla.

### 1. Connect FileZilla
1. In your InfinityFree Client Area, locate your **FTP Details** (FTP Hostname, FTP Username, FTP Password).
2. Open FileZilla.
3. Enter the Host, Username, and Password (Port is usually 21). Click **Quickconnect**.

### 2. Create Directory Structure
Once connected, you will see a folder called `htdocs` on the remote server (right side of FileZilla).
Right-click in the empty space alongside `htdocs` and choose **Create Directory**. Name it `core`.

**Your Directory Tree Should Look Like This:**
```
/
├── htdocs/       <-- Put Laravel's "public" contents here
└── core/         <-- Put everything else here
```

### 3. Uploading Files
**To the `core` folder:**
- Upload all folders and files from your local backend project (e.g., `app`, `bootstrap`, `routes`, `vendor`, `.env`).
- **DO NOT** upload the `public` folder here.

**To the `htdocs` folder:**
- Open the `public` folder on your local computer (left side of FileZilla).
- Select all contents inside it (`index.php`, `.htaccess`, etc.).
- Drag and drop them into the `htdocs` folder on the remote server.

---

## SECTION 6: EDIT INDEX.PHP

Because we separated the public files (`htdocs`) from the core files (`core`), we must tell `index.php` where to find the rest of the application.

1. In FileZilla, navigate to `htdocs`.
2. Right-click `index.php` and select **View/Edit**.
3. Locate the following lines of code:

**Old Code:**
```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

**New Code (Change it to this):**
```php
require __DIR__.'/../core/vendor/autoload.php';
$app = require_once __DIR__.'/../core/bootstrap/app.php';
```

4. Save the file and confirm the FileZilla prompt to upload the changes.

*Why?* We moved the `vendor` and `bootstrap` folders inside `core`. This tells `index.php` to look inside the `core` folder instead of the root directory.

---

## SECTION 7: ENVIRONMENT VARIABLES

1. In FileZilla, navigate to the `core` folder.
2. Right-click `.env` and select **View/Edit**.
3. Configure the variables exactly as explained below:

| Variable | What it does | Example Value | Common Mistake |
|----------|--------------|---------------|----------------|
| `APP_NAME` | Name of your app | `Crossword Labs` | Leaving spaces without quotes (`" "`) |
| `APP_ENV` | Environment mode | `production` | Leaving it as `local` |
| `APP_KEY` | Security encryption key | `base64:XYZ...` | Leaving it blank. Copy from local `.env`. |
| `APP_DEBUG` | Shows error details | `false` | Setting to `true` exposes server secrets |
| `APP_URL` | Your InfinityFree URL | `http://yourname.epizy.com` | Adding a trailing slash (`/`) at the end |
| `DB_HOST` | Database server address | `sql123.epizy.com` | Using `127.0.0.1` or `localhost` |
| `DB_DATABASE` | Database name | `epiz_123456_db` | Using your local database name |
| `DB_USERNAME` | Database user | `epiz_123456` | Using `root` |
| `DB_PASSWORD` | Database password | `your_cpanel_password` | Leaving it blank |
| `FRONTEND_URL` | Vercel frontend link | `https://your-frontend.vercel.app` | Forgetting `https://` or adding a trailing slash |
| `SANCTUM_STATEFUL_DOMAINS` | Domains allowed to use cookies | `your-frontend.vercel.app` | Including `https://` (Do NOT include protocols here) |
| `FILESYSTEM_DISK` | Default storage location | `public` | Changing to `local` breaks file viewing |
| `QUEUE_CONNECTION` | Background job handler | `sync` | InfinityFree doesn't support `database`/`redis` |
| `CACHE_DRIVER` | Data cache storage | `file` | Using `redis` or `memcached` |
| `SESSION_DRIVER` | User session storage | `file` | Leaving as `database` without a sessions table |

Save and upload the `.env` file back to the server.

---

## SECTION 8: VERCEL FRONTEND CONFIGURATION

Now that the backend is live, we must connect the frontend.

### How to Connect Backend with Frontend
1. Go to your Vercel Dashboard and select your Frontend project.
2. Click **Settings**, then navigate to **Environment Variables**.
3. Look for `VITE_API_URL` (or the equivalent API variable).
4. **Update it** to your InfinityFree Backend URL.
   *Example:* `http://yourname.epizy.com` (Ensure there is NO trailing slash).
5. Click **Save**.

### How to Redeploy
Vercel requires a new build to apply environment variables.
1. Go to the **Deployments** tab in Vercel.
2. Find the latest deployment, click the three dots (`...`), and select **Redeploy**.
3. Wait for the build to finish.

---

## SECTION 9: CORS (Cross-Origin Resource Sharing)

CORS blocks unauthorized websites from reading your API.

### How to Verify CORS
1. Open your Vercel frontend in Google Chrome.
2. Right-click anywhere and click **Inspect**.
3. Go to the **Console** tab.
4. Log in to the application.

### Common Errors & Solutions
- **Error:** `Blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.`
  - **Cause:** `FRONTEND_URL` in the backend `.env` does not match the Vercel URL, or `SANCTUM_STATEFUL_DOMAINS` has a typo.
  - **Solution:** Check `.env` in the `core` folder. Ensure `FRONTEND_URL=https://your-app.vercel.app` and `SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app`.
- **Error:** `CSRF token mismatch.`
  - **Cause:** Cookies are being blocked.
  - **Solution:** Ensure `SANCTUM_STATEFUL_DOMAINS` is correct and does NOT include `https://`.

---

## SECTION 10: COMPLETE TESTING CHECKLIST

Go through this list manually on your deployed Vercel app to verify everything works:

- [ ] **Homepage:** Loads instantly without console errors.
- [ ] **Login:** User can log in successfully.
- [ ] **Logout:** User can log out successfully.
- [ ] **Admin:** Admin dashboard displays users correctly.
- [ ] **Teacher:** Teacher can see their specific courses.
- [ ] **Student:** Student can view enrolled courses.
- [ ] **Create Course:** Teacher/Admin can create a new course.
- [ ] **Upload PDF:** Teacher can upload a PDF material (under 10MB).
- [ ] **Open PDF:** PDF renders correctly on the screen.
- [ ] **Create Crossword:** Teacher can generate and save a crossword grid.
- [ ] **Solve Crossword:** Student can fill in the crossword and submit.
- [ ] **History:** Submissions appear in the history tab.
- [ ] **Language Switch:** Changing languages updates the UI immediately.
- [ ] **Theme Switch:** Changing themes applies colors correctly.
- [ ] **Dark Mode:** Dark mode toggles and saves preference.
- [ ] **Responsive:** Everything looks correct on a mobile screen.

---

## SECTION 11: COMMON ERRORS & TROUBLESHOOTING

| Error | Cause | Solution |
|-------|-------|----------|
| **500 Internal Server Error** | Syntax error in `index.php` or missing `.env` variables. | Verify `index.php` points to `core/vendor/autoload.php`. Ensure `APP_KEY` is set. |
| **403 Forbidden** | Directory indexing blocked, or wrong file permissions. | Ensure `index.php` and `.htaccess` are in `htdocs`. |
| **419 CSRF / Page Expired** | Sanctum misconfiguration. | Fix `SANCTUM_STATEFUL_DOMAINS` in `.env`. Ensure it has no `http://`. |
| **404 Not Found (API)** | `index.php` cannot route properly. | Ensure the `.htaccess` file was uploaded to `htdocs` along with `index.php`. |
| **CORS Error** | Frontend URL not allowed by backend. | Update `FRONTEND_URL` in `.env` to match Vercel exactly. |
| **Database Connection Error** | Wrong credentials in `.env`. | Double-check DB Host, DB Name, User, and Password in InfinityFree cPanel. |
| **Missing APP_KEY** | Missing or empty `APP_KEY` in `.env`. | Run `php artisan key:generate` locally and copy the key to the server's `.env`. |
| **Missing Vendor** | You forgot to upload the `vendor` folder. | Upload the `core/vendor/` folder via FileZilla. |
| **Storage Error (PDF not showing)**| Pathing issue. | Since InfinityFree blocks symlinks, ensure you are using the streaming controller (`MaterialController::streamPdf`). |
| **Permission Error** | Server cannot write to storage. | Use FileZilla, right click `core/storage` and `core/bootstrap/cache`, select File Permissions, set to 755 or 777. |
| **Session Error** | Server cannot create session files. | Ensure `core/storage/framework/sessions` exists. |

---

## SECTION 12: ROLLBACK

If the deployment fails entirely and the live app breaks:

1. **Keep Calm:** Your local code and local database are safe.
2. **Revert Vercel:** Go to Vercel Deployments, find the previous successful deployment, click `...` and select **Promote to Production / Redeploy**.
3. **Wipe InfinityFree (Optional):** If the backend is corrupted, delete the `core` and `htdocs` contents via FileZilla and start the upload process again slowly.
4. **Local Backup:** Always ensure your code is committed to GitHub before attempting a deployment.

---

## SECTION 13: POST DEPLOYMENT FINAL CHECKLIST

Before celebrating, ensure all boxes are checked:

- [ ] Homepage works
- [ ] Login works
- [ ] Admin works
- [ ] Teacher works
- [ ] Student works
- [ ] PDF viewing works
- [ ] Crossword mechanics work
- [ ] Mobile layout is responsive
- [ ] Language switching works
- [ ] Theme switching works
- [ ] No red console errors in Chrome Inspector
- [ ] API routes return 200 OK
- [ ] Database is connected and retrieving live data
- [ ] File uploads succeed
- [ ] Submission History displays correctly
- [ ] **Smoke test passed!**

---

## BONUS APPENDIX: INFINITYFREE LIMITATIONS

InfinityFree provides excellent free hosting, but it comes with strict limitations designed for basic websites. Here is how Crossword Labs bypasses them safely:

- **File Size Limit (10MB):** InfinityFree blocks uploads larger than 10MB. 
  *How we handle it:* Our Laravel `MaterialController` explicitly validates PDFs with `max:10240` to ensure no one triggers the server limit and causes a crash.
- **Execution Time:** Scripts running longer than a few seconds are killed. 
  *How we handle it:* The API is extremely lightweight, relying on simple JSON responses.
- **No SSH / No Artisan:** You cannot open a terminal on the server.
  *How we handle it:* We build locally (`composer install`, `php artisan key:generate`) and upload the final, compiled files via FTP. We manage the database manually via phpMyAdmin.
- **No Queue Worker / Scheduler:** Cron jobs are essentially non-existent.
  *How we handle it:* We use `QUEUE_CONNECTION=sync` so any background tasks execute immediately during the web request.
- **No Redis:** High-performance caching isn't allowed.
  *How we handle it:* We rely entirely on the `file` driver for `SESSION_DRIVER` and `CACHE_DRIVER`.
- **No Symlinks (`storage:link`):** The standard way Laravel exposes uploaded files is blocked.
  *How we handle it:* Instead of relying on direct public URLs, Crossword Labs uses `MaterialController::streamPdf()` to serve the binary PDF file directly through the PHP application. This is a brilliant workaround that makes the app 100% compatible.
