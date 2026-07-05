# Missing Information & Unresolved Questions

This document lists open questions, missing technical information, and areas requiring clarification before entering the architecture phase.

## 1. Unresolved Technical Questions
- **Laravel Integration Details**:
  - The reference codebases are purely client-side React templates. We need to decide how to structure API responses and shape payloads to integrate the React frontend with the Laravel backend.
- **Drizzle ORM to Laravel Migrations**:
  - The database schemas in `shadcn-table` are written for Drizzle ORM. We need to map these tables to Laravel migration files (e.g. for student history).
- **PDF Text Selection Overlays**:
  - We need to confirm if we need full text selection overlays (with copy-paste support) in our PDF viewer MVP, or if rendering pages on standard canvas viewports is sufficient.

## 2. Unanswered Product Questions
- **Auth Provider Selection**:
  - `shadcn-admin` uses Clerk for authentication. Since our backend runs on Laravel, we must choose whether to use standard Laravel Sanctum tokens, session-based cookies, or an external provider like Clerk for authentication.
- **Crossword Layout Failure Handling**:
  - If the layout engine fails to fit all teacher-submitted words into a single connected grid, we need to decide whether to:
    - Display an error message asking the teacher to add more connecting words.
    - Or discard unconnected words and render a smaller grid containing only the matching subset.
