# Database Architecture

## ERD Overview
The database is relational MySQL, designed to support RBAC and course management.

## Core Tables
- `users`: Core identity table (id, name, email, password, role).
- `courses`: Educational subjects (id, title, description, teacher_id).
- `materials`: Content for courses (id, course_id, title, file_path, type).
- `submissions`: Student crossword results (id, course_id, user_id, score, data).

## Relations
- `User` (Teacher) has many `Course`.
- `Course` has many `Material`.
- `Course` has many `Submission`.
- `User` (Student) has many `Submission`.

## Foreign Keys & Indexing
- Foreign keys strictly enforce referential integrity (e.g., `materials.course_id` references `courses.id`).
- Indexes are applied to foreign keys and lookup columns (e.g., `users.email`).

## Migration Order
1. Users table
2. Courses table
3. Materials table
4. Submissions table
