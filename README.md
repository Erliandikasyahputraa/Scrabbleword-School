# TekaTeki - Interactive Learning Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

**TekaTeki** is an interactive educational platform designed for schools, empowering teachers to create engaging reading materials combined with interactive crossword puzzles. It aims to improve student retention and engagement through active recall mechanisms seamlessly integrated into course modules.

---

## 🌟 Project Overview

TekaTeki solves the problem of passive reading in education by forcing students to actively recall what they just read. 

### Key Features
- **Visual Crossword Builder**: Teachers can instantly generate playable crosswords from a list of words and clues—no technical JSON knowledge required!
- **PDF Streaming & Viewer**: Native high-DPI PDF rendering with secure backend streaming.
- **Role-based Dashboards**: Distinct experiences for Admins, Teachers, and Students.
- **Progress Tracking engine**: Auto-calculates completion rates, averages scores, and tracks student progress across entire courses.
- **REST API Driven**: Fully decoupled modern stack.

---

## 🏗 Architecture

TekaTeki follows a strict separation of concerns, built as an API-first monolithic backend interacting with a Single Page Application (SPA) frontend.

### Frontend Architecture
- **Framework**: React 18 + Vite (TypeScript).
- **Styling**: Tailwind CSS (Utility-first, responsive, themable).
- **State Management**: React Query (`@tanstack/react-query`) for remote state caching, Context API for isolated local states (e.g., `CrosswordProvider`).
- **Routing**: React Router DOM (v6).
- **PDF Rendering**: `react-pdf` for robust, cross-platform PDF parsing.

### Backend Architecture
- **Framework**: Laravel 11.
- **Authentication**: Laravel Sanctum (Stateful SPA cookie-based auth).
- **Database**: SQLite (Configurable to MySQL/PostgreSQL).
- **Architecture**: Fat Models, Thin Controllers. Resources return strict JSON responses using Form Requests for validation.

---

## 📁 Folder Structure

```text
scrabblewordseser/
├── project/
│   ├── backend/               # Laravel API Source
│   │   ├── app/Models/        # Eloquent Models & Relationships
│   │   ├── app/Http/          # Controllers, Middleware, Requests
│   │   ├── database/          # Migrations & Seeders
│   │   └── routes/            # API Route definitions
│   │
│   └── frontend/              # React SPA Source
│       ├── src/
│       │   ├── components/    # Reusable UI & Feature modules
│       │   ├── lib/           # Utilities (e.g., CrosswordGenerator)
│       │   ├── providers/     # React Context Providers
│       │   ├── routes/        # Page-level components
│       │   └── types/         # TypeScript interfaces
└── docs/                      # Generated Documentation (Walkthroughs)
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v20+)
- PHP (v8.2+)
- Composer

### 1. Backend Setup

```bash
cd project/backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

### 2. Frontend Setup

```bash
cd project/frontend
npm install
```

### 3. Running Locally

You need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd project/backend
php artisan serve
# Runs on http://localhost:8000
```

**Terminal 2 (Frontend):**
```bash
cd project/frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🎲 Seeder & Demo Environment

To instantly populate the application with a realistic dataset (7 Subjects, 14 Courses, 28 Materials, Teachers, Students, Enrollments, and Submissions), run:

```bash
cd project/backend
php artisan migrate:fresh --seed
```

**Demo Accounts (Password: `password`):**
- **Super Admin**: `admin@example.com` (System-wide access)
- **Teacher**: `teacher@example.com` (Has created 14 courses and 28 materials)

**Student Personas (Password: `password`):**
To facilitate both realistic dashboard statistics and manual QA for different user journeys, the seeder provisions 5 distinct student accounts:
1. `student1@example.com`: **Brand New Learner**. 0% Progress. Enrolled in all courses but has never opened any materials or submitted anything. Perfect for testing a clean state.
2. `student2@example.com`: **Reader Only**. Has opened and read some PDFs, but has never attempted any crosswords.
3. `student3@example.com`: **Active Participant**. Has completed several crosswords successfully, but left others untouched.
4. `student4@example.com`: **Average Student**. Has roughly 50-70% progress across all courses.
5. `student5@example.com`: **Overachiever**. Has 100% fully completed every single material and crossword in the platform.

---

## 🛡 Roles & Permissions

- **Student**: Can view enrolled courses, read PDFs, submit crosswords. Cannot modify courses or materials.
- **Teacher**: Can create/edit/delete courses, upload PDFs, use the Crossword Builder, and view class statistics.
- **Admin**: Can approve/reject newly registered accounts and manage system-wide settings.

---

## 🛣 Roadmap & Future Work

- [x] **Priority 1**: Core Entity Lifecycle & MVP.
- [x] **Priority 2**: Teacher UX, Visual Crossword Builder.
- [ ] **Priority 3**: Strict Learning Pipelines (Locking crosswords until PDF is completely read).
- [ ] **Priority 4**: Gamification (Badges, Streaks, Leaderboards).
- [ ] **Priority 5**: Mobile Responsiveness Polish.

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 👥 Contributors

Built by the Engineering Team. For contributions, please submit a Pull Request describing the architectural rationale behind your changes.
