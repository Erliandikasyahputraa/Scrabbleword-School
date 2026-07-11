# Project Memory

This document tracks overall project state, decisions, and system constraints.

## Project Context
- **Name**: Scrabble Wordseser
- **Goal**: Interactive learning platform where students learn from PDFs and solve crossword puzzles based on clues.
- **Tech Stack**: React 19, TypeScript, TailwindCSS 4, shadcn/ui, Laravel, MySQL.

## Reference Repositories Decisions
- **Crossword Layout**: Reuse the fitting algorithm from `Crossword-Layout-Generator` (ported to TypeScript) to generate grid positions client-side.
- **PDF Viewer**: Wrap core `pdfjs-dist` rendering APIs with a custom React component using canvas, avoiding the heavy default viewer.
- **App Layout**: Adopt the feature-based folder structure and collapsible sidebar layouts from `shadcn-admin`.
- **List Sync**: Synchronize sorting and pagination states with URL query parameters, following patterns from `shadcn-table`.

## Bootstrap Stage Decisions
- **TASK_QUEUE Location**: Relocated from `references/` to the project root directory.
- **Frontend Config**: Configured path aliases (`@/*`) pointing to `src/*`, styled using TailwindCSS v4 inside `index.css`.
- **Backend Config**: Switched DB connection connection drivers from default SQLite to MySQL inside `.env`.
- **Boilerplates**: Created controllers, models, requests, services, and routing rules as empty foundation structures, verifying that the frontend compiles cleanly under production builds.

## Current System Constraints & State
- **Feature Freeze**: As of Stage 3A, the project is under a strict Feature Freeze to prepare for thesis demonstration. No new non-MVP features (Gamification, Badges, Chat, Exporting) are permitted. Architecture must remain simple (Controller -> Service -> Eloquent).
- **Role Scoping**: Teachers and Admins have extended dashboard analytics and detailed paginated student monitoring views per course. Students have progress, history tracking, and categorized continue-learning hubs. Pending/rejected users are securely isolated.
- **Strict UI Patterns**: All dangerous actions (deletions, rejections) must route through the global `<ConfirmDialog>` instead of native alerts.
- **Silent Auditing**: The frontend enforces a strict zero-warning, zero-error console policy for production builds.

## Stage 3A Decisions
- **Lifecycle Engine**: Submissions track `started_at`, `reading_finished_at`, and `submitted_at` to accurately gate interaction (PDF -> Crossword) and prevent state skipping.
- **Server-Side Data**: Moved large data filtering, sorting, and pagination for `Courses`, `StudentHistory`, and `TeacherMonitoringDashboard` (including material filter and sort combo) to the backend (Eloquent paginator) to ensure scalable performance.
## Sprint 1 UI/UX Polish Decisions
- **Design System Foundation**: Implemented semantic design tokens (Tailwind v4 CSS variables) in `index.css` (e.g. `--primary`, `--card`, `--muted`).
- **Component Library**: Migrated away from duplicated tailwind utility strings by centralizing UI elements into `src/components/ui/` (`Badge`, `Table`, `Input`, `Select`, `EmptyState`, `LoadingSystem`).
- **Dashboard Refactor**: Migrated `Dashboard.tsx`, `Courses.tsx`, and `CourseDetail.tsx` to use these consistent tokens.

## Sprint 1.1 Responsive Foundation Decisions
- **Mobile First Approach**: Enforced strict rules against horizontal scrolling by wrapping Tables in `overflow-x-auto` or gracefully degrading to two-column stacked `Card` lists on smaller viewports.
- **Constrained Overlays**: Refactored all modals (`CourseFormModal`, `MaterialFormModal`, `StudentAssignmentModal`, `ConfirmDialog`) to guarantee a `w-[95vw]` max width with safe inner scrolling `max-h-[90vh]` on mobile devices.
- **Learn Portal Fluidity**: The PDF and Crossword containers in `LearnPortal.tsx` now stack naturally via CSS Grid without artificial min-height constraints on mobile.
- **Official Branding**: The application `index.html` title is finalized as "Crossword Labs".

