# API Console Technical Decisions (ADR)

This document captures the engineering reasoning behind the architecture and technical choices made during the implementation of the API Console for the CrosswordLabs project.

--------------------------------------------------------

## Why Route Closure?
Instead of creating a dedicated Controller for the API Console, all logic was placed directly inside a closure in `routes/web.php`.
- **Reason:** Isolation. The API console is essentially a sophisticated "landing page" meant to sit on top of the backend without coupling to its core logic. By using a closure, we avoid cluttering the `app/Http/Controllers` directory with logic that isn't part of the actual API application. It keeps the footprint extremely minimal.

## Why Blade?
The entire UI is built natively using Laravel's Blade templating engine.
- **Reason:** Blade is native, requires zero build steps in production, and renders instantaneously on the server. Because the data (routes, runtime config) is inherently PHP-based, injecting it straight into Blade is the most direct pipeline with no API bridge required.

## Why not Livewire?
Livewire was explicitly avoided.
- **Reason:** Livewire introduces extra Composer dependencies, requires specific Javascript assets to be loaded, and operates via XHR polling which adds latency. For a simple, read-only documentation portal, this overhead is entirely unnecessary and violates the "zero dependency" constraint.

## Why no Vue or React?
- **Reason:** The actual consumer-facing frontend is already built in React and deployed separately to Vercel. Adding a JavaScript framework to the *backend* just to render the API Console would require an NPM build step (`npm run build`), complex Vite configurations, and would bloat the backend payload for a feature that is purely informational.

## Why no Swagger?
- **Reason:** Swagger (e.g., L5-Swagger) relies heavily on parsing PHP annotations (DocBlocks) and generates significant I/O overhead. It also requires installing heavy third-party Composer packages. The goal was to keep the backend lightweight and InfinityFree-compatible. The native `Route::getRoutes()` provides exact runtime truth without external dependencies.

## Why no OpenAPI Export?
- **Reason:** Generating a full OpenAPI spec requires a deep introspection of input validations, controller parameters, and response schemas, which Laravel's routing engine does not expose easily by default. Implementing this from scratch inside a closure is highly complex and error-prone. 

## Why no Composer or Build Step?
- **Reason:** The target deployment environment is InfinityFree Shared Hosting. On shared hosting, SSH access is generally prohibited, and running `composer install` or `npm run build` natively on the server is impossible. The application must be 100% portable out-of-the-box.

## Why Config() instead of env()?
- **Reason:** In Laravel production environments, configuration variables are aggressively cached (`php artisan config:cache`). When config is cached, direct calls to `env()` return `null`. By exclusively using `config('app.name')` etc., we ensure the API Console works flawlessly regardless of the server's cache state.

## Why Tailwind CDN Fallback?
- **Reason:** The strict "no NPM" rule meant we could not compile Tailwind locally during this specific implementation sprint. While utilizing existing `public/build` assets is the preferred method, having a Tailwind CDN script ensures the styling works universally, preventing unstyled HTML from leaking if the `public/build` directory is missing during deployment.

## Why is Request Builder Disabled by Default?
- **Reason:** Security and Data Integrity. The Request Builder acts as an active HTTP client. If left completely active, accidental clicks by developers or unauthorized users could mutate the database in a live production environment. An explicit "Enable Testing" overlay forces intentionality.

## Why Runtime Fallbacks?
Every check (Execution Time, Timezone, Server Software) utilizes `try/catch`, null-coalescing (`??`), or `defined()` checks.
- **Reason:** PHP configurations differ wildly between local machines and shared hosting environments like InfinityFree. Functions like `microtime()` or variables like `$_SERVER['SERVER_SOFTWARE']` might be disabled or structured differently. Fallbacks ensure the page always renders perfectly, even if data is missing.

## Why DB getPdo()?
Database connectivity is verified specifically by invoking `DB::connection()->getPdo()`.
- **Reason:** It is the fastest, lowest-level ping to the database layer that Laravel provides without executing an actual SQL query (like `select 1`). It validates credentials, networking, and the PDO driver in one step, allowing the Health Panel to immediately detect and report an "Unavailable" state if the database goes down.

## Why Monolithic Blade Files?
The architecture was originally planned with multiple isolated Blade components (`sidebar.blade.php`, `health-panel.blade.php`), but was implemented as two core files (`layouts/api-console` and `pages/api-console`).
- **Reason:** Shared hosting platforms penalize extensive file I/O. Having the compiler parse and compile a dozen small nested Blade components adds unnecessary disk reads. Furthermore, injecting variables into multiple isolated components requires complex data passing. A monolithic view structure guarantees peak performance and simplicity.
