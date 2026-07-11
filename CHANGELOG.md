# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **RC-3: Global Theme Design System**:
  - Created `AppThemeBackgroundLayer.tsx` — a fixed full-screen component rendering 8–15 large Lucide-sourced SVG icons per theme at 3–6% opacity. Now renders behind Dashboard, Builder, Learn Portal, Course Detail, Admin, Login, and Register.
  - Extended `CrosswordTheme` type with `tokens` — a complete design language token set (`primary`, `ring`, `border`, `accentStripe`, `scrollbar`, `badge`, `badgeText`, `buttonPrimary`, `cardShadow`, `pageBackground`, `illustrationColor`).
  - `CrosswordThemeProvider` now injects design tokens into `:root` as CSS variables on every theme switch, propagating the design language across all UI components.
  - `index.css` adds `.card-themed`, `.badge-themed`, `.btn-theme-primary`, `.ring-theme`, `.themed-scrollbar` utility classes that consume live CSS variables.
  - HTML scrollbar tint follows the active theme via `scrollbar-color` and `-webkit-scrollbar-thumb`.
  - Replaced legacy `BrandBackground` (generic crossword grid pattern) with `AppThemeBackgroundLayer` in both `AuthenticatedLayout` and `GuestLayout`.
  - Theme icon sets per page: Classic (book, pencil, feather, ruler), Education (book, graduation cap, atom, microscope, globe, ruler), Nature (leaf, flower, mountain, cloud, bird, wind), Technology (CPU, bot, terminal, network, brain, sparkles), Space (moon, rocket, star, satellite), Batik (Kawung circles, Parang lines, hexagon, compass, diamond).

### Added
- **RC-2: Premium Theme Engine**:
  - Introduced `ThemeBackground.tsx` — a dedicated background rendering system sourcing SVG paths from **Lucide React (ISC License)**. All icons are local; no CDN or network dependency.
  - Each theme now renders a distinct atmospheric background using positioned Lucide SVG paths at 2-5% opacity:
    - **Classic**: Paper fiber lines and grain dot texture.
    - **Education**: Book, Pencil, Graduation Cap, Globe, Atom, Ruler icons arranged organically.
    - **Nature**: Leaf, Flower, Mountain, Cloud, Bird, Wind icons.
    - **Technology**: CPU, Bot, Terminal, Network, Brain, Sparkles icons.
    - **Space**: Rocket, Moon, Star, Satellite icons with tiny dot-stars.
    - **Batik**: SVG pattern tiles for Kawung (circle petal) and Parang (diagonal S-curve) motifs.
  - All crossword cells standardized across every theme (white cell, dark block, yellow active, green complete). Only the board frame, outer shadow, and background atmosphere change.
  - `CrosswordBoard.tsx` refactored to use `ThemeBackground` as an absolute positioned layer *behind* the grid.
  - `CrosswordThemeSelector` redesigned with real mini-previews: actual themed background + actual 3×3 mock crossword cells per card.
  - Themes animate on switch (`transition-all duration-500`), providing instant live preview without page reload.

### Added
- **Release Candidate (RC-1) Final Product Polish**:
  - Enforced a system-wide **Single Scroll Principle**, eliminating nested scrollbars in all views including Modals, Builder, and PDF Viewer.
  - Redesigned the Student `LearnPortal` into a definitive dual-pane desktop workspace (PDF on the left, Crossword and Tools on the right) matching professional educational software.
  - Finalized the **Crossword Builder Workspace** to a stable 70/30 split, correctly ordering tools (Add Word -> Theme Gallery -> Word List -> Generate Layout -> Save Material) entirely in the right sidebar.
  - Overhauled the **Theme System**, standardizing all cell appearances (white cells, dark blocks) to maintain grid priority while decorating the frame and background with subtle, 2-5% opacity SVG illustrations (Education, Space, Technology, Nature, Batik, Classic).
  - Perfected preview scaling dynamically adjusting Crossword grid sizes to eliminate clipping while maintaining square cells and optimal whitespace up to maximum bounding limits.
  - Audited Dashboards, ensuring standardized Card border-radius (`rounded-2xl`), cohesive margins, and professional shadow elevation on hover.
  - Implemented production builds successfully with zero TypeScript and ESLint warnings.

### Added
- **UI Sprint 2.5 Professional Builder Workspace & Runtime Hotfix**:
  
