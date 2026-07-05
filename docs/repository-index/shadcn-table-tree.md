# Shadcn Table - Repository Tree & Overview

## Folder Tree
```
shadcn-table/
├── package.json
├── tsconfig.json
├── components.json
├── drizzle.config.ts
├── partykit.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data-grid/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── data-table/
│   │   │   ├── data-table-advanced-toolbar.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   └── data-table.tsx
│   │   ├── data-grid/
│   │   │   ├── data-grid.tsx
│   │   │   └── data-grid-row.tsx
│   │   ├── ui/
│   │   └── providers.tsx
│   ├── config/
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── hooks/
│   │   └── use-data-table.ts
│   ├── lib/
│   └── types/
└── party/
    └── server.ts (PartyKit server)
```

## Important Directories
- **`src/components/data-table/`**: Standard server-side filtering, sorting, and paginated table UI components using TanStack Table.
- **`src/components/data-grid/`**: High-performance interactive grid system (variants, context menu, presence, selections).
- **`src/db/`**: Drizzle ORM configuration and database migrations.
- **`party/`**: WebSockets multiplayer backend using PartyKit.

## Important Files
- **`src/hooks/use-data-table.ts`**: Core hook managing sorting, pagination, filtering, column visibility, and URL sync.
- **`drizzle.config.ts`**: Database configuration.
- **`partykit.json`**: Multiplayer scaling deployment settings.

## Entry Points
- **Next.js Web Client**: `src/app/page.tsx`
- **PartyKit Server**: `party/server.ts`

## Dependencies
- **Framework**: React 19, Next.js 16
- **State & Tables**: `@tanstack/react-table` 8, `@tanstack/react-query` 5, `nuqs` 2 (URL search params state sync)
- **Database**: `drizzle-orm` 0.45, `postgres` 3
- **File Upload**: `@uploadthing/react` 7, `uploadthing` 7
- **Interactive utilities**: `@dnd-kit/core` 6 (Drag and Drop sorting)
- **Real-time WebSockets**: `partysocket` 1, `partykit` 0

## Build Flow
- Start developer environment: `pnpm dev` or `pnpm dev:multiplayer` (starts dev server + partykit client).
- Production build: `pnpm build` (runs Next.js production bundler).
