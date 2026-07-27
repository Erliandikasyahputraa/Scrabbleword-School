# API Reference

*Note: For dynamic documentation, visit the root `/` endpoint of the deployed backend.*

## Authentication
### `POST /api/auth/login`
- **Description:** Authenticate user and issue Sanctum token.
- **Request:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "token": "...", "user": {...} }`

## Users
### `GET /api/users`
- **Auth:** Required (Admin)
- **Description:** Retrieve all users.

## Courses
### `GET /api/courses`
- **Auth:** Required
- **Description:** Retrieve enrolled courses.

## Materials
### `GET /api/materials/{id}`
- **Auth:** Required
- **Description:** Download or view material contents.

## Submissions
### `POST /api/submissions`
- **Auth:** Required (Student)
- **Description:** Submit crossword answers.
