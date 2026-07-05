# Magic UI - Repository Tree & Overview

## Folder Tree
```
magicui/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── apps/
    └── www/
        ├── app/
        ├── components/
        │   ├── ui/
        │   └── docs-sidebar.tsx, main-nav.tsx, etc.
        ├── config/
        ├── content/
        ├── hooks/
        ├── lib/
        ├── registry/
        │   ├── example/
        │   ├── magicui/
        │   │   ├── animated-beam.tsx
        │   │   ├── bento-grid.tsx
        │   │   ├── blur-fade.tsx
        │   │   └── particles.tsx
        │   └── registry-ui.ts
        ├── styles/
        ├── types/
        ├── package.json
        └── tsconfig.json
```

## Important Directories
- **`apps/www/registry/magicui/`**: Source files of the copy-paste components.
- **`apps/www/components/`**: Standard UI components for the documentation site (sidebar, header, mobile navigation, code blocks).
- **`apps/www/app/`**: Next.js App Router source pages.

## Important Files
- **`pnpm-workspace.yaml`**: Monorepo configurations.
- **`apps/www/registry.json`**: Registry manifest mapping components to files and dependencies.

## Entry Points
- **Documentation Website**: `apps/www/app/layout.tsx` / `page.tsx`
- **Registry Endpoint**: `apps/www/registry/index.ts`

## Dependencies (Core)
- **Framework**: React 19, Next.js 15
- **Animation**: `motion` (Framer Motion v12)
- **Styling**: TailwindCSS 4, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Primitives**: `@radix-ui/react-*` components
- **Other**: `canvas-confetti`, `lucide-react`, `jotai`, `zod`

## Build Flow
1. Root runs `pnpm build` via turborepo.
2. Generates the registry files under `apps/www/public/r/` using `npx tsx ./scripts/build-registry.mts` and `npx shadcn build`.
3. Next.js builds the documentation site.
