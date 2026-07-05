# Component Reference Map

This document maps reference components to their planned implementation in our learning platform.

## 1. Dashboard Layout Components

### AppSidebar
- **Source**: `shadcn-admin` ([app-sidebar.tsx](file:///c:/Mine/JOKI/scrabblewordseser/references/shadcn-admin/src/components/layout/app-sidebar.tsx))
- **Target**: `c:/Mine/JOKI/scrabblewordseser/project/frontend/src/components/layout/AppSidebar.tsx`
- **Purpose**: Collapsible sidebar navigation for students and teachers, showing active links based on current paths.

### Header
- **Source**: `shadcn-admin` ([header.tsx](file:///c:/Mine/JOKI/scrabblewordseser/references/shadcn-admin/src/components/layout/header.tsx))
- **Target**: `c:/Mine/JOKI/scrabblewordseser/project/frontend/src/components/layout/Header.tsx`
- **Purpose**: Top toolbar holding breadcrumbs, theme toggles, and user profile menus.

---

## 2. Interactive Data Components

### DataTablePagination
- **Source**: `shadcn-table` ([data-table-pagination.tsx](file:///c:/Mine/JOKI/scrabblewordseser/references/shadcn-table/src/components/data-table/data-table-pagination.tsx))
- **Target**: `c:/Mine/JOKI/scrabblewordseser/project/frontend/src/components/shared/DataTablePagination.tsx`
- **Purpose**: Reusable footer pagination control for student history, course lists, and submissions.

### PasswordInput
- **Source**: `shadcn-admin` ([password-input.tsx](file:///c:/Mine/JOKI/scrabblewordseser/references/shadcn-admin/src/components/password-input.tsx))
- **Target**: `c:/Mine/JOKI/scrabblewordseser/project/frontend/src/components/shared/PasswordInput.tsx`
- **Purpose**: Form field with show/hide password toggle.

---

## 3. Visual Presentation Components

### BentoGrid
- **Source**: `magicui` ([bento-grid.tsx](file:///c:/Mine/JOKI/scrabblewordseser/references/magicui/apps/www/registry/magicui/bento-grid.tsx))
- **Target**: `c:/Mine/JOKI/scrabblewordseser/project/frontend/src/components/shared/BentoGrid.tsx`
- **Purpose**: Interactive grid dashboard cards displaying course summaries and progress stats.

### BlurFade
- **Source**: `magicui` ([blur-fade.tsx](file:///c:/Mine/JOKI/scrabblewordseser/references/magicui/apps/www/registry/magicui/blur-fade.tsx))
- **Target**: `c:/Mine/JOKI/scrabblewordseser/project/frontend/src/components/shared/BlurFade.tsx`
- **Purpose**: Entrance transitions for dashboard lists and course cards.
