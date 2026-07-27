# Maintenance Guide

## How to Update
1. Develop and test changes in `project/backend`.
2. Mirror changes to `project/deployment/core`.
3. Zip `core` and upload via FTP.

## How to Deploy
See `DEPLOYMENT_GUIDE.md`.

## How to Rollback
Maintain historical `.zip` files of the `core` directory. To rollback, wipe the server's `htdocs` and extract a previous `.zip`.

## How to Debug
Enable `APP_DEBUG=true` in the `.env` file temporarily via FTP. View the `storage/logs/laravel.log` file directly through the hosting File Manager.

## How to Backup Database
Use phpMyAdmin export functionality to download a `.sql` file of the entire schema and data.

## How to Rotate APP_KEY
Generate a new key locally (`php artisan key:generate --show`), update the `.env` on the server, and invalidate all existing sessions/tokens.

## How to Update Environment Variables
Edit the `.env` file directly using the InfinityFree web-based File Manager or download/edit/upload via FTP.
