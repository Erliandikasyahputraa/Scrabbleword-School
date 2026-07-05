# Dashboard Patterns Knowledge Base

This document synthesizes layout, routing, and data visualization strategies for dashboard applications.

## 1. Modular Shell Layout
- **Concept**: Wrap dashboard views in a shell layout containing a sidebar, a global top header, and a main content viewport.
- **Repositories Analyzed**: `shadcn-admin`, `shadcn-table`
- **Structure**:
  - **Sidebar Component**: Collapsible panel on the left containing navigation links.
  - **Header Bar**: Fixed top panel displaying page titles, search inputs, notifications, and profile dropdowns.
  - **Main Viewport**: Flexible container with overflow-y auto-scroll, hosting the page content.
  - **Footer**: Bottom strip for copyrights and metadata.

## 2. Dynamic Metric Cards
- **Concept**: Display key dashboard statistics (e.g. active users, completed courses, average scores) using clear card layouts.
- **Repositories Analyzed**: `shadcn-admin`
- **Aesthetic Guidelines**:
  - Use simple cards showing a title, a large value, a percentage trend (positive/negative indicator), and a simple icon.
  - Apply clean grid layouts (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`) to arrange metric cards.

## 3. Data Tables & Visual Analytics
- **Concept**: Present tabular information with inline charts to show data trends clearly.
- **Repositories Analyzed**: `shadcn-admin`, `shadcn-table`
- **Application**:
  - Embed responsive charts (like Recharts lines or bar charts) directly into layout containers.
  - Pair list views with filters, pagination, and action menus to let users manage records easily.
