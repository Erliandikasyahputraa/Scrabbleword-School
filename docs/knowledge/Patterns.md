# Architectural & Design Patterns Knowledge Base

This document synthesizes common design patterns used to structure applications and manage states.

## 1. Monorepo Package Federation
- **Concept**: Split large applications into discrete packages (e.g., UI components, documentation sites, API clients) within a single repository to organize codebases clearly.
- **Repositories Analyzed**: `magicui`
- **Application**:
  - Uses PNPM workspaces to link local packages together.
  - Turborepo manages the build pipeline, running tasks in parallel and caching outputs to speed up subsequent builds.

## 2. Dynamic State Sync with URLs
- **Concept**: Synchronize table states (filters, sorting, pagination) directly with URL query parameters.
- **Repositories Analyzed**: `shadcn-table`, `shadcn-admin`
- **Application**:
  - Treats the browser URL as the single source of truth for lists.
  - Updating a filter modifies the URL search query, which automatically updates the page state. This makes it easy for users to bookmark and share filtered views.

## 3. Worker-Thread Separation
- **Concept**: Run heavy tasks (like parsing large binary PDF files) in background worker threads to keep the main UI thread responsive.
- **Repositories Analyzed**: `pdf.js`
- **Application**:
  - Heavy parsing calculations run in a Web Worker, while the main thread focuses entirely on canvas rendering and user interactions.
