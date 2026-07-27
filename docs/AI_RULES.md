# AI Agent Permanent Directives

These rules are PERMANENT and must be followed by any AI (Gemini, Claude, Cursor, Copilot) operating in this workspace.

## NEVER
- Touch `routes/api.php` unless explicitly directed.
- Touch authentication flow or Sanctum configuration.
- Touch core middleware.
- Touch database schemas or migrations unless explicitly directed.
- Propose or install heavy Composer/NPM packages.
- Propose SSH, Docker, Redis, or Queue Worker implementations (hosting is InfinityFree).

## ALWAYS
- **Keep Deployment Synchronized:** If you modify `project/backend`, you MUST mirror the exact changes to `project/deployment/core`.
- **Use `config()`:** Never use `env()` directly in routes or views.
- **Reuse Existing Components:** Check existing Blade/React components before creating new ones.
- **Preserve Architecture:** Keep the frontend (React) and backend (Laravel) strictly decoupled.

## WHEN MODIFYING
1. **Analyze:** Read existing context and documentation.
2. **Implement:** Write minimal, efficient code.
3. **Verify:** Ensure safety rules are not violated.
4. **Report:** Output a concise audit of files changed.

## DO NOT
- Rewrite large files unless strictly necessary (use targeted replacements or unified diffs).
- Remove existing comments unless they are invalidated by your changes.
- Add marketing fluff or emojis to technical reports.
