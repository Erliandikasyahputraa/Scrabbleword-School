# Environment Setup

## Backend (.env)
Key environment variables required for the backend:
- `APP_URL`: Must match the backend's public URL.
- `FRONTEND_URL`: Must match the React application's URL for CORS.
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: Standard MySQL credentials.
- `APP_ENV=production` and `APP_DEBUG=false` for live deployment.

## Frontend (.env)
Key environment variables required for the frontend:
- `VITE_API_URL`: The absolute URL pointing to the Laravel backend API.
