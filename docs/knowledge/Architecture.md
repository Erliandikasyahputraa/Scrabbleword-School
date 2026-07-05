# Architectural Patterns Knowledge Base

This document synthesizes architectural patterns observed across the analyzed reference repositories.

## 1. Feature-Based Architecture
- **Concept**: Organize codebase directories by domain feature (e.g. `users`, `tasks`, `auth`) rather than purely by technical layer (e.g. `components/`, `hooks/`, `apis/`).
- **Repositories Analyzed**: `shadcn-admin`, `shadcn-table`
- **Application**:
  - Encapsulates domain logic, hooks, state stores, and page-specific components within a single directory (e.g., `src/features/users/`).
  - Limits exposure of feature files to the rest of the application via explicit entry points (index barrels).

## 2. Decoupled Core & Presentation Layouts
- **Concept**: Separate computational engines (algorithms, parser backends) from the visual presentation layer (DOM, CSS libraries).
- **Repositories Analyzed**: `Crossword-Layout-Generator`, `pdf.js`
- **Application**:
  - **Crossword Layout**: The fitting engine runs inside a pure Javascript module (`layout_generator.js`), emitting pure JSON metadata (grid matrix, word coordinates). The HTML layer handles input collection and output styling.
  - **PDF Renderer**: Renders document data in background workers, passing drawing payloads to the UI layer, which displays them on HTML5 Canvases and DOM text overlays.

## 3. URL-As-State Management
- **Concept**: Maintain application state (especially filters, sort parameters, and pagination) directly in the URL query string.
- **Repositories Analyzed**: `shadcn-table`, `shadcn-admin`
- **Application**:
  - The URL acts as the single source of truth for list views.
  - Selecting a filter modifies browser URL queries, triggering state changes and database calls. This enables users to share links that preserve their exact filter and pagination views.

## 4. Client-Side Copy-Paste Registry
- **Concept**: Component distribution models that emphasize copy-pasting source code over installing bulky NPM package dependencies.
- **Repositories Analyzed**: `magicui`
- **Application**:
  - Components are designed to be self-contained in single files.
  - Promotes code ownership, as developers can edit styles directly in their project directories without dealing with NPM package wrappers.
