# AI Context

This file serves as a meta-document for future AI coding assistants operating in this workspace.

## Rules of Engagement
- **Read-Only API Console:** The root `/` route serves a dynamic API console. Do NOT modify `routes/web.php` to add standard application features.
- **InfinityFree Target:** The deployment target is strictly shared hosting. Do NOT propose Docker, Redis, Queue Workers, or SSH-dependent solutions unless explicitly requested.
- **Sync Architecture:** `project/backend` and `project/deployment/core` must remain perfectly mirrored.
- **No Symlinks:** Do not suggest `storage:link`. All file access must be streamed through a controller.
- **Stateless:** Use Sanctum Bearer tokens. Do not implement web-based cookie sessions for the API.