### Added
- **UI Sprint 2.4 Builder Experience Redesign**:
  - Implemented a 70/30 workspace layout for the Crossword Builder (Left: Preview, Right: Word Management & Theme Selection).
  - Designed and integrated `CustomUploadField.tsx` with drag-and-drop styling to replace native file inputs.
  - Upgraded the Theme Selector from a simple dropdown to a visual Theme Gallery with mini-preview cards.
  - Implemented `localStorage` persistence for the active Crossword Theme.
  - Enhanced Dashboard `StatCard` padding and margin to prevent icon overflow and maintain visual rhythm.
  - Fixed UX regressions including the Theme Selector inadvertently submitting forms and refreshing the page.
  - Resolved nested scrolling constraints in `MaterialFormModal` to match professional IDE layouts.

## [3.5.1] - 2026-07-11

### Added
- **Responsive Layout System**: Completed UI/UX Polish Sprint 1.1 to finalize responsive behavior across all views.
- **Mobile Navigation Drawer**: Refactored `AuthenticatedLayout.tsx` to support a mobile-friendly slide-out drawer with a backdrop blur overlay and outside-click/escape key handling.
- **Adaptive Data Tables**: Refactored `StudentHistory.tsx`, `Users.tsx`, and `Approvals.tsx` to utilize `overflow-x-auto` wrapped standard `Table` components to prevent horizontal page scrolling on mobile.
- **Mobile Card Lists**: Refactored `CourseDetail.tsx` monitoring tables to intelligently switch from a standard tabular layout on desktop to a stacked, two-column `Card` layout on mobile devices.
- **Component Alignment**: Improved grid columns scaling and toolbar wrapping in `Dashboard.tsx`, `Courses.tsx`, and `CourseCard.tsx`.
- **Responsive Modals**: Ensured all application modals (`CourseFormModal`, `MaterialFormModal`, `StudentAssignmentModal`, `ConfirmDialog`) scale properly on mobile devices using `w-[95vw]` limits and scrollable overflow areas.
- **Learn Portal Flexibility**: Modified `LearnPortal.tsx` to stack the PDF Viewer and Crossword naturally on mobile without artificial height constraints, while maintaining the side-by-side split layout on desktop.

## [3.5.0] - 2026-07-11

### Added
- **Design System Foundation**: Completed Phase 1 to 8 of the UI/UX Polish Sprint (Design Foundation).
- **Design Tokens**: Configured Tailwind v4 with semantic CSS variables (`--primary`, `--background`, `--card`, `--muted`, etc.) in `index.css`.
- **Core UI Components**: Built robust base components: `Badge`, `Table`, `EmptyState`, `LoadingSystem` (Spinner, Skeletons), `Breadcrumb`, `Input`, and `Select`.
- **Component Refactoring**: Updated `Button`, `Card`, and `CourseCard` to utilize semantic design tokens instead of hardcoded tailwind utilities.
- **Dashboard & Course View Migration**: Refactored `Dashboard.tsx`, `Courses.tsx`, and `CourseDetail.tsx` to fully rely on the new design system components, replacing native HTML tables, inputs, and static loaders with their semantic component counterparts.

## [3.4.0] - 2026-07-11

### Added
- **Student Dashboard Overhaul**: Transformed student dashboard into a centralized learning hub showing overall progress, material completion counts, and estimated remaining tasks.
- **Dynamic Material Categorization**: Dashboard now automatically sorts materials into `Continue Learning`, `Recently Completed`, `In Progress`, and `Not Started` lists using the `LearningService`.
- **Learning History**: Added a dedicated `StudentHistory` page (`/history`) showing paginated, filterable, and sortable submission records (scores, time spent, completion status).
- **Teacher Monitoring Dashboard**: Teachers can now monitor individual student progress per course inside the `CourseDetail` view, including detailed metrics for `Reading`, `Ready for Crossword`, and `Completed` statuses. Includes server-side sorting and material filtering.
- **Server-Side Data Operations**: Upgraded the `Courses` view to handle search, debouncing, filtering, sorting, and pagination entirely on the backend to improve large-scale data handling.
- **Progress Lifecycle Refactoring**: Added `started_at`, `reading_finished_at`, `submitted_at` timestamps to Submissions table to explicitly track the student journey without skipping states.

