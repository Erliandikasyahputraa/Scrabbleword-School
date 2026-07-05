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
