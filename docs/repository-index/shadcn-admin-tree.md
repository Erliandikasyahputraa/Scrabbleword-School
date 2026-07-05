# Shadcn Admin - Repository Tree & Overview

## Folder Tree
```
shadcn-admin/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── components.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── routeTree.gen.ts
│   ├── routes/
│   │   ├── (auth)/
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── (errors)/
│   │   ├── clark/
│   │   ├── _authenticated/
│   │   │   ├── index.tsx (Dashboard page)
│   │   │   ├── route.tsx (Authenticated layout parent)
│   │   │   ├── apps/
│   │   │   ├── chats/
│   │   │   ├── tasks/
│   │   │   └── users/
│   │   └── __root.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── authenticated-layout.tsx
│   │   │   └── header.tsx
│   │   ├── data-table/
│   │   └── theme-switch.tsx
│   ├── context/
│   ├── features/
│   ├── hooks/
│   │   ├── use-check-active-nav.tsx
│   │   ├── use-is-collapsed.tsx
│   │   └── use-local-storage.tsx
│   ├── lib/
│   └── stores/
│       ├── authStore.ts
│       └── sidebarStore.ts
```

## Important Directories
- **`src/routes/`**: Contains TanStack Router route tree with group folder structures like `(auth)`, `(errors)`, and `_authenticated`.
- **`src/components/layout/`**: Layout structures including sidebar controllers, authenticated views, and header navigation.
- **`src/stores/`**: Frontend store files using Zustand for state synchronization (sidebar toggle, mock auth).

## Important Files
- **`src/routeTree.gen.ts`**: Auto-generated TanStack Router route tree declaration.
- **`vite.config.ts`**: Project build configurations combining React, TanStack Router plugin, and TailwindCSS compilation.

## Entry Points
- **Web UI Client**: `src/main.tsx`

## Dependencies
- **Framework**: React 19, Vite 8, TypeScript 6
- **Routing**: `@tanstack/react-router` 1
- **Styling**: TailwindCSS 4, `@tailwindcss/vite`
- **State Management**: `zustand` 5
- **Forms & Validation**: `react-hook-form` 7, `zod` 4
- **Auth Service**: `@clerk/react` 6
- **Tables & Charts**: `@tanstack/react-table` 8, `recharts` 3

## Build Flow
- Run `npm run dev` to start Vite.
- Run `npm run build` to execute TypeScript compilation (`tsc -b`) and trigger Vite production bundling.
