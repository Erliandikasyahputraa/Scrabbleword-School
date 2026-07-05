# REST API Design

This document details the REST API endpoints, request schemas, and JSON response models for the Scrabble Wordseser MVP.

---

## 1. Authentication Endpoints

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Purpose**: Authenticates credentials and returns a secure access token.
- **Authentication**: None.
- **Request Body**:
  ```json
  {
    "email": "student@school.edu",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "1|sanctumgeneratedtokenpayload",
    "user": {
      "id": 2,
      "name": "Jane Student",
      "email": "student@school.edu",
      "role": "student"
    }
  }
  ```

---

## 2. Course & Material Endpoints

### List Courses
- **Endpoint**: `GET /api/courses`
- **Purpose**: Lists all active courses.
- **Authentication**: Bearer Token.
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 10,
      "name": "English 101",
      "description": "Introduction to vocabulary.",
      "teacher_name": "John Teacher",
      "created_at": "2026-06-26T12:00:00Z"
    }
  ]
  ```

### Create Material
- **Endpoint**: `POST /api/courses/{courseId}/materials`
- **Purpose**: Uploads a PDF and crossword solutions (Teacher only).
- **Authentication**: Bearer Token.
- **Request Body (multipart/form-data)**:
  - `title`: "Week 1 Vocabulary" (string)
  - `pdf_file`: [Binary PDF File]
  - `crossword_data`: JSON string matching the puzzle configuration:
    ```json
    [
      { "clue": "Opposite of cold", "answer": "hot" },
      { "clue": "High temperature season", "answer": "summer" }
    ]
    ```
- **Response (201 Created)**:
  ```json
  {
    "id": 25,
    "course_id": 10,
    "title": "Week 1 Vocabulary",
    "pdf_url": "/storage/materials/filename.pdf",
    "crossword_data": [...]
  }
  ```

---

## 3. Submissions & Scores

### Submit Answer
- **Endpoint**: `POST /api/materials/{materialId}/submissions`
- **Purpose**: Submits crossword answers, calculates the score, and saves the attempt.
- **Authentication**: Bearer Token.
- **Request Body**:
  ```json
  {
    "score": 85,
    "answers_submitted": {
      "1,1": "h",
      "1,2": "o",
      "1,3": "t"
    }
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "submission_id": 99,
    "student_id": 2,
    "material_id": 25,
    "score": 85,
    "completed_at": "2026-06-26T12:15:00Z"
  }
  ```
