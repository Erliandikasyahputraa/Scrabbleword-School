# DEPLOYMENT PACKAGE FOR INFINITYFREE

This folder contains your entire application bundled securely and correctly for InfinityFree.

## HOW TO UPLOAD

1. **`htdocs/` Folder**
   - Upload the **CONTENTS** of this folder directly into your InfinityFree `htdocs` directory using FileZilla.
   - Do NOT upload the `htdocs` folder itself, only what is inside it (`index.php`, `.htaccess`, etc.).

2. **`backend-core/` Folder**
   - Rename this folder to `core` on the remote server.
   - Upload this entire folder to your InfinityFree root directory (alongside `htdocs`, **NOT** inside it).
   - This ensures your sensitive code and `vendor` files are completely hidden from public web access.

3. **`env/.env` File**
   - Upload the `.env` file into your newly created `core` folder on the remote server.
   - Edit the `.env` on the server and ensure you fill in your actual database credentials and domain names.

4. **`database/` Folder**
   - Place your exported `.sql` file in this folder (for your own backup).
   - Use phpMyAdmin on InfinityFree to import your `.sql` file into your InfinityFree MySQL database.

---
**Why this layout?**
InfinityFree does not allow separating public and private directories easily. By splitting the codebase manually into `htdocs` (public) and `core` (private) and updating the `index.php` paths, we keep your application 100% secure!
