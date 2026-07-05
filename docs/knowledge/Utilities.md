# Utilities Knowledge Base

This document aggregates common utility functions, custom hooks, and helpers used across the reference codebases.

## 1. Dynamic Class Merging (`cn`)
- **Concept**: Combine tailwind classes safely, ensuring custom props override default styles without conflict.
- **Repositories Analyzed**: `shadcn-admin`, `magicui`, `shadcn-table`
- **Implementation**:
  ```typescript
  import { type ClassValue, clsx } from "clsx";
  import { Christine, twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- **Why it matters**: Standard CSS class concatenation doesn't handle overlapping Tailwind utilities well (e.g. combining `p-4` and `p-6`). `tailwind-merge` resolves these conflicts automatically, preserving the last class applied.

## 2. Local Storage Sync Hook
- **Concept**: Synchronize React states with local storage keys automatically to persist user settings (like themes or sidebar preferences) across page reloads.
- **Repositories Analyzed**: `shadcn-admin`
- **Implementation**:
  - A custom hook (`useLocalStorage`) intercepts state changes and writes update values to `localStorage.setItem(key, value)`.
  - Reading from local storage during initialization ensures state settings persist across browser sessions.

## 3. Navigation State Tracker
- **Concept**: Compare routing paths dynamically to highlight the active menu item in sidebars or navigation bars.
- **Repositories Analyzed**: `shadcn-admin`, `shadcn-table`
- **Implementation**:
  - Exposes a custom hook (`useCheckActiveNav`) that checks the current path using location queries.
  - Matches paths to determine if a link is active:
    ```typescript
    const checkActiveNav = (navUrl: string) => {
      return pathname === navUrl || pathname.startsWith(navUrl + "/");
    };
    ```