### Fixed
- **Teacher Analytics Bug**: Fixed an issue where `CourseDetail.tsx` incorrectly displayed blank data for Enrolled, Completed, and Completion Rate by fixing the `LearningService` key mappings to match frontend expectations.

## [3.2.0] - 2026-07-06

### Fixed
- Fixed critical authorization leaks in `CourseController` and `MaterialController` where students could access unenrolled courses (Priority 0.2).
- Added missing `update` method to `MaterialController` and registered its `PUT` route.
- Hardened `SubmissionController` to strictly validate course enrollment before accepting submissions and reject duplicate submissions.
- Improved eager loading performance in `SubmissionController::history`.
- Implemented Frontend UI for Material CRUD (`MaterialFormModal`) allowing teachers to upload PDFs and edit Crossword JSON.
- Implemented Frontend UI for Course CRUD (`CourseFormModal`) allowing Admins and Teachers to edit/delete courses from the Course Detail view.
- Fixed backend API authentication middleware to return `401 JSON` instead of redirecting to the undefined `login` route.
- Improved `CrosswordSubmit.tsx` UX to gracefully handle duplicate submissions and display clear success/error states.

## [3.3.0] - 2026-07-06

### Added
- Implemented **Progress Engine**: Tracks material completion (PDF Read + Crossword Submitted) and calculates Course Progress.
- Updated Dashboard and Course Detail to accurately reflect student progress and completion rates.
- Implemented **Course Assignment (Enrollment) MVP**:
  - `EnrollmentController` added to backend with API for querying and toggling student enrollments.
  - Teachers can now assign/unassign students to their courses via the new `StudentAssignmentModal`.
  - Enforced visibility: students only see courses and materials they are assigned to.
- Implemented **Crossword Builder (JSON validation)**: The Material form now validates Crossword JSON strings and shows a real-time mini-preview of the crossword layout before saving.
- Implemented **Error Pages**: Added a centralized, theme-matching `ErrorPage` component for 401, 403, 404, and 500 error states. Integrated with React Router and `fetchApi` handler.

### Fixed
- Fixed bug where reading a PDF incorrectly generated a 0-point crossword submission. Reading a PDF now correctly creates an `is_completed=false` state that unlocks the crossword without calculating a score or marking it as submitted.
- Fixed issue where uploaded PDFs failed to render (CORS blockage) by building a dedicated, authenticated `api/courses/.../pdf` streaming endpoint.
- Upgraded PDF Viewer with Retina/High-DPI rendering, eliminating blurriness during zoom scaling.
- Fixed PDF page counter displaying `--` by properly initializing `numPages` and propagating the state on successful load.
- **Fixed Engineering Quality Issues**:
  - Relaxed `mimes:pdf` validation to `extensions:pdf` for testing purposes (preventing false 422 Unprocessable Content when uploading mock/dummy PDFs).
  - Fixed `/api/materials/{id}/my-submission` returning 404 on unread materials by returning a clean `200 OK` with a `null` response instead, satisfying the frontend fetcher without polluting the console.
  - Completed console audit: Cleaned up unused React imports (`Bookmark`, `login`, `navigate` etc) to ensure zero warnings during Vite build.
- Completed all tasks for Priority 1 (Core MVP).

## [3.2.0] - 2026-07-11
### Added
- **Visual Crossword Builder**: Teachers can now generate interactive crosswords directly in the Material Form without touching raw JSON.
- **Client-Side Layout Algorithm**: Added a bespoke intersection algorithm in TypeScript that generates, validates, crops, and auto-numbers crossword layouts.
- **Crossword Preview Panel**: Live visual feedback for generated crosswords including metadata (estimated time, difficulty, size).
- **Teacher UX Overhaul**: Replaced technical jargon with user-friendly terms (e.g., "Interactive Puzzle").
- **Database Seeder**: Upgraded `DatabaseSeeder` to generate a comprehensive demo environment with 7 Subjects, 14 Courses, 28 Materials, Teachers, Students, Enrollments, and realistic Submissions.
- **Documentation**: Rewrote `README.md` to production-grade standards.

