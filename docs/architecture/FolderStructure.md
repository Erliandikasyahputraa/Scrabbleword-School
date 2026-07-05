# System Folder Structure Design

This document details the directory tree layout for both frontend and backend systems, adopting the feature-based folder organization pattern.

## 1. Project Directory Layout

```
scrabblewordseser/
├── project/
│   ├── backend/ (Laravel App)
│   │   ├── app/
│   │   │   ├── Http/
│   │   │   │   ├── Controllers/
│   │   │   │   ├── Middleware/
│   │   │   │   └── Requests/
│   │   │   ├── Models/
│   │   │   ├── Policies/
│   │   │   └── Services/
│   │   ├── config/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeders/
│   │   ├── routes/
│   │   │   └── api.php
│   │   └── tests/
│   └── frontend/ (React / Vite App)
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── layout/ (AppSidebar.tsx, Header.tsx)
│       │   │   └── ui/ (Button.tsx, Input.tsx, Dialog.tsx)
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   ├── courses/
│       │   │   ├── crossword/
│       │   │   └── pdf-viewer/
│       │   ├── hooks/
│       │   ├── lib/ (utils.ts)
│       │   ├── routes/
│       │   ├── stores/
│       │   ├── types/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.ts
├── docs/ (Design blueprints)
└── references/ (Read-only repositories)
```

---

## 2. Organization Guidelines

### Frontend Features Layer (`src/features/`)
- Keep domain files encapsulated in their respective feature folders:
  - `components/`: UI components specific to the feature.
  - `hooks/`: Custom react hooks for the feature.
  - `services/`: Fetch endpoints and API calls.
  - `types/`: Domain-specific type interfaces.

### Backend Application Layer (`app/`)
- **Http/Controllers/**: Slim entry controllers parsing HTTP requests and delegating to services.
- **Http/Requests/**: Zod-equivalent form validation classes.
- **Services/**: Domain logic implementations (handling file uploads, grading checks).
- **Policies/**: Laravel authorization gates limiting actions by role (Teacher vs. Student).
