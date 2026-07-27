# Project Handbook: CrosswordLabs

## 1. Executive Summary
CrosswordLabs is a decoupled educational platform providing course management, material distribution, and interactive crossword capabilities. It is optimized for zero-cost hosting environments.

## 2. Problem Statement
Traditional LMS platforms are resource-intensive. CrosswordLabs delivers essential functionality while strictly adhering to the severe resource constraints of free shared hosting (no queue workers, no SSH, limited I/O).

## 3. Objectives
- Provide secure, stateless learning management.
- Ensure 100% compatibility with InfinityFree shared hosting.
- Maintain a decoupled, scalable frontend.

## 4. System Architecture
See `SYSTEM_ARCHITECTURE.md`.

## 5. Technology Stack
See `TECH_STACK.md`.

## 6. Folder Structure
See `FOLDER_STRUCTURE.md`.

## 7. Authentication Flow
Stateless Bearer token authentication via Laravel Sanctum. No sessions or cookies are utilized for API calls.

## 8. Authorization
Role-based middleware (Admin, Teacher, Student) protects specific route groups.

## 9. Database Overview
Relational MySQL database. Tables: Users, Courses, Materials, Submissions.

## 10. API Overview
RESTful JSON API with a dedicated dynamic API console at `/`.

## 11. Runtime Architecture
Sync queue driver, File cache driver, Local storage disk without symlinks.

## 12. Deployment Architecture
See `DEPLOYMENT_GUIDE.md`.

## 13. InfinityFree Notes
Symlinks (`storage:link`) are forbidden. Files are served via explicit controller streaming.

## 14. Security Decisions
See `SECURITY.md`.

## 15. Architecture Decision Records Summary
See `API_CONSOLE_TECHNICAL_DECISIONS.md`.

## 16. Known Limitations
See `KNOWN_LIMITATIONS.md`.

## 17. Future Improvements
See `ROADMAP.md`.

## 18. Maintenance Guide
See `MAINTENANCE.md`.

## 19. Changelog Summary
See `CHANGELOG.md`.

## 20. Developer Notes
Always test code under the assumption that background processes do not exist.
