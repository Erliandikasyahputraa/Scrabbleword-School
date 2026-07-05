# Backend Application Design

This document details the Laravel backend architecture, controller responsibilities, service boundaries, database access patterns, and middleware rules.

## 1. Request Handling Pipeline

```
HTTP Request 
   ↓
Middleware (Sanctum Auth & CSRF guards)
   ↓
Form Request (Input validation schemas)
   ↓
Controller (Routes traffic, parses request parameters)
   ↓
Service (Implements core business logic, e.g. saving files, grading)
   ↓
Repository / Eloquent Model (Executes database operations)
   ↓
HTTP JSON Response
```

---

## 2. Core Backend Elements

### Controllers (`app/Http/Controllers/`)
- **AuthController**: Handles user registration, login credentials validation, and token distribution.
- **CourseController**: Handles fetching, creating, and archiving courses.
- **MaterialController**: Coordinates material uploads (multipart PDF files) and clue configuration metadata.
- **SubmissionController**: Handles grading submissions and fetching score histories.

### Services (`app/Services/`)
- **FileStorageService**: Manages PDF file uploads, saving files to local storage and returning secure URLs.
- **GradingService**: Compares submitted answers against solution keys, calculates scores, and returns results.

### Repositories (`app/Repositories/`)
- **CourseRepository**: Handles course database queries.
- **SubmissionRepository**: Handles submission writes and student score calculations.

### Policies (`app/Policies/`)
- **CoursePolicy**: Limits course editing permissions to the course owner (Teacher role).
- **MaterialPolicy**: Ensures only authorized course creators can add materials.

### Middleware (`app/Http/Middleware/`)
- **IsTeacher**: Verifies that the authenticated user has the `'teacher'` role before allowing write operations.
