# CrosswordLabs

## Project Overview
CrosswordLabs is a comprehensive web application designed for learning management and crossword puzzle integration. It consists of a decoupled architecture featuring a React-based frontend and a Laravel 11/13 backend, tailored for deployment on InfinityFree shared hosting and Vercel.

## Features
- Stateless authentication via Laravel Sanctum
- Role-Based Access Control (RBAC)
- Course and Material Management
- Interactive Crossword Engine integration
- Real-time API Console

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Laravel (PHP 8.3), MySQL
- **Deployment:** Vercel (Frontend), InfinityFree (Backend)

## Folder Structure
- `/project/backend`: Local Laravel source code.
- `/project/frontend`: React TypeScript frontend.
- `/project/deployment/core`: Production-ready Laravel backend (prepared for InfinityFree).

## Installation
1. Clone the repository.
2. Backend: `composer install`, copy `.env.example` to `.env`, `php artisan key:generate`.
3. Frontend: `npm install`, `npm run dev`.

## Environment Variables
- `APP_URL`: Backend API URL
- `FRONTEND_URL`: React application URL
- `DB_*`: MySQL connection details

## Deployment
See `docs/DEPLOYMENT_GUIDE.md` for InfinityFree and Vercel specifics.

## API
See `docs/API_REFERENCE.md` for endpoint details.
