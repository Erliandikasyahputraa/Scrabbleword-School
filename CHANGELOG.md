# Changelog

All notable changes to this project will be documented in this file.

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
