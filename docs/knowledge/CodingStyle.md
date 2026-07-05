# Coding Style & Standards Knowledge Base

This document synthesizes code structure guidelines, naming conventions, and file organization rules observed in the reference codebases.

## 1. Type Safety & TypeScript Guidelines
- **Guidelines**:
  - Prefer strong types (`interface`, `type`) over `any` declarations.
  - Define prop types explicitly for all React components.
  - Use Zod schemas to validate external payloads (e.g. form inputs, API responses) before processing them in the application.
- **Repositories Analyzed**: `shadcn-admin`, `shadcn-table`, `magicui`

## 2. Naming Conventions
- **Files**:
  - **React Components**: Use PascalCase (e.g. `AppSidebar.tsx`, `BentoGrid.tsx`).
  - **Hooks**: Prefix hook files with `use-` in lowercase kebab-case (e.g. `use-local-storage.tsx`, `use-data-table.ts`).
  - **Utilities**: Use camelCase or kebab-case (e.g. `layout_generator.js`, `ui-utils.ts`).
- **Variables & Functions**:
  - Use camelCase for standard variables and functions (e.g. `buttonClicked`, `generateLayout`).
  - Use UPPER_SNAKE_CASE for global constants (e.g. `DEFAULT_THEME`, `MAX_GRID_SIZE`).

## 3. CSS & Tailwind Class Organization
- **Guidelines**:
  - Keep Tailwind utility classes organized logically (e.g., structural classes first, spacing next, colors/typography last).
  - Use prettier plugins (`prettier-plugin-tailwindcss`) to sort Tailwind classes automatically.
  - Group style variants cleanly using `class-variance-authority` (CVA).
- **Repositories Analyzed**: `magicui`, `shadcn-admin`, `shadcn-table`