## Sprint 2 Branding & Visual Identity Decisions
- **SVG Illustration System**: Instead of loading heavy external assets, implemented a custom `Illustrations.tsx` library using inline SVG paths (Teacher, Achievement, Empty States).
- **Brand Assets**: Designed a dynamic SVG `Logo.tsx` component that reacts to theme changes.
- **Identity Enforcement**: Standardized the core color palette to a vibrant Blue (`blue-600`), Yellow (`yellow-500`), and semantic success/warning/danger colors.
- **Subtle Theming**: Injected `BrandBackground.tsx` (1-4% opacity crossword/dot grids) across all layouts to give the empty space an educational identity without reducing contrast.

## Sprint 2.2 Learning Experience Polish Decisions
- **Premium Workspace**: Enforced a 25/75 layout split in the Crossword Builder to give the preview area maximum real estate.
- **Crossword Verisimilitude**: Enforced `aspect-square`, solid black/white cell borders, and thin 1px gaps so the digital board perfectly mimics traditional printed crosswords without any horizontal distortion.
- **KPI Consistency**: Regulated all dashboard metric cards to use identical icon containers, font sizes, and padding, dropping excessive decorative watermarks in favor of a cleaner hierarchy.

## Sprint 2.4 Builder Experience Redesign Decisions
- **Unified Workspace Flow**: Reorganized `MaterialFormModal` into a strict layout keeping Title and PDF Upload distinct at the top, while delegating the entire 70/30 Builder Workspace (Preview on Left, Tools on Right) underneath to match professional productivity tooling (like Figma and Notion AI).
- **Theme Persistence Engine**: Themes are now stored in `localStorage` directly within the `CrosswordThemeProvider`, maintaining state across the entire application without triggering reloads or regenerating the crossword.
- **Custom Uploads**: Replaced native HTML file inputs with a styled `CustomUploadField` component that tracks drag-and-drop states and explicitly displays file sizes and names.

## Sprint 2.5 & Release Candidate 1 (RC-1) Decisions
- **Single Scroll Principle**: Instituted a hard architectural rule that inside any single screen (Modals, Builder, PDF Viewer) there must never be nested scrollbars. Natural browser-level or container-level single scrolling is enforced.
- **Dual-Pane Desktop Learning**: Finalized `LearnPortal.tsx` to a definitive dual-pane layout on desktop (Option B). The PDF Viewer on the left and Crossword Workspace on the right coexist side-by-side to eliminate tedious navigation.
- **Builder Workflow Hierarchy**: Enforced a strict vertical hierarchy in the Builder's Right Sidebar (Add Word -> Theme Gallery -> Word List -> Generate -> Save), pushing the entire left pane to focus purely on the Crossword Preview.
- **Intelligent Grid Scaling**: Perfected the `CrosswordPreview` and `CrosswordBoard` scaling algorithm, ensuring the board maximizes available space without clipping, distortion, or losing its perfect square aspect ratio up to its absolute bounding limits.
- **Theming Standardization**: Standardized all internal crossword cells (white cell, dark block, yellow select, green complete) to ensure 100% readability across all themes. Theming now exclusively applies to outer board frames, shadows, and subtle SVG backgrounds (2-5% opacity custom doodles).
- **Context Stability**: Eradicated the persistent `useCrosswordTheme` runtime crash by shifting the context creation and exports completely out of the Provider module, preventing duplicate Context instances caused by Vite HMR.

## RC-2 Premium Theme Engine Decisions
- **Local SVG Icon Architecture**: Sourced all theme illustration paths from `lucide-react` (ISC License, already installed). SVG path data is embedded directly in `ThemeBackground.tsx`. Zero external CDN dependencies, 100% offline capable.
- **ThemeBackground Component**: Created `src/components/crossword/ThemeBackground.tsx` as a self-contained SVG renderer. Each theme maps to a specific function (e.g., `EducationBackground`, `SpaceBackground`) that positions Lucide icon paths at 2-5% opacity behind the crossword.
- **Atmosphere-Only Principle**: Cell standardization is enforced globally (white cells, dark blocks, yellow selection, green completion). Themes only affect `background`, `board`, and the `ThemeBackground` SVG layer.
- **Live Theme Transition**: `CrosswordBoard` wraps the background in `transition-all duration-500`, making theme switches instantaneous without re-rendering the game state.
- **Batik Motif Fidelity**: Kawung motif uses 4 overlapping ellipses with a center circle; Parang uses sweeping diagonal bezier S-curves — both are authentic simplified versions of traditional Indonesian textile patterns.
