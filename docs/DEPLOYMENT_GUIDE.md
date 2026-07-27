# Deployment Guide

## Local Environment (Laragon)
1. Start Laragon (Apache/Nginx & MySQL).
2. Point a virtual host to `project/backend/public`.
3. Run migrations: `php artisan migrate`.

## Frontend (Vercel)
1. Connect the repository to Vercel.
2. Set Build Command: `npm run build`.
3. Set Output Directory: `dist`.
4. Set Environment Variables: `VITE_API_URL`.

## Backend (InfinityFree)
1. Zip the contents of `project/deployment/core`.
2. Upload to the `htdocs` directory via FTP (FileZilla).
3. Unzip via the InfinityFree File Manager.

### Database Import
1. Create a MySQL database in the InfinityFree panel.
2. Open phpMyAdmin.
3. Import `project/deployment/database/database.sql`.

### Environment Variables
Update the `.env` file via FTP with the InfinityFree DB credentials.

### Rollback
Keep backups of the previous `.zip` release. To rollback, delete `htdocs` contents and extract the older `.zip`.

### Common Problems & Troubleshooting
- **500 Error:** Check `.env` syntax or file permissions (directories 755, files 644).
- **Database Connection Error:** Verify DB host, it is not `localhost` on InfinityFree.
