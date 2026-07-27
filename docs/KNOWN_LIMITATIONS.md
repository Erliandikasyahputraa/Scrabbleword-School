# Known Limitations

## InfinityFree & Shared Hosting Limitations
- **No SSH Access:** `php artisan` commands cannot be run in production.
- **No Symlinks:** `php artisan storage:link` is disabled, requiring explicit file streaming controllers.
- **No Queue Worker:** Long-running processes (e.g., emails) must run synchronously, risking timeouts.
- **No Redis/Memcached:** Caching and sessions must fall back to the `file` driver.
- **Upload Limits:** PHP `upload_max_filesize` is strictly enforced (often 10MB) and cannot be overridden via `ini_set`.
- **Execution Time:** Strict limits (often 30s) on script execution time.
- **No Scheduler:** Cron jobs are severely limited or absent.
