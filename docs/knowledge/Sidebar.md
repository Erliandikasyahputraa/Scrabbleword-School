# Sidebar Patterns Knowledge Base

This document synthesizes navigation layouts, collapsible behaviors, and state tracking patterns for application sidebars.

## 1. Collapsible Sidebar Layouts
- **Concept**: A vertical navigation panel that can collapse into a compact icon-only view to maximize screen space.
- **Repositories Analyzed**: `shadcn-admin`, `magicui`
- **Application**:
  - **Compact State**: Collapses the menu text, showing only Lucide icons for each navigation item.
  - **Hover Expansion**: Optionally expands the sidebar when hovering over it to preview links without clicking.
  - **Responsive Layout**: Automatically collapses the sidebar on mobile and tablet viewports, using drawer overlays (via Radix Sheet/SheetContent) to save space.

## 2. Global State Management (Zustand & Context)
- **Concept**: Track the sidebar's collapse state globally to synchronize other page layouts.
- **Repositories Analyzed**: `shadcn-admin`
- **Application**:
  - Uses a lightweight Zustand store (`sidebarStore.ts`) or React Context to track state flags like `isCollapsed`.
  - Adding transition utilities (such as `transition-all duration-300`) to sidebars and main content wrappers makes collapse animations smooth.

## 3. Nested Navigation Links
- **Concept**: Group links into expandable sections (accordion style) for cleaner navigation.
- **Repositories Analyzed**: `shadcn-admin`
- **Application**:
  - Collapsible triggers (accordion wraps) allow users to show or hide sub-links under parent categories.
  - Active links are highlighted (e.g. bold font, colored background, border indicators) based on the current URL path.
