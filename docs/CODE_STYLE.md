# Code Style Guide

## Laravel Conventions
- **Naming:** Controllers use PascalCase (e.g., `CourseController`). Methods use camelCase (e.g., `getMaterials`).
- **Models:** Singular PascalCase (e.g., `Course`). Table names are plural snake_case (e.g., `courses`).
- **Validation:** Always use FormRequests or `Validator::make()` within the controller. Never trust client input.
- **Exceptions:** Handle exceptions gracefully and return standardized JSON error responses.

## React Conventions
- **Naming:** Components use PascalCase (`CourseCard.tsx`). Hooks use camelCase (`useCourseData.ts`).
- **Folder Convention:** `/src/components`, `/src/pages`, `/src/hooks`, `/src/utils`.
- **State:** Prefer local component state unless global state (Zustand/Context) is strictly necessary.

## API Response Format
All successful API responses must return structured JSON:
```json
{
    "success": true,
    "data": { ... },
    "message": "Operation successful"
}
```
For errors, refer to `API_ERRORS.md`.
