# Folder Structure

```text
/
├── docs/                      # Centralized project documentation
├── project/
│   ├── backend/               # Local development Laravel backend
│   │   ├── app/               # Controllers, Models, Middleware
│   │   ├── routes/            # api.php, web.php
│   │   └── ...
│   ├── deployment/
│   │   ├── core/              # Production-ready backend code for InfinityFree
│   │   └── database/          # SQL dumps for manual phpMyAdmin import
│   └── frontend/              # React & TypeScript source code
│       ├── src/               # Components, Hooks, Pages
│       └── package.json
└── API_CONSOLE_IMPLEMENTATION_AUDIT.md # Historical audit
```
