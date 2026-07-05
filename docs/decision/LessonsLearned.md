# Architectural lessons learned from reference analysis

This document outlines key technical lessons learned from analyzing the reference repositories.

## 1. Keep Algorithmic Engines Independent of UI Layouts
- **Lesson**: Don't mix complex algorithms (like fitting crossword grids) with UI presentation layouts.
- **Application**: The crossword engine should be written as a pure TypeScript utility. It should receive word arrays, compute positions, and output coordinates in a simple JSON structure. This lets the React layer focus entirely on rendering a clean visual grid using grid CSS variables.

## 2. Store List Views and Filters in the URL
- **Lesson**: Storing page parameters (filters, sorting, pagination) in React states instead of the URL makes sharing views difficult.
- **Application**: Synchronizing filters, searches, and pages with URL query parameters ensures that page states are preserved across reloads. This makes links shareable, helping teachers easily inspect submissions and student history.

## 3. Build Lightweight PDF Custom Wrappers
- **Lesson**: Importing full pre-packaged PDF viewers introduces heavy dependencies and makes customization difficult.
- **Application**: Build a custom React/Tailwind wrapper around the core `pdfjs-dist` engine. Let the core handle loading and rendering pages onto canvas elements, while the custom React app handles navigation controls, zooms, and layouts. This keeps the viewer lightweight and styling consistent.

## 4. Organize Repositories by Feature
- **Lesson**: Organising folders by technical layer (e.g., placing all hooks in `hooks/` and all components in `components/`) makes it harder to maintain features as the project grows.
- **Application**: Group files by logical domain features (e.g. `src/features/courses/`, `src/features/crossword/`). Place components, stores, and hooks specific to a feature inside its directory, keeping the codebase organized.
