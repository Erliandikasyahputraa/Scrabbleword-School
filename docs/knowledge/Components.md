# Reusable Components Knowledge Base

This document synthesizes key reusable UI components, layout blocks, and patterns from the analyzed repositories.

## 1. Interactive Data Tables
- **Concept**: A modular table component built with TanStack Table and Radix UI.
- **Repositories Analyzed**: `shadcn-table`, `shadcn-admin`
- **Sub-components**:
  - `data-table.tsx`: The main grid wrapper mapping rows and header cells.
  - `data-table-pagination.tsx`: Pagination controls (next/prev buttons, rows-per-page selector).
  - `data-table-column-header.tsx`: Interactive headers for sorting columns.
  - `data-table-toolbar.tsx`: Action bar holding search bars and view options.

## 2. Dynamic Input Fields
- **Concept**: Specialized input controls that handle validation and state changes.
- **Repositories Analyzed**: `shadcn-admin`
- **Sub-components**:
  - `password-input.tsx`: Input field with a show/hide toggle.
  - `date-picker.tsx`: Calendar popover for selecting single dates or ranges.
  - `confirm-dialog.tsx`: Standard alert modal to confirm destructive actions.

## 3. High-Quality Presentation Cards
- **Concept**: Visual components that make dashboard layouts feel modern and premium.
- **Repositories Analyzed**: `magicui`
- **Sub-components**:
  - `bento-grid.tsx`: Multi-span card container with hover transitions.
  - `blur-fade.tsx`: Entrance wrapper that applies a fade-in animation on scroll.
  - `shimmer-button.tsx`: Action button with a custom gradient shimmer effect.