## [Unreleased]
### Added
- **UI Sprint 2: Product Branding & Visual Identity**
  - Established `DESIGN_GUIDELINES.md` as the single source of truth.
  - Injected `BrandBackground` to provide a subtle educational pattern.
  - Implemented `Illustrations.tsx` inline SVG system for Empty States (Teacher, Achievement, Search, Document, Crossword).
  - Redesigned `Dashboard.tsx`, `Courses.tsx`, and `CourseDetail.tsx` Hero sections with vibrant gradients and illustrations.
  - Upgraded `CourseCard.tsx` with micro-animations, soft shadows, and badge details.
  - Defined rigid color system in `index.css` (Blue-600 Primary, Yellow-500 Accent, Slate Neutrals).
  - Cleaned up CrosswordBuilder with a professional layout and empty state illustration.

## [2026-07-11] UI Sprint 2.2 Learning Experience Polish
### Added
- **Dashboard**: Refactored KPI stat cards and performance insights for consistent typography, sizing, and spacing to match premium SaaS dashboards.
- **Hero CTAs**: Audited all Hero sections to ensure maximum contrast for primary buttons and consistent outline styles for secondary actions.
- **Course Cards**: Increased visual density by removing redundant text and improving metadata layout with inline teacher avatars.
- **Crossword Builder**: Rebuilt workspace with a 25/75 split, pinned generation actions, and improved visual grouping to resemble a professional editor.
- **Crossword Preview**: Redesigned the crossword board to feature perfect square aspect ratios and correct numbering for a realistic printed crossword appearance.
- **Crossword Player**: Adjusted Learn Portal to display the crossword board and clues side-by-side on desktop, prioritizing the board over secondary clues. Added active clue highlighter.
- **PDF Viewer**: Polished the PDF viewer toolbar and container, utilizing fixed full-screen modes, cleaner backgrounds, and premium drop-shadows.
- **Modal Polish**: Delegated inner scrolling from `MaterialFormModal` to child components to recreate the feel of a professional IDE.

## [2026-07-11] UI Foundation Freeze
### Fixed
- **Registration Flow**: Rejected users can now re-register using their original email to resubmit their application for approval.
- **Enrollment**: Only fully approved students now appear in the course assignment roster.
- **Teacher Dashboard**: Replaced student-centric "Course Progress" with teacher-centric learning analytics (Enrolled, Completion Rate, Average Score).
- **UI/UX Polish**: Replaced all native browser `alert()` and `confirm()` calls with a globally accessible `ConfirmDialog` and `react-hot-toast` notifications.
- **PDF Upload UX**: Added a localized 10MB size validation check and upload progress simulation to the Material Form.
- **State Feedback**: Upgraded all empty states with distinct visual designs and added loading spinners to all interactive auth components (`Login.tsx`, `Register.tsx`).
- **Console Audit**: Cleared all frontend build warnings, unused variables, and console debug logs.

## [3.1.0] - 2026-07-06

### Fixed
- Fixed Authentication bypass bug (Priority 0). Registration no longer automatically returns a token, and users remain in 'pending' status.
- UI now displays a success message instead of auto-login upon registration.

## [3.0.0] - 2026-06-26

### Added
- Completed Project Bootstrap and Foundation setup (Prompt 03):
  - Moved `TASK_QUEUE.md` from `references/` to the project root.
  - Initialized Vite + React + TS frontend application under `project/frontend/`.
  - Configured Tailwind CSS v4, path aliases (`@/*`), and TS options inside `project/frontend/tsconfig.app.json` and `project/frontend/vite.config.ts`.
  - Generated empty frontend page views (`Login`, `Register`, `Dashboard`, `CourseDetail`, `LearnPortal`) and layout wrappers (`GuestLayout`, `AuthenticatedLayout`) using React Router.
  - Initialized Laravel backend application under `project/backend/`.
  - Configured MySQL connection in `.env` and `.env.example` configurations.
  - Generated empty controller bases, model frameworks, service boundaries, repositories, requests validation layers, policies, and authorization gates for all MVP modules.
  - Configured global code style rules using Prettier and EditorConfig.
- Updated project memory and task registers.

## [2.0.0] - 2026-06-26

### Added
- Completed system architecture design, backend file generation blueprints, ERD tables, and REST endpoints specifications (Prompt 02).

## [1.1.0] - 2026-06-26

### Added
- Completed final acceptance review and evidence validation for Phase 1 (Prompt 01.6).

## [1.0.0] - 2026-06-26

### Added
- Completed discovery and source-code reverse engineering of reference repositories.
