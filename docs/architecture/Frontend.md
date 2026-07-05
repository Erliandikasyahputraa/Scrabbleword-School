# Frontend Application Design

This document outlines the React SPA pages, layout structures, routing hierarchy, and client state management schemas.

## 1. Views & Pages Map
- **Auth Page** (`/login`, `/register`): Minimal user entry screens handling login and registration.
- **Dashboard Home** (`/`):
  - **Student View**: Shows registered courses, completion rates, and score history.
  - **Teacher View**: Shows course lists, student enrollment metrics, and material creation shortcuts.
- **Course View** (`/courses/{id}`): Lists course documents, materials, and student progress metrics.
- **Material Learn Portal** (`/courses/{courseId}/materials/{id}`):
  - Split-pane layout: Left pane renders the PDF viewer, right pane renders the interactive crossword puzzle grid.

---

## 2. Layout Framework
Following patterns from `shadcn-admin`, we will implement two primary layout structures:
- **Guest Layout** (`guest-layout.tsx`): Centered flex containers wrapping login and registration pages.
- **Authenticated Layout** (`authenticated-layout.tsx`): Main dashboard shell layout containing:
  - `AppSidebar`: Responsive collapsible left navigation panel.
  - `Header`: Sticky top bar with breadcrumbs and theme controls.
  - `MainViewport`: Auto-scrolling main content area.

---

## 3. Client State Management
- **Global Auth Store** (`authStore.ts`):
  - Implemented using Zustand to track the logged-in user state (`user`) and access tokens (`token`).
- **Sidebar Layout Store** (`sidebarStore.ts`):
  - Implemented using Zustand or React Context to coordinate the sidebar's collapse state (`isCollapsed`) across viewports.
- **Crossword Puzzle State**:
  - Managed locally within the puzzle component using standard React state (`useState`), tracking input coordinates and completion flags.
- **URL Parameter Synchronization**:
  - Synchronizes sorting and pagination states directly with URL query parameters to enable shareable list views.
